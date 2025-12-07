#!/usr/bin/env python3
"""
Parse mapping-c64.txt into logical sections for Qdrant import.
Each memory location or location range becomes its own document.
"""

import re
import json

def parse_mapping_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    lines = content.split('\n')
    documents = []
    current_doc = None
    current_text = []
    in_preamble = True
    current_chapter = ""

    # Patterns for memory locations
    # Pattern: "55296-56319   $D800-$DBFF" or "0             $0             D6510"
    location_pattern = re.compile(r'^(\d+)(?:-(\d+))?\s+\$([0-9A-Fa-f]+)(?:-\$([0-9A-Fa-f]+))?\s*(\w+)?')
    location_range_pattern = re.compile(r'^Location Range:\s*(\d+)-(\d+)\s*\(\$([0-9A-Fa-f]+)-\$([0-9A-Fa-f]+)\)')
    chapter_pattern = re.compile(r'^::Chapter \d+::$|^::\s*Chapter \d+|^Chapter \d+\.')

    def save_current():
        nonlocal current_doc, current_text
        if current_doc and current_text:
            text = '\n'.join(current_text).strip()
            if len(text) > 50:  # Skip very short entries
                current_doc['text'] = text
                documents.append(current_doc)
        current_doc = None
        current_text = []

    for i, line in enumerate(lines):
        # Skip preamble until we hit Chapter 1
        if in_preamble:
            if '::Chapter 1::' in line or 'Chapter 1.' in line:
                in_preamble = False
            continue

        # Track chapters
        if chapter_pattern.match(line.strip()):
            current_chapter = line.strip()
            continue

        # Check for location range
        range_match = location_range_pattern.match(line)
        if range_match:
            save_current()
            dec_start, dec_end, hex_start, hex_end = range_match.groups()
            current_doc = {
                'id': f"map-{hex_start}-{hex_end}",
                'address_start': int(dec_start),
                'address_end': int(dec_end),
                'hex_start': f"${hex_start}",
                'hex_end': f"${hex_end}",
                'source': 'mapping-c64.txt',
                'chapter': current_chapter,
                'type': 'location_range'
            }
            current_text = [line]
            continue

        # Check for single location or range
        loc_match = location_pattern.match(line)
        if loc_match:
            dec_start, dec_end, hex_start, hex_end, label = loc_match.groups()

            # Only trigger on actual memory location entries (not random numbers)
            # Check if hex matches decimal
            try:
                if int(hex_start, 16) == int(dec_start):
                    save_current()
                    current_doc = {
                        'id': f"map-{hex_start}" + (f"-{hex_end}" if hex_end else ""),
                        'address_start': int(dec_start),
                        'address_end': int(dec_end) if dec_end else int(dec_start),
                        'hex_start': f"${hex_start}",
                        'hex_end': f"${hex_end}" if hex_end else f"${hex_start}",
                        'label': label if label else '',
                        'source': 'mapping-c64.txt',
                        'chapter': current_chapter,
                        'type': 'location'
                    }
                    current_text = [line]
                    continue
            except:
                pass

        # Accumulate text for current document
        if current_doc:
            current_text.append(line)

    # Save last document
    save_current()

    return documents

def main():
    filepath = '/home/mark/Development/6502/6502 training/mapping-c64.txt'
    documents = parse_mapping_file(filepath)

    print(f"Parsed {len(documents)} memory location entries")

    # Show some samples
    print("\nSample entries:")
    for doc in documents[:3]:
        print(f"  {doc['hex_start']}-{doc['hex_end']}: {doc.get('label', 'N/A')} ({len(doc.get('text', ''))} chars)")

    print(f"\n  ...")

    for doc in documents[-3:]:
        print(f"  {doc['hex_start']}-{doc['hex_end']}: {doc.get('label', 'N/A')} ({len(doc.get('text', ''))} chars)")

    # Save to JSON for import
    output_path = '/home/mark/Development/6502/mapping_parsed.json'
    with open(output_path, 'w') as f:
        json.dump(documents, f, indent=2)

    print(f"\nSaved to {output_path}")

if __name__ == '__main__':
    main()
