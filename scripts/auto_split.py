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
    uv run scripts/auto_split.py --workers 8          # Process 8 files concurrently (default: 4)
"""

import hashlib
import json
import os
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
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
- Prefer GRANULAR splits. A concept that takes 20-30 lines is a perfectly good chunk — do NOT pad it or merge it with unrelated content just to reach a larger size.
- When a section covers multiple distinct sub-topics, registers, techniques, or instructions, split them into separate chunks even if each one is small.
- Only keep content together if it is truly ONE cohesive concept that cannot be understood when separated.
- If a chunk exceeds ~80 lines, look harder for sub-topic boundaries — most concepts can be split further. Chunks over 120 lines almost certainly contain multiple concepts.
- Do NOT split mid-table, mid-code-listing, mid-paragraph, or mid-concept.
- Do NOT create chunks that are just fragments — every chunk must answer "what is this about?" clearly.
- When in doubt, split smaller. A semantic search database works best with focused, specific chunks rather than broad, multi-topic ones.
- Self-check: "would someone search for these sub-topics separately?" If yes, they should be separate chunks.

## What to ignore
Mark non-technical sections as ignored regardless of size: table of contents, author credits, indexes, copyright notices, bibliographies, revision history, modification timestamps, acknowledgements.
Do NOT create ignored entries for blank lines, page breaks, or minor whitespace — just include those in the adjacent chunk. The cleaning step handles formatting.

## Naming and metadata
- Each chunk needs a descriptive snake_case name based on its topic (NOT _part01/_part02).
- Each chunk needs a description that lists the specific content: register addresses, instruction names, techniques, chip names.
- Add references between related chunks so readers can discover connected topics. With granular chunks, references are essential — if you split a topic into several focused chunks, link them to each other.
- Every line of the document must be covered by exactly one split entry (no gaps, no overlaps).

## Output Format
Return ONLY valid JSON (no markdown fencing, no commentary):
{
  "source_file": "<filename>",
  "context": "<Document Title>",
  "splits": [
    {
      "start": 1, "end": 8,
      "ignore": true,
      "reason": "Title page and copyright"
    },
    {
      "start": 9, "end": 34,
      "name": "sprite_register_layout",
      "description": "VIC-II sprite position registers $D000-$D00F, X/Y coordinate pairs, MSB register $D010",
      "references": [
        { "chunk": "sprite_display_enable", "topic": "enabling sprites via $D015" },
        { "chunk": "sprite_color_registers", "topic": "sprite color configuration" }
      ]
    },
    {
      "start": 35, "end": 58,
      "name": "sprite_display_enable",
      "description": "Sprite enable register $D015, priority register $D01B, multicolor mode $D01C",
      "references": [
        { "chunk": "sprite_register_layout", "topic": "sprite position registers" }
      ]
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
- Mark non-technical sections as ignored regardless of size (TOC, index, credits, revision history). Do NOT create ignored entries for blank lines or minor whitespace — include them in the adjacent chunk.

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

def _fmt_response(response):
    """Format a one-line summary of an OpenAI API response."""
    usage = response.usage
    parts = [f"model={response.model}"]
    if usage:
        parts.append(f"tokens={usage.prompt_tokens}+{usage.completion_tokens}={usage.total_tokens}")
    return ', '.join(parts)


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
            print(f"      [{_fmt_response(response)}]")

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
    print(f"    [{_fmt_response(response)}]")
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
    print(f"      [{_fmt_response(response)}]")
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
            print(f"        [{_fmt_response(response)}]")
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


def normalize_ignored(config):
    """Ensure splits with 'ignored' in the name have the ignore flag set.

    The AI sometimes names sections with 'ignored' but forgets to set the flag.
    """
    fixed = 0
    for split in config.get('splits', []):
        name = split.get('name', '')
        if 'ignored' in name.lower() and not split.get('ignore', False):
            split['ignore'] = True
            if not split.get('reason'):
                split['reason'] = split.get('description', 'ignored section')
            fixed += 1
    return fixed


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


def _is_blank(line):
    """Return True if a line is blank or whitespace-only."""
    return line.strip() == ''


def _add_context(issue, lines, splits, total):
    """Add surrounding context lines and chunk names to an issue dict."""
    prev_idx = issue.get('prev_split_idx')
    next_idx = issue.get('next_split_idx')

    if prev_idx is not None and 0 <= prev_idx < len(splits):
        issue['prev_chunk'] = splits[prev_idx].get('name', splits[prev_idx].get('reason'))
    if next_idx is not None and 0 <= next_idx < len(splits):
        issue['next_chunk'] = splits[next_idx].get('name', splits[next_idx].get('reason'))

    # 5 lines before the issue region
    ctx_start = max(0, issue['start'] - 1 - 5)
    ctx_end = issue['start'] - 1
    if ctx_start < ctx_end:
        issue['context_before'] = _number_lines(
            ''.join(lines[ctx_start:ctx_end]), ctx_start + 1)

    # 5 lines after the issue region
    ctx_start2 = issue['end']
    ctx_end2 = min(total, issue['end'] + 5)
    if ctx_start2 < ctx_end2:
        issue['context_after'] = _number_lines(
            ''.join(lines[ctx_start2:ctx_end2]), ctx_start2 + 1)


def _classify_issues_with_ai(client, model, filename, issues):
    """Send all non-trivial issues (gaps and overlaps) to OpenAI in one batch call.

    Returns dict mapping issue id → {"action": ..., "reason": ..., ...}
    """
    descriptions = []
    for iss in issues:
        kind = iss['type'].upper()
        prev = iss.get('prev_chunk', 'none')
        nxt = iss.get('next_chunk', 'none')
        ctx_before = iss.get('context_before', '')
        ctx_after = iss.get('context_after', '')

        parts = [f"{kind} {iss['id']}: lines {iss['start']}-{iss['end']}"]
        parts.append(f"  Previous chunk: {prev}")
        parts.append(f"  Next chunk: {nxt}")
        if ctx_before:
            parts.append(f"  Last 5 lines of previous chunk:\n{ctx_before}")
        parts.append(f"  {kind} content:\n{iss['content']}")
        if ctx_after:
            parts.append(f"  First 5 lines of next chunk:\n{ctx_after}")
        descriptions.append('\n'.join(parts))

    user_msg = (
        f"Document: {filename}\n\n"
        f"The following issues exist in a split config. "
        f"GAPS are lines not covered by any chunk. "
        f"OVERLAPS are lines claimed by two adjacent chunks.\n\n"
        f"For each issue, decide the best action:\n\n"
        f'- "ignore": the content is non-technical (page markers, figure references, '
        f"blank lines, formatting artifacts) — mark as ignored\n"
        f'- "extend_prev": the content belongs with the previous chunk — '
        f"for gaps extend its end; for overlaps shrink the next chunk's start\n"
        f'- "extend_next": the content belongs with the next chunk — '
        f"for gaps extend its start; for overlaps shrink the previous chunk's end\n"
        f'- "new_chunk": the content is a distinct topic — '
        f'provide a snake_case "name" and "description". '
        f"For overlaps this removes the lines from both adjacent chunks\n\n"
        + '\n\n'.join(descriptions)
        + '\n\nReturn ONLY valid JSON (no markdown fencing):\n'
        + '{"issues": [{"id": 1, "action": "ignore|extend_prev|extend_next|new_chunk", '
        + '"reason": "brief reason", "name": "only_for_new_chunk", '
        + '"description": "only_for_new_chunk"}]}'
    )

    system_msg = (
        "You are fixing gaps and overlaps in a Commodore 64 / MOS 6502 reference document "
        "split config. This is a technical document about 6502 assembly, C64 hardware, etc. "
        "Be careful not to discard real technical content — addresses like $D020, "
        "register descriptions, code, memory map entries, instruction details are all valuable. "
        "Page markers (like standalone ':187:'), figure references ('Figure C.10'), "
        "form feeds, and blank lines are safe to ignore."
    )

    num_gaps = sum(1 for i in issues if i['type'] == 'gap')
    num_overlaps = sum(1 for i in issues if i['type'] == 'overlap')
    label = []
    if num_gaps:
        label.append(f"{num_gaps} gaps")
    if num_overlaps:
        label.append(f"{num_overlaps} overlaps")
    print(f"    Classifying {' + '.join(label)} via AI ... ", end='', flush=True)
    call_start = time.time()

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
    )

    elapsed = time.time() - call_start
    result_text = _strip_json_fencing(response.choices[0].message.content)
    print(f"done ({_fmt_elapsed(elapsed)})")
    print(f"      [{_fmt_response(response)}]")

    try:
        result = json.loads(result_text)
        return {item['id']: item for item in result.get('issues', [])}
    except (json.JSONDecodeError, KeyError) as e:
        print(f"      WARNING: Failed to parse AI issue classification: {e}")
        return {}


def fix_gaps_and_overlaps(config, lines, client=None, model=None, filename=None):
    """Fix gaps and overlaps in split config.

    Both gaps and overlaps are classified by AI (with context) to decide:
      ignore / extend_prev / extend_next / new_chunk
    All-blank gaps are auto-ignored without AI.

    Returns (config, num_fixes).
    """
    splits = config.get('splits', [])
    if not splits:
        return config, 0

    splits.sort(key=lambda s: s.get('start', 0))
    total = len(lines)
    num_fixes = 0
    issue_counter = 0

    # --- Collect all issues (gaps AND overlaps) ---
    all_issues = []

    for idx in range(len(splits)):
        s = splits[idx]
        start = s.get('start', 0)
        expected = 1 if idx == 0 else splits[idx - 1].get('end', 0) + 1

        if start > expected:
            # Gap
            issue_counter += 1
            all_issues.append({
                "id": issue_counter,
                "type": "gap",
                "start": expected,
                "end": start - 1,
                "split_idx": idx,  # gap is before this split
                "prev_split_idx": idx - 1 if idx > 0 else None,
                "next_split_idx": idx,
            })
        elif start < expected:
            # Overlap: lines start..expected-1 are claimed by both splits[idx-1] and splits[idx]
            overlap_start = start
            overlap_end = expected - 1  # = splits[idx-1].end
            issue_counter += 1
            all_issues.append({
                "id": issue_counter,
                "type": "overlap",
                "start": overlap_start,
                "end": overlap_end,
                "split_idx": idx,
                "prev_split_idx": idx - 1,
                "next_split_idx": idx,
            })

    # Check trailing gap
    if splits:
        last_end = splits[-1].get('end', 0)
        if last_end < total:
            issue_counter += 1
            all_issues.append({
                "id": issue_counter,
                "type": "gap",
                "start": last_end + 1,
                "end": total,
                "split_idx": len(splits),  # after last split
                "prev_split_idx": len(splits) - 1,
                "next_split_idx": None,
            })

    if not all_issues:
        return config, num_fixes

    # Separate trivial (blank-only gaps) from issues needing AI
    auto_issues = []
    ai_issues = []

    for iss in all_issues:
        issue_lines = lines[iss['start'] - 1:iss['end']]
        if iss['type'] == 'gap' and all(_is_blank(l) for l in issue_lines):
            auto_issues.append(iss)
        else:
            iss['content'] = _number_lines(''.join(issue_lines), iss['start'])
            _add_context(iss, lines, splits, total)
            ai_issues.append(iss)

    # Classify non-trivial issues via AI
    ai_decisions = {}
    if ai_issues and client:
        ai_decisions = _classify_issues_with_ai(client, model, filename or '', ai_issues)
    elif ai_issues:
        print(f"    WARNING: {len(ai_issues)} issues but no AI client — using fallback")

    # Build decision map
    decisions = {}
    for iss in auto_issues:
        decisions[iss['id']] = {"action": "ignore", "reason": "Blank lines"}
    for iss in ai_issues:
        ai_result = ai_decisions.get(iss['id'])
        if ai_result:
            decisions[iss['id']] = ai_result
        else:
            # Fallback: give lines to previous chunk
            decisions[iss['id']] = {"action": "extend_prev", "reason": "AI fallback"}

    # --- Apply fixes in reverse order so index shifts don't matter ---
    for iss in reversed(all_issues):
        decision = decisions.get(iss['id'], {})
        action = decision.get('action', 'extend_prev')
        reason = decision.get('reason', '')
        iss_start = iss['start']
        iss_end = iss['end']
        iss_type = iss['type']
        split_idx = iss['split_idx']
        prev_idx = iss.get('prev_split_idx')
        next_idx = iss.get('next_split_idx')
        label = iss_type.capitalize()

        if action == 'ignore':
            if iss_type == 'gap':
                splits.insert(split_idx, {
                    "start": iss_start, "end": iss_end,
                    "ignore": True, "reason": reason or "Non-technical content"
                })
            else:  # overlap
                # Shrink both chunks away from the overlap, insert ignored entry
                if prev_idx is not None:
                    splits[prev_idx]['end'] = iss_start - 1
                if next_idx is not None:
                    splits[next_idx]['start'] = iss_end + 1
                splits.insert(split_idx, {
                    "start": iss_start, "end": iss_end,
                    "ignore": True, "reason": reason or "Non-technical content"
                })
            print(f"    {label} fix: lines {iss_start}-{iss_end} → ignored ({reason})")
            num_fixes += 1

        elif action == 'new_chunk':
            new_entry = {
                "start": iss_start, "end": iss_end,
                "name": decision.get('name', f'{iss_type}_{iss_start}_{iss_end}'),
                "description": decision.get('description', reason),
            }
            if iss_type == 'overlap':
                if prev_idx is not None:
                    splits[prev_idx]['end'] = iss_start - 1
                if next_idx is not None:
                    splits[next_idx]['start'] = iss_end + 1
            splits.insert(split_idx, new_entry)
            print(f"    {label} fix: lines {iss_start}-{iss_end} → "
                  f"new chunk '{new_entry['name']}' ({reason})")
            num_fixes += 1

        elif action == 'extend_next':
            if iss_type == 'gap':
                if next_idx is not None and next_idx < len(splits):
                    chunk = splits[next_idx]
                    print(f"    {label} fix: lines {iss_start}-{iss_end} → "
                          f"extended '{chunk.get('name', '?')}' start → {iss_start} ({reason})")
                    chunk['start'] = iss_start
                    num_fixes += 1
                elif prev_idx is not None:
                    chunk = splits[prev_idx]
                    print(f"    {label} fix: lines {iss_start}-{iss_end} → "
                          f"extended '{chunk.get('name', '?')}' end → {iss_end} (fallback)")
                    chunk['end'] = iss_end
                    num_fixes += 1
            else:  # overlap → next chunk keeps lines, shrink prev
                if prev_idx is not None:
                    print(f"    {label} fix: lines {iss_start}-{iss_end} → "
                          f"kept in '{splits[next_idx].get('name', '?')}', "
                          f"shrunk '{splits[prev_idx].get('name', '?')}' end → {iss_start - 1} "
                          f"({reason})")
                    splits[prev_idx]['end'] = iss_start - 1
                    num_fixes += 1

        else:  # extend_prev (default)
            if iss_type == 'gap':
                if prev_idx is not None and prev_idx >= 0:
                    chunk = splits[prev_idx]
                    print(f"    {label} fix: lines {iss_start}-{iss_end} → "
                          f"extended '{chunk.get('name', '?')}' end → {iss_end} ({reason})")
                    chunk['end'] = iss_end
                    num_fixes += 1
                elif next_idx is not None and next_idx < len(splits):
                    chunk = splits[next_idx]
                    print(f"    {label} fix: lines {iss_start}-{iss_end} → "
                          f"extended '{chunk.get('name', '?')}' start → {iss_start} (fallback)")
                    chunk['start'] = iss_start
                    num_fixes += 1
            else:  # overlap → prev chunk keeps lines, shrink next
                if next_idx is not None:
                    print(f"    {label} fix: lines {iss_start}-{iss_end} → "
                          f"kept in '{splits[prev_idx].get('name', '?')}', "
                          f"shrunk '{splits[next_idx].get('name', '?')}' start → {iss_end + 1} "
                          f"({reason})")
                    splits[next_idx]['start'] = iss_end + 1
                    num_fixes += 1

    # Clean up any splits that became empty after overlap fixes
    splits = [s for s in splits if s.get('end', 0) >= s.get('start', 0)]

    config['splits'] = splits
    return config, num_fixes


def _run_refine(client, model, _config_dir, docs_dir, config_files, workers=1):
    """Refine configs: fix gaps/overlaps first, then sub-split oversized chunks.
    Runs iteratively until all chunks are within MAX_CHUNK_LINES."""
    counter = {'refined': 0, 'errors': 0, 'done': 0}
    counter_lock = threading.Lock()
    refine_start_time = time.time()
    total = len(config_files)

    def refine_one(config_path):
        with counter_lock:
            counter['done'] += 1
            n = counter['done']
        print(f"\n[{n}/{total}] Refining: {config_path.name}")
        file_start = time.time()

        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)

            raw_path = docs_dir / config['source_file']
            if not raw_path.exists():
                print(f"  Warning: Source file not found: {raw_path}")
                return

            file_content = raw_path.read_text(encoding='utf-8', errors='replace')
            lines = file_content.splitlines(keepends=True)
            total_lines = len(lines)

            iteration = 0
            max_iterations = 5
            while iteration < max_iterations:
                iteration += 1
                if iteration > 1:
                    print(f"  --- Pass {iteration} ---")

                config, gap_fixes = fix_gaps_and_overlaps(
                    config, lines, client=client, model=model,
                    filename=config['source_file'])
                if gap_fixes:
                    print(f"  Fixed {gap_fixes} gaps/overlaps")

                config, num_refined = refine_config(client, model, config, docs_dir,
                                                     verbose=True)
                if num_refined:
                    with counter_lock:
                        counter['refined'] += num_refined

                if gap_fixes == 0 and num_refined == 0:
                    break

            marked = 0
            for s in config.get('splits', []):
                if (not s.get('ignore', False)
                        and not s.get('no_refine', False)
                        and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES):
                    s['no_refine'] = True
                    marked += 1
            if marked:
                print(f"  Marked {marked} chunks as no_refine (cannot split further)")

            norm_fixed = normalize_ignored(config)
            if norm_fixed:
                print(f"  Fixed {norm_fixed} entries missing ignore flag")

            validation_errors = validate_config(config, total_lines)
            if validation_errors:
                config['warnings'] = validation_errors
                print(f"  Validation warnings after refine:")
                for err in validation_errors:
                    print(f"    - {err}")
            else:
                config.pop('warnings', None)

            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
                f.write('\n')

            num_splits = len([s for s in config.get('splits', []) if not s.get('ignore')])
            file_elapsed = time.time() - file_start
            print(f"  Result: {num_splits} total chunks in {_fmt_elapsed(file_elapsed)}")

        except Exception as e:
            with counter_lock:
                counter['errors'] += 1
            print(f"  ERROR: {e}")

    if workers > 1:
        print(f"Refining with {workers} workers...")
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = [pool.submit(refine_one, cp) for cp in config_files]
            for f in as_completed(futures):
                f.result()
    else:
        for cp in config_files:
            refine_one(cp)

    total_elapsed = time.time() - refine_start_time
    print(f"\nRefine total time: {_fmt_elapsed(total_elapsed)}")
    return counter['refined'], counter['errors']


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    docs_dir = project_root / 'documents'
    config_dir = project_root / 'training' / 'split_config'

    # Parse arguments
    force = '--force' in sys.argv
    process_all = '--all' in sys.argv
    refine_mode = '--refine' in sys.argv
    model = 'gpt-5-mini'

    if '--model' in sys.argv:
        idx = sys.argv.index('--model')
        model = sys.argv[idx + 1]

    workers = 4
    if '--workers' in sys.argv:
        idx = sys.argv.index('--workers')
        workers = int(sys.argv[idx + 1])

    # Collect positional args
    skip_flags = {'--force', '--all', '--model', '--refine', '--workers'}
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
            # Refine all configs that have warnings or oversized chunks
            config_files = []
            for cp in sorted(config_dir.glob('*.json')):
                if cp.name == 'parsed_sources.json':
                    continue
                with open(cp, 'r', encoding='utf-8') as f:
                    cfg = json.load(f)
                has_warnings = bool(cfg.get('warnings'))
                has_oversized = any(
                    not s.get('ignore', False)
                    and not s.get('no_refine', False)
                    and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES
                    for s in cfg.get('splits', [])
                )
                if has_warnings or has_oversized:
                    config_files.append(cp)

            if not config_files:
                print("No configs needing refinement found.")
                sys.exit(0)

            print(f"Found {len(config_files)} configs to refine")

        refined, errors = _run_refine(client, model, config_dir, docs_dir, config_files, workers=workers)
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
    counter = {'processed': 0, 'errors': 0, 'done': 0}
    counter_lock = threading.Lock()
    configs_to_refine = []

    run_start_time = time.time()

    def generate_one(doc_path):
        with counter_lock:
            counter['done'] += 1
            n = counter['done']
        print(f"\n[{n}/{len(doc_files)}] Processing: {doc_path.name}")
        file_start = time.time()

        try:
            content = doc_path.read_text(encoding='utf-8', errors='replace')
            total_lines = len(content.splitlines())
            print(f"    {total_lines} lines")

            config = split_document(client, model, doc_path.name, content, total_lines)

            config['source_md5'] = md5_content(content)

            norm_fixed = normalize_ignored(config)
            if norm_fixed:
                print(f"    Fixed {norm_fixed} entries missing ignore flag")

            validation_errors = validate_config(config, total_lines)
            if validation_errors:
                config['warnings'] = validation_errors
                print(f"    Validation warnings:")
                for err in validation_errors:
                    print(f"      - {err}")
            else:
                config.pop('warnings', None)

            config_path = config_dir / f"{doc_path.stem}.json"
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
                f.write('\n')

            num_splits = len([s for s in config.get('splits', []) if not s.get('ignore')])
            num_ignored = len([s for s in config.get('splits', []) if s.get('ignore')])
            file_elapsed = time.time() - file_start
            print(f"    Created: {config_path.name} ({num_splits} chunks, {num_ignored} ignored) in {_fmt_elapsed(file_elapsed)}")

            with counter_lock:
                counter['processed'] += 1
                has_oversized = any(
                    not s.get('ignore', False)
                    and (s.get('end', 0) - s.get('start', 0) + 1) > MAX_CHUNK_LINES
                    for s in config.get('splits', [])
                )
                if has_oversized:
                    configs_to_refine.append(config_path)

        except Exception as e:
            with counter_lock:
                counter['errors'] += 1
            print(f"    ERROR: {e}")

    if workers > 1:
        print(f"Processing with {workers} workers...")
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = [pool.submit(generate_one, dp) for dp in doc_files]
            for f in as_completed(futures):
                f.result()
    else:
        for dp in doc_files:
            generate_one(dp)

    # Auto-refine any newly generated configs with oversized chunks
    refined_total = 0
    if configs_to_refine:
        print(f"\n{'='*50}")
        print(f"Auto-refining {len(configs_to_refine)} configs with oversized chunks...")
        refined_total, refine_errors = _run_refine(client, model, config_dir,
                                                    docs_dir, configs_to_refine, workers=workers)
        counter['errors'] += refine_errors

    # Summary
    total_run_time = time.time() - run_start_time
    print(f"\n{'='*50}")
    print(f"Documents: {counter['processed']} processed, {counter['errors']} errors")
    if refined_total:
        print(f"Auto-refined: {refined_total} oversized chunks")
    print(f"Total time: {_fmt_elapsed(total_run_time)}")


if __name__ == '__main__':
    main()
