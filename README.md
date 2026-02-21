# C64 / 6502 AI Toolkit

An integrated suite of tools for Commodore 64 development, reverse engineering, and AI-assisted disassembly.

## Projects

### [static-analysis/](static-analysis/) -- Binary Analysis

Deterministic pipeline that decomposes C64 binaries into structured blocks. Discovers code via control-flow tracing, classifies data regions (sprites, strings, tables, etc.), builds a dependency tree, and outputs `blocks.json` + `dependency_tree.json`. No AI, no API calls — pure structural analysis.

```bash
npx tsx static-analysis/src/index.ts game.prg        # .prg file
npx tsx static-analysis/src/index.ts snapshot.vsf     # VICE snapshot
```

### [builder/](builder/) -- KickAssembler Code Generator

Reads `blocks.json` from static-analysis and produces compilable KickAssembler `.asm` files. Emitter plugins handle each block type (code, sprites, strings, tables, padding). When `dependency_tree.json` is available, also generates `dependency_tree.md` and annotates unreachable blocks.

```bash
cd builder && npx tsx src/index.ts ../blocks.json -o ../output/
kickass output/main.asm -o output/compiled.prg
```

**Round-trip verified:** `game.prg → static-analysis → builder → kickass → compiled.prg` produces byte-identical output.

### [training/](training/) -- Qdrant Knowledge Base

Curated, semantically-chunked vector database covering the full C64 hardware and software stack (4000+ chunks). Includes a Python pipeline for splitting documents, cleaning with OpenAI, and importing into Qdrant.

### [query/](query/) -- Qdrant Search

Hybrid search tool for querying the knowledge base. Supports hex address filtering, automatic number base conversion, and memory map enrichment. Use via `/query-qdrant` slash command.

### [helper/](helper/) -- Utility Tools

- **prg2vsf/** — Convert `.prg` files to VICE `.vsf` snapshots for emulator testing
- **prg-crunch/** — Cruncher/packer utilities

### Reverse Engineering Pipeline (planned)

AI-powered semantic analysis layer that sits on top of static-analysis output. Adds human-meaningful names, purpose descriptions, module groupings, and documentation to blocks. Consumes `blocks.json` + `dependency_tree.json`, produces enriched output for the builder.

- [docs/reverse-engineering-pipeline.md](docs/reverse-engineering-pipeline.md) -- architecture and design

### KickAssembler LSP (planned)

VS Code extension with a built-in Language Server for KickAssembler.

- [docs/kickassembler-lsp-extension.md](docs/kickassembler-lsp-extension.md) -- architecture and research

## Full Pipeline

```
game.prg / snapshot.vsf
    │
    ▼
[static-analysis]  ──→  blocks.json + dependency_tree.json
    │
    ▼
[builder]          ──→  main.asm + dependency_tree.md
    │
    ▼
[kickass]          ──→  compiled.prg  (byte-identical to original)
    │
    ▼
[prg2vsf]          ──→  output.vsf    (optional, for emulator testing)
```

## Prerequisites

- Docker (for Qdrant)
- direnv
- OpenAI API key (for embeddings and training pipeline)

## Setup

```bash
cp .envrc.example .envrc
# Edit .envrc and set your OPENAI_API_KEY
direnv allow .
```

## Key Memory Locations (Quick Reference)

| Address | Purpose |
|---------|---------|
| `$0400` | Screen RAM |
| `$D800` | Colour RAM |
| `$D000-$D3FF` | VIC-II (graphics) |
| `$D400-$D7FF` | SID (sound) |
| `$DC00-$DCFF` | CIA1 (keyboard, joystick, timer) |
| `$DD00-$DDFF` | CIA2 (serial, VIC bank, NMI) |
| `$A000-$BFFF` | BASIC ROM |
| `$E000-$FFFF` | KERNAL ROM |
