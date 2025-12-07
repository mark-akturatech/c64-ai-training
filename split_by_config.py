#!/usr/bin/env python3
"""
Split training files using JSON configuration files.
Each config specifies line numbers and context headers for splits.
"""

import os
import json
import shutil

TRAINING_DIR = "/home/mark/Development/6502/6502 training"
CONFIG_DIR = "/home/mark/Development/6502/6502 training/split_config"
OUTPUT_DIR = "/home/mark/Development/6502/6502 training/split"


def split_file(config_path: str) -> list:
    """Split a file according to its JSON config."""
    with open(config_path, 'r') as f:
        config = json.load(f)

    source_file = config['source_file']
    source_path = os.path.join(TRAINING_DIR, source_file)

    if not os.path.exists(source_path):
        print(f"  WARNING: Source file not found: {source_file}")
        return []

    with open(source_path, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    splits = config.get('splits', [])

    if not splits:
        # No splits defined, copy as-is
        base = source_file.replace('.txt', '').replace(' ', '_').lower()
        return [(f"{base}.txt", ''.join(lines))]

    # Sort splits by line number
    splits = sorted(splits, key=lambda x: x['line'])

    chunks = []

    # First chunk: from start to first split
    first_split = splits[0]['line'] - 1  # Convert to 0-indexed
    if first_split > 0:
        chunk_lines = lines[:first_split]
        chunks.append((''.join(chunk_lines), None))  # No context for first chunk

    # Remaining chunks: from each split to the next
    for i, split in enumerate(splits):
        start_line = split['line'] - 1  # Convert to 0-indexed
        context = split.get('context', '')

        # End at next split or end of file
        if i + 1 < len(splits):
            end_line = splits[i + 1]['line'] - 1
        else:
            end_line = len(lines)

        chunk_lines = lines[start_line:end_line]

        # Prepend context header if provided
        if context:
            chunk_content = f"# {context}\n\n{''.join(chunk_lines)}"
        else:
            chunk_content = ''.join(chunk_lines)

        chunks.append((chunk_content, context))

    # Generate output filenames
    base = source_file.replace('.txt', '').replace(' ', '_').lower()
    results = []

    for i, (content, _) in enumerate(chunks):
        if len(chunks) == 1:
            filename = f"{base}.txt"
        else:
            filename = f"{base}_part{i+1:02d}.txt"
        results.append((filename, content))

    return results


def main():
    print("=== Splitting Files Using JSON Configs ===\n")

    # Clean and create output directory
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)

    # Get all config files
    config_files = [f for f in os.listdir(CONFIG_DIR) if f.endswith('.json')]

    total_chunks = 0
    total_size = 0

    for config_file in sorted(config_files):
        config_path = os.path.join(CONFIG_DIR, config_file)
        print(f"Processing: {config_file}")

        results = split_file(config_path)

        for filename, content in results:
            output_path = os.path.join(OUTPUT_DIR, filename)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(content)
            size = len(content)
            total_size += size
            print(f"  Created: {filename} ({size:,} bytes)")

        total_chunks += len(results)

    # Summary
    print(f"\n=== Summary ===")
    print(f"Total files created: {total_chunks}")
    print(f"Total size: {total_size:,} bytes")

    # Show size distribution
    output_files = os.listdir(OUTPUT_DIR)
    sizes = [(f, os.path.getsize(os.path.join(OUTPUT_DIR, f))) for f in output_files]
    sizes.sort(key=lambda x: x[1], reverse=True)

    print(f"\nLargest files:")
    for f, s in sizes[:10]:
        print(f"  {s:>8,} bytes: {f}")

    # Check for oversized chunks
    target_size = 4000
    over_target = [(f, s) for f, s in sizes if s > target_size * 3]
    if over_target:
        print(f"\nWarning: {len(over_target)} files exceed 3x target size ({target_size * 3:,} bytes)")
        for f, s in over_target[:5]:
            print(f"  {s:>8,} bytes: {f}")


if __name__ == '__main__':
    main()
