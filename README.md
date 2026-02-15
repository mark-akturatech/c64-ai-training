# C64 / 6502 AI Toolkit

An integrated suite of tools for Commodore 64 development, reverse engineering, and AI-assisted disassembly.

## Projects

### [training/](training/) -- Qdrant Knowledge Base

Curated, semantically-chunked vector database covering the full C64 hardware and software stack (4000+ chunks). Includes a Python pipeline for splitting documents, cleaning with OpenAI, and importing into Qdrant.

### [query/](query/) -- Qdrant Search

Hybrid search tool for querying the knowledge base. Supports hex address filtering, automatic number base conversion, and memory map enrichment. Use via `/query-qdrant` slash command.

### AI Disassembler (planned)

Automated reverse engineering pipeline for C64 binaries. Static analysis engine + AI-powered semantic analysis produces documented, multi-file KickAssembler source from `.prg` files.

- [plans/static-analysis.md](plans/static-analysis.md) -- deterministic code/data classification
- [plans/reverse-engineering-pipeline.md](plans/reverse-engineering-pipeline.md) -- AI annotation, naming, and documentation passes
- [plans/ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md) -- MCP tools and output format

### KickAssembler LSP (planned)

VS Code extension with a built-in Language Server for KickAssembler.

- [plans/kickassembler-lsp-extension.md](plans/kickassembler-lsp-extension.md) -- architecture and research

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
