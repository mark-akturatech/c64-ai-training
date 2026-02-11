#!/usr/bin/env python3
# /// script
# dependencies = ["openai", "requests"]
# ///
"""
Import training data into Qdrant vector database.

Reads .md files from training/data/, generates embeddings via OpenAI,
and stores them in a Qdrant collection. For example files (example_*.md),
only the header (everything before ## Source Code) is embedded as the
search vector — the full content including source code is stored as payload
so it can be retrieved but doesn't pollute search results.

Usage:
    uv run scripts/import_qdrant.py                  # Import all files
    uv run scripts/import_qdrant.py --force           # Recreate collection and reimport all
    uv run scripts/import_qdrant.py --dry-run          # Show what would be imported
    uv run scripts/import_qdrant.py some_file.md       # Import specific file(s)
"""

import hashlib
import json
import os
import re
import sys
import time
import uuid
from pathlib import Path

import requests
from openai import OpenAI

# Configuration
QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "c64_training"
EMBEDDING_MODEL = "text-embedding-3-large"
EMBEDDING_DIMENSIONS = 3072
DATA_DIR = Path(__file__).parent.parent / "training" / "data"
CACHE_FILE = Path(__file__).parent.parent / "training" / "import_cache.json"
BATCH_SIZE = 20  # embeddings per API call


def md5(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()


def load_cache() -> dict:
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text())
    return {}


def save_cache(cache: dict):
    CACHE_FILE.write_text(json.dumps(cache, indent=2) + "\n")


def strip_references(content: str) -> tuple[str, list[dict]]:
    """Strip the ## References section from content and parse it.

    Returns (content_without_refs, references_list).
    Each reference is {"chunk": "name", "description": "what it covers"}.
    """
    marker = "\n## References\n"
    idx = content.find(marker)
    if idx == -1:
        return content.strip(), []

    before = content[:idx].strip()
    refs_text = content[idx + len(marker):]

    refs = []
    for line in refs_text.split("\n"):
        line = line.strip()
        if not line or not line.startswith("- "):
            continue
        line = line[2:]  # strip "- "
        # Parse: "chunk_name" — description
        if line.startswith('"') and '"' in line[1:]:
            end_quote = line.index('"', 1)
            chunk_name = line[1:end_quote]
            desc = line[end_quote + 1:].lstrip(" —-–").strip()
            refs.append({"chunk": chunk_name, "description": desc})

    return before, refs


def split_source_code(content: str) -> tuple[str, str]:
    """Split markdown into header (for embedding) and full content (for payload).

    Returns (header_text, full_content).
    Header is everything before '## Source Code'.
    Works for both example files and documentation chunks with assembly listings.
    """
    marker = "## Source Code"
    idx = content.find(marker)
    if idx == -1:
        # No source code section — embed everything
        return content.strip(), content.strip()
    header = content[:idx].strip()
    return header, content.strip()


# Pattern: $XXXX-$YYYY (address range, dash with optional whitespace)
_RANGE_PATTERN = re.compile(
    r'\$([0-9A-Fa-f]{2,4})[-–]\$([0-9A-Fa-f]{2,4})'
)
# Pattern: individual $XXXX
_ADDR_PATTERN = re.compile(r'\$([0-9A-Fa-f]{2,4})')

MAX_RANGE_EXPAND = 256  # don't expand ranges larger than this
MAX_REGISTERS_PER_CHUNK = 16  # chunks with more registers than this are "area" docs, not register docs

# Pattern: ROM disassembly line: .,XXXX (4-digit hex address at start of instruction)
_DISASM_ADDR_PATTERN = re.compile(r'^\.,([0-9A-Fa-f]{4})', re.MULTILINE)


