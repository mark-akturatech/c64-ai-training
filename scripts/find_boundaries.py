#!/usr/bin/env python3
"""
Find natural section boundaries in source documents for oversized chunks.

For each split config, identifies chunks exceeding a line limit and scans
the source document at those line ranges for natural break points:
- Section headers (ALL CAPS lines, numbered sections like "3.1", "Chapter X")
- Separator lines (===, ---, ***, blank line clusters)
- ROM disassembly routine markers (*** lines)
- Topic transitions

Outputs a report of suggested split points for each oversized chunk.
"""

import json
import re
import sys
from pathlib import Path


def find_section_headers(lines, start, end):
    """Find lines that look like section headers within a range."""
    headers = []
    for i in range(start - 1, min(end, len(lines))):
        line = lines[i].rstrip()
        lineno = i + 1

        # Skip empty lines
        if not line.strip():
            continue

        # ALL CAPS headers (at least 3 words, not assembly code)
        if (re.match(r'^[A-Z][A-Z /\-,]{8,}$', line.strip()) and
            not re.match(r'^\s*[.;]', line) and
            not re.match(r'^\s*\$', line) and
            'LDA' not in line and 'STA' not in line and 'JMP' not in line):
            headers.append((lineno, 'CAPS', line.strip()[:60]))

        # Numbered sections like "3.1 Title" or "Section 3.1"
        m = re.match(r'^\s*(\d+\.\d+[\.\d]*)\s+(.+)', line)
        if m:
            headers.append((lineno, 'NUM', f"{m.group(1)} {m.group(2)[:50]}"))

        # Chapter headers
        m = re.match(r'^\s*(Chapter|CHAPTER|Part|PART)\s+(\d+)', line, re.IGNORECASE)
        if m:
            headers.append((lineno, 'CHAP', line.strip()[:60]))

        # ROM disassembly *** markers
        if re.match(r'^\*{3,}', line.strip()):
            headers.append((lineno, '***', line.strip()[:60]))

        # Separator lines (===, ---, ~~~)
        if re.match(r'^[=\-~]{10,}$', line.strip()):
            headers.append((lineno, 'SEP', line.strip()[:30]))

        # .LIB directive in ROM disassembly
        if re.match(r'^\s*\.LIB\s+', line):
            headers.append((lineno, 'LIB', line.strip()[:60]))

        # Address-prefixed routine labels (e.g., "$E000 LABEL")
        m = re.match(r'^[\s,]*\$([0-9A-Fa-f]{4})\s+(\w+)', line)
        if m and not re.match(r'^\s*[.;]', line):
            # Only count if it looks like a major label (not instruction)
            label = m.group(2)
            if len(label) > 2 and label.upper() == label:
                headers.append((lineno, 'ADDR', f"${m.group(1)} {label}"))

    return headers


def find_blank_clusters(lines, start, end, min_gap=2):
    """Find clusters of blank lines that might indicate section breaks."""
    clusters = []
    blank_start = None
    blank_count = 0

    for i in range(start - 1, min(end, len(lines))):
        line = lines[i].strip()
        if not line:
            if blank_start is None:
                blank_start = i + 1
            blank_count += 1
        else:
            if blank_count >= min_gap:
                clusters.append((blank_start, blank_count))
            blank_start = None
            blank_count = 0

    if blank_count >= min_gap:
        clusters.append((blank_start, blank_count))

    return clusters


def analyze_config(config_path, raw_dir, max_lines=80):
    """Analyze a config file and report oversized chunks with potential boundaries."""
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    source_file = config['source_file']
    raw_path = raw_dir / source_file

    if not raw_path.exists():
        print(f"  Source not found: {raw_path}")
        return

    with open(raw_path, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()

    oversized = []
    for s in config.get('splits', []):
        if s.get('ignore'):
            continue
        chunk_lines = s['end'] - s['start'] + 1
        if chunk_lines > max_lines:
            oversized.append(s)

    if not oversized:
        print(f"  All chunks within {max_lines} lines")
        return

    print(f"  {len(oversized)} oversized chunks (>{max_lines} lines):")
    for s in oversized:
        chunk_lines = s['end'] - s['start'] + 1
        name = s.get('name', '?')
        print(f"\n  --- {name}: lines {s['start']}-{s['end']} ({chunk_lines} lines) ---")

        headers = find_section_headers(lines, s['start'], s['end'])
        if headers:
            print(f"    Section headers found ({len(headers)}):")
            for lineno, htype, text in headers[:20]:
                rel = lineno - s['start']
                print(f"      L{lineno} (+{rel}): [{htype}] {text}")
            if len(headers) > 20:
                print(f"      ... and {len(headers) - 20} more")

        blanks = find_blank_clusters(lines, s['start'], s['end'])
        if blanks and len(headers) < 5:
            print(f"    Blank line clusters ({len(blanks)}):")
            for bstart, bcount in blanks[:10]:
                rel = bstart - s['start']
                print(f"      L{bstart} (+{rel}): {bcount} blank lines")

        # Suggest split count
        ideal_chunks = max(2, chunk_lines // 65)
        print(f"    Suggested: ~{ideal_chunks} sub-chunks of ~{chunk_lines // ideal_chunks} lines")


def main():
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    config_dir = project_root / 'training' / 'split_config'
    raw_dir = project_root / 'documents'

    max_lines = 80
    if '--max' in sys.argv:
        idx = sys.argv.index('--max')
        max_lines = int(sys.argv[idx + 1])

    # Process specific config or all
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if args:
        config_files = []
        for a in args:
            p = config_dir / a
            if not p.exists():
                p = config_dir / f"{a}.json"
            if p.exists():
                config_files.append(p)
            else:
                print(f"Config not found: {a}")
    else:
        config_files = sorted(config_dir.glob('*.json'))

    for config_path in config_files:
        print(f"\n{'='*60}")
        print(f"Config: {config_path.name}")
        analyze_config(config_path, raw_dir, max_lines)


if __name__ == '__main__':
    main()
