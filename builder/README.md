# C64 Builder — KickAssembler Code Generator

Reads `blocks.json` from static-analysis and produces compilable KickAssembler `.asm` files. The builder is a **renderer** — it emits assembly source from pre-classified blocks. It makes no analytical decisions about code structure or data types; those are made upstream by static-analysis (structure) and the RE pipeline (semantics).

## Setup

```bash
cd builder
npm install
```

Requires:

- **Node.js 18+**
- **tsx** (installed as dev dependency)
- **KickAssembler** (`kickass`) for compilation

## Usage

```bash
cd builder

# Basic usage
npx tsx src/index.ts ../blocks.json -o ../output/

# With original binary for byte-perfect resolution
npx tsx src/index.ts ../blocks.json --binary ../game.prg -o ../output/

# With explicit dependency tree
npx tsx src/index.ts ../blocks.json --tree ../dependency_tree.json -o ../output/

# Suppress dependency_tree.md (UNREACHABLE warnings still appear in ASM)
npx tsx src/index.ts ../blocks.json --no-tree-doc -o ../output/

# Include junk blocks
npx tsx src/index.ts ../blocks.json --include-junk -o ../output/
```

**Important:** Must be run from the `builder/` directory.

## Output

- **main.asm** — single KickAssembler source file, all blocks concatenated by address
- **dependency_tree.md** — human-readable program structure doc (when tree available)
- **assets/** — binary files extracted by emitters (when applicable)

## What It Consumes

| Input | Source | Required |
|-------|--------|----------|
| `blocks.json` | static-analysis | Yes |
| `dependency_tree.json` | static-analysis | No — auto-detected alongside blocks.json |
| `integration.json` | RE pipeline | No — future, for module names |
| `.prg` binary | original file | No — block `raw` fields suffice |

When `dependency_tree.json` is available:
- **UNREACHABLE** comment blocks are added to dead code/data in the ASM
- **dependency_tree.md** is generated with call chains, data block tables, and dead node lists

When `block.enrichment` fields are populated (by the RE pipeline):
- Semantic labels override auto-generated labels
- Header comments and inline comments are emitted
- Purpose descriptions appear in the dependency tree doc

## Emitter Plugins

Block-type-specific code generators, auto-discovered by filename convention (`*_emitter.ts`). Priority-sorted, first-match dispatch.

| Emitter | Priority | Handles |
|---------|----------|---------|
| `basic_stub` | 5 | BASIC SYS stub at $0801 |
| `code` | 10 | Subroutines, IRQ handlers, fragments |
| `sprite` | 20 | 64-byte sprite data (hires/multicolor) |
| `string` | 22 | PETSCII/screen-code strings |
| `lookup_table` | 25 | Word/byte tables |
| `padding` | 28 | Fill regions |
| `raw_data` | 90 | Catch-all data |
| `unknown` | 95 | Unknown regions |

## Round-Trip Verification

The pipeline produces byte-identical output:

```
game.prg → static-analysis → blocks.json → builder → main.asm → kickass → compiled.prg
SHA256(game.prg) == SHA256(compiled.prg)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for full technical details.
