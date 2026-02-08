#!/usr/bin/env python3
# /// script
# dependencies = ["openai"]
# ///
"""
Auto-generate split configs for source documents using OpenAI API.

Reads source documents from documents/, sends content to OpenAI to identify
natural topic boundaries, and generates split config JSON files.

Usage:
    uv run scripts/auto_split.py document.txt        # Generate config for one file
    uv run scripts/auto_split.py --all                # Generate for all unconfigured docs
    uv run scripts/auto_split.py --force document.txt # Overwrite existing config
    uv run scripts/auto_split.py --model gpt-4o       # Use different model
    uv run scripts/auto_split.py --refine             # Refine all configs with oversized chunks
    uv run scripts/auto_split.py --refine config.json # Refine a specific config
"""

import hashlib
import json
import os
import sys
import time
from pathlib import Path

from openai import OpenAI

SYSTEM_PROMPT = """\
You are splitting a Commodore 64 / MOS 6502 reference document into discrete knowledge chunks for a semantic search database.

## CRITICAL: Line numbers
Every line in the input is prefixed with its line number like "  42| actual content here".
The prefix format is: right-aligned number, pipe character, space, then the actual document content. The prefix is NOT part of the document — it is only there so you can read the line number.
Use EXACTLY the line numbers shown in the prefix for your start/end values. Do NOT count lines yourself — read the number from the prefix.
Note: This is a 6502/C64 document, so the content itself may contain numbers and hex addresses ($0400, 6502, etc). Do not confuse those with the line number prefix.

## Purpose
Each chunk is a standalone knowledge node. When someone searches for a topic (e.g. "VIC-II sprite collision", "SID filter cutoff"), the chunk that comes back must be a complete, self-contained explanation of ONE concept or closely related group of concepts. It must make sense in isolation — the reader has no access to surrounding chunks.

## How to split
- Split by CONCEPT, not by line count. Each chunk = one discrete topic.
- A small concept (20 lines) stays as one chunk — do NOT pad it or merge it with unrelated content.
- A large concept (200 lines) that is truly one cohesive topic should stay together if possible, but if it naturally contains distinct sub-topics, split at those boundaries.
- Typical chunks will be 60-120 lines, but concept coherence always takes priority over size.
- Do NOT split mid-table, mid-code-listing, mid-paragraph, or mid-concept.
- Do NOT create chunks that are just fragments — every chunk must answer "what is this about?" clearly.

## What to ignore
Mark non-technical content as ignored: table of contents, author credits, indexes, page numbers, copyright notices, bibliographies.

## Naming and metadata
- Each chunk needs a descriptive snake_case name based on its topic (NOT _part01/_part02).
- Each chunk needs a description that lists the specific content: register addresses, instruction names, techniques, chip names.
- Add references between related chunks so readers can discover connected topics.
- Every line of the document must be covered by exactly one split entry (no gaps, no overlaps).

## Output Format
Return ONLY valid JSON (no markdown fencing, no commentary):
{
  "source_file": "<filename>",
  "context": "<Document Title>",
  "splits": [
    {
      "start": 1, "end": 60,
      "name": "descriptive_topic_name",
      "description": "Specific content: register addresses, techniques, chip names",
      "references": [
        { "chunk": "related_chunk_name", "topic": "what it covers" }
      ]
    },
    {
      "start": 61, "end": 70,
      "ignore": true,
      "reason": "Table of contents"
    }
  ]
}
"""