def extract_registers_from_line(line: str) -> list[str]:
    """Extract register addresses from a Key Registers line, expanding ranges.

    For '$D000-$D02E', expands to all addresses in the range.
    For '$D020/$D021', extracts both individually.
    Ranges > MAX_RANGE_EXPAND just keep endpoints.
    """
    addrs = set()

    # First pass: find and expand ranges like $07C0-$07E7
    range_spans = []
    for m in _RANGE_PATTERN.finditer(line):
        start = int(m.group(1), 16)
        end = int(m.group(2), 16)
        range_spans.append((m.start(), m.end()))
        if start <= end and (end - start) <= MAX_RANGE_EXPAND:
            for val in range(start, end + 1):
                addrs.add(f"${val:04X}")
        else:
            # Too large or inverted — just keep endpoints
            addrs.add(f"${start:04X}")
            addrs.add(f"${end:04X}")

    # Second pass: find individual addresses not part of a range
    for m in _ADDR_PATTERN.finditer(line):
        # Skip if this match falls within a range match
        in_range = any(rs <= m.start() and m.end() <= re for rs, re in range_spans)
        if not in_range:
            addrs.add(f"${m.group(1).upper()}")

    return sorted(addrs)


def extract_code_addresses(content: str) -> list[str]:
    """Extract instruction addresses from ROM disassembly in ## Source Code.

    Parses .,XXXX patterns (ROM disassembly lines) to make chunks
    findable by any address within the disassembled range.
    Only applies to actual disassembly — BASIC/data tables are ignored.
    """
    marker = "## Source Code"
    idx = content.find(marker)
    if idx == -1:
        return []

    # Find the end of Source Code section (next ## heading or EOF)
    rest = content[idx + len(marker):]
    end_idx = rest.find("\n## ")
    source_block = rest[:end_idx] if end_idx != -1 else rest

    addrs = set()
    for m in _DISASM_ADDR_PATTERN.finditer(source_block):
        addrs.add(f"${m.group(1).upper()}")

    return sorted(addrs)


def extract_section_items(content: str, heading: str) -> list[str]:
    """Extract list items from a markdown section by heading name.

    Parses "- ITEM" lines under the given ## heading until the next ## or EOF.
    Returns the first whitespace-delimited token from each line (uppercase).
    """
    items = []
    in_section = False
    for line in content.split("\n"):
        if line.startswith(f"## {heading}"):
            in_section = True
            continue
        elif line.startswith("## ") and in_section:
            break
        elif in_section and line.startswith("- "):
            token = line[2:].strip().split()[0] if line[2:].strip() else ""
            if token:
                items.append(token.upper())
    return items


def extract_metadata(content: str, filename: str) -> dict:
    """Extract structured metadata from the markdown content."""
    meta = {"filename": filename}

    # Chunks with ## Source Code have concrete backing for their registers
    # (register maps, disassembly, etc.) — bypass the cap
    has_source_code = "## Source Code" in content

    # Detect type
    if filename.startswith("example_"):
        meta["type"] = "example"
    else:
        meta["type"] = "documentation"

    # Extract title from first # heading
    for line in content.split("\n"):
        if line.startswith("# "):
            meta["title"] = line[2:].strip()
            break

    # For examples, extract hardware, techniques, and key registers
    if meta["type"] == "example":
        in_techniques = False
        in_hardware = False
        in_registers = False
        techniques = []
        registers = []
        for line in content.split("\n"):
            if line.startswith("## Techniques"):
                in_techniques = True
                in_hardware = False
                in_registers = False
                continue
            elif line.startswith("## Hardware"):
                in_hardware = True
                in_techniques = False
                in_registers = False
                continue
            elif line.startswith("## Key Registers"):
                in_registers = True
                in_techniques = False
                in_hardware = False
                continue
            elif line.startswith("## "):
                in_techniques = False
                in_hardware = False
                in_registers = False
                continue

            if in_techniques and line.startswith("- "):
                techniques.append(line[2:].strip())
            elif in_hardware and line.strip():
                meta["hardware"] = line.strip()
            elif in_registers and line.startswith("- "):
                registers.extend(extract_registers_from_line(line))

        if techniques:
            meta["techniques"] = techniques
        if registers:
            unique = sorted(set(registers))
            if has_source_code or len(unique) <= MAX_REGISTERS_PER_CHUNK:
                meta["tags"] = unique

    # For all types, parse ## Key Registers if present
    if "tags" not in meta:
        in_registers = False
        registers = []
        for line in content.split("\n"):
            if line.startswith("## Key Registers"):
                in_registers = True
                continue
            elif line.startswith("## ") and in_registers:
                break
            elif in_registers and line.startswith("- "):
                registers.extend(extract_registers_from_line(line))
        if registers:
            unique = sorted(set(registers))
            if has_source_code or len(unique) <= MAX_REGISTERS_PER_CHUNK:
                meta["tags"] = unique

    # Merge in disassembly instruction addresses from ## Source Code
    # These bypass MAX_REGISTERS_PER_CHUNK — they're precise code locations, not area descriptions
    code_addrs = extract_code_addresses(content)
    if code_addrs:
        existing = set(meta.get("tags", []))
        meta["tags"] = sorted(existing | set(code_addrs))

    # Merge labels and mnemonics from ## Labels and ## Mnemonics sections
    # These are curated by OpenAI and bypass the register cap
    labels = extract_section_items(content, "Labels")
    mnemonics = extract_section_items(content, "Mnemonics")
    if labels or mnemonics:
        existing = set(meta.get("tags", []))
        existing.update(labels)
        existing.update(mnemonics)
        meta["tags"] = sorted(existing)

    return meta


