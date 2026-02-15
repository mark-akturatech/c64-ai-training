#!/usr/bin/env python3
# /// script
# dependencies = ["openai"]
# ///
"""
Audit training chunks for low-value content that would pollute vector search.

Uses heuristics to identify candidate junk chunks, then confirms with OpenAI.
Confirmed junk is removed: .md deleted, .txt deleted, split config marked ignore.

Usage:
    uv run scripts/audit_chunks.py                    # Dry run (default)
    uv run scripts/audit_chunks.py --apply            # Actually delete + mark ignore
    uv run scripts/audit_chunks.py some_chunk.md      # Audit a single file
    uv run scripts/audit_chunks.py --all              # Send ALL chunks to OpenAI (no pre-filter)
    uv run scripts/audit_chunks.py --model gpt-4o     # Use different model
    uv run scripts/audit_chunks.py --threshold 0.3    # Lower heuristic threshold (more candidates)
    uv run scripts/audit_chunks.py --workers 8        # Process 8 chunks concurrently (default: 4)
"""

import json
import os
import re
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from openai import OpenAI


JUNK_KEYWORDS_FILENAME = [
    'header', 'omitted', 'artifact', 'placeholder', 'ignored',
    'front_matter', 'table_of_contents', 'toc_', '_toc',
    'heading_and_', '_heading', 'cartridge', 'resources',
]

JUNK_PATTERNS_CONTENT = [
    re.compile(r'\[\*{3}\s*OMITTED\s*\*{3}\]', re.IGNORECASE),
    re.compile(r'no technical content', re.IGNORECASE),
    re.compile(r'no code,?\s*registers,?\s*or technical', re.IGNORECASE),
    re.compile(r'placeholder', re.IGNORECASE),
    re.compile(r'metadata only', re.IGNORECASE),
    re.compile(r'not included in this', re.IGNORECASE),
    re.compile(r'omitted from the text', re.IGNORECASE),
    re.compile(r'widely available elsewhere', re.IGNORECASE),
    re.compile(r'generation metadata', re.IGNORECASE),
    re.compile(r'\(omitted\s*[—–-]\s*not applicable\)', re.IGNORECASE),
    re.compile(r'chapter head(er|ing) and mini-?(table of contents|toc)', re.IGNORECASE),
    re.compile(r'this (chunk|page) is (a |the )?(chapter|section) head', re.IGNORECASE),
    re.compile(r'no code or register maps', re.IGNORECASE),
    re.compile(r'only\s+(a\s+)?(high-level|brief)\s+(product\s+)?description', re.IGNORECASE),
]

AUDIT_PROMPT = """\
You are auditing chunks for a Commodore 64 / 6502 vector knowledge base (Qdrant).
Each chunk should be a useful, standalone knowledge node that helps answer C64 programming questions.

Evaluate this chunk and decide: is it USEFUL or JUNK?

JUNK criteria (must meet one or more):
- Contains no real technical information (just metadata, book titles, TOC, credits, disclaimers, acknowledgments, chapter headings)
- Content is explicitly omitted/missing ("[*** OMITTED ***]", "not included", "widely available elsewhere")
- Garbled OCR artifacts with no recoverable meaning
- Thin index/pointer that only says "see these other chunks" with no standalone value
- Generic book recommendations with no C64-specific technical detail
- Empty register tables, empty code sections, content-free stubs

KEEP criteria (override JUNK — if ANY of these apply, mark as KEEP):
- Contains ANY specific technical information: register addresses, opcodes, memory locations, timing values, code examples, algorithms, hardware behavior
- Has an ## Incomplete section AND the described missing content would make this chunk genuinely useful when filled in (e.g. "Missing: sprite multiplexing timing diagram" means the surrounding text about sprite multiplexing is worth keeping)
- Serves as a meaningful overview/introduction that teaches something (not just "Chapter X covers Y")
- Contains formulas, bit layouts, pin descriptions, wiring info, or electrical specs

IMPORTANT: Be conservative. When in doubt, KEEP. Only mark as JUNK if you are confident (>90%) the chunk adds zero value to someone searching for C64 programming knowledge.

Respond with EXACTLY one line in this format:
VERDICT: JUNK | reason
or
VERDICT: KEEP | reason

The reason should be brief (under 20 words).
"""


