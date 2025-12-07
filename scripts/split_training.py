#!/usr/bin/env python3
"""
Split training files based on JSON configuration.

Reads split configurations from training/split_config/*.json and splits
the corresponding raw files from training/raw/ into chunks stored in
training/split/.

Each split config JSON has the format:
{
  "source_file": "filename.txt",
  "target_chunk_size": 4000,
  "splits": [
    {"line": 85, "context": "Context header for this chunk"},
    {"line": 200, "context": "Context header for next chunk"}
  ]
}

The first chunk starts at line 1, subsequent chunks start at the split lines.
Each chunk gets its context prepended as a header.
"""

import json
import os
import re
import sys
from pathlib import Path


def sanitize_filename(name: str) -> str:
    """Convert source filename to a safe base name for split files."""
    # Remove extension and convert to lowercase
    base = Path(name).stem.lower()
    # Replace spaces and special chars with underscores
    base = re.sub(r'[^a-z0-9]+', '_', base)
    # Remove leading/trailing underscores
    base = base.strip('_')
    return base


def split_file(config_path: Path, raw_dir: Path, split_dir: Path, verbose: bool = True) -> int:
    """
    Split a single file based on its config.

    Returns the number of chunks created.
    """
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    source_file = config['source_file']
    splits = config.get('splits', [])

    raw_path = raw_dir / source_file
    if not raw_path.exists():
        print(f"Warning: Source file not found: {raw_path}")
        return 0

    # Read all lines from source
    with open(raw_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    total_lines = len(lines)
    base_name = sanitize_filename(source_file)

    # Build split points: [(start_line, end_line, context), ...]
    # Lines are 1-indexed in config, 0-indexed in array
    split_points = []

    # First chunk: from line 1 to first split (or end of file)
    # The first chunk doesn't have a context header (it's the original start)
    if splits:
        first_split_line = splits[0]['line']
        split_points.append((0, first_split_line - 1, None))
    else:
        # No splits defined, entire file is one chunk
        split_points.append((0, total_lines, None))

    # Subsequent chunks based on splits
    for i, split in enumerate(splits):
        start_line = split['line'] - 1  # Convert to 0-indexed
        context = split.get('context', '')

        # End at next split or end of file
        if i + 1 < len(splits):
            end_line = splits[i + 1]['line'] - 1
        else:
            end_line = total_lines

        split_points.append((start_line, end_line, context))

    # Create output files
    chunks_created = 0
    for i, (start, end, context) in enumerate(split_points):
        part_num = str(i + 1).zfill(2)
        output_name = f"{base_name}_part{part_num}.txt"
        output_path = split_dir / output_name

        chunk_lines = lines[start:end]

        # Prepend context header if provided
        if context:
            header = f"# {context}\n\n"
            chunk_content = header + ''.join(chunk_lines)
        else:
            chunk_content = ''.join(chunk_lines)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(chunk_content)

        chunk_size = len(chunk_content.encode('utf-8'))
        if verbose:
            print(f"  Created {output_name} ({chunk_size:,} bytes, lines {start+1}-{end})")

        chunks_created += 1

    return chunks_created


def main():
    # Determine paths relative to script location
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    config_dir = project_root / 'training' / 'split_config'
    raw_dir = project_root / 'training' / 'raw'
    split_dir = project_root / 'training' / 'split'

    # Ensure directories exist
    split_dir.mkdir(parents=True, exist_ok=True)

    if not config_dir.exists():
        print(f"Error: Config directory not found: {config_dir}")
        sys.exit(1)

    if not raw_dir.exists():
        print(f"Error: Raw directory not found: {raw_dir}")
        sys.exit(1)

    # Process specific file or all configs
    if len(sys.argv) > 1:
        config_files = [config_dir / sys.argv[1]]
        if not config_files[0].exists():
            # Try adding .json extension
            config_files = [config_dir / f"{sys.argv[1]}.json"]
    else:
        config_files = sorted(config_dir.glob('*.json'))

    total_chunks = 0
    for config_path in config_files:
        if not config_path.exists():
            print(f"Config not found: {config_path}")
            continue

        print(f"Processing: {config_path.name}")
        chunks = split_file(config_path, raw_dir, split_dir)
        total_chunks += chunks

    print(f"\nTotal chunks created: {total_chunks}")
    print(f"Output directory: {split_dir}")


if __name__ == '__main__':
    main()
