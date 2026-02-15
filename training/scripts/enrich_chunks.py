#!/usr/bin/env python3
# /// script
# dependencies = ["openai"]
# ///
"""
Enrich cleaned training chunks with ## Labels and ## Mnemonics sections,
and remove junk ## Source Code / ## Key Registers sections.

Uses OpenAI to analyse each chunk and decide:
  1. Whether to add a ## Labels section (KERNAL labels, register mnemonics, color names)
  2. Whether to add a ## Mnemonics section (6502 instruction definitions)
  3. Whether to remove placeholder ## Source Code sections (e.g. "(omitted ...)")
  4. Whether to remove placeholder ## Key Registers sections (e.g. "(none)")

Usage:
    uv run scripts/enrich_chunks.py                    # Process all chunks
    uv run scripts/enrich_chunks.py --dry-run          # Show what would change
    uv run scripts/enrich_chunks.py --force             # Reprocess even cached files
    uv run scripts/enrich_chunks.py --workers 8         # Concurrency (default 4)
    uv run scripts/enrich_chunks.py --model gpt-4o      # Use different model
    uv run scripts/enrich_chunks.py some_chunk.md       # Process specific file(s)
"""

import hashlib
import json
import os
import re
import sys
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from openai import OpenAI


# ---------------------------------------------------------------------------
# OpenAI prompt
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """\
You are enriching a Commodore 64 / 6502 knowledge base chunk with searchable metadata.

Analyze this chunk and produce a structured response with up to four directives.

═══════════════════════════════════════════════════════════
DIRECTIVE 1 — REMOVE_SOURCE_CODE
═══════════════════════════════════════════════════════════
Look at the ## Source Code section (if present). Output:
  REMOVE_SOURCE_CODE: YES
if the section contains NO real code, data tables, register maps, or diagrams —
only placeholder text like "(omitted ...)", "(none)", "No source code", "N/A",
"not applicable", "no assembly listings provided", or similar phrasing indicating
absence. The exact wording varies — use your judgement.
Otherwise output:
  REMOVE_SOURCE_CODE: NO

═══════════════════════════════════════════════════════════
DIRECTIVE 2 — REMOVE_KEY_REGISTERS
═══════════════════════════════════════════════════════════
Look at the ## Key Registers section (if present). Output:
  REMOVE_KEY_REGISTERS: YES
if the section contains NO real register entries — only placeholder text like
"(none)", "- (none)", "not applicable", "no specific registers", "N/A",
"no registers are referenced", "(omitted ...)", or similar. Use your judgement.
Do NOT remove if it has actual register lines like "- $D020 - VIC-II - ...".
Otherwise output:
  REMOVE_KEY_REGISTERS: NO

═══════════════════════════════════════════════════════════
DIRECTIVE 3 — ## Labels
═══════════════════════════════════════════════════════════
Output a ## Labels section if this chunk DEFINES or is the PRIMARY DOCUMENTATION
for any of these types of identifiers:

• KERNAL API entry points (CHROUT, SETLFS, CHRIN, OPEN, CLOSE, GETIN, etc.)
  — Only if this chunk documents that routine: its address, calling convention,
    parameters, or behavior. Not if it merely calls or mentions the routine.

• I/O register symbolic names (EXTCOL, SIGVOL, RESON, BGCOL0, SCROLY, VMCSB,
  SP0X, CIAPRA, CIDDRA, TIMALO, etc.)
  — Only if this chunk defines that register: its address, bit layout, or behavior.

• Color names with value mapping (BLACK, WHITE, RED, CYAN, PURPLE, GREEN, BLUE,
  YELLOW, ORANGE, BROWN, LIGHT_RED, DARK_GRAY, GRAY, LIGHT_GREEN, LIGHT_BLUE,
  LIGHT_GRAY)
  — ONLY if the chunk contains a table or list mapping color names to their
    numeric values (e.g. BLACK=0, WHITE=1, RED=2). Do NOT add color labels if
    colors are merely mentioned or used in example code.

• Zero-page / OS variable labels (TXTTAB, CURLIN, OLDLIN, STATUS, DFLTN, etc.)
  — Only if this chunk specifically documents that variable.

• Other well-known C64 symbols (CHRGET, IRQ vector labels, etc.)
  — Only if specifically documented here.

Format (one per line, canonical UPPERCASE name only):
## Labels
- CHROUT
- SETLFS

Rules:
- ONLY labels this chunk DEFINES — not ones merely referenced
- Typically 1-5 labels; rarely more than 8
- If unsure, leave it out
- If no labels apply, omit the entire section

═══════════════════════════════════════════════════════════
DIRECTIVE 4 — ## Mnemonics
═══════════════════════════════════════════════════════════
Output a ## Mnemonics section if this chunk DEFINES a 6502/6510 CPU instruction:

• Official opcodes: LDA, STA, LDX, STX, LDY, STY, ADC, SBC, AND, ORA, EOR,
  CMP, CPX, CPY, INC, DEC, INX, INY, DEX, DEY, ASL, LSR, ROL, ROR, BIT,
  JMP, JSR, RTS, RTI, BRK, NOP, BCC, BCS, BEQ, BNE, BMI, BPL, BVC, BVS,
  CLC, SEC, CLD, SED, CLI, SEI, CLV, PHA, PLA, PHP, PLP, TAX, TXA, TAY,
  TYA, TSX, TXS

• Undocumented opcodes: DCP/DCM, ISB/ISC/INS, LAX, SAX/AXS, SLO/ASO,
  RLA, SRE/LSE, RRA, ANC/ANC2, ALR/ASR, ARR, SBX/AXS/SAX, LAS/LAR,
  SHA/AXA, SHX/SXA/XAS, SHY/SYA/SAY, TAS/SHS, ANE/XAA, LAX#/ATX/LXA,
  USBC/SBC#

Criteria: the chunk must be ABOUT the instruction — it has opcode table(s),
addressing modes, flag effects, cycle counts, or detailed behavioral description.

Include ALL known alternative names for the same opcode family.

Format:
## Mnemonics
- DCP
- DCM

Rules:
- ONLY if this chunk defines/documents the instruction
- Do NOT add mnemonics just because an instruction appears in example code
- If no mnemonics apply, omit the entire section

═══════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════
Output ALL applicable directives, in this order. Omit sections that don't apply.

REMOVE_SOURCE_CODE: YES/NO
REMOVE_KEY_REGISTERS: YES/NO
## Labels
- LABEL1
- LABEL2
## Mnemonics
- MNEM1

If the chunk has no ## Source Code section, omit REMOVE_SOURCE_CODE entirely.
If the chunk has no ## Key Registers section, omit REMOVE_KEY_REGISTERS entirely.
If nothing at all applies (no removals, no labels, no mnemonics), output exactly:
NONE
"""


