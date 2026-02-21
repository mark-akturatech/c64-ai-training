# Builder Modifications — Dependency Tree Output & Dead Code Reporting

## Context

The builder currently produces `main.asm` + optional `assets/` — compilable KickAssembler output from `blocks.json`. It has no concept of the dependency tree or dead code analysis.

The reverse engineering pipeline ([reverse-engineering-pipeline.md](docs/reverse-engineering-pipeline.md)) now produces enriched `blocks.json` + `dependency_tree.json` with full tree structure, banking state annotations, resolution levels, and dead code classification. The builder needs to consume this additional data for:

1. **Dependency tree documentation** — human-readable document showing call chains, data dependencies, register state, and dead nodes
2. **Dead node reporting** — clearly mark unreachable/unused blocks in the ASM output

### What the Builder Does NOT Do

The builder is a **renderer**, not an analyzer. All intelligent decisions about labeling, comments, and annotations are made upstream:

- **Labels** — The RE pipeline writes banking-aware labels to `enrichment.semanticLabels` (e.g., `CHROUT` vs `ram_FFD2` vs `maybe_CHROUT`). The builder's `label_resolver.ts` already applies these at highest priority. No changes needed.
- **Comments** — The RE pipeline writes inline comments to `enrichment.inlineComments` (e.g., `"⚠ Bank out KERNAL + BASIC ($01=$35)"` on `STA $01` instructions) and block headers to `enrichment.headerComment`. The builder's code emitter already reads these. No changes needed.
- **Annotations** — The RE pipeline writes structured annotations to `enrichment.annotations`. The builder's symbol enricher already reads `block.annotations`. No changes needed.

The existing `enrichment` fields in `shared/src/enrichment.ts` are the contract between the RE pipeline and the builder:

```typescript
interface BlockEnrichment {
  semanticLabels?: Record<string, string>;    // RE pipeline → builder label_resolver
  inlineComments?: Record<string, string>;    // RE pipeline → builder code_emitter
  headerComment?: string;                      // RE pipeline → builder code_emitter
  variableNames?: Record<string, string>;      // RE pipeline → builder code_emitter
  annotations?: Array<{ ... }>;                // RE pipeline → builder code_emitter
  // ... other fields
}
```

---

## 1. Dependency Tree Documentation Output

### New File: `dependency_tree.md`

The builder emits a human-readable dependency tree document alongside `main.asm`. This is the primary artifact for reverse engineers trying to understand how the program is structured.

**Design principles:**
- **Not a tree diagram** — ASCII tree diagrams become unreadable at 20+ nodes and unusable at 50+
- **Indented call-chain format** — scales to hundreds of nodes, grep-friendly, collapsible
- **Shows everything** — call chains, data dependencies, register state, dead nodes, warnings
- **Banking state prominent** — non-default banking highlighted with warnings

**Output format:**

