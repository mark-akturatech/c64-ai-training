# Create Training Data

Build or update the Qdrant training knowledge base from source documents and code examples.

## Pipeline Overview

```
documents/*.txt ──→ auto_split.py ──→ split_config/*.json
                                          ↓
                    auto_split.py --refine ──→ sub-split oversized chunks
                                          ↓
documents/*.txt ──→ split_training.py ──→ split/*.txt ──→ clean_chunks.py ──→ data/*.md
examples/*.asm  ──→ document_examples.py ──→ data/example_*.md
data/*.md ──→ fix_incomplete.py ──→ data/*.md (patched)
data/*.md ──→ Qdrant import
```

Each script tracks MD5 hashes so only changed files are reprocessed.

## Flags

### `--no-import`
Skip all Qdrant import steps. Only process documents and examples.

### `--force`
Pass `--force` to all scripts to reprocess everything regardless of MD5 cache.

## Steps

Run these steps in order. Use **TodoWrite** to track progress.

### 1. Auto-split new documents

Check if any `.txt` files in `training/documents/` lack a matching config in `training/split_config/`. If so, generate configs automatically:

```bash
uv run training/scripts/auto_split.py --all
```

Or for a specific file:
```bash
uv run training/scripts/auto_split.py "document name.txt"
```

**Hard stop**: If `auto_split.py` reports validation errors (gaps, overlaps, oversized chunks), review the generated config before continuing. Fix issues manually if needed.

Skip this step if all documents already have configs.

Note: `auto_split.py` auto-refines oversized chunks (>120 lines) after initial generation. For existing configs that were generated before auto-refine existed, run step 1b.

### 1b. Refine oversized chunks

If existing configs have chunks larger than 120 lines, refine them:

```bash
uv run training/scripts/auto_split.py --refine
```

Or for a specific config:
```bash
uv run training/scripts/auto_split.py --refine "config name.json"
```

This sends oversized chunks to OpenAI to sub-split them into 60-120 line pieces. It iterates until all chunks are within the size limit. Newly generated configs (step 1) do this automatically.

### 2. Extract chunks

Split source documents into raw text chunks using existing configs:

```bash
python3 training/scripts/split_training.py
```

**Hard stop**: If `split_training.py` exits with non-zero code or reports "uncovered lines", stop and report the issue.

### 3. Clean chunks (OpenAI)

Send raw chunks to OpenAI for cleaning into well-formatted Markdown:

```bash
uv run training/scripts/clean_chunks.py
```

This reads from `training/split/`, writes cleaned `.md` files to `training/data/`. Tracks processed files in `parsed_sources.json`.

To reprocess everything: `uv run training/scripts/clean_chunks.py --force`
To process one chunk: `uv run training/scripts/clean_chunks.py chunk_name.txt`

### 4. Document examples (OpenAI)

Analyze assembly examples and generate documented versions:

```bash
uv run training/scripts/document_examples.py
```

This reads `.asm` files from `training/examples/`, writes `example_*.md` to `training/data/`. Tracks processed files in `parsed_sources.json`.

To reprocess everything: `uv run training/scripts/document_examples.py --force`
To process one file: `uv run training/scripts/document_examples.py training/examples/bars256.asm`

### 5. Fix incomplete chunks (OpenAI + web search)

Fix chunks that have `## Incomplete` sections by searching authoritative sources:

```bash
uv run training/scripts/fix_incomplete.py
```

This uses `gpt-4o-search-preview` with web search to fill in missing datasheet values, reconstruct diagrams, and resolve other gaps. False positives are auto-skipped.

To fix specific files: `uv run training/scripts/fix_incomplete.py chunk_name.md`
To see what needs fixing: `uv run training/scripts/fix_incomplete.py --list`
To include false positives: `uv run training/scripts/fix_incomplete.py --force`

### 6. Import to Qdrant

Skip if `--no-import` was specified.

Import all `.md` files from `training/data/` into Qdrant using the import script:

```bash
uv run training/scripts/import_qdrant.py
```

For full rebuild: `uv run training/scripts/import_qdrant.py --force`

The script handles:
- Collection creation (`c64_training`, 3072d cosine for `text-embedding-3-large`)
- For `example_*.md` files: embeds only the header (before `## Source Code`) — full source code stored in payload
- For doc chunks: embeds the full content
- MD5 caching in `training/import_cache.json` to skip unchanged files
- Incremental updates (deletes old point by filename before upserting)

## Summary

After completion, report:
- Number of document chunks created/cleaned
- Number of examples documented
- Number of items imported into Qdrant (or "skipped -- `--no-import`")
- Any warnings or errors