# ---------------------------------------------------------------------------
# Section manipulation
# ---------------------------------------------------------------------------

def remove_section(content: str, heading: str) -> str:
    """Remove a markdown section (## heading + content until next ## or EOF)."""
    pattern = re.compile(
        r'(^|\n)(## ' + re.escape(heading) + r'\s*\n)'   # heading line
        r'(.*?)'                                           # content
        r'(?=\n## |\Z)',                                   # until next ## or EOF
        re.DOTALL
    )
    result = pattern.sub('', content)
    # Clean up double blank lines left behind
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.strip() + '\n'


def append_sections(content: str, new_sections: str) -> str:
    """Append new sections to the end of the content."""
    content = content.rstrip()
    if new_sections.strip():
        content += '\n\n' + new_sections.strip() + '\n'
    return content


# ---------------------------------------------------------------------------
# OpenAI interaction
# ---------------------------------------------------------------------------

def _fmt_response(response) -> str:
    """Format token usage from OpenAI response."""
    u = response.usage
    return f"{u.prompt_tokens}+{u.completion_tokens}tok"


def enrich_with_openai(client, model: str, content: str) -> dict:
    """Send chunk to OpenAI for enrichment analysis.

    Returns dict with keys:
        remove_source_code: bool | None (None if section absent)
        remove_key_registers: bool | None
        labels_section: str | None (full "## Labels\n- ..." text)
        mnemonics_section: str | None
        response_info: str (token usage)
    """
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": content},
        ],
        temperature=1,
    )
    result = response.choices[0].message.content.strip()
    resp_info = _fmt_response(response)

    parsed = {
        'remove_source_code': None,
        'remove_key_registers': None,
        'labels_section': None,
        'mnemonics_section': None,
        'response_info': resp_info,
    }

    if result == 'NONE':
        return parsed

    # Parse directives
    for line in result.split('\n'):
        line_s = line.strip()
        if line_s.startswith('REMOVE_SOURCE_CODE:'):
            val = line_s.split(':', 1)[1].strip().upper()
            parsed['remove_source_code'] = val == 'YES'
        elif line_s.startswith('REMOVE_KEY_REGISTERS:'):
            val = line_s.split(':', 1)[1].strip().upper()
            parsed['remove_key_registers'] = val == 'YES'

    # Parse ## Labels section
    labels_match = re.search(
        r'^## Labels\s*\n((?:- .+\n?)+)',
        result, re.MULTILINE
    )
    if labels_match:
        parsed['labels_section'] = '## Labels\n' + labels_match.group(1).strip()

    # Parse ## Mnemonics section
    mnemonics_match = re.search(
        r'^## Mnemonics\s*\n((?:- .+\n?)+)',
        result, re.MULTILINE
    )
    if mnemonics_match:
        parsed['mnemonics_section'] = '## Mnemonics\n' + mnemonics_match.group(1).strip()

    return parsed


# ---------------------------------------------------------------------------
# Cache helpers
# ---------------------------------------------------------------------------

def load_cache(cache_path: Path) -> dict:
    if cache_path.exists():
        with open(cache_path) as f:
            return json.load(f)
    return {}