def get_embedding(client: OpenAI, texts: list[str]) -> list[list[float]]:
    """Get embeddings for a batch of texts."""
    response = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=texts,
    )
    return [item.embedding for item in response.data]


def qdrant_collection_exists() -> bool:
    """Check if the collection exists."""
    r = requests.get(f"{QDRANT_URL}/collections/{COLLECTION_NAME}")
    return r.status_code == 200


def qdrant_create_collection():
    """Create the Qdrant collection with proper vector config and payload indexes."""
    r = requests.put(
        f"{QDRANT_URL}/collections/{COLLECTION_NAME}",
        json={
            "vectors": {
                "size": EMBEDDING_DIMENSIONS,
                "distance": "Cosine",
            }
        },
    )
    r.raise_for_status()
    print(f"  Created collection '{COLLECTION_NAME}' ({EMBEDDING_DIMENSIONS}d cosine)")

    # Create payload index on tags for keyword filtering
    r = requests.put(
        f"{QDRANT_URL}/collections/{COLLECTION_NAME}/index",
        json={
            "field_name": "tags",
            "field_schema": "keyword",
        },
    )
    r.raise_for_status()
    print(f"  Created payload index on 'tags' (keyword)")


def qdrant_delete_collection():
    """Delete the collection if it exists."""
    r = requests.delete(f"{QDRANT_URL}/collections/{COLLECTION_NAME}")
    if r.status_code == 200:
        print(f"  Deleted existing collection '{COLLECTION_NAME}'")


def qdrant_upsert_points(points: list[dict]):
    """Upsert points into the collection."""
    r = requests.put(
        f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points",
        json={"points": points},
    )
    r.raise_for_status()


def qdrant_delete_by_filename(filename: str):
    """Delete all points with a given filename in payload."""
    r = requests.post(
        f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/delete",
        json={
            "filter": {
                "must": [
                    {"key": "filename", "match": {"value": filename}}
                ]
            }
        },
    )
    r.raise_for_status()


