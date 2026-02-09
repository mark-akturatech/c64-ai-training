#!/usr/bin/env python3
# /// script
# dependencies = ["openai"]
# ///
"""
Clean training chunks using OpenAI API.

Reads raw .txt chunks from training/split/, sends each to OpenAI for
cleaning and reformatting as Markdown, writes results to training/data/.
Tracks MD5 hashes in parsed_sources.json to skip unchanged files.

Usage:
    uv run scripts/clean_chunks.py                  # Process all chunks
    uv run scripts/clean_chunks.py chunk_name.txt   # Process one chunk
    uv run scripts/clean_chunks.py --force           # Reprocess all
    uv run scripts/clean_chunks.py --model gpt-4o    # Use different model
    uv run scripts/clean_chunks.py --dry-run          # Show what would be processed
    uv run scripts/clean_chunks.py --shrink           # Shrink .md files in training/data/ over 6KB
    uv run scripts/clean_chunks.py --shrink --threshold 4096  # Custom size threshold
"""

import hashlib
import json
import os
import sys
import time
from pathlib import Path

from openai import OpenAI

def _fmt_response(response):
    """Format a one-line summary of an OpenAI API response."""
    usage = response.usage
    parts = [f"model={response.model}"]
    if usage:
        parts.append(f"tokens={usage.prompt_tokens}+{usage.completion_tokens}={usage.total_tokens}")
    return ', '.join(parts)


SYSTEM_PROMPT = """\
You are producing standalone knowledge nodes for a Commodore 64 / 6502 vector database (RAG system).

Each chunk you produce is a self-contained unit stored in Qdrant. The architecture:
- **Descriptive text** (title, summary, sections) is embedded as a search vector — this is what queries match against.
- **Source Code section** is stored as payload only — NOT embedded. It's retrieved alongside results but doesn't affect search ranking.
- **Key Registers section** is parsed into keyword metadata for exact-match address filtering (e.g. searching "$D020" finds chunks with that register).
- **References section** is parsed into metadata for cross-chunk navigation.

Your job: convert a raw text chunk into clean Markdown that makes a good, discrete knowledge packet.
- Priority #1: PRESERVE ALL TECHNICAL DETAIL — never sacrifice detail for brevity.
- Priority #2: Keep descriptive sections focused and searchable, with code/data/maps separated into Source Code.
- Priority #3: Strip verbosity and duplication — noise hurts search relevance.

## Required Output Format

```
# <Title>

**Summary:** <1-2 sentences with searchable terms: register addresses ($D012), chip names (VIC-II), technique names, mnemonics.>

## <Section Name>
<descriptive content — explains what the code/registers do, how things work>

## Source Code
<code listings, register maps, data tables — reference material for retrieval, not search>

## Key Registers
- $XXXX - Chip - brief description

## References
- "chunk_name" — what it covers
```

CRITICAL FORMATTING RULES:
- The title MUST be a `# ` heading (h1)
- ALL content sections MUST use `## ` headings (h2) — NEVER plain uppercase text
- `## Source Code`, `## Key Registers`, `## References` MUST be exactly these heading texts (parsed by downstream tools)

## Source Code section

This section holds reference material that should be retrievable but not searched against:
- Assembly listings (lines starting with `.,XXXX` or labeled assembly with opcodes like LDA/STA/JSR etc.)
- BASIC programs (numbered lines with POKE/PEEK/GOTO/GOSUB etc.)
- Opcode/data tables
- Detailed register maps (multi-line tables listing register addresses with bit names/layouts) — Key Registers already provides a searchable summary, so the full bit-level map is reference data
- Use appropriate fenced code blocks: ```asm for assembly, ```basic for BASIC, ```text for data tables and register maps
- Place AFTER all descriptive sections, BEFORE Key Registers
- Do NOT duplicate: if code/maps appear in the source, move them here — don't also inline them in descriptive sections. Brief single-instruction examples in prose (e.g. "use `LDA #$01`") are fine
- If the source has no code listings, data tables, or register maps, omit this section entirely

## Key Registers section

These become keyword-indexed metadata for exact address matching:
- Omit entirely if the chunk isn't about specific registers/addresses (e.g. instruction set, concepts, syntax docs)
- Use RANGES for consecutive registers (e.g. "$D000-$D00F - VIC-II - Sprite 0-7 X/Y positions"), never list each one individually
- Convert chip-relative offsets to absolute C64 addresses:
  - SID: base $D400 (Voice 1: $D400-$D406, Voice 2: $D407-$D40D, Voice 3: $D40E-$D414, Filter: $D415-$D418)
  - VIC-II: base $D000 ($D000-$D02E)
  - CIA 1: base $DC00 ($DC00-$DC0F), CIA 2: base $DD00 ($DD00-$DD0F)
- Only convert when CERTAIN it's a register offset. Non-C64 chips (6520, 6545, 6525): omit Key Registers entirely. Raster line numbers and timing values are NOT registers.

## References section
- Only include if cross-references exist at bottom of source
- Format: `- "chunk_name" — what it covers`

## Content Rules

1. REMOVE: BOM, page numbers, headers/footers, author credits, filler phrases ("As mentioned earlier..."), book navigation ("See Chapter 5"), redundant intros, excessive whitespace, OCR artifacts. Remove beginner-level explanations — the audience is experienced programmers. If something is already shown in a table or code example, don't also explain it in prose.

2. NEVER REMOVE: register bit layouts, address calculations, timing values, resolution details, operational explanations, behavioral specifics, caveats/warnings, formulas, bit-field descriptions, memory maps, pin descriptions, electrical specs. When in doubt, KEEP IT.

3. FORMAT: Valid Markdown only. `## Section Name` headings. Markdown tables, fenced code blocks, $XXXX hex formatting.

4. DO NOT add content the source doesn't contain:
   - No invented "practical notes", "usage tips", or "notes and caveats" sections
   - No expanded explanations of concepts the source only mentions briefly
   - No tutorial-style elaboration
   - If a concept is used without definition, add a SHORT parenthetical only (max 10 words), max 2 per chunk
   - NEVER expand a register range into individual entries unless the source itself lists them individually

5. COMPLETENESS: If data is clearly truncated (missing table columns, cut-off sentence), fill in from standard 6502/C64 knowledge. Error correction only, not invention.

6. SOURCE ERRORS: Flag clear contradictions with `**[Note: Source may contain an error — <brief>.]**`

7. Output may be LONGER than input if reformatting requires it. The goal is clean, complete, well-structured Markdown — not compression.
"""