def score_chunk(file_path: Path, content: str) -> tuple[float, list[str]]:
    """Score a chunk's junk likelihood using heuristics. Returns (score, reasons).
    Score 0.0 = definitely good, 1.0 = definitely junk."""
    score = 0.0
    reasons = []
    name = file_path.stem

    # Skip example files entirely — they're documented separately
    if name.startswith('example_'):
        return 0.0, ['example file']

    # Filename keywords
    for kw in JUNK_KEYWORDS_FILENAME:
        if kw in name.lower():
            score += 0.3
            reasons.append(f'filename contains "{kw}"')
            break

    # Content pattern matches
    for pattern in JUNK_PATTERNS_CONTENT:
        if pattern.search(content):
            score += 0.3
            reasons.append(f'content matches /{pattern.pattern}/')
            break

    # Very short content (strip markdown formatting for line count)
    lines = [l for l in content.splitlines() if l.strip() and not l.startswith('#')]
    if len(lines) < 8:
        score += 0.3
        reasons.append(f'very short ({len(lines)} non-heading lines)')
    elif len(lines) < 15:
        score += 0.15
        reasons.append(f'short ({len(lines)} non-heading lines)')

    # Small file size (known junk: 382-868 bytes; legit small chunks: 900+)
    size = len(content.encode('utf-8'))
    if size < 500:
        score += 0.3
        reasons.append(f'tiny file ({size} bytes)')
    elif size < 900:
        score += 0.15
        reasons.append(f'small file ({size} bytes)')

    # No Key Registers AND no Source Code — less likely to be technical
    has_registers = '## Key Registers' in content and '(none)' not in content.split('## Key Registers')[1][:100] if '## Key Registers' in content else False
    has_source = '## Source Code' in content
    if not has_registers and not has_source:
        score += 0.1
        reasons.append('no registers or source code')

    # Both Key Registers and Source Code explicitly say omitted/none
    kr_section = content.split('## Key Registers')[1][:200] if '## Key Registers' in content else ''
    sc_section = content.split('## Source Code')[1][:200] if '## Source Code' in content else ''
    both_empty = (
        re.search(r'\((?:omitted|none)', kr_section, re.IGNORECASE) and
        re.search(r'\((?:omitted|none)', sc_section, re.IGNORECASE)
    )
    if both_empty:
        score += 0.2
        reasons.append('both Key Registers and Source Code marked omitted/none')

    return min(score, 1.0), reasons


def find_split_config(chunk_name: str, config_dir: Path) -> tuple[Path | None, int | None]:
    """Find which split config JSON contains the given chunk name.
    Returns (config_path, split_index) or (None, None)."""
    for config_path in config_dir.glob('*.json'):
        try:
            with open(config_path) as f:
                config = json.load(f)
        except (json.JSONDecodeError, OSError):
            continue

        for i, split in enumerate(config.get('splits', [])):
            if split.get('name') == chunk_name:
                return config_path, i

    return None, None


def mark_split_ignored(config_path: Path, split_index: int, reason: str) -> bool:
    """Mark a split entry as ignored in its config file. Returns True if changed."""
    with open(config_path) as f:
        config = json.load(f)

    split = config['splits'][split_index]
    if split.get('ignore'):
        return False  # Already ignored

    split['ignore'] = True
    split['reason'] = f"audit: {reason}"

    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
        f.write('\n')

    return True


