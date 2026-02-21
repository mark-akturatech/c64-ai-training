# RE Extraction Plan — Cleaning Up Static Analysis Boundaries

## Problem

Static analysis currently contains enrichers and detectors that perform **interpretive** work — symbol lookups, naming, and comparison hints that rely on human-curated knowledge databases rather than structural byte analysis. This blurs the boundary between "what bytes are here?" (static analysis) and "what does this mean?" (reverse engineering).

## Principle

**Static analysis** answers: "what bytes are here, how are they structured, and how do they relate?"
**RE pipeline** answers: "what does this code/data mean, what should it be called, and what is its purpose?"

The test: if you need a curated symbol database, external reference file, or domain expertise to produce the output, it belongs in RE.

## Where the Extracted Logic Goes

The RE pipeline (see [reverse-engineering-pipeline.md](reverse-engineering-pipeline.md)) has two relevant stages:

- **Stage 1: Static Enrichment** — deterministic plugins, no AI, fast. This is where symbol lookups, register naming, KERNAL API annotations, ROM shadow detection, and comparison hints belong. These are the first things the RE pipeline runs.
- **Stage 2+: AI Enrichment** — optional (`--enable-ai`), sequential AI plugins for purpose analysis, variable naming, documentation, iterative RE, and integration.

The pipeline should support running **without AI** (`--enable-ai` off by default). Stage 1 alone provides significant value — named registers, KERNAL routine labels, hardware access summaries, ROM shadow identification — all without any API calls. Users who want to do their own manual RE get a solid foundation from Stage 1 alone. Full AI enrichment (Stages 2-4) is opt-in for those who want it.

## Items to Remove from Static Analysis

### 1. `symbol_enricher.ts` — DELETE

**Currently does:**
- Maps `callsOut` addresses to KERNAL routine names (`$FFD2` → "CHROUT: Output character")
- Maps `hardwareRefs` addresses to register names (`$D020` → "VIC_BORDER_COLOR: Border color")
- Adds comparison hints for CMP/CPX/CPY immediate values (`CMP #$28` → "40 (screen width)")

**Why it's RE:** Entirely driven by `symbol_db.ts` — a hand-curated lookup table. No structural analysis involved.

**RE pipeline equivalent:** Stage 1 plugins `kernal_api_enrichment.ts` (pri 15, banking-aware) and `register_semantics_enrichment.ts` (pri 40). These are more sophisticated — they understand banking state and write to `block.enrichment.semanticLabels` and `block.enrichment.inlineComments` which the builder actually consumes.

**Impact on builder:** None — the builder reads `block.enrichment`, not `block.annotations`. The current `symbol_enricher` writes to `block.annotations` which the builder ignores.

### 2. `comment_generator_enricher.ts` — SPLIT

**Currently does (5 things):**

| Section | Structural? | Action |
|---------|------------|--------|
| Loop detection (back-edge comments) | Yes — derived from control flow | **KEEP** |
| SMC warning (self-modifying code) | Yes — derived from `smcTargets` | **KEEP** |
| Data candidate comments | Yes — copies detector evidence | **KEEP** |
| Hardware access summary ("VIC-II access: sprite enable, x-pos") | No — uses `HARDWARE_SYMBOLS` to name registers | **DELETE** |
| KERNAL call summary ("KERNAL calls: CHROUT, SETLFS") | No — uses `KERNAL_SYMBOLS` to name routines | **DELETE** |

**RE pipeline equivalent:** Stage 1 plugins `vic_annotation_enrichment.ts` (pri 85) and `sid_annotation_enrichment.ts` (pri 88) provide much richer hardware access summaries. KERNAL naming is handled by `kernal_api_enrichment.ts`.

### 3. `symbol_db.ts` — DELETE from static-analysis

**Currently contains:**
- `KERNAL_SYMBOLS` — 40+ KERNAL routine entries with name, description, calling convention
- `HARDWARE_SYMBOLS` — 60+ hardware register entries (VIC-II, SID, CIA1, CIA2)
- `COMPARISON_HINTS` — 20+ common comparison values with human-readable descriptions
- `lookupSymbol()`, `lookupComparisonHint()` — lookup functions

**Action:** Delete from static-analysis. The data will live in the RE pipeline's own symbol database (which will be expanded with banking awareness, ZP system locations, etc.).