SHRINK_PROMPT = """\
You are a technical documentation compressor. You will receive a Markdown document about Commodore 64 / 6502 programming.

Your job: make it SHORTER without losing ANY technical information.

Rules:
- KEEP every register address, opcode, memory location, hex value, timing value, bit description, code example, and table row
- KEEP the # title, **Summary:** line, ## Key Registers section, and ## References section exactly as-is
- REMOVE or shorten: wordy explanations, redundant sentences that restate what a table/code already shows, verbose descriptions where a terse one suffices
- MERGE duplicate information (e.g. if the same register is described twice)
- COMPRESS prose: replace long sentences with short ones. "The VIC-II chip uses register $D011 to control the vertical fine scrolling of the display" → "VIC-II $D011 controls vertical fine scroll"
- COLLAPSE register lists: if individual registers are listed that could be a range, use a range (e.g. "$D000-$D00F - VIC-II - Sprite 0-7 X/Y positions")
- DO NOT remove technical content, code examples, table data, or warnings/caveats from the source
- DO NOT add new content
- Return ONLY the compressed markdown, nothing else
"""


def md5_file(path):
    """Compute MD5 hash of a file's contents."""
    return hashlib.md5(path.read_bytes()).hexdigest()


def load_cache(cache_path):
    """Load the parsed_sources.json cache."""
    if cache_path.exists():
        with open(cache_path, 'r') as f:
            return json.load(f)
    return {"chunks": {}, "examples": {}}


def save_cache(cache_path, cache):
    """Save the parsed_sources.json cache."""
    with open(cache_path, 'w') as f:
        json.dump(cache, f, indent=2)
        f.write('\n')