```markdown
# Dependency Tree — game.prg

## Summary

- **Entry points:** 1 (BASIC SYS $0810)
- **IRQ handlers:** 2 ($C200 raster split, $C280 raster split)
- **Total nodes:** 62 (47 code, 12 data, 3 unknown)
- **Reachable:** 55 (89%)
- **Dead/unreachable:** 7 (11%, 2048 bytes)
- **Banking changes:** 3 nodes switch from default

## Call Chain (from entry $0810)

- **init** ($0810) [proven, HIGH] — Initialize hardware and start main loop
  - **init_screen** ($0900) [proven, HIGH] — Set up multicolor text mode
    → reads dat_2000 "Custom charset" (2048 bytes, charset)
    → writes $D018 (VIC memory pointer = $15)
    → writes $DD00 (CIA2 port A: VIC bank 2)
  - **init_sprites** ($0950) [proven, HIGH] — Load sprite positions from tables
    → reads dat_C800 "Sprite X positions" (8 bytes, byte_table)
    → reads dat_C810 "Sprite Y positions" (8 bytes, byte_table)
    → writes $D000-$D00F (sprite position registers)
    → writes $D015 (sprite enable = $FF)
  - **init_sound** ($0A00) [proven, HIGH] — Initialize SID and start music
    ⚠ BANKING: $01=$35 on exit (KERNAL banked out)
    - **play_music** ($0A80) [proven, MEDIUM] — Music player tick
      → reads dat_1000 "Music data" (4096 bytes, command_stream)
      → writes $D400-$D418 (SID registers)
  - **main_loop** ($0B00) [proven, HIGH] — Main game loop
    ⚠ BANKING: $01=$35 on entry (KERNAL not mapped)
    - **read_input** ($0B40) [proven, HIGH] — Read joystick port 2
      → reads $DC00 (CIA1 data port A)
    - **update_game** ($0B80) [proven, HIGH] — Update game state
      - **check_collision** ($0BC0) [proven, HIGH] — Sprite-sprite collision
        → reads $D01E (sprite-sprite collision register)
      - **move_player** ($0C00) [proven, HIGH] — Move player sprite
        → writes $D000-$D001 (sprite 0 X/Y)
    - **draw_frame** ($0C40) [proven, HIGH] — Render current frame
      - **update_score** ($0C80) [proven, MEDIUM] — Update score display
        → writes $0400-$0427 (screen RAM row 0)

## IRQ Handler Chain

- **irq_raster_1** ($C200) [proven, HIGH] — Top-of-screen raster split
  → writes $D012 (raster line = $80)
  → writes $D020 (border color = $00)
  → sets IRQ vector → irq_raster_2 ($C280)
- **irq_raster_2** ($C280) [proven, HIGH] — Mid-screen raster split
  → writes $D012 (raster line = $F8)
  → writes $D020 (border color = $06)
  → sets IRQ vector → irq_raster_1 ($C200)

## Data Blocks

| Address | Label | Type | Size | Used By | Reachable |
|---------|-------|------|------|---------|-----------|
| $1000 | dat_1000 | command_stream | 4096 | play_music | proven |
| $2000 | dat_2000 | charset | 2048 | init_screen | proven |
| $C800 | dat_C800 | byte_table | 8 | init_sprites | proven |
| $C810 | dat_C810 | byte_table | 8 | init_sprites | proven |
| $D000 | dat_D000 | sprite_data | 640 | (VIC pointer $07F8) | proven |

## Banking State Transitions

| Block | Entry $01 | Exit $01 | Effect |
|-------|-----------|----------|--------|
| init ($0810) | $37 (default) | $37 | No change |
| init_sound ($0A00) | $37 | $35 | ⚠ Banks out KERNAL + BASIC |
| main_loop ($0B00) | $35 | $35 | KERNAL remains banked out |

**Warning:** All blocks below init_sound in the call chain execute with KERNAL banked out ($01=$35). Addresses $A000-$BFFF and $E000-$FFFF map to RAM, not ROM.

## Dead/Unreachable Nodes

| Address | Type | Size | Classification | Recommendation |
|---------|------|------|----------------|----------------|
| $4000-$5FFF | unknown | 8192 | fill_padding | Remove — all $00 bytes, likely PRG boundary fill |
| $6000-$60FF | data | 256 | unused_routine | Investigate — valid code but no callers (debug routine?) |
| $8000-$803F | data | 64 | rom_shadow | Remove — copy of BASIC ROM header |
| $9000-$90FF | unknown | 256 | fill_padding | Remove — all $AA bytes, alignment fill |
| $A000-$A03F | code | 64 | abandoned_feature | Keep — commented-out keyboard handler, may be intentional |

**Dead code total:** 8832 bytes (27% of program)
```

### Implementation

**New file:** `tree_renderer.ts`