REFINE_SYSTEM_PROMPT = """\
You are refining a split configuration for a Commodore 64 / MOS 6502 reference document.

A chunk was too large and needs to be sub-divided. Each resulting chunk must be a standalone knowledge node for a semantic search database — when retrieved, it must make complete sense in isolation and cover ONE discrete concept or tightly related group of concepts.

## CRITICAL: Line numbers
Every line in the input is prefixed with its line number like "  42| actual content here".
The prefix format is: right-aligned number, pipe character, space, then the actual document content. The prefix is NOT part of the document — it is only there so you can read the line number.
Use EXACTLY the line numbers shown in the prefix for your start/end values. Do NOT count lines yourself — read the number from the prefix.
Note: This is a 6502/C64 document, so the content itself may contain numbers and hex addresses ($0400, 6502, etc). Do not confuse those with the line number prefix.

## How to split
- Split ONLY at natural concept boundaries (new register group, new instruction category, new technique, new hardware feature).
- Do NOT split just to hit a line count target. Concept coherence is more important than size.
- A sub-topic of 30 lines is fine as its own chunk if it's a distinct concept.
- Do NOT split mid-table, mid-code-listing, mid-paragraph, or mid-concept.
- Typical chunks will be 60-120 lines, but if a concept is naturally smaller or larger, that's OK.
- Every chunk must clearly answer "what is this about?" — no fragments or orphaned content.

## Naming and metadata
- Each sub-chunk needs a descriptive snake_case name based on its topic (NOT _part01/_part02).
- Each sub-chunk needs a description listing the specific content covered.
- Add references between the sub-chunks so readers can find related content.
- Every line must be covered by exactly one split entry (no gaps, no overlaps).
- The first split must start at {start_line} and the last must end at {end_line}.
- If a section is non-technical (TOC, index, credits), mark it as ignored.

## Context
- Document: {filename}
- Original chunk name: {chunk_name}
- Original description: {chunk_description}
- Lines {start_line}-{end_line} ({line_count} lines)

## Output Format
Return ONLY valid JSON (no markdown fencing, no commentary):
{{
  "splits": [
    {{
      "start": {start_line}, "end": <end>,
      "name": "descriptive_topic_name",
      "description": "Specific content covered",
      "references": [
        {{ "chunk": "sibling_chunk_name", "topic": "what it covers" }}
      ]
    }}
  ]
}}
"""

# Maximum lines to send in a single API call
MAX_LINES_PER_CALL = 3000

# Chunks larger than this trigger refinement
MAX_CHUNK_LINES = 120


def _fmt_elapsed(seconds):
    """Format elapsed seconds as a human-readable string."""
    if seconds < 60:
        return f"{seconds:.1f}s"
    minutes = int(seconds) // 60
    secs = seconds - minutes * 60
    return f"{minutes}m {secs:.0f}s"


def md5_content(content):
    """Compute MD5 hash of string content."""
    return hashlib.md5(content.encode('utf-8', errors='replace')).hexdigest()


def _number_lines(text, start_line=1):
    """Prefix each line with its absolute line number.

    Input: raw text (string), starting line number.
    Output: text with each line prefixed like "  42| content here".
    The width of the number column adapts to the highest line number.
    """
    lines = text.split('\n')
    end_line = start_line + len(lines) - 1
    width = len(str(end_line))
    numbered = []
    for i, line in enumerate(lines):
        num = start_line + i
        numbered.append(f"{num:>{width}}| {line}")
    return '\n'.join(numbered)


def split_document(client, model, filename, content, total_lines):
    """Send document to OpenAI for split config generation."""
    lines = content.splitlines()

    if total_lines <= MAX_LINES_PER_CALL:
        # Small enough to process in one call
        return _call_openai(client, model, filename, content, 1, total_lines)

    # Large document: process in windows with overlap
    all_splits = []
    window_size = MAX_LINES_PER_CALL
    overlap = 200  # Lines of overlap for context

    # Calculate total windows for progress reporting
    num_windows = 1
    pos = 0
    while pos + window_size < total_lines:
        pos += window_size - overlap
        num_windows += 1

    print(f"    Large document ({total_lines} lines), {num_windows} windows needed")
    window_start = 0
    window_num = 0
    doc_start_time = time.time()

    while window_start < total_lines:
        window_num += 1
        window_end = min(window_start + window_size, total_lines)
        window_lines = lines[window_start:window_end]
        window_content = '\n'.join(window_lines)
        numbered = _number_lines(window_content, window_start + 1)

        context_msg = ""
        if window_start > 0:
            context_msg = (
                f"\n\nNOTE: This is lines {window_start + 1}-{window_end} of {total_lines}. "
                f"Previous sections have already been split. Start your splits from line {window_start + 1}."
            )

        user_msg = (
            f"Split this section of '{filename}' (lines {window_start + 1}-{window_end} "
            f"of {total_lines} total):{context_msg}\n\n{numbered}"
        )

        print(f"    Window {window_num}/{num_windows}: lines {window_start + 1}-{window_end} ... ", end='', flush=True)
        call_start = time.time()

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
        )

        elapsed = time.time() - call_start
        result_text = _strip_json_fencing(response.choices[0].message.content)

        try:
            window_config = json.loads(result_text)
            window_splits = window_config.get('splits', [])

            new_count = 0
            for s in window_splits:
                if s.get('start', 0) >= window_start + 1:
                    all_splits.append(s)
                    new_count += 1

            print(f"{new_count} splits ({_fmt_elapsed(elapsed)})")

        except json.JSONDecodeError as e:
            print(f"PARSE ERROR ({_fmt_elapsed(elapsed)})")
            print(f"      {e}")

        # Move to next window (minus overlap)
        window_start = window_end - overlap
        if window_end >= total_lines:
            break

        time.sleep(1)  # Rate limit between windows

    total_elapsed = time.time() - doc_start_time
    print(f"    All windows done: {len(all_splits)} total splits in {_fmt_elapsed(total_elapsed)}")

    # Build final config
    return {
        "source_file": filename,
        "context": _extract_title(content),
        "splits": all_splits,
    }