def main():
    force = "--force" in sys.argv
    dry_run = "--dry-run" in sys.argv

    # Collect specific files if given
    specific_files = []
    for arg in sys.argv[1:]:
        if not arg.startswith("-"):
            specific_files.append(arg)

    # Check OpenAI key
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Error: OPENAI_API_KEY environment variable not set")
        sys.exit(1)

    client = OpenAI(api_key=api_key)

    # Check Qdrant is running
    try:
        requests.get(f"{QDRANT_URL}/collections", timeout=3)
    except requests.ConnectionError:
        print(f"Error: Cannot connect to Qdrant at {QDRANT_URL}")
        print("Start it with: docker start qdrant-db")
        sys.exit(1)

    # Gather files to process
    if specific_files:
        md_files = []
        for f in specific_files:
            p = DATA_DIR / f
            if not p.exists():
                # Try as-is path
                p = Path(f)
            if p.exists():
                md_files.append(p)
            else:
                print(f"Warning: File not found: {f}")
        if not md_files:
            print("No valid files to process")
            sys.exit(1)
    else:
        md_files = sorted(DATA_DIR.glob("*.md"))

    if not md_files:
        print("No .md files found in training/data/")
        sys.exit(1)

    print(f"Found {len(md_files)} files in {DATA_DIR}")

    # Load cache
    cache = {} if force else load_cache()

    # Filter to only changed files
    to_process = []
    for f in md_files:
        content = f.read_text()
        content_hash = md5(content)
        if not force and cache.get(f.name) == content_hash:
            continue
        to_process.append((f, content, content_hash))

    if not to_process:
        print("All files up to date — nothing to import")
        return

    print(f"{len(to_process)} files to import ({len(md_files) - len(to_process)} unchanged)")

    if dry_run:
        for f, _, _ in to_process:
            is_example = f.name.startswith("example_")
            print(f"  {'[example]' if is_example else '[doc]    '} {f.name}")
        return

    # Handle collection setup
    if force:
        qdrant_delete_collection()
        time.sleep(0.5)  # let Qdrant settle
        qdrant_create_collection()
        cache = {}
    elif not qdrant_collection_exists():
        qdrant_create_collection()

    # Prepare all items: (filename, embed_text, full_content, metadata, content_hash)
    items = []
    for f, content, content_hash in to_process:
        is_example = f.name.startswith("example_")
        metadata = extract_metadata(content, f.name)

        # Strip references from embedding text, store as metadata
        content_no_refs, refs = strip_references(content)
        if refs:
            metadata["references"] = refs

        # Strip source code from embedding text for all types
        embed_text, _ = split_source_code(content_no_refs)
        # Payload stores full content (examples without refs, docs with refs)
        if is_example:
            _, full_content = split_source_code(content_no_refs)
        else:
            full_content = content

        items.append({
            "filename": f.name,
            "embed_text": embed_text,
            "full_content": full_content,
            "metadata": metadata,
            "content_hash": content_hash,
        })

    # Process in batches
    total_imported = 0
    for batch_start in range(0, len(items), BATCH_SIZE):
        batch = items[batch_start:batch_start + BATCH_SIZE]
        batch_texts = [item["embed_text"] for item in batch]

        print(f"  Embedding batch {batch_start // BATCH_SIZE + 1}"
              f" ({len(batch)} items)...", end="", flush=True)

        embeddings = get_embedding(client, batch_texts)

        # Delete old versions and upsert new ones
        points = []
        for item, embedding in zip(batch, embeddings):
            # Delete any existing point for this file
            if not force:  # force already wiped collection
                qdrant_delete_by_filename(item["filename"])

            point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, item["filename"]))
            points.append({
                "id": point_id,
                "vector": embedding,
                "payload": {
                    "document": item["full_content"],
                    "filename": item["filename"],
                    **item["metadata"],
                },
            })

        qdrant_upsert_points(points)

        # Update cache
        for item in batch:
            cache[item["filename"]] = item["content_hash"]
        save_cache(cache)

        total_imported += len(batch)
        print(f" done")

        # Rate limit
        if batch_start + BATCH_SIZE < len(items):
            time.sleep(0.5)

    print(f"\nImported {total_imported} files into '{COLLECTION_NAME}'")

    # Summary
    examples = sum(1 for i in items if i["metadata"]["type"] == "example")
    docs = total_imported - examples
    print(f"  {examples} examples (header-only embeddings)")
    print(f"  {docs} documentation chunks (full-text embeddings)")


if __name__ == "__main__":
    main()
