# C64 / 6502 Development Toolkit

An integrated suite of tools for Commodore 64 development, reverse engineering, and AI-assisted disassembly -- combining a semantic knowledge base, a KickAssembler language server, and an automated disassembly pipeline.

## Overview

This project has four pillars:

### 1. Qdrant Knowledge Base -- C64/6502 Training Data

A curated, semantically-chunked vector database covering the full C64 hardware and software stack. Used by AI assistants (Claude, etc.) to provide accurate, context-aware help when writing or analysing 6502 assembly.

**Coverage includes:**
- Complete 6502 instruction set (all addressing modes, cycle counts, undocumented opcodes)
- Full C64 memory map ($0000-$FFFF)
- VIC-II graphics programming (sprites, characters, bitmaps, raster interrupts)
- SID sound chip (3 voices, filters, envelopes, ring modulation)
- CIA timer and I/O programming
- KERNAL and BASIC ROM entry points with calling conventions
- KickAssembler syntax, directives, and scripting language
- Commented ROM disassembly
- Programmer's Reference Guide content

### 2. KickAssembler VS Code Extension

A VS Code extension with a built-in Language Server Protocol (LSP) implementation for KickAssembler -- the most popular modern C64 assembler. No production-ready KickAssembler LSP currently exists; existing extensions shell out to Java for every operation and lack true code intelligence.

**Planned features:**
- Own parser (not dependent on Java/KickAssembler process for navigation)
- Go-to-definition, find references, rename across files
- Scope-aware symbol resolution (`.namespace`, `.filenamespace`, `{ }` blocks)
- `#import`/`#importonce` dependency tracking
- Autocompletion with context detection (instructions, directives, labels, macros)
- Hover docs for 6502 instructions, KickAssembler directives, and C64 hardware registers (VIC-II, SID, CIA)
- Diagnostics via KickAssembler `-asminfo` integration
- Document outline and workspace symbols
- VICE debugger integration (DAP over binary monitor protocol)

See [plans/kickassembler-lsp-extension.md](plans/kickassembler-lsp-extension.md) for the full architecture and research.

### 3. AI-Accessible LSP (via Serena / MCP)

The LSP from pillar 2 is exposed to AI assistants through two interfaces:

- **Serena adapter** -- wraps the LSP as an MCP server, giving AI standard code navigation tools (`find_symbol`, `find_referencing_symbols`, `get_hover_info`, etc.)
- **Custom C64-aware MCP server** -- composite tools that combine LSP code intelligence with Qdrant hardware knowledge in a single call (e.g., "What is `$D018` and where is it used in this project?" returns both the VIC-II register description and all code references)

This bridges the gap between knowing *what* a hardware register does (Qdrant) and knowing *where* it's used in your code (LSP).

### 4. AI Disassembler MCP

A feature-rich MCP server for automated disassembly and documentation of C64 binaries. Takes partially-disassembled ASM text (from Regenerator, VICE, etc.) or raw `.prg` files and produces well-structured, commented, multi-file KickAssembler source code.

**Key capabilities:**
- Static analysis engine (control flow graphs, cross-references, subroutine detection, loop detection)
- Self-modifying code detection
- Code/data separation with format recognition (sprites, charsets, SID music, lookup tables, text strings)
- AI-powered semantic analysis (subroutine naming, variable naming, data classification)
- Confidence tracking with conflict detection (validates existing names against actual behaviour)
- KickAssembler output following the [Archon C64](https://github.com/mark-akturatech/archon-c64) project conventions
- Byte-for-byte reassembly verification
- Iterative refinement workflow with human-in-the-loop review

See [plans/ai-disassembler-mcp.md](plans/ai-disassembler-mcp.md) for the full architecture and plan.

## Prerequisites

- Arch Linux (or compatible distro with AUR access)
- Docker
- direnv
- OpenAI API key (for Qdrant embeddings)
- Java (for KickAssembler)
- Node.js (for VS Code extension / LSP)

## Installation

### 1. Install Docker

```bash
paru -S docker
sudo systemctl enable docker.socket
sudo systemctl start docker.socket
sudo usermod -aG docker $USER
```

Log out and back in for group changes to take effect.

### 2. Install direnv

```bash
sudo pacman -S direnv
```

Add the direnv hook to your shell (e.g., for bash, add to `~/.bashrc`):
```bash
eval "$(direnv hook bash)"
```

### 3. Configure Environment

```bash
cp .envrc.example .envrc
# Edit .envrc and set your OPENAI_API_KEY
direnv allow .
```

## Usage

### Compiling Assembly

```bash
kickass filename.asm
```

Produces a `.prg` file that can be run in a C64 emulator (VICE, etc.).

### AI-Assisted Development

The Qdrant knowledge base is available via MCP. AI assistants query it automatically when writing C64 code -- see `CLAUDE.md` for integration details.

## Adding Training Content

The knowledge base is built from training documents that are split into semantic chunks for better retrieval.

### Directory Structure

```
documents/       # Original source documents
training/
  split_config/  # JSON configs defining how to split each file
  split/         # Generated chunks (output)
```

### Workflow

#### 1. Add Raw Document

Place your new document in `documents/`. Supported formats: `.txt`

#### 2. Create Split Configuration

Use the `/split-training` command to analyze the document and generate a split config:

```
/split-training my_document.txt
```

The agent will:
- Analyze the document structure
- Identify conceptual topics (e.g. "addressing_modes", "sprite_registers")
- Mark sections to ignore (TOC, indexes, redundant summaries)
- Add context headers so each chunk is self-contained
- Create the config file in `training/split_config/`

The config format is `training/split_config/<filename>.json`:

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
- `ignore`: Set `true` to skip sections (TOC, indexes, line numbers, redundant summaries)

#### 3. Run the Split Script

```bash
# Split a specific file
python3 scripts/split_training.py "my_document.json"

# Or split all configured files
python3 scripts/split_training.py

# Force re-split even if source hasn't changed
python3 scripts/split_training.py --force
```

Output goes to `training/split/` named by topic (e.g. `6502_addressing_modes.txt`).

#### 4. Index to Qdrant

Use the Qdrant MCP tools to reindex:

```
mcp__qdrant-local__reindex_changes(path="/path/to/training/split")
```

Or for a fresh index:

```
mcp__qdrant-local__index_codebase(path="/path/to/training/split")
```

### Split Guidelines

- **Logical breaks**: Split at chapter/section boundaries, not mid-paragraph
- **Self-contained**: Each chunk should make sense on its own
- **Context headers**: Describe what the chunk covers (e.g., "6502 Instructions - Branch Operations")
- **Size targets**: Aim for <4KB, allow up to 8KB only when content is indivisible

## Project Structure

```
.
├── CLAUDE.md              # AI assistant instructions for C64 development
├── .mcp.json              # MCP server configuration (Qdrant, etc.)
├── .envrc.example         # Environment variable template
├── documents/             # Original source documents
├── examples/              # Example C64 assembly programs
├── plans/                 # Architecture and design documents
│   ├── ai-disassembler-mcp.md
│   └── kickassembler-lsp-extension.md
├── scripts/               # Build and utility scripts
│   └── split_training.py
└── training/              # Knowledge base content
    ├── split_config/      # Split configuration files
    └── split/             # Generated chunks for Qdrant
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

## License

MIT