def _call_openai(client, model, filename, content, start_line, end_line):
    """Make a single OpenAI API call for split generation."""
    numbered = _number_lines(content, start_line)
    user_msg = f"Split this document '{filename}' ({end_line} lines total):\n\n{numbered}"

    print(f"    Calling OpenAI ({end_line - start_line + 1} lines) ... ", end='', flush=True)
    call_start = time.time()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
    )

    elapsed = time.time() - call_start
    result_text = _strip_json_fencing(response.choices[0].message.content)
    result = json.loads(result_text)
    num_splits = len([s for s in result.get('splits', []) if not s.get('ignore')])
    print(f"{num_splits} splits ({_fmt_elapsed(elapsed)})")
    return result


def _extract_title(content):
    """Try to extract a document title from the first few lines."""
    for line in content.splitlines()[:10]:
        line = line.strip()
        if line and len(line) > 3 and not line.startswith('#'):
            # Clean BOM and return first non-empty line
            return line.lstrip('\ufeff').strip()[:80]
    return "Untitled Document"


def _strip_json_fencing(text):
    """Strip markdown code fencing from AI response."""
    text = text.strip()
    if text.startswith('```'):
        text = text.split('\n', 1)[1]
        if text.endswith('```'):
            text = text[:-3]
    return text.strip()


def refine_chunk(client, model, filename, lines, split_entry):
    """Send an oversized chunk to OpenAI for sub-splitting. Returns list of new splits."""
    start = split_entry['start']
    end = split_entry['end']
    chunk_name = split_entry.get('name', 'unnamed')
    chunk_desc = split_entry.get('description', '')
    line_count = end - start + 1

    # Extract the chunk content (1-indexed to 0-indexed)
    chunk_lines = lines[start - 1:end]
    chunk_content = ''.join(chunk_lines)

    prompt = REFINE_SYSTEM_PROMPT.format(
        start_line=start,
        end_line=end,
        line_count=line_count,
        filename=filename,
        chunk_name=chunk_name,
        chunk_description=chunk_desc,
    )

    # For very large chunks, process in windows
    if line_count > MAX_LINES_PER_CALL:
        return _refine_large_chunk(client, model, prompt, filename, lines,
                                   start, end, chunk_name, chunk_desc)

    numbered = _number_lines(chunk_content, start)
    user_msg = (
        f"Sub-split this oversized chunk ({line_count} lines, "
        f"lines {start}-{end}):\n\n{numbered}"
    )

    print(f"      Calling OpenAI ... ", end='', flush=True)
    call_start = time.time()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": user_msg},
        ],
    )

    elapsed = time.time() - call_start
    result_text = _strip_json_fencing(response.choices[0].message.content)
    result = json.loads(result_text)
    new_splits = result.get('splits', [])
    print(f"{len(new_splits)} sub-splits ({_fmt_elapsed(elapsed)})")
    return new_splits


