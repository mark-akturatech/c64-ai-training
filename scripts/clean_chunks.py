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
"""

import hashlib
import json
import os
import sys
import time
from pathlib import Path

from openai import OpenAI

SYSTEM_PROMPT = """\
You are a technical documentation editor specializing in Commodore 64 and MOS 6502 assembly programming.

You are given a chunk of text extracted from a larger reference document. The source was exported from a PDF or book and may contain formatting artifacts. Your job is to produce a clean, well-structured Markdown document optimized for retrieval by an AI coding assistant.

## Output Structure

Return ONLY the cleaned markdown with this structure:

# <Use the title from the first line header, cleaned up>

**Summary:** <1-2 sentences with specific searchable terms: register addresses ($D012), chip names (VIC-II), technique names (raster interrupt), instruction mnemonics (LDA, STA). This is the most important line for search retrieval.>

<Cleaned content as markdown>

<If cross-references exist at the bottom (lines starting with "---" followed by "Additional information"), reformat them as a ## References section like this:>

## References
- "chunk_name" — description of what it covers
- "other_chunk" — description of what it covers

## Cleaning Rules

1. REMOVE these artifacts:
   - BOM characters, zero-width Unicode
   - Page numbers, roman numeral page markers (standalone i, ii, iii, iv, v, vi etc.)
   - Repeated document headers/footers from PDF extraction
   - Author credits, publication dates, copyright notices, "Written by...", contributor names
   - Transitional filler: "As mentioned earlier...", "In the previous section...", "We will now..."
   - Book navigation: "See Chapter 5", "Refer to appendix", "As shown in Figure 3.2"
   - Redundant introductions that just restate the title

2. PRESERVE exactly:
   - ALL technical content: register addresses, opcodes, memory locations, timing values, code
   - Technical explanations even if conversational ("The trick here is...")
   - Caveats and warnings ("Be careful not to write during...")
   - Any sentence containing a register address, opcode, or technical term

3. FORMAT as clean Markdown:
   - Tables: use Markdown tables (preserve all data and columns)
   - Code examples: use fenced code blocks with `asm` language hint
   - ASCII art/diagrams: use fenced code blocks (preserve layout exactly)
   - Use `$XXXX` formatting for hex addresses
   - Convert roman numerals to numbers in headings (Chapter IV -> Chapter 4)
   - Use ## for section headings within the chunk

4. SELF-CONTAINMENT:
   - If the chunk uses a concept without defining it, add a brief parenthetical explanation
   - Example: "the ADSR envelope" -> "the ADSR envelope (Attack, Decay, Sustain, Release -- the SID's per-voice volume shaping)"
   - Maximum 3-4 such additions per chunk, one sentence each
   - Assume reader knows basic 6502 assembly but may not know C64-specific details
   - If the chunk has cross-references at the bottom (lines like `"chunk_name" which expands on ...`) and you need to read a referenced chunk to write an accurate summary or parenthetical, respond with ONLY this line:
     NEED_REFERENCE: chunk_name
   - You will then receive the referenced chunk content and can use it to produce the final output
   - Only request a reference if you genuinely cannot write an accurate explanation without it
   - Request at most ONE reference per chunk

5. COMPLETENESS CHECK:
   - If technical data appears truncated (e.g., an instruction listing shows flag headers "N Z C I D V" but no values, a table row is missing columns, or a register description cuts off mid-sentence), complete it from standard 6502/C64 reference knowledge. This is correction of extraction errors, not invention.
   - If the chunk covers only part of a known set (e.g., BBR2-BBR7 but not BBR0-BBR1, or SID voice 1-2 but not voice 3), add a brief note in the summary or relevant section stating what is missing and that it can be found in related chunks.
   - If only a few members of a well-known set are present, list all members for completeness (e.g., if showing BBS4-BBS7 opcodes, mention BBS0-BBS3 exist with a note about where to find them).

6. SOURCE QUALITY WARNINGS:
   - If you notice what appears to be an error in the source data (e.g., a heading says "STA" but the opcode table shows "SBC", or a cycle count contradicts known 6502 behavior), preserve the original content but add a note: `**[Note: Source may contain an error — <brief description of the discrepancy>.]**`
   - Only flag clear contradictions, not ambiguities or stylistic choices.

7. DO NOT:
   - Remove or modify technical statements (but DO complete clearly truncated data per rule 5)
   - Add opinions or commentary
   - Change the meaning of any statement
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
    """Send a chunk to OpenAI for cleaning. Returns cleaned markdown.

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
            return result, ref_name
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
            return result, None

    return result, None


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    split_dir = project_root / 'training' / 'split'
    data_dir = project_root / 'training' / 'data'
    cache_path = project_root / 'training' / 'parsed_sources.json'

    # Parse arguments
    force = '--force' in sys.argv
    dry_run = '--dry-run' in sys.argv
    model = 'gpt-5'

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    # Collect target files
    skip_flags = {'--force', '--dry-run', '--model'}
    args = []
    skip_next = False
    for a in sys.argv[1:]:
        if skip_next:
            skip_next = False
            continue
        if a == '--model':
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
            result, ref_used = clean_chunk(client, model, chunk_content, split_dir)

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
