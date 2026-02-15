# Qdrant Knowledge Base -- C64/6502 Training Data

A curated, semantically-chunked vector database covering the full C64 hardware and software stack. Used by AI assistants (Claude, etc.) to provide accurate, context-aware help when writing or analysing 6502 assembly.

## Coverage

- Complete 6502 instruction set (all addressing modes, cycle counts, undocumented opcodes)
- Full C64 memory map ($0000-$FFFF)
- VIC-II graphics programming (sprites, characters, bitmaps, raster interrupts)
- SID sound chip (3 voices, filters, envelopes, ring modulation)
- CIA timer and I/O programming
- KERNAL and BASIC ROM entry points with calling conventions
- KickAssembler syntax, directives, and scripting language
- Commented ROM disassembly
- Programmer's Reference Guide content

## Directory Structure

```
documents/     # Original source documents (.txt)
examples/      # Example C64 assembly programs (.asm)
scripts/       # Training pipeline scripts (Python, PEP 723 inline deps)
includes/      # Generated KickAssembler include files
split_config/  # JSON configs defining how to split each document
split/         # Generated raw text chunks
data/          # Cleaned markdown output (chunks + examples) for Qdrant import
```

## Pipeline

All scripts use PEP 723 inline deps and are run via `uv run training/scripts/<name>.py` from the project root.

Use the `/create-training-data` slash command to run the full pipeline, or run steps individually:

1. **Auto-split** -- generate split configs from source documents:
   ```bash
   uv run training/scripts/auto_split.py --all
   ```

2. **Extract chunks** -- split documents into raw text using configs:
   ```bash
   uv run training/scripts/split_training.py
   ```

3. **Clean chunks** (OpenAI) -- convert raw chunks to well-formatted markdown:
   ```bash
   uv run training/scripts/clean_chunks.py
   ```

4. **Document examples** (OpenAI) -- analyse assembly examples:
   ```bash
   uv run training/scripts/document_examples.py
   ```

5. **Import to Qdrant** -- import cleaned markdown into the vector database:
   ```bash
   uv run training/scripts/import_qdrant.py
   ```

Each script tracks MD5 hashes so only changed files are reprocessed. Use `--force` to override.

## Adding New Content

1. Place your document in `documents/`. Supported format: `.txt`
2. Run `uv run training/scripts/auto_split.py "document name.txt"` to generate a split config
3. Run the full pipeline via `/create-training-data`

### Split Config Format

Configs live in `split_config/<filename>.json`:

```json
{
  "source_file": "my_document.txt",
  "context": "Document Title",
  "splits": [
    {
      "start": 1,
      "end": 100,
      "name": "topic_name",
      "description": "Human readable description of this topic"
    },
    {
      "start": 101,
      "end": 120,
      "ignore": true,
      "reason": "Table of contents - not useful for training"
    }
  ]
}
```

- `start`/`end`: Line range (1-indexed, inclusive)
- `name`: Topic name, becomes the output filename (e.g. `topic_name.txt`)
- `description`: Prepended as `# <context> - <description>` header
- `ignore`: Set `true` to skip sections (TOC, indexes, redundant summaries)

### Split Guidelines

- **Logical breaks**: Split at chapter/section boundaries, not mid-paragraph
- **Self-contained**: Each chunk should make sense on its own
- **Context headers**: Describe what the chunk covers
- **Size targets**: Aim for <4KB, allow up to 8KB only when content is indivisible
- Chunks > 120 lines trigger auto-refinement via `auto_split.py --refine`

## Querying

Use the `/query-qdrant` slash command for hybrid search with automatic number base enrichment:

```
/query-qdrant VIC-II sprite registers $D015
/query-qdrant SID envelope attack decay
/query-qdrant $DC0D CIA interrupt control
```
