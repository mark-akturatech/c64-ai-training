---
description: Split raw training docs, process examples, and import into Qdrant
argument-hint: [filename.txt | example.asm | --no-import | (none for full rebuild)]
---

# Create Training Data

Build or update the Qdrant training knowledge base from source documents and code examples.

## Progress Tracking

Use **TodoWrite** to track progress throughout execution. Create todos for each major step at the start, mark each in_progress/completed as you go. For full rebuilds the todos should be:
1. Split documents
2. Copy examples to split dir
3. Import into Qdrant (or mark completed immediately with "skipped" if `--no-import`)

## Hard Stops

**STOP and ask the user before continuing** if any of these occur:
- `split_training.py` exits with a non-zero exit code
- `split_training.py` output contains "uncovered lines" warnings (lines in a source doc not covered by any split config entry)
- Zero `.txt` files exist in `training/split/` after splitting + example copying (something went wrong)
- A source document in `documents/` has no matching config in `split_config/`

Report the issue clearly and ask whether to continue or abort.

## Flags

### `--no-import`
If `$ARGUMENTS` contains `--no-import`, skip all Qdrant import steps. Only split documents and copy examples to `training/split/`. This flag can be combined with any mode (full rebuild or single file). Strip `--no-import` from the arguments before processing the remaining argument.

## Modes

### No argument — Full rebuild
If `$ARGUMENTS` is empty, perform a **full rebuild** of all training data:

1. **Ask for confirmation** — "This will regenerate split files for any changed source documents and replace the Qdrant collection. Continue?" (if `--no-import`, omit the Qdrant part)
2. **Split all docs** — run `python3 scripts/split_training.py` (no args = processes all configs; unchanged source files are skipped via MD5 caching)
4. **Copy examples to split dir** — copy each documented `.asm` from `examples/` to `training/split/` as `example_<effect_name>.txt` (derive name from the `# Example:` header). Skip any `.asm` files that don't have a `# Example:` header (they are not yet documented).
5. **Replace Qdrant collection** (skip if `--no-import`) — delete existing collection, create new one, import all files from `training/split/`

### File argument — Single file
If `$ARGUMENTS` is a raw doc filename (`.txt`):
1. Split that file using its config
2. Import the new chunks into the **existing** Qdrant collection (skip if `--no-import`)

If `$ARGUMENTS` is an example filename (`.asm`):
1. Verify the file has a `# Example:` header (if not, tell the user to run `/document-examples` on it first)
2. Copy to `training/split/` as `example_<effect_name>.txt`
3. Import into the **existing** Qdrant collection (skip if `--no-import`)

## Processing Raw Documents

Source documents in `documents/` are split using configs in `training/split_config/`.

1. Run `python3 scripts/split_training.py` to split the files
2. If a document has no config in `split_config/`, warn the user and skip it
3. Review the script output for any "uncovered lines" warnings

### Chunk size limits

After the initial split configs are created, review each config for oversized chunks:
- **Target**: ~60 lines (~4KB) per chunk
- **Maximum**: ~80 lines (~5KB) per chunk
- Only split further if the content has natural topic boundaries — don't break mid-table or mid-code-listing
- Each chunk must be **self-contained** — it should make sense when read in isolation. If a chunk references concepts defined elsewhere, repeat or summarise the key context inline so readers don't need the other chunk to understand it.

For any chunk exceeding ~80 lines, read the source document at those line ranges, find natural sub-topic boundaries, and split into smaller chunks.

### Cross-references

When splitting a large chunk into sub-chunks (or for any closely related chunks), add a `references` array to connect them:

```json
{
  "start": 11, "end": 70,
  "name": "sid_registers",
  "description": "SID register map ($D400-$D41C)",
  "references": [
    { "chunk": "sid_adsr_waveforms", "topic": "ADSR envelope timing and waveform details" },
    { "chunk": "sid_frequency_filter", "topic": "frequency calculation and filter modes" }
  ]
}
```

The script appends these as a search-oriented footer in the output chunk:
```
---
Additional information can be found by searching:
- "sid_adsr_waveforms" which expands on ADSR envelope timing and waveform details
- "sid_frequency_filter" which expands on frequency calculation and filter modes
```

## Processing Examples

Examples must already be documented with `# Example:` headers (use `/document-examples` separately if needed).

Copy each documented `.asm` to `training/split/` as `example_<effect_name>.txt`:
- Derive the effect name from the `# Example: <name>` header line
- Convert to snake_case with `example_` prefix
- Example: `# Example: Raster Color Bars` → `example_raster_color_bars.txt`
- For multi-file projects (files with `# Project:` tag), prefix with the project directory name:
  - Example: `dustlayer_sprites/sub_check_keyboard.asm` with `# Example: Keyboard Matrix Scanning` → `example_dustlayer_sprites_keyboard_matrix_scanning.txt`
  - This ensures all files from the same project share a naming prefix for discoverability

## Qdrant Import

After all files are in `training/split/`, import them into Qdrant.

### Collection name
Use collection name: `c64_training`

### For full rebuild:
1. Delete the existing `c64_training` collection if it exists (also delete any old auto-named collections like `code_*`)
2. Create a new `c64_training` collection
3. Import every `.txt` file from `training/split/`

### For single file updates:
1. Import new/updated chunks into the existing `c64_training` collection
2. If replacing an existing chunk, delete the old version first

### Import method
Use the Qdrant MCP tools if available:
- `mcp__qdrant-local__list_collections()` to check existing collections
- `mcp__qdrant-local__store()` to import each chunk

If MCP tools are not available, inform the user that Qdrant import requires the qdrant-local MCP server to be running and they should restart Claude Code with Docker running.

## Summary

After completion, report:
- Number of document chunks created
- Number of examples processed (documented / skipped / warnings)
- Number of items imported into Qdrant (or "skipped — `--no-import`")
- Any warnings or skipped files