def audit_with_openai(client, model: str, content: str) -> tuple[str, str]:
    """Ask OpenAI to evaluate a chunk. Returns (verdict, reason)."""
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": AUDIT_PROMPT},
            {"role": "user", "content": content},
        ],
        temperature=1,  # gpt-5-mini only supports default temperature
    )
    result = response.choices[0].message.content.strip()

    # Parse verdict
    match = re.match(r'VERDICT:\s*(JUNK|KEEP)\s*\|\s*(.*)', result, re.IGNORECASE)
    if match:
        return match.group(1).upper(), match.group(2).strip()

    # Fallback: try to detect intent
    if 'JUNK' in result.upper():
        return 'JUNK', result[:80]
    return 'KEEP', f'unparseable response: {result[:80]}'


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_dir = project_root / 'data'
    split_dir = project_root / 'split'
    config_dir = project_root / 'split_config'

    # Parse arguments
    apply = '--apply' in sys.argv
    audit_all = '--all' in sys.argv
    score_only = '--score-only' in sys.argv
    model = 'gpt-5-mini'
    threshold = 0.4

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    if '--threshold' in sys.argv:
        idx = sys.argv.index('--threshold')
        threshold = float(sys.argv[idx + 1])

    workers = 4
    if '--workers' in sys.argv:
        idx = sys.argv.index('--workers')
        workers = int(sys.argv[idx + 1])

    # Collect target files
    skip_flags = {'--apply', '--all', '--score-only', '--model', '--threshold', '--force', '--workers'}
    args = []
    skip_next = False
    for a in sys.argv[1:]:
        if skip_next:
            skip_next = False
            continue
        if a in ('--model', '--threshold', '--workers'):
            skip_next = True
            continue
        if a not in skip_flags:
            args.append(a)

    # Single file or all
    if args:
        md_files = []
        for a in args:
            p = data_dir / a
            if not p.exists() and not a.endswith('.md'):
                p = data_dir / f"{a}.md"
            if p.exists():
                md_files.append(p)
            else:
                print(f"File not found: {a}")
        if not md_files:
            sys.exit(1)
        # Single-file mode: skip heuristic threshold, always send to OpenAI
        audit_all = True
    else:
        md_files = sorted(data_dir.glob('*.md'))

    if not md_files:
        print(f"No .md files found in {data_dir}")
        sys.exit(0)

    # Phase 1: Heuristic scoring
    print(f"Phase 1: Scoring {len(md_files)} chunks with heuristics...")
    candidates = []
    for f in md_files:
        content = f.read_text(encoding='utf-8', errors='replace')
        score, reasons = score_chunk(f, content)
        if audit_all or score >= threshold:
            candidates.append((f, content, score, reasons))

    if not candidates:
        print(f"No candidates found above threshold {threshold}. Try --threshold 0.2 or --all")
        sys.exit(0)

    print(f"Found {len(candidates)} candidates (threshold={threshold})")
    for f, _, score, reasons in sorted(candidates, key=lambda x: -x[2]):
        print(f"  {score:.2f}  {f.name}  ({'; '.join(reasons)})")

    if score_only:
        return

    # Phase 2: OpenAI confirmation
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print("\nError: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    client = OpenAI(api_key=api_key)
    print(f"\nPhase 2: Confirming {len(candidates)} candidates with OpenAI ({model})...")

    junk_list = []
    keep_list = []
    results_lock = threading.Lock()
    counter = {'done': 0}

    def audit_one(file_path, content):
        with results_lock:
            counter['done'] += 1
            n = counter['done']
        print(f"  [{n}/{len(candidates)}] {file_path.name} ...", flush=True)

        try:
            verdict, reason = audit_with_openai(client, model, content)

            with results_lock:
                if verdict == 'JUNK':
                    junk_list.append((file_path, reason))
                    print(f"    JUNK — {reason}")
                else:
                    keep_list.append((file_path, reason))
                    print(f"    KEEP — {reason}")

        except Exception as e:
            with results_lock:
                keep_list.append((file_path, f"error: {e}"))
            print(f"    ERROR (keeping) — {e}")

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(audit_one, fp, c) for fp, c, _, _ in candidates]
        for f in as_completed(futures):
            f.result()

    # Summary
    print(f"\n{'='*60}")
    print(f"Results: {len(junk_list)} JUNK, {len(keep_list)} KEEP")

    if not junk_list:
        print("Nothing to remove.")
        return

    print(f"\nJunk chunks to remove:")
    for f, reason in junk_list:
        print(f"  {f.name} — {reason}")

    # Phase 3: Apply changes
    if not apply:
        print(f"\nDry run — no changes made. Use --apply to delete and mark as ignored.")
        return

    print(f"\nPhase 3: Applying changes...")
    deleted_md = 0
    deleted_txt = 0
    configs_updated = 0
    config_not_found = []

    for file_path, reason in junk_list:
        chunk_name = file_path.stem
        print(f"  Removing: {chunk_name}")

        # 1. Find and update split config
        config_path, split_idx = find_split_config(chunk_name, config_dir)
        if config_path and split_idx is not None:
            if mark_split_ignored(config_path, split_idx, reason):
                configs_updated += 1
                print(f"    split config: marked ignore in {config_path.name}")
            else:
                print(f"    split config: already ignored in {config_path.name}")
        else:
            config_not_found.append(chunk_name)
            print(f"    split config: NOT FOUND (chunk may be orphaned)")

        # 2. Delete .txt from training/split/
        txt_path = split_dir / f"{chunk_name}.txt"
        if txt_path.exists():
            txt_path.unlink()
            deleted_txt += 1
            print(f"    deleted: {txt_path.name}")
        else:
            print(f"    {txt_path.name}: not found (already deleted?)")

        # 3. Delete .md from training/data/
        if file_path.exists():
            file_path.unlink()
            deleted_md += 1
            print(f"    deleted: {file_path.name}")

    print(f"\n{'='*60}")
    print(f"Applied: {deleted_md} .md deleted, {deleted_txt} .txt deleted, {configs_updated} configs updated")
    if config_not_found:
        print(f"Warning: {len(config_not_found)} chunks had no split config entry:")
        for name in config_not_found:
            print(f"  {name}")


if __name__ == '__main__':
    main()