```typescript
interface TreeRendererInput {
  tree: DependencyTreeJson;          // from dependency_tree.json
  blocks: Block[];                   // from blocks.json
  integration?: IntegrationJson;     // from integration.json (optional, for module names)
  labelMap: Map<number, string>;     // from label_resolver (which includes RE pipeline's semanticLabels)
}

interface TreeRendererOutput {
  markdown: string;                  // dependency_tree.md content
}

function renderDependencyTree(input: TreeRendererInput): TreeRendererOutput { ... }
```

**Key rendering logic:**

1. **Walk from entry points** — depth-first, indent by call depth
2. **For each code node** — show: label, address, reachability, certainty, purpose (one line)
3. **For each code node's edges** — show data reads/writes and hardware accesses as `→` lines
4. **Banking warnings** — `⚠ BANKING:` line when banking state changes (reads `bankingState` from tree JSON)
5. **IRQ chains** — separate section, show cycle with arrows
6. **Data blocks** — table format with address, label, type, size, users, reachability
7. **Dead nodes** — table format with classification and recommendation (always fully listed)

**Handling large programs (200+ nodes):**
- Top-level shows only direct children of entry points / main loop
- Each module gets its own subsection with full expansion
- Data blocks grouped by module assignment
- Dead nodes always fully listed (they're the point of the analysis)

### JSON Output: `dependency_tree.json`

The builder also passes through `dependency_tree.json` (from the RE pipeline) alongside the markdown output. This enables programmatic consumption by other tools.

---

## 2. Dead Node Reporting in ASM Output

### Changes to `builder.ts`

When the builder has `dependency_tree.json` available, dead/unreachable blocks get special treatment in the ASM output.

**For junk blocks (already skipped by default):** No change.

**For unreachable code blocks (not junk, but no path from entry points):**

```asm
// ============================================================
// ⚠ UNREACHABLE: sub_6000 — No path from any entry point
// Classification: unused_routine
// Recommendation: Investigate — valid code but no callers
// This block may be called via unresolved indirect jump,
// or may be dead/debug code.
// ============================================================
*=$6000 "sub_6000"
sub_6000:
        lda #$00
        sta $D020
        ; ...
```

**For unreachable data blocks:**

```asm
// ============================================================
// ⚠ UNREACHABLE: dat_4000 — Not referenced by any code
// Classification: fill_padding
// Recommendation: Remove — all $00 bytes
// ============================================================
*=$4000 "dat_4000"
dat_4000:
        .fill 8192, $00
```

### Implementation

In the emitter dispatch loop, before emitting each block:

```typescript
if (tree && isDeadNode(block, tree)) {
  const classification = getDeadNodeClassification(block, tree, integration);
  lines.push(comment(`============================================================`));
  lines.push(comment(`⚠ UNREACHABLE: ${block.id} — ${classification.reason}`));
  lines.push(comment(`Classification: ${classification.type}`));
  lines.push(comment(`Recommendation: ${classification.recommendation}`));
  lines.push(comment(`============================================================`));
}
```

The `isDeadNode()` and `getDeadNodeClassification()` functions read from the tree JSON — the RE pipeline's `dead_code_analyzer` integration plugin has already computed reachability and classification. The builder just renders this data.

---

## 3. New CLI Flags

| Flag | Description |
|------|-------------|
| `--tree <file>` | Path to `dependency_tree.json`. Enables dead node reporting and tree documentation output. |
| `--integration <file>` | Path to `integration.json`. Enables module names and dead code classifications in tree output. |
| `--no-tree-doc` | Suppress `dependency_tree.md` generation. |
| `--include-dead` | Emit dead/unreachable blocks with warnings (default: emit them). Use `--exclude-dead` to skip. |

**Backwards compatibility:** All new flags are optional. Without `--tree`, builder behaves exactly as it does today. Labels and comments come from `enrichment` fields on blocks — no separate flags needed.

**Updated CLI example:**
```
npx tsx builder/src/index.ts blocks.json --tree dependency_tree.json --integration integration.json -o output/
# Outputs: main.asm, dependency_tree.md, dependency_tree.json, assets/
```

---

## Pipeline Integration

Updated build pipeline from [CLAUDE.md](CLAUDE.md):

```bash
# 1. Static analysis
npx tsx static-analysis/src/index.ts path/to/input.vsf
# → outputs blocks.json + dependency_tree.json

# 2. RE pipeline (enriches blocks + tree, writes labels + comments to enrichment fields)
npx tsx reverse-engineering/src/index.ts blocks.json
# → outputs enriched blocks.json + dependency_tree.json + integration.json + ...

# 3. Builder (renders enriched data — does NOT analyze or decide labels)
npx tsx builder/src/index.ts blocks.json \
  --tree dependency_tree.json \
  --integration integration.json \
  -o test/output-dir/
# → outputs main.asm + dependency_tree.md + dependency_tree.json + assets/

# 4. KickAssembler
kickass test/output-dir/main.asm -o test/output-dir/compiled.prg
```

### Separation of Concerns

| Concern | Handled By | Mechanism |
|---------|-----------|-----------|
| Banking-aware label decisions | RE pipeline | `kernal_api_enrichment.ts` + `banking_resolver.ts` → writes to `enrichment.semanticLabels` |
| Register state comments (STA $01) | RE pipeline | `register_semantics_enrichment.ts` / AI → writes to `enrichment.inlineComments` |
| Block header comments | RE pipeline | AI analysis → writes to `enrichment.headerComment` |
| Variable naming | RE pipeline | AI analysis → writes to `enrichment.variableNames` |
| Dead code classification | RE pipeline | `dead_code_analyzer` → writes to tree JSON |
| Structural labels (sub_XXXX, dat_XXXX) | Builder | `label_resolver.ts` — auto-generated from block IDs |
| Label application to ASM | Builder | `label_resolver.ts` — reads `enrichment.semanticLabels` (highest priority) |
| Comment emission to ASM | Builder | `code_emitter.ts` — reads `enrichment.inlineComments`, `enrichment.headerComment` |
| Tree documentation rendering | Builder | `tree_renderer.ts` — reads tree JSON + blocks + integration |
| Dead node ASM warnings | Builder | `builder.ts` — reads tree JSON reachability data |

---

## Testing

1. **Tree documentation**: Run on `spriteintro.prg` (small program). Verify `dependency_tree.md` shows correct call chain, data dependencies, and hardware access info.
2. **Dead node reporting**: Run on a VSF snapshot with large unused regions. Verify `dependency_tree.md` lists dead nodes with classifications. Verify ASM output has `⚠ UNREACHABLE` comments on dead blocks.
3. **Large program scaling**: Run on a program with 100+ blocks. Verify `dependency_tree.md` is still readable (module grouping, not one giant tree).
4. **Backwards compatibility**: Run builder WITHOUT `--tree` flag. Verify output is byte-identical to current builder output.
5. **Label passthrough**: Enrich blocks with `semanticLabels` containing banking-aware labels (e.g., `ram_FFD2`). Run builder. Verify labels appear correctly in ASM output without any builder-side banking logic.
6. **Comment passthrough**: Enrich blocks with `inlineComments` containing register state notes. Run builder. Verify comments appear on correct instructions.

---

## File Inventory (Changes + New)

| File | Change |
|------|--------|
| `index.ts` | Add `--tree`, `--integration`, `--no-tree-doc`, `--include-dead`/`--exclude-dead` CLI flags |
| `builder.ts` | Load tree JSON, pass to emitters, call tree renderer |
| **`tree_renderer.ts`** | **NEW** — renders `dependency_tree.md` from tree + blocks + integration data |

**1 new file**, 2 modified files. No changes to `label_resolver.ts` or `code_emitter.ts` — they already consume the enrichment fields correctly.