def _refine_large_chunk(client, model, system_prompt, _filename, lines,
                        start, end, _chunk_name, _chunk_desc):
    """Refine a chunk that's too large for a single API call."""
    line_count = end - start + 1
    window_size = MAX_LINES_PER_CALL
    overlap = 200

    # Calculate total windows
    num_windows = 1
    pos = start - 1
    while pos + window_size < end:
        pos += window_size - overlap
        num_windows += 1

    print(f"      Large chunk ({line_count} lines), {num_windows} windows needed")

    all_splits = []
    window_start = start - 1  # 0-indexed
    window_num = 0
    chunk_start_time = time.time()

    while window_start < end:
        window_num += 1
        window_end = min(window_start + window_size, end)
        window_lines = lines[window_start:window_end]
        window_content = ''.join(window_lines)

        abs_start = window_start + 1  # back to 1-indexed
        abs_end = window_end

        numbered = _number_lines(window_content, abs_start)

        context_msg = ""
        if window_start > start - 1:
            context_msg = (
                f"\n\nNOTE: This is lines {abs_start}-{abs_end} of the chunk "
                f"(lines {start}-{end}). Previous sections already split. "
                f"Start from line {abs_start}."
            )

        user_msg = (
            f"Sub-split this section (lines {abs_start}-{abs_end}):"
            f"{context_msg}\n\n{numbered}"
        )

        print(f"      Window {window_num}/{num_windows}: lines {abs_start}-{abs_end} ... ", end='', flush=True)
        call_start = time.time()

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg},
            ],
        )

        elapsed = time.time() - call_start
        result_text = _strip_json_fencing(response.choices[0].message.content)
        try:
            window_result = json.loads(result_text)
            new_count = 0
            for s in window_result.get('splits', []):
                if s.get('start', 0) >= abs_start:
                    all_splits.append(s)
                    new_count += 1
            print(f"{new_count} splits ({_fmt_elapsed(elapsed)})")
        except json.JSONDecodeError as e:
            print(f"PARSE ERROR ({_fmt_elapsed(elapsed)})")
            print(f"        {e}")

        window_start = window_end - overlap
        if window_end >= end:
            break
        time.sleep(1)

    total_elapsed = time.time() - chunk_start_time
    print(f"      All windows done: {len(all_splits)} total splits in {_fmt_elapsed(total_elapsed)}")
    return all_splits


