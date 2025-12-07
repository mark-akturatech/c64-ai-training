#!/usr/bin/env python3
"""
AI-powered context-aware file splitter.
Reads files in chunks, uses AI to determine split points and add context headers.
"""

import os
import json
from openai import OpenAI

TRAINING_DIR = "/home/mark/Development/6502/6502 training"
SPLIT_DIR = "/home/mark/Development/6502/6502 training/split"
TARGET_CHUNK_SIZE = 4000  # Target ~4KB chunks
READ_CHUNK_SIZE = 8000    # Read 8KB at a time for context

client = OpenAI()

def get_split_suggestion(content: str, filename: str, position_info: str) -> dict:
    """Ask AI where to split and what context header to add."""

    prompt = f"""You are analyzing a chunk of a C64/6502 technical document for splitting into smaller pieces.

File: {filename}
Position: {position_info}

Content to analyze:
---
{content}
---

This content needs to be split into chunks of approximately 4KB each for vector database indexing.

Analyze this content and respond with JSON:
{{
    "split_points": [
        {{
            "line_number": <line number where split should occur>,
            "context_header": "<brief context header to add at this split point, e.g. 'Continued: VIC-II Sprite Registers $D000-$D010' or 'BASIC ROM Floating Point Routines $B000-$B0FF'>"
        }}
    ],
    "reasoning": "<brief explanation of why you chose these split points>"
}}

Rules:
1. Split at logical boundaries (new sections, new memory addresses, new topics)
2. Each chunk should be self-explanatory - add context headers that explain what the chunk contains
3. For disassembly: split at routine/function boundaries, include address ranges in context
4. For memory maps: split at register groups or memory regions
5. For documentation: split at topic changes
6. If content is already small enough or no good split point exists, return empty split_points array
7. Context headers should be 1 line, starting with the topic/section name

Respond ONLY with valid JSON, no other text."""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        response_format={"type": "json_object"}
    )

    return json.loads(response.choices[0].message.content)


def process_file(filepath: str) -> list:
    """Process a single file, splitting with AI-guided context."""
    filename = os.path.basename(filepath)

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # If file is small enough, keep as-is
    if len(content) <= TARGET_CHUNK_SIZE:
        return [(filename, content)]

    lines = content.split('\n')
    total_lines = len(lines)

    chunks = []
    current_start = 0
    chunk_num = 1

    while current_start < total_lines:
        # Calculate end of current read window
        current_content = []
        current_size = 0
        line_idx = current_start

        # Read up to READ_CHUNK_SIZE
        while line_idx < total_lines and current_size < READ_CHUNK_SIZE:
            line = lines[line_idx]
            current_content.append(line)
            current_size += len(line) + 1
            line_idx += 1

        chunk_text = '\n'.join(current_content)

        # If this is the last bit and it's small, just add it
        if line_idx >= total_lines and current_size <= TARGET_CHUNK_SIZE:
            chunks.append(chunk_text)
            break

        # Ask AI for split suggestion
        position_info = f"Lines {current_start + 1}-{line_idx} of {total_lines} (chunk {chunk_num})"
        print(f"  Analyzing {filename}: {position_info}...")

        try:
            suggestion = get_split_suggestion(chunk_text, filename, position_info)

            if suggestion.get('split_points') and len(suggestion['split_points']) > 0:
                # Use the first split point
                split = suggestion['split_points'][0]
                split_line = split['line_number'] - 1  # Convert to 0-indexed
                context_header = split['context_header']

                # Clamp split_line to valid range
                split_line = max(1, min(split_line, len(current_content) - 1))

                # First chunk: lines before split
                first_chunk = '\n'.join(current_content[:split_line])
                if first_chunk.strip():
                    chunks.append(first_chunk)

                # Update position for next iteration - go back to split point
                current_start = current_start + split_line

                # Prepend context header to next chunk
                if context_header:
                    # We'll add it when we create the next chunk
                    lines[current_start] = f"# {context_header}\n{lines[current_start]}"
            else:
                # No split suggested, take what we have up to target size
                take_lines = 0
                take_size = 0
                for i, line in enumerate(current_content):
                    if take_size + len(line) > TARGET_CHUNK_SIZE and take_lines > 0:
                        break
                    take_size += len(line) + 1
                    take_lines += 1

                chunks.append('\n'.join(current_content[:take_lines]))
                current_start += take_lines

        except Exception as e:
            print(f"    Error getting AI suggestion: {e}")
            # Fallback: just take target size worth
            take_lines = 0
            take_size = 0
            for i, line in enumerate(current_content):
                if take_size + len(line) > TARGET_CHUNK_SIZE and take_lines > 0:
                    break
                take_size += len(line) + 1
                take_lines += 1

            chunks.append('\n'.join(current_content[:take_lines]))
            current_start += take_lines

        chunk_num += 1

    # Generate output filenames
    results = []
    base = filename.replace('.txt', '')
    for i, chunk in enumerate(chunks):
        if len(chunks) == 1:
            out_filename = f"{base}.txt"
        else:
            out_filename = f"{base}_part{i+1:02d}.txt"
        results.append((out_filename, chunk))

    return results


def main():
    print("=== AI-Powered Context-Aware Splitting ===\n")

    # Clean and create split directory
    import shutil
    if os.path.exists(SPLIT_DIR):
        shutil.rmtree(SPLIT_DIR)
    os.makedirs(SPLIT_DIR)

    # Get all training files
    files = [f for f in os.listdir(TRAINING_DIR) if f.endswith('.txt')]

    total_chunks = 0

    for filename in sorted(files):
        filepath = os.path.join(TRAINING_DIR, filename)
        size = os.path.getsize(filepath)

        print(f"\nProcessing {filename} ({size:,} bytes)...")

        results = process_file(filepath)

        for out_filename, content in results:
            out_path = os.path.join(SPLIT_DIR, out_filename)
            with open(out_path, 'w') as f:
                f.write(content)
            print(f"  Created {out_filename} ({len(content):,} bytes)")

        total_chunks += len(results)

    # Summary
    print(f"\n=== Summary ===")
    final_files = os.listdir(SPLIT_DIR)
    total_size = sum(os.path.getsize(os.path.join(SPLIT_DIR, f)) for f in final_files)
    print(f"Created {len(final_files)} files, total size: {total_size:,} bytes")

    # Show size distribution
    sizes = [(f, os.path.getsize(os.path.join(SPLIT_DIR, f))) for f in final_files]
    sizes.sort(key=lambda x: x[1], reverse=True)

    print("\nLargest files:")
    for f, s in sizes[:10]:
        print(f"  {s:>8,} bytes: {f}")

    over_target = [(f, s) for f, s in sizes if s > TARGET_CHUNK_SIZE * 1.5]
    if over_target:
        print(f"\nWarning: {len(over_target)} files exceed target size")


if __name__ == '__main__':
    main()
