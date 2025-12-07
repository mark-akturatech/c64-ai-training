#!/usr/bin/env python3
"""
Smart splitter - breaks large files at logical boundaries into ~10-20KB chunks.
"""

import os
import re

SPLIT_DIR = "/home/mark/Development/6502/6502 training/split"
TARGET_SIZE = 15000  # Target ~15KB per chunk

def get_file_size(filepath):
    return os.path.getsize(filepath)

def split_at_memory_locations(content, base_filename):
    """Split content at memory location headers (e.g., '512-600  $200-$258')"""
    # Pattern for memory location headers
    location_pattern = re.compile(r'^(\d+(?:-\d+)?)\s+\$([0-9A-Fa-f]+(?:-\$[0-9A-Fa-f]+)?)\s+', re.MULTILINE)

    # Also match "Location Range:" headers
    range_pattern = re.compile(r'^Location Range:\s*\d+-\d+\s*\(\$[0-9A-Fa-f]+-\$[0-9A-Fa-f]+\)', re.MULTILINE)

    # Find all split points
    splits = []
    for match in location_pattern.finditer(content):
        splits.append(match.start())
    for match in range_pattern.finditer(content):
        splits.append(match.start())

    splits = sorted(set(splits))

    if not splits:
        # Fallback to size-based splitting
        return split_by_size(content, base_filename)

    # Group into chunks of target size
    chunks = []
    current_chunk = []
    current_size = 0
    chunk_start_idx = 0

    for i, split_pos in enumerate(splits):
        # Get content from last split to this one
        if i == 0:
            section = content[:split_pos]
            if section.strip():
                current_chunk.append(section)
                current_size += len(section)

        # Get section from this split to next (or end)
        next_pos = splits[i + 1] if i + 1 < len(splits) else len(content)
        section = content[split_pos:next_pos]

        # Check if adding this would exceed target
        if current_size + len(section) > TARGET_SIZE and current_chunk:
            # Save current chunk
            chunk_text = ''.join(current_chunk)
            chunks.append(chunk_text)
            current_chunk = [section]
            current_size = len(section)
        else:
            current_chunk.append(section)
            current_size += len(section)

    # Don't forget last chunk
    if current_chunk:
        chunks.append(''.join(current_chunk))

    # Generate filenames
    results = []
    base = base_filename.replace('.txt', '')
    for i, chunk in enumerate(chunks):
        if len(chunks) == 1:
            filename = f"{base}.txt"
        else:
            filename = f"{base}_part{i+1:02d}.txt"
        results.append((filename, chunk))

    return results


def split_by_size(content, base_filename):
    """Fallback: split content by size at paragraph boundaries."""
    lines = content.split('\n')
    chunks = []
    current_chunk = []
    current_size = 0
    has_blank_lines = any(line.strip() == '' for line in lines)

    for line in lines:
        current_chunk.append(line)
        current_size += len(line) + 1

        # Split at blank lines when we exceed target size
        # If no blank lines exist, split at any line when over target
        should_split = current_size > TARGET_SIZE
        if has_blank_lines:
            should_split = should_split and line.strip() == ''

        if should_split:
            chunks.append('\n'.join(current_chunk))
            current_chunk = []
            current_size = 0

    if current_chunk:
        chunks.append('\n'.join(current_chunk))

    # Generate filenames - strip existing _partXX suffix if present
    base = base_filename.replace('.txt', '')
    # Remove existing part suffix to avoid names like _part1_part01
    base = re.sub(r'_part\d+$', '', base)

    results = []
    for i, chunk in enumerate(chunks):
        if len(chunks) == 1:
            filename = f"{base}.txt"
        else:
            filename = f"{base}_part{i+1:02d}.txt"
        results.append((filename, chunk))

    return results


def split_at_headings(content, base_filename):
    """Split content at major headings (*** lines or similar)"""
    # Pattern for major headings
    heading_pattern = re.compile(r'^\s*\*{3,}.*$', re.MULTILINE)

    splits = [match.start() for match in heading_pattern.finditer(content)]

    if not splits:
        # Try splitting at blank line + uppercase line (section headers)
        section_pattern = re.compile(r'\n\n[A-Z][A-Z\s]+\n', re.MULTILINE)
        splits = [match.start() for match in section_pattern.finditer(content)]

    if not splits:
        # Fallback to size-based splitting
        return split_by_size(content, base_filename)

    # Group into chunks
    chunks = []
    current_chunk = []
    current_size = 0

    # Add header (before first split)
    if splits[0] > 0:
        header = content[:splits[0]]
        current_chunk.append(header)
        current_size = len(header)

    for i, split_pos in enumerate(splits):
        next_pos = splits[i + 1] if i + 1 < len(splits) else len(content)
        section = content[split_pos:next_pos]

        if current_size + len(section) > TARGET_SIZE and current_chunk:
            chunks.append(''.join(current_chunk))
            current_chunk = [section]
            current_size = len(section)
        else:
            current_chunk.append(section)
            current_size += len(section)

    if current_chunk:
        chunks.append(''.join(current_chunk))

    # Generate filenames
    results = []
    base = base_filename.replace('.txt', '')
    for i, chunk in enumerate(chunks):
        if len(chunks) == 1:
            filename = f"{base}.txt"
        else:
            filename = f"{base}_part{i+1:02d}.txt"
        results.append((filename, chunk))

    return results