def clean_chunk(client, model, chunk_content, split_dir):
    """Send a chunk to OpenAI for cleaning. Returns (cleaned_markdown, ref_name, response_info).

    If GPT responds with NEED_REFERENCE: chunk_name, loads that chunk
    from split_dir and sends a follow-up message with the reference content.
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": chunk_content},
    ]

    response = client.chat.completions.create(
        model=model, messages=messages,
    )
    result = response.choices[0].message.content.strip()

    # Check if GPT requested a reference
    if result.startswith('NEED_REFERENCE:'):
        ref_name = result.split(':', 1)[1].strip()
        ref_path = split_dir / f"{ref_name}.txt"

        if ref_path.exists():
            ref_content = ref_path.read_text(encoding='utf-8', errors='replace')
            messages.append({"role": "assistant", "content": result})
            messages.append({
                "role": "user",
                "content": (
                    f"Here is the referenced chunk '{ref_name}':\n\n{ref_content}\n\n"
                    f"Now produce the cleaned markdown for the original chunk."
                ),
            })

            response = client.chat.completions.create(
                model=model, messages=messages,
            )
            result = response.choices[0].message.content.strip()
            return result, ref_name, _fmt_response(response)
        else:
            # Reference not found, ask GPT to proceed without it
            messages.append({"role": "assistant", "content": result})
            messages.append({
                "role": "user",
                "content": (
                    f"Reference '{ref_name}' is not available. "
                    f"Proceed with cleaning the original chunk using your best knowledge."
                ),
            })

            response = client.chat.completions.create(
                model=model, messages=messages,
            )
            result = response.choices[0].message.content.strip()
            return result, None, _fmt_response(response)

    return result, None, _fmt_response(response)


def shrink_file(client, model, file_path, dry_run=False):
    """Shrink an oversized .md file in-place. Returns (old_size, new_size, resp_info) or None if dry_run."""
    content = file_path.read_text(encoding='utf-8', errors='replace')
    old_size = len(content.encode('utf-8'))

    if dry_run:
        return old_size, None, None

    # Skip example files — they contain source code that shouldn't be compressed
    if file_path.name.startswith('example_'):
        return None, None, None

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SHRINK_PROMPT},
            {"role": "user", "content": content},
        ],
    )
    result = response.choices[0].message.content.strip()
    new_size = len(result.encode('utf-8'))

    # Only write if actually smaller
    if new_size < old_size:
        file_path.write_text(result, encoding='utf-8')

    return old_size, new_size, _fmt_response(response)


def run_shrink(data_dir, client, model, threshold, dry_run):
    """Shrink mode: compress .md files over threshold bytes."""
    md_files = sorted(data_dir.glob('*.md'))
    oversized = [(f, f.stat().st_size) for f in md_files if f.stat().st_size > threshold]

    if not oversized:
        print(f"No .md files over {threshold} bytes in {data_dir}")
        return

    # Filter out example files
    non_example = [(f, s) for f, s in oversized if not f.name.startswith('example_')]
    example_count = len(oversized) - len(non_example)

    print(f"Found {len(non_example)} doc files over {threshold} bytes to shrink")
    if example_count:
        print(f"  (skipping {example_count} example_* files)")

    if not non_example:
        return

    processed = 0
    errors = 0
    total_saved = 0

    for i, (file_path, size) in enumerate(non_example, 1):
        if dry_run:
            print(f"  [{i}/{len(non_example)}] Would shrink: {file_path.name} ({size} bytes)")
            processed += 1
            continue

        print(f"  [{i}/{len(non_example)}] Shrinking: {file_path.name} ({size} bytes) ...", end='', flush=True)

        try:
            old_size, new_size, resp_info = shrink_file(client, model, file_path)
            if old_size is None:
                print(f" skipped (example)")
                continue

            saved = old_size - new_size
            total_saved += max(0, saved)
            pct = (1 - new_size / old_size) * 100 if old_size > 0 else 0

            if new_size < old_size:
                print(f" {old_size} -> {new_size} bytes ({pct:.0f}% smaller)")
            else:
                print(f" no reduction ({old_size} -> {new_size}), kept original")
            print(f"    [{resp_info}]")

            processed += 1

            if i < len(non_example):
                time.sleep(0.5)

        except Exception as e:
            errors += 1
            print(f" ERROR: {e}")

    print(f"\n{'='*50}")
    print(f"Shrink: {processed} processed, {errors} errors")
    if not dry_run:
        print(f"Total saved: {total_saved} bytes ({total_saved/1024:.1f} KB)")
    if dry_run:
        print("(dry run - no files were modified)")


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    split_dir = project_root / 'training' / 'split'
    data_dir = project_root / 'training' / 'data'
    cache_path = project_root / 'training' / 'parsed_sources.json'

    # Parse arguments
    force = '--force' in sys.argv
    dry_run = '--dry-run' in sys.argv
    shrink = '--shrink' in sys.argv
    model = 'gpt-5-mini'
    threshold = 6144  # 6KB default

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    if '--threshold' in sys.argv:
        idx = sys.argv.index('--threshold')
        threshold = int(sys.argv[idx + 1])

    # Shrink mode: operate on training/data/*.md directly
    if shrink:
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key and not dry_run:
            print("Error: OPENAI_API_KEY environment variable not set")
            sys.exit(1)
        client = OpenAI(api_key=api_key) if not dry_run else None
        run_shrink(data_dir, client, model, threshold, dry_run)
        return

    # Collect target files
    skip_flags = {'--force', '--dry-run', '--model', '--shrink', '--threshold'}
    args = []
    skip_next = False
    for a in sys.argv[1:]:
        if skip_next:
            skip_next = False
            continue
        if a in ('--model', '--threshold'):
            skip_next = True
            continue
        if a not in skip_flags:
            args.append(a)

    if args:
        chunk_files = []
        for a in args:
            p = split_dir / a
            if not p.exists() and not a.endswith('.txt'):
                p = split_dir / f"{a}.txt"
            if p.exists():
                chunk_files.append(p)
            else:
                print(f"Chunk not found: {a}")
        if not chunk_files:
            sys.exit(1)
    else:
        chunk_files = sorted(split_dir.glob('*.txt'))

    if not chunk_files:
        print("No chunks found in training/split/")
        sys.exit(0)

    # Ensure output dir exists
    data_dir.mkdir(parents=True, exist_ok=True)

    # Load cache
    cache = load_cache(cache_path)
    if 'chunks' not in cache:
        cache['chunks'] = {}

    # Check API key
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key and not dry_run:
        print("Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    client = None
    if not dry_run:
        client = OpenAI(api_key=api_key)

    # Process chunks
    processed = 0
    skipped = 0
    errors = 0
    refs_fetched = 0
    total = len(chunk_files)

    for i, chunk_path in enumerate(chunk_files, 1):
        name = chunk_path.name
        current_md5 = md5_file(chunk_path)

        # Check cache
        cached = cache['chunks'].get(name)
        if cached and cached.get('source_md5') == current_md5 and not force:
            # Verify output still exists
            output_path = data_dir / cached['output']
            if output_path.exists():
                skipped += 1
                continue

        output_name = chunk_path.stem + '.md'
        output_path = data_dir / output_name

        if dry_run:
            reason = "forced" if force else ("changed" if cached else "new")
            print(f"  [{i}/{total}] Would process: {name} ({reason})")
            processed += 1
            continue

        print(f"  [{i}/{total}] Processing: {name} ...", end='', flush=True)

        try:
            chunk_content = chunk_path.read_text(encoding='utf-8', errors='replace')
            result, ref_used, resp_info = clean_chunk(client, model, chunk_content, split_dir)

            output_path.write_text(result, encoding='utf-8')

            cache['chunks'][name] = {
                'source_md5': current_md5,
                'output': output_name,
            }
            save_cache(cache_path, cache)

            processed += 1
            if ref_used:
                refs_fetched += 1
                print(f" done -> {output_name} (ref: {ref_used})")
            else:
                print(f" done -> {output_name}")
            print(f"    [{resp_info}]")

            # Rate limiting: small delay between API calls
            if i < total:
                time.sleep(0.5)

        except Exception as e:
            errors += 1
            print(f" ERROR: {e}")

    # Summary
    print(f"\n{'='*50}")
    print(f"Chunks: {processed} processed, {skipped} skipped, {errors} errors (of {total} total)")
    if refs_fetched:
        print(f"References fetched: {refs_fetched} (extra API calls for self-containment)")
    if dry_run:
        print("(dry run - no files were modified)")


if __name__ == '__main__':
    main()