**Note:** `xref_enricher_plugin.ts` (discovery plugin) currently imports from `symbol_db.ts` to check if an address is a known hardware register. Replace with simple numeric range constants:
```typescript
const isHardwareReg = (addr: number) =>
  (addr >= 0xD000 && addr <= 0xD02E) ||  // VIC-II
  (addr >= 0xD400 && addr <= 0xD41C) ||  // SID
  (addr >= 0xDC00 && addr <= 0xDC0F) ||  // CIA1
  (addr >= 0xDD00 && addr <= 0xDD0F);    // CIA2
```

### 4. `rom_shadow_detector.ts` — DELETE

**Currently does:**
- Loads KERNAL, BASIC, and CHARGEN ROM images from disk (VICE installation paths)
- Byte-for-byte compares RAM regions against ROM images
- Reports match percentage and patch locations

**Why it's RE:**
- Requires external files (ROM images) that may not be available
- The detector silently does nothing if ROMs aren't found — unreliable for structural analysis
- "This is a copy of KERNAL ROM" is an interpretation, not a structural observation

**RE pipeline equivalent:** Stage 1 plugin for ROM shadow detection, with access to shipped ROM data files.

## Items to KEEP in Static Analysis

These detectors/enrichers are structural despite looking "smart":

| Item | Why it stays |
|------|-------------|
| `sprite_detector` | 64-byte alignment detection affects block splitting. Pointer tracing via code refs is structural. |
| `sid_music_detector` | PAL frequency table matching is against mathematical constants (clock-derived values), not a curated database. |
| `compressed_detector` | Shannon entropy is pure math. Packer signature matching is minimal and mostly uses tree metadata. |
| `string_detector` / `string_discovery_enricher` | Byte value range checks ($00-$3F, $20-$5F) are structural. |
| `color_data_detector` | $00-$0F range check is structural. |
| `label_generator_enricher` | Labels from type+address (`sub_080E`, `dat_2000`) are structural identifiers, not semantic names. |
| `sub_splitter_enricher` | Splits at back-edges (structural control flow) and size limits (heuristic but necessary for builder). |
| `coverage_validator_enricher` | Pure validation, no interpretation. |

## Execution Order

1. **Delete `symbol_enricher.ts`** — cleanest removal, nothing in static analysis depends on its output
2. **Strip `comment_generator_enricher.ts`** — remove hardware/KERNAL naming sections, keep loop/SMC/data sections
3. **Replace `symbol_db.ts` import in `xref_enricher_plugin.ts`** — use numeric range constants
4. **Delete `symbol_db.ts`** — no remaining imports within static analysis
5. **Delete `rom_shadow_detector.ts`** — no dependencies
6. **Verify** — run static analysis on spriteintro.prg and archon.vsf, confirm `blocks.json` + `dependency_tree.json` output is structurally complete (same blocks, same edges, same tree — just missing annotations/comments)
7. **Verify builder** — confirm main.asm compiles and produces byte-identical PRG

## Impact Assessment

**blocks.json changes:**
- `block.annotations` field will be empty (no KERNAL/hardware/comparison annotations)
- `block.comments` will lose hardware summary and KERNAL call summary lines
- ROM shadow candidates will no longer appear in data blocks
- All other fields unchanged (instructions, candidates, edges, labels, reachability, tree)

**dependency_tree.json:** Unchanged — none of the removed items touch the tree.

**Builder output:** ASM is structurally identical. The builder reads `block.enrichment` (set by RE pipeline), not `block.annotations` (set by symbol_enricher). Byte-identical round-trip is unaffected.

## RE Pipeline: `--enable-ai` Flag

The RE pipeline should support two modes:

### Default mode (no flag): Stage 1 only
- Deterministic plugins only — no API calls, no cost, fast
- Symbol lookup: KERNAL routines, hardware registers, comparison hints
- Banking-aware KERNAL labels (`CHROUT` vs `ram_FFD2` vs `maybe_CHROUT`)
- Register semantics: inline comments for hardware writes (`STA $D020 = Set border color`)
- ROM shadow detection
- VIC-II / SID higher-level annotations (sprite setup sequences, voice config, etc.)
- Writes to `block.enrichment.semanticLabels`, `block.enrichment.inlineComments`, `block.enrichment.annotations`
- Useful for people who want a solid annotated foundation and will do manual RE from there

### `--enable-ai`: Full pipeline (Stages 1-4)
- Stage 1 (deterministic) runs first as above
- Stage 2: AI enrichment — purpose analysis, variable naming, documentation
- Stage 3: AI reverse engineering — iterative per-block RE with context gathering
- Stage 4: Integration — module assignment, file splitting, dead code, documentation
- Requires `OPENAI_API_KEY` (or equivalent)
- Cost varies by program size (see cost estimates in [reverse-engineering-pipeline.md](reverse-engineering-pipeline.md))