def split_at_instruction_entries(content, base_filename):
    """Split 6502 instruction file at each instruction (3-letter mnemonic headers)"""
    # Pattern: line starting with 3 uppercase letters followed by description
    instr_pattern = re.compile(r'^([A-Z]{3})\s+[A-Z]', re.MULTILINE)

    splits = [match.start() for match in instr_pattern.finditer(content)]

    if not splits:
        # Fallback to size-based splitting
        return split_by_size(content, base_filename)

    # Group instructions into chunks
    chunks = []
    current_chunk = []
    current_size = 0

    # Add header
    if splits[0] > 0:
        header = content[:splits[0]]
        current_chunk.append(header)
        current_size = len(header)

    for i, split_pos in enumerate(splits):
        next_pos = splits[i + 1] if i + 1 < len(splits) else len(content)
        section = content[split_pos:next_pos]

        if current_size + len(section) > TARGET_SIZE and current_chunk:
            chunks.append(''.join(current_chunk))
            current_chunk = [section]
            current_size = len(section)
        else:
            current_chunk.append(section)
            current_size += len(section)

    if current_chunk:
        chunks.append(''.join(current_chunk))

    results = []
    base = base_filename.replace('.txt', '')
    for i, chunk in enumerate(chunks):
        if len(chunks) == 1:
            filename = f"{base}.txt"
        else:
            filename = f"{base}_part{i+1:02d}.txt"
        results.append((filename, chunk))

    return results


def process_file(filepath):
    """Process a single file, splitting if needed."""
    filename = os.path.basename(filepath)
    size = get_file_size(filepath)

    # Skip small files
    if size < 20000:  # Under 20KB, leave as-is
        return [(filename, None)]  # None means keep original

    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    # Choose splitting strategy based on filename
    if filename.startswith('map_'):
        return split_at_memory_locations(content, filename)
    elif filename.startswith('rom_'):
        return split_at_headings(content, filename)
    elif '6502_instructions' in filename:
        return split_at_instruction_entries(content, filename)
    elif 'kickassembler' in filename:
        return split_at_headings(content, filename)
    elif '64doc' in filename:
        return split_at_headings(content, filename)
    else:
        return split_at_headings(content, filename)


def main():
    print("=== Smart Splitting Large Files ===\n")

    # Get all files in split directory
    files = [f for f in os.listdir(SPLIT_DIR) if f.endswith('.txt')]

    all_results = []
    files_to_remove = []

    for filename in sorted(files):
        filepath = os.path.join(SPLIT_DIR, filename)
        size = get_file_size(filepath)

        results = process_file(filepath)

        if len(results) == 1 and results[0][1] is None:
            # Keep original
            print(f"  {filename}: {size:,} bytes (kept as-is)")
        else:
            # File was split
            files_to_remove.append(filepath)
            for new_filename, content in results:
                new_path = os.path.join(SPLIT_DIR, new_filename)
                with open(new_path, 'w') as f:
                    f.write(content)
                print(f"  {new_filename}: {len(content):,} bytes")
            all_results.extend(results)

    # Remove original large files that were split
    for filepath in files_to_remove:
        os.remove(filepath)
        print(f"  Removed: {os.path.basename(filepath)}")

    # Final summary
    print("\n=== Summary ===")
    final_files = [f for f in os.listdir(SPLIT_DIR) if f.endswith('.txt')]
    total_size = sum(get_file_size(os.path.join(SPLIT_DIR, f)) for f in final_files)
    print(f"Total files: {len(final_files)}")
    print(f"Total size: {total_size:,} bytes")

    # Show size distribution
    sizes = [(f, get_file_size(os.path.join(SPLIT_DIR, f))) for f in final_files]
    sizes.sort(key=lambda x: x[1], reverse=True)

    print("\nLargest files:")
    for f, s in sizes[:10]:
        print(f"  {s:>8,} bytes: {f}")


if __name__ == '__main__':
    main()
