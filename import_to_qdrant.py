#!/usr/bin/env python3
"""Import training files to Qdrant via MCP server."""

import os
import json

TRAINING_DIR = "/home/mark/Development/6502/.claude/c64 training data"
COLLECTION = "c64-knowledge"

# Already imported files (from previous session)
ALREADY_IMPORTED = {
    "6502_addressing_modes_part01.txt",
    "6502_addressing_modes_part02.txt",
    "6502_instructions_summary_part01.txt",
    "6502_instructions_summary_part02.txt",
    "6502_instructions_summary_part03.txt"
}

def get_all_files():
    """Get all txt files from training directory."""
    files = []
    for f in sorted(os.listdir(TRAINING_DIR)):
        if f.endswith('.txt') and f not in ALREADY_IMPORTED:
            files.append(f)
    return files

def read_file_content(filename):
    """Read file content."""
    filepath = os.path.join(TRAINING_DIR, filename)
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        return f.read()

def main():
    files = get_all_files()
    print(f"Found {len(files)} files to import (excluding {len(ALREADY_IMPORTED)} already imported)")

    # Create batches and output JSON files
    batch_size = 10
    for i in range(0, len(files), batch_size):
        batch = files[i:i+batch_size]
        batch_num = i//batch_size + 1
        
        docs = []
        for filename in batch:
            content = read_file_content(filename)
            doc_id = filename.replace('.txt', '')
            docs.append({
                "id": doc_id,
                "text": content,
                "metadata": {
                    "source": filename,
                    "type": "training_document"
                }
            })

        # Output JSON for this batch
        output_file = f"/tmp/qdrant_batch_{batch_num:02d}.json"
        with open(output_file, 'w') as f:
            json.dump(docs, f, indent=2)
        print(f"Batch {batch_num}: {len(batch)} files -> {output_file}")

if __name__ == "__main__":
    main()
