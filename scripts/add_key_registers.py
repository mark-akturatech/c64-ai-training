#!/usr/bin/env python3
# /// script
# dependencies = ["openai"]
# ///
"""
Add ## Key Registers section to existing cleaned doc chunks.

Reads .md files from training/data/, skips examples and files that already
have a Key Registers section. Sends content to OpenAI to identify key
registers, then inserts the section.

Usage:
    uv run scripts/add_key_registers.py                  # Process all doc chunks
    uv run scripts/add_key_registers.py some_chunk.md    # Process specific file
    uv run scripts/add_key_registers.py --dry-run         # Show what would be processed
    uv run scripts/add_key_registers.py --model gpt-4o    # Use different model
"""

import os
import sys
import time
from pathlib import Path

from openai import OpenAI

SYSTEM_PROMPT = """\
You are given a cleaned Markdown document about Commodore 64 / MOS 6502 programming.

Your ONLY job: identify the primary hardware registers and memory addresses this chunk is ABOUT (not just mentions incidentally).

If the chunk documents or focuses on specific registers/addresses, respond with ONLY lines in this format:
- $XXXX - Chip/component - brief description

Example:
- $D020 - VIC-II - border color (16 colors, bits 0-3)
- $D021 - VIC-II - background color 0 (16 colors, bits 0-3)

Rules:
- Only include registers the chunk is primarily ABOUT
- Do NOT include registers that are just mentioned in passing or in example code
- Use uppercase hex: $D020 not $d020
- If the chunk is not about specific registers (e.g. instruction set reference, general concepts, syntax docs), respond with exactly: NONE
- Do NOT include any other text, headers, or explanation

CRITICAL — Use absolute C64 memory addresses, not chip-relative offsets:

Many source documents (especially chip datasheets) use chip-relative register offsets ($00, $04, $18, etc.). You MUST convert these to absolute C64 addresses.

Chip base addresses:
- SID (6581/8580): base $D400
  - Voice 1: $D400–$D406 (offsets $00–$06)
  - Voice 2: $D407–$D40D (offsets $07–$0D)
  - Voice 3: $D40E–$D414 (offsets $0E–$14)
  - Filter/volume: $D415–$D418 (offsets $15–$18)
  - Read-only: $D419–$D41C (offsets $19–$1C)
- VIC-II (6566/6567/6569): base $D000 (offsets $00–$2E → $D000–$D02E)
- CIA 1 (6526): base $DC00 (offsets $00–$0F → $DC00–$DC0F)
- CIA 2 (6526): base $DD00 (offsets $00–$0F → $DD00–$DD0F)

Conversion rules:
1. Only convert when CERTAIN the value is a register offset, not a data value/mask/count.
2. SID per-voice registers (offsets $00–$06): if the chunk describes a register generically (applies to all voices), list all 3 absolute addresses. If about a specific voice, list only that voice.
3. SID global registers ($15–$1C): singular, just $D400 + offset.
4. If unsure whether something is a register or a value, LEAVE IT OUT. Other chunks will cover it.
5. Non-C64 chips (6520 PIA, 6545 CRTC, 6525 TPI): respond NONE. Chip-relative offsets collide with real C64 addresses.
6. Raster line numbers, timing values, and non-address constants must NOT appear.
7. Self-check: if any address you output is $00XX or only 2 hex digits ($18, $04), it is almost certainly a chip-relative offset that was NOT converted. Fix it or remove it.
"""


def get_key_registers(client, model, content):
    """Ask OpenAI to identify key registers from chunk content."""
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": content},
        ],
    )
    result = response.choices[0].message.content.strip()
    usage = response.usage
    info = f"model={response.model}"
    if usage:
        info += f", tokens={usage.prompt_tokens}+{usage.completion_tokens}={usage.total_tokens}"

    if result == "NONE" or not result.startswith("- "):
        return None, info

    return result, info


def insert_key_registers(content, registers_section):
    """Insert ## Key Registers before ## References, or at end of content."""
    section = f"\n\n## Key Registers\n{registers_section}"

    # Insert before ## References if present
    ref_marker = "\n## References\n"
    idx = content.find(ref_marker)
    if idx != -1:
        return content[:idx] + section + content[idx:]

    # Otherwise append
    return content.rstrip() + section + "\n"


def main():
    data_dir = Path(__file__).parent.parent / "training" / "data"

    dry_run = "--dry-run" in sys.argv
    model = "gpt-5-mini"

    if "--model" in sys.argv:
        idx = sys.argv.index("--model")
        model = sys.argv[idx + 1]

    # Collect target files
    skip_flags = {"--dry-run", "--model"}
    args = []
    skip_next = False
    for a in sys.argv[1:]:
        if skip_next:
            skip_next = False
            continue
        if a == "--model":
            skip_next = True
            continue
        if a not in skip_flags:
            args.append(a)

    if args:
        md_files = []
        for a in args:
            p = data_dir / a
            if not p.exists() and not a.endswith(".md"):
                p = data_dir / f"{a}.md"
            if p.exists():
                md_files.append(p)
            else:
                print(f"Not found: {a}")
    else:
        md_files = sorted(data_dir.glob("*.md"))

    # Filter: skip examples and files that already have Key Registers
    to_process = []
    skipped_example = 0
    skipped_existing = 0
    for f in md_files:
        if f.name.startswith("example_"):
            skipped_example += 1
            continue
        content = f.read_text()
        if "## Key Registers" in content:
            skipped_existing += 1
            continue
        to_process.append((f, content))

    print(f"Found {len(md_files)} files, {len(to_process)} need Key Registers")
    print(f"  Skipped: {skipped_example} examples, {skipped_existing} already have section")

    if not to_process:
        print("Nothing to process")
        return

    if dry_run:
        for f, _ in to_process:
            print(f"  Would process: {f.name}")
        return

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY not set")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    processed = 0
    added = 0
    no_registers = 0
    errors = 0

    for i, (f, content) in enumerate(to_process, 1):
        print(f"  [{i}/{len(to_process)}] {f.name} ...", end="", flush=True)
        try:
            registers, info = get_key_registers(client, model, content)
            if registers:
                updated = insert_key_registers(content, registers)
                f.write_text(updated)
                added += 1
                print(f" added ({info})")
            else:
                no_registers += 1
                print(f" no key registers ({info})")

            processed += 1
            if i < len(to_process):
                time.sleep(0.3)

        except Exception as e:
            errors += 1
            print(f" ERROR: {e}")

    print(f"\n{'='*50}")
    print(f"Processed: {processed}, Added: {added}, No registers: {no_registers}, Errors: {errors}")


if __name__ == "__main__":
    main()