def refine_config(client, model, config, docs_dir, verbose=True):
    """Find oversized chunks in a config and sub-split them via OpenAI.
    Returns (updated_config, num_refined) or (config, 0) if nothing to do."""
    source_file = config['source_file']
    raw_path = docs_dir / source_file

    if not raw_path.exists():
        if verbose:
            print(f"  Warning: Source file not found: {raw_path}")
        return config, 0

    with open(raw_path, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    splits = config.get('splits', [])
    oversized = [
        (i, s) for i, s in enumerate(splits)
        if not s.get('ignore', False)
        and not s.get('no_refine', False)
        and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES
    ]

    if not oversized:
        if verbose:
            print(f"  No oversized chunks found")
        return config, 0

    if verbose:
        print(f"  Found {len(oversized)} oversized chunks to refine")

    num_refined = 0
    # Process in reverse index order so insertions don't shift indices
    for idx, split_entry in reversed(oversized):
        name = split_entry.get('name', '?')
        size = split_entry['end'] - split_entry['start'] + 1
        if verbose:
            print(f"    Refining '{name}' ({size} lines, {split_entry['start']}-{split_entry['end']})")

        try:
            new_splits = refine_chunk(client, model, source_file, lines, split_entry)

            if not new_splits:
                print(f"      WARNING: Got no splits back, keeping original")
                continue

            # Validate sub-splits cover the original range
            new_sorted = sorted(new_splits, key=lambda s: s.get('start', 0))
            first_start = new_sorted[0].get('start', 0)
            last_end = new_sorted[-1].get('end', 0)

            if first_start != split_entry['start'] or last_end != split_entry['end']:
                print(f"      WARNING: Sub-splits cover {first_start}-{last_end}, "
                      f"expected {split_entry['start']}-{split_entry['end']}. "
                      f"Adjusting boundaries.")
                new_sorted[0]['start'] = split_entry['start']
                new_sorted[-1]['end'] = split_entry['end']

            # Check for internal gaps/overlaps
            valid = True
            for j in range(1, len(new_sorted)):
                prev_end = new_sorted[j - 1].get('end', 0)
                curr_start = new_sorted[j].get('start', 0)
                if curr_start != prev_end + 1:
                    print(f"      WARNING: Gap/overlap between sub-splits at line {prev_end}/{curr_start}")
                    valid = False

            if not valid:
                print(f"      Keeping original due to validation errors")
                continue

            # Replace the original split with the new sub-splits
            splits[idx:idx + 1] = new_sorted
            num_refined += 1

            if verbose:
                still_oversized = [
                    s for s in new_sorted
                    if not s.get('ignore', False)
                    and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES
                ]
                print(f"      Split into {len(new_sorted)} sub-chunks"
                      + (f" ({len(still_oversized)} still oversized)" if still_oversized else ""))

        except Exception as e:
            print(f"      ERROR refining '{name}': {e}")

        time.sleep(1)  # Rate limit

    config['splits'] = splits
    return config, num_refined


def validate_config(config, total_lines):
    """Validate a split config for gaps and overlaps."""
    splits = config.get('splits', [])
    if not splits:
        return ["No splits defined"]

    errors = []
    # Sort by start line
    sorted_splits = sorted(splits, key=lambda s: s.get('start', 0))

    # Check for gaps and overlaps
    expected_start = 1
    for s in sorted_splits:
        start = s.get('start', 0)
        end = s.get('end', 0)

        if start > expected_start:
            errors.append(f"Gap: lines {expected_start}-{start - 1} not covered")
        elif start < expected_start:
            errors.append(f"Overlap at line {start} (expected {expected_start})")

        if end < start:
            errors.append(f"Invalid range: start={start} > end={end}")

        expected_start = end + 1

    if expected_start <= total_lines:
        errors.append(f"Uncovered lines at end: {expected_start}-{total_lines}")

    # Check chunk sizes
    for s in sorted_splits:
        if s.get('ignore') or s.get('no_refine'):
            continue
        size = s.get('end', 0) - s.get('start', 0) + 1
        if size > MAX_CHUNK_LINES:
            errors.append(f"Chunk '{s.get('name', '?')}' is {size} lines (max {MAX_CHUNK_LINES})")

    return errors


def _run_refine(client, model, _config_dir, docs_dir, config_files):
    """Refine oversized chunks in the given config files. Runs iteratively
    until all chunks are within MAX_CHUNK_LINES."""
    refined_total = 0
    errors = 0
    refine_start_time = time.time()

    for i, config_path in enumerate(config_files, 1):
        print(f"\n[{i}/{len(config_files)}] Refining: {config_path.name}")
        file_start = time.time()

        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)

            raw_path = docs_dir / config['source_file']
            if not raw_path.exists():
                print(f"  Warning: Source file not found: {raw_path}")
                continue

            total_lines = len(raw_path.read_text(encoding='utf-8', errors='replace').splitlines())

            # Iterate: refine may produce chunks that are still oversized
            iteration = 0
            max_iterations = 5
            while iteration < max_iterations:
                iteration += 1
                if iteration > 1:
                    print(f"  Refine iteration {iteration}...")
                config, num_refined = refine_config(client, model, config, docs_dir,
                                                     verbose=True)
                if num_refined == 0:
                    break
                refined_total += num_refined
                if iteration > 1:
                    print(f"    Refined {num_refined} more chunks")

            # Mark any still-oversized chunks as no_refine
            marked = 0
            for s in config.get('splits', []):
                if (not s.get('ignore', False)
                        and not s.get('no_refine', False)
                        and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES):
                    s['no_refine'] = True
                    marked += 1
            if marked:
                print(f"  Marked {marked} chunks as no_refine (cannot split further)")

            # Validate final result
            validation_errors = validate_config(config, total_lines)
            if validation_errors:
                print(f"  Validation warnings after refine:")
                for err in validation_errors:
                    print(f"    - {err}")

            # Write updated config
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
                f.write('\n')

            num_splits = len([s for s in config.get('splits', []) if not s.get('ignore')])
            file_elapsed = time.time() - file_start
            print(f"  Result: {num_splits} total chunks in {_fmt_elapsed(file_elapsed)}")

        except Exception as e:
            errors += 1
            print(f"  ERROR: {e}")

    total_elapsed = time.time() - refine_start_time
    print(f"\nRefine total time: {_fmt_elapsed(total_elapsed)}")
    return refined_total, errors


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    docs_dir = project_root / 'documents'
    config_dir = project_root / 'training' / 'split_config'

    # Parse arguments
    force = '--force' in sys.argv
    process_all = '--all' in sys.argv
    refine_mode = '--refine' in sys.argv
    model = 'gpt-5'

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    # Collect positional args
    skip_flags = {'--force', '--all', '--model', '--refine'}
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

    # Check API key
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    # --- REFINE MODE ---
    if refine_mode:
        config_dir.mkdir(parents=True, exist_ok=True)

        if args:
            # Refine specific config(s)
            config_files = []
            for a in args:
                p = config_dir / a
                if not p.exists() and not a.endswith('.json'):
                    p = config_dir / f"{a}.json"
                if p.exists():
                    config_files.append(p)
                else:
                    print(f"Config not found: {a}")
            if not config_files:
                sys.exit(1)
        else:
            # Refine all configs that have oversized chunks
            config_files = []
            for cp in sorted(config_dir.glob('*.json')):
                if cp.name == 'parsed_sources.json':
                    continue
                with open(cp, 'r', encoding='utf-8') as f:
                    cfg = json.load(f)
                has_oversized = any(
                    not s.get('ignore', False)
                    and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES
                    for s in cfg.get('splits', [])
                )
                if has_oversized:
                    config_files.append(cp)

            if not config_files:
                print("No configs with oversized chunks found.")
                sys.exit(0)

            print(f"Found {len(config_files)} configs with oversized chunks")

        refined, errors = _run_refine(client, model, config_dir, docs_dir, config_files)
        print(f"\n{'='*50}")
        print(f"Refined {refined} oversized chunks, {errors} errors")
        sys.exit(0)

    # --- NORMAL GENERATE MODE ---
    if process_all:
        doc_files = []
        for doc in sorted(docs_dir.glob('*.txt')):
            config_path = config_dir / f"{doc.stem}.json"
            if not config_path.exists() or force:
                doc_files.append(doc)
        if not doc_files:
            print("All documents already have configs (use --force to regenerate)")
            sys.exit(0)
    elif args:
        doc_files = []
        for a in args:
            p = docs_dir / a
            if not p.exists() and not a.endswith('.txt'):
                p = docs_dir / f"{a}.txt"
            if p.exists():
                doc_files.append(p)
            else:
                print(f"Document not found: {a}")
        if not doc_files:
            sys.exit(1)
    else:
        print("Usage: auto_split.py <document.txt> | --all | --refine [--force] [--model MODEL]")
        sys.exit(1)

    # Check for existing configs
    if not force:
        to_process = []
        for doc in doc_files:
            config_path = config_dir / f"{doc.stem}.json"
            if config_path.exists():
                print(f"  Skipping {doc.name}: config already exists (use --force to overwrite)")
            else:
                to_process.append(doc)
        doc_files = to_process

    if not doc_files:
        print("Nothing to process.")
        sys.exit(0)

    config_dir.mkdir(parents=True, exist_ok=True)

    # Process documents
    processed = 0
    errors = 0
    configs_to_refine = []

    run_start_time = time.time()

    for i, doc_path in enumerate(doc_files, 1):
        print(f"\n[{i}/{len(doc_files)}] Processing: {doc_path.name}")
        file_start = time.time()

        try:
            content = doc_path.read_text(encoding='utf-8', errors='replace')
            total_lines = len(content.splitlines())
            print(f"    {total_lines} lines")

            config = split_document(client, model, doc_path.name, content, total_lines)

            # Add source_md5
            config['source_md5'] = md5_content(content)

            # Validate
            validation_errors = validate_config(config, total_lines)
            if validation_errors:
                print(f"    Validation warnings:")
                for err in validation_errors:
                    print(f"      - {err}")

            # Write config
            config_path = config_dir / f"{doc_path.stem}.json"
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
                f.write('\n')

            num_splits = len([s for s in config.get('splits', []) if not s.get('ignore')])
            num_ignored = len([s for s in config.get('splits', []) if s.get('ignore')])
            file_elapsed = time.time() - file_start
            print(f"    Created: {config_path.name} ({num_splits} chunks, {num_ignored} ignored) in {_fmt_elapsed(file_elapsed)}")
            processed += 1

            # Check if auto-refine is needed
            has_oversized = any(
                not s.get('ignore', False)
                and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES
                for s in config.get('splits', [])
            )
            if has_oversized:
                configs_to_refine.append(config_path)

        except Exception as e:
            errors += 1
            print(f"    ERROR: {e}")

        # Rate limit
        if i < len(doc_files):
            time.sleep(1)

    # Auto-refine any newly generated configs with oversized chunks
    refined_total = 0
    if configs_to_refine:
        print(f"\n{'='*50}")
        print(f"Auto-refining {len(configs_to_refine)} configs with oversized chunks...")
        refined_total, refine_errors = _run_refine(client, model, config_dir,
                                                    docs_dir, configs_to_refine)
        errors += refine_errors

    # Summary
    total_run_time = time.time() - run_start_time
    print(f"\n{'='*50}")
    print(f"Documents: {processed} processed, {errors} errors")
    if refined_total:
        print(f"Auto-refined: {refined_total} oversized chunks")
    print(f"Total time: {_fmt_elapsed(total_run_time)}")


if __name__ == '__main__':
    main()
