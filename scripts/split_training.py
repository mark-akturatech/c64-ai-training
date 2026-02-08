#!/usr/bin/env python3
"""
Split training files based on JSON configuration.

Reads split configurations from training/split_config/*.json and splits
the corresponding source documents from documents/ into topic-based chunks
stored in training/split/.

Each split config JSON has the format:
{
  "source_file": "filename.txt",
  "context": "Document Title",
  "splits": [
    {
      "start": 10,
      "end": 85,
      "name": "topic_name",
      "description": "Human readable description of this topic"
    },
    {
      "start": 1,
      "end": 9,
      "ignore": true,
      "reason": "Table of contents - not useful for training"
    }
  ]
}

Splits may include a "references" array to cross-link related chunks:
    "references": [
      {"chunk": "other_chunk_name", "topic": "what it covers"}
    ]
These are appended as a footer in the output file.

Splits are by concept/topic, not by size. Each split covers a specific
subject (e.g. "addressing_modes", "sprite_registers"). The name field
becomes the output filename. Ignored sections (TOC, indexes, line numbers)
are skipped. Each output chunk gets "# <context> - <description>" prepended.
"""

import json
import re
import sys
from pathlib import Path


def sanitize_name(name: str) -> str:
    """Convert a name to a safe filename component."""
    name = name.lower()
    name = re.sub(r'[^a-z0-9]+', '_', name)
    name = name.strip('_')
    return name


def write_chunk(lines, start, end, total_lines, name, description, context,
                references, split_dir, verbose):
    """Write a single output chunk file. Returns (lines_covered, chunk_size) or None if skipped."""
    end = min(end, total_lines)

    # Extract lines (convert 1-indexed to 0-indexed)
    chunk_lines = lines[start - 1:end]
    chunk_content = ''.join(chunk_lines)

    # Prepend context header
    if context and description:
        header = f"# {context} - {description}\n\n"
    elif context:
        header = f"# {context}\n\n"
    elif description:
        header = f"# {description}\n\n"
    else:
        header = ""

    chunk_content = header + chunk_content

    # Append cross-references footer if present
    if references:
        ref_lines = ['\n---\nAdditional information can be found by searching:\n']
        for ref in references:
            ref_lines.append(f'- "{ref["chunk"]}" which expands on {ref["topic"]}\n')
        chunk_content += ''.join(ref_lines)

    # Output filename is the topic name
    safe_name = sanitize_name(name)
    output_name = f"{safe_name}.txt"
    output_path = split_dir / output_name

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(chunk_content)

    chunk_size = len(chunk_content.encode('utf-8'))
    line_count = end - start + 1

    if verbose:
        print(f"  Created {output_name} ({chunk_size:,} bytes, lines {start}-{end})")

    return line_count, chunk_size


def split_file(config_path: Path, raw_dir: Path, split_dir: Path, verbose: bool = True) -> int:
    """Split a single file based on its config. Returns the number of chunks created."""
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    source_file = config['source_file']
    context = config.get('context', '')
    splits = config.get('splits', [])

    raw_path = raw_dir / source_file
    if not raw_path.exists():
        print(f"  Warning: Source file not found: {raw_path}")
        return 0

    with open(raw_path, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    total_lines = len(lines)
    chunks_created = 0
    lines_covered = 0
    lines_ignored = 0

    for split in splits:
        start = split['start']
        end = min(split['end'], total_lines)

        if split.get('ignore', False):
            reason = split.get('reason', 'no reason given')
            line_count = end - start + 1
            lines_ignored += line_count
            if verbose:
                print(f"  Ignored lines {start}-{end} ({line_count} lines): {reason}")
            continue

        name = split.get('name', f'chunk_{chunks_created + 1}')
        description = split.get('description', name)
        references = split.get('references', [])

        result = write_chunk(lines, start, end, total_lines,
                             name, description, context, references,
                             split_dir, verbose)
        if result:
            line_count, _ = result
            lines_covered += line_count
            chunks_created += 1

    if verbose:
        uncovered = total_lines - lines_covered - lines_ignored
        print(f"  Summary: {chunks_created} chunks, {lines_covered} lines extracted, "
              f"{lines_ignored} lines ignored, {uncovered} lines uncovered")
        if uncovered > 0:
            print(f"  Warning: {uncovered} lines not covered by any split or ignore entry")

    return chunks_created


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    config_dir = project_root / 'training' / 'split_config'
    raw_dir = project_root / 'documents'
    split_dir = project_root / 'training' / 'split'

    split_dir.mkdir(parents=True, exist_ok=True)

    if not config_dir.exists():
        print(f"Error: Config directory not found: {config_dir}")
        sys.exit(1)

    if not raw_dir.exists():
        print(f"Error: Documents directory not found: {raw_dir}")
        sys.exit(1)

    args = [a for a in sys.argv[1:]]

    # Process specific config or all
    if args:
        config_files = [config_dir / args[0]]
        if not config_files[0].exists():
            config_files = [config_dir / f"{args[0]}.json"]
    else:
        config_files = sorted(config_dir.glob('*.json'))

    if not config_files:
        print("No config files found.")
        sys.exit(1)

    total_chunks = 0

    for config_path in config_files:
        if not config_path.exists():
            print(f"Config not found: {config_path}")
            continue

        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)

        raw_path = raw_dir / config['source_file']
        if not raw_path.exists():
            print(f"Processing: {config_path.name}")
            print(f"  Warning: Source file not found: {raw_path}")
            continue

        print(f"Processing: {config_path.name}")
        chunks = split_file(config_path, raw_dir, split_dir)
        total_chunks += chunks

    print(f"\nTotal chunks created: {total_chunks}")
    print(f"Output directory: {split_dir}")


if __name__ == '__main__':
    main()