def save_cache(cache_path: Path, cache: dict):
    with open(cache_path, 'w') as f:
        json.dump(cache, f, indent=2)
        f.write('\n')


def file_md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_dir = project_root / 'data'
    cache_path = project_root / 'parsed_sources.json'

    # Parse arguments
    dry_run = '--dry-run' in sys.argv
    force = '--force' in sys.argv
    model = 'gpt-5-mini'
    workers = 4

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    if '--workers' in sys.argv:
        idx = sys.argv.index('--workers')
        workers = int(sys.argv[idx + 1])

    # Collect target files
    skip_flags = {'--dry-run', '--force', '--model', '--workers'}
    args = []
    skip_next = False
    for a in sys.argv[1:]:
        if skip_next:
            skip_next = False
            continue
        if a in ('--model', '--workers'):
            skip_next = True
            continue
        if a not in skip_flags:
            args.append(a)

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
    else:
        md_files = sorted(data_dir.glob('*.md'))

    if not md_files:
        print(f"No .md files found in {data_dir}")
        sys.exit(0)

    # Load cache
    cache = load_cache(cache_path)
    enrichments = cache.get('enrichments', {})

    # Filter to files needing processing
    to_process = []
    skipped = 0
    for f in md_files:
        md5 = file_md5(f)
        cached = enrichments.get(f.name, {})

        if not force and cached.get('source_md5') == md5:
            skipped += 1
            continue

        to_process.append((f, md5))

    print(f"Enrichment: {len(to_process)} to process, {skipped} cached/skipped")
    if not to_process:
        print("Nothing to do.")
        return

    if dry_run:
        print("(dry run — will show OpenAI responses but not write files)")

    # Check API key
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    client = OpenAI(api_key=api_key)
    print(f"Processing {len(to_process)} chunks with OpenAI ({model}, {workers} workers)...\n")

    # Counters and lock
    cache_lock = threading.Lock()
    counter = {
        'done': 0, 'modified': 0, 'no_change': 0, 'errors': 0,
        'sections_removed': 0, 'labels_added': 0, 'mnemonics_added': 0,
    }

    def process_one(file_path: Path, current_md5: str):
        with cache_lock:
            counter['done'] += 1
            n = counter['done']
        print(f"  [{n}/{len(to_process)}] {file_path.name} ...", flush=True)

        try:
            content = file_path.read_text(encoding='utf-8', errors='replace')
            original = content

            # Send to OpenAI
            parsed = enrich_with_openai(client, model, content)

            # Apply changes
            changes = []

            if parsed['remove_source_code']:
                content = remove_section(content, 'Source Code')
                changes.append('rm Source Code')

            if parsed['remove_key_registers']:
                content = remove_section(content, 'Key Registers')
                changes.append('rm Key Registers')

            new_sections = []
            if parsed['labels_section']:
                new_sections.append(parsed['labels_section'])
                changes.append('+ Labels')

            if parsed['mnemonics_section']:
                new_sections.append(parsed['mnemonics_section'])
                changes.append('+ Mnemonics')

            if new_sections:
                content = append_sections(content, '\n\n'.join(new_sections))

            if content != original:
                if not dry_run:
                    file_path.write_text(content, encoding='utf-8')

                with cache_lock:
                    counter['modified'] += 1
                    if parsed['remove_source_code'] or parsed['remove_key_registers']:
                        counter['sections_removed'] += 1
                    if parsed['labels_section']:
                        counter['labels_added'] += 1
                    if parsed['mnemonics_section']:
                        counter['mnemonics_added'] += 1
                    # Update cache with NEW md5 (post-modification)
                    if not dry_run:
                        new_md5 = file_md5(file_path)
                        enrichments[file_path.name] = {'source_md5': new_md5}
                        cache['enrichments'] = enrichments
                        save_cache(cache_path, cache)

                change_str = ', '.join(changes)
                print(f"    MODIFIED ({change_str}) [{parsed['response_info']}]")
            else:
                with cache_lock:
                    counter['no_change'] += 1
                    # Cache original md5 to skip next time
                    if not dry_run:
                        enrichments[file_path.name] = {'source_md5': current_md5}
                        cache['enrichments'] = enrichments
                        save_cache(cache_path, cache)
                print(f"    no change [{parsed['response_info']}]")

        except Exception as e:
            with cache_lock:
                counter['errors'] += 1
            print(f"    ERROR: {e}")

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(process_one, fp, md5) for fp, md5 in to_process]
        for f in as_completed(futures):
            f.result()

    # Summary
    print(f"\n{'='*60}")
    print(f"Done: {counter['modified']} modified, {counter['no_change']} unchanged, {counter['errors']} errors")
    print(f"  Sections removed: {counter['sections_removed']}")
    print(f"  Labels added: {counter['labels_added']}")
    print(f"  Mnemonics added: {counter['mnemonics_added']}")
    if dry_run:
        print("\n(dry run — no files were modified)")


if __name__ == '__main__':
    main()
