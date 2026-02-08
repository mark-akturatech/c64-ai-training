# KickAssembler LSP Core Library

## Overview

A standalone TypeScript library providing KickAssembler language intelligence: parsing, symbol tracking, scope resolution, and cross-file navigation. Designed to be consumed by multiple clients:

```
kickassembler-lsp (this plan - core library + LSP server)
    │
    ├──> kickassembler-vscode (VS Code extension - IDE features, debug adapter)
    │    See: plans/kickassembler-lsp-extension.md
    │
    └──> c64-disasm-mcp (Python MCP server - connects as LSP client)
         See: plans/ai-disassembler-mcp.md
```

**Why separate?** The LSP provides code intelligence that both projects need:
- **VS Code extension**: go-to-def, find refs, rename, completion, hover, outline
- **Disassembler MCP**: validate generated output, navigate disassembled code, rename during refine, verify symbol consistency

Both import the same LSP rather than duplicating parser/symbol logic.

---

## Architecture

```
kickassembler-lsp/
  src/
    parser/
      lexer.ts              -- Tokeniser (KickAssembler syntax)
      parser.ts             -- Line-by-line parser, builds AST-like structures
      format_detector.ts    -- Auto-detect KickAssembler syntax version/variant
    symbols/
      symbol_table.ts       -- Symbol definitions (labels, consts, vars, macros)
      scope_tracker.ts      -- Brace-delimited scope chain (.namespace, .filenamespace, {})
      cross_file_resolver.ts -- #import/#importonce resolution, file dependency graph
      exports_map.ts        -- Global symbol visibility tracking
    analysis/
      reference_finder.ts   -- Find all references to a symbol (scope-aware)
      call_hierarchy.ts     -- JSR/JMP call graph
      rename_engine.ts      -- Cross-file rename with scope awareness
    data/
      opcodes.json          -- All 256 6502 opcodes (official + undocumented)
      directives.json       -- KickAssembler directives (~40+)
      registers.json        -- C64 hardware registers (VIC-II, SID, CIA1, CIA2)
      kernal.json           -- KERNAL entry points with calling conventions
      zeropage.json         -- System zero page variables
    server/
      lsp_server.ts         -- LSP protocol handler (textDocument/*, workspace/*)
      capabilities.ts       -- Declared LSP capabilities
    index.ts                -- Library entry point (exports parser, symbols, analysis)
  data/                     -- JSON data files
  test/                     -- Unit tests
  package.json
  tsconfig.json
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Language** | TypeScript | Same ecosystem as VS Code extension; fast enough for 64KB programs |
| **Parser approach** | Hand-rolled regex scanner | Proven (ca65 uses this), KickAssembler syntax is regular enough. Upgrade to tree-sitter only if needed |
| **Scope model** | Linked-list scope chain | Learned from paulhocker's failed numeric ID approach; works for brace-delimited scoping |
| **LSP transport** | stdio (default) + IPC (VS Code) | stdio allows any client to connect; IPC for in-process VS Code |
| **Data format** | JSON files | Human-readable, easy to extend, version-controllable |
| **Distribution** | npm package + standalone server binary | Library import for TypeScript consumers; standalone for non-TS clients (Python MCP) |

---

## Core Components

### Parser (`parser/`)

#### `lexer.ts` -- Tokeniser

Tokenises KickAssembler source into a stream of typed tokens.

**Token types:**
- `LABEL` -- `myLabel:` or `!localLabel`
- `MNEMONIC` -- `lda`, `sta`, `jsr`, etc. (all 256 opcodes)
- `DIRECTIVE` -- `.byte`, `.const`, `.namespace`, `.segmentdef`, etc.
- `PREPROCESSOR` -- `#import`, `#importonce`, `#if`, `#define`
- `OPERAND` -- `#$FF`, `$D000,X`, `($FB),Y`, etc.
- `NUMBER` -- `$FF`, `%10101010`, `255`
- `STRING` -- `"hello"`, `'c'`
- `IDENTIFIER` -- symbol references
- `COMMENT` -- `// ...` and `/* ... */`
- `BRACE_OPEN` / `BRACE_CLOSE` -- `{` / `}`
- `OPERATOR` -- `+`, `-`, `*`, `/`, `==`, `!=`, etc.
- `DOT_ACCESS` -- `.` in `namespace.symbol`

**KickAssembler-specific lexer rules:**
- `//` starts line comment (NOT `;` which is statement separator)
- `/* */` for block comments
- `{ }` for block delimiters (macros, namespaces, conditionals)
- `#` prefix for preprocessor directives
- `.` prefix for assembler directives
- `!` prefix for multi-labels (with `+`/`-` direction suffixes)
- `;` as statement separator (multiple statements per line)

#### `parser.ts` -- Line Parser

Parses tokenised lines into structured data.

**Per-line output:**
```typescript
interface ParsedLine {
  lineNumber: number;
  label?: LabelDef;        // Label definition on this line
  instruction?: Instruction; // Mnemonic + operand
  directive?: Directive;    // KickAssembler directive + args
  preprocessor?: Preprocessor; // #import, #if, etc.
  comment?: string;         // Trailing comment
  scopeChange?: number;     // +1 for {, -1 for }, 0 for neither
}
```

**Directive dispatch** handles:
- Symbol definitions: `.const`, `.var`, `.label`, `.eval`
- Structure: `.namespace`, `.filenamespace`, `.macro`, `.function`, `.pseudocommand`
- Data: `.byte`, `.word`, `.text`, `.fill`, `.import binary`
- Segments: `.segment`, `.segmentdef`, `.file`
- Control flow: `.if`, `.else`, `.for`, `.while`, `.return`
- Structs/enums: `.struct`, `.enum`

### Symbol System (`symbols/`)

#### `symbol_table.ts` -- Symbol Definitions

```typescript
interface Symbol {
  name: string;
  type: SymbolType; // label, const, var, macro, function, namespace, segment, struct, enum
  scope: Scope;
  location: Location; // file + line + column
  value?: string | number; // For consts and vars
  documentation?: string; // From comments above definition
  references: Location[]; // All usage sites
}

enum SymbolType {
  LABEL, CONST, VAR, MACRO, FUNCTION, PSEUDOCOMMAND,
  NAMESPACE, FILENAMESPACE, SEGMENT, STRUCT, ENUM,
  MULTI_LABEL // !label with +/- counting
}
```

#### `scope_tracker.ts` -- Scope Chain

Linked-list scope chain for KickAssembler's brace-delimited scoping.

```typescript
interface Scope {
  name: string;
  type: ScopeType; // global, filenamespace, namespace, macro, function, block
  parent: Scope | null;
  children: Scope[];
  symbols: Map<string, Symbol>;
  startLine: number;
  endLine: number;
  file: string;
}
```

**Scope rules (KickAssembler-specific):**
- `.filenamespace X` -- all labels in this file are prefixed with `X.`
- `.namespace X { }` -- explicit namespace block
- `.macro Name(params) { }` -- macro scope
- `.function Name(params) { }` -- function scope
- `{ }` -- anonymous block scope (labels inside are local)
- Multi-labels (`!loop`) -- scoped between two non-local labels

#### `cross_file_resolver.ts` -- Import Resolution

- Parse `#import "file.asm"` and `#importonce` directives
- Build file dependency DAG (bidirectional: imports + imported-by)
- Resolve symbol references across files following import chains
- Handle circular import detection (via `#importonce`)

### Analysis (`analysis/`)

#### `reference_finder.ts` -- Find All References

Scope-aware reference finding. Unlike sanmont's flat string match, this resolves which scope each reference belongs to.

- Find all references to a symbol, correctly handling:
  - Same name in different namespaces
  - Multi-labels (`!loop` in different routines)
  - Macro parameters shadowing outer symbols

#### `call_hierarchy.ts` -- Call Graph

- Track `JSR label` and `JMP label` instructions
- Build incoming/outgoing call hierarchy
- Detect recursive calls
- Used by disassembler for file splitting decisions

#### `rename_engine.ts` -- Cross-File Rename

- Rename a symbol and all its references across all files
- Scope-aware: only renames references in the correct scope
- Validates: no name collisions in target scope after rename
- Used by disassembler's `/disasm-refine` skill

### Data Files (`data/`)

#### `opcodes.json` -- All 256 6502 Opcodes

```json
{
  "0xA9": {
    "mnemonic": "LDA",
    "mode": "immediate",
    "bytes": 2,
    "cycles": 2,
    "flags": "NZ",
    "description": "Load Accumulator with immediate value",
    "undocumented": false
  },
  "0xAB": {
    "mnemonic": "LAX",
    "mode": "immediate",
    "bytes": 2,
    "cycles": 2,
    "flags": "NZ",
    "description": "Load A and X with immediate value (undocumented)",
    "undocumented": true
  }
}
```

All 256 entries. Official + undocumented. Source: 6502 reference + Qdrant training data.

#### `registers.json` -- C64 Hardware Registers

```json
{
  "$D000": {
    "name": "VIC_SPRITE_0_X",
    "chip": "VIC-II",
    "description": "Sprite 0 X position (bits 0-7)",
    "read": true,
    "write": true,
    "bits": "XXXXXXXX"
  }
}
```

Coverage: VIC-II ($D000-$D02E), SID ($D400-$D41C), CIA1 ($DC00-$DC0F), CIA2 ($DD00-$DD0F), processor port ($0000-$0001).

#### `kernal.json` -- KERNAL Entry Points

```json
{
  "$FFD2": {
    "name": "CHROUT",
    "description": "Output a character",
    "input": "A = character to output (PETSCII)",
    "output": "Carry set on error",
    "preserves": "X, Y",
    "clobbers": "A"
  }
}
```

All documented KERNAL entry points with full calling conventions.

---

## LSP Server (`server/`)

Standard Language Server Protocol implementation. Exposes the library's capabilities over LSP.

### Capabilities

| LSP Method | Implementation |
|-----------|----------------|
| `textDocument/definition` | `symbol_table` + `cross_file_resolver` |
| `textDocument/references` | `reference_finder` (scope-aware) |
| `textDocument/hover` | `opcodes.json` + `registers.json` + `kernal.json` + symbol docs |
| `textDocument/completion` | Context-aware (see completion rules below) |
| `textDocument/rename` | `rename_engine` (cross-file, scope-aware) |
| `textDocument/documentSymbol` | `symbol_table` (hierarchical outline) |
| `textDocument/signatureHelp` | Macro/function parameter info |
| `textDocument/formatting` | KickAssembler formatting rules |
| `textDocument/foldingRange` | Brace-delimited blocks + comment blocks |
| `workspace/symbol` | Workspace-wide symbol search |
| `textDocument/callHierarchy` | `call_hierarchy` (JSR/JMP graph) |

### Completion Context Rules

(From paulhocker's analysis, refined)

| Context | Suggestions |
|---------|------------|
| Start of line | Instructions + Macros + PseudoCommands + `*` |
| After instruction (`LDA `) | Variables + Constants + Labels + Namespaces + Functions |
| After `label:` | Instructions + Macros + PseudoCommands |
| `#` prefix | Preprocessor directives |
| `.` prefix | Assembler directives |
| `!` prefix | Multi-labels with +/- directional suffixes |
| `symbol.` (dot access) | Child symbols in namespace |
| Inside `#import "..."` | Filesystem file paths |
| After `$`, `#$`, `#%` | Nothing (numeric literal entry) |

---

## Consumers

### VS Code Extension (kickassembler-vscode)

Imports the LSP library and wraps it with VS Code-specific features:
- Extension host activation and LSP client wiring
- TextMate grammar for syntax highlighting
- Snippets
- Diagnostics via KickAssembler (`java -jar KickAss.jar -asminfo`)
- Debug Adapter (DAP) for VICE integration
- Serena MCP adapter

The extension adds the **UX layer** on top of the LSP's **intelligence layer**.

See: [plans/kickassembler-lsp-extension.md](kickassembler-lsp-extension.md)

### Disassembler MCP (c64-disasm-mcp)

Connects to the LSP server as a client to navigate generated KickAssembler output:
- **During `/disasm-emit`**: Validate generated symbol structure, check for scope issues
- **During `/disasm-refine`**: Use rename engine for cross-file symbol renaming
- **During `/disasm-verify`**: Use find-references to check xref consistency
- **During `/disasm-document`**: Use call hierarchy for tracing subroutine relationships
- **General**: Symbol lookup, outline, navigation on the generated output project

Connection: The disassembler MCP launches the LSP server as a subprocess and communicates via stdio LSP protocol. This keeps the Python MCP and TypeScript LSP cleanly separated.

See: [plans/ai-disassembler-mcp.md](ai-disassembler-mcp.md)

---

## Implementation Phases

### Phase 1: Parser + Symbol Table (1.5-2 weeks)

Core parsing and symbol tracking. After this, go-to-definition and find-references work on single files.

- `lexer.ts` -- KickAssembler tokeniser
- `parser.ts` -- Line parser with directive dispatch
- `symbol_table.ts` -- Symbol definitions with types
- `scope_tracker.ts` -- Brace-delimited scope chain
- Unit tests for parser and scope tracking

### Phase 2: Cross-File + LSP Server (1-1.5 weeks)

Multi-file support and LSP protocol. After this, the LSP server can be connected to by any client.

- `cross_file_resolver.ts` -- #import resolution, file dependency graph
- `exports_map.ts` -- Global symbol visibility
- `reference_finder.ts` -- Scope-aware find all references
- `lsp_server.ts` -- LSP protocol handler (definition, references, hover, completion, symbols)
- `capabilities.ts` -- Capability declaration

### Phase 3: Data Files + Advanced Analysis (1 week)

Rich data and analysis features.

- `opcodes.json` -- All 256 opcodes
- `directives.json` -- All KickAssembler directives
- `registers.json` -- C64 hardware registers
- `kernal.json` -- KERNAL entry points with calling conventions
- `zeropage.json` -- System zero page variables
- `call_hierarchy.ts` -- JSR/JMP call graph
- `rename_engine.ts` -- Cross-file rename

### Phase 4: Scripting Awareness (2-3 weeks)

Handle KickAssembler's scripting features for better symbol coverage.

- `.for` loop detection and static unrolling for symbol tracking
- `.var`/`.eval` tracking through simple assignments
- `.function` definitions (name, parameters, return)
- `.pseudocommand` definitions
- `.struct` member tracking
- `.enum` inline syntax parsing

---

## What This Plan Does NOT Cover

These belong in the other plans:

- **VS Code extension specifics** (TextMate grammar, snippets, debug adapter, Serena) → [kickassembler-lsp-extension.md](kickassembler-lsp-extension.md)
- **Disassembly pipeline** (static analysis, AI naming, KickAssembler output) → [ai-disassembler-mcp.md](ai-disassembler-mcp.md)
- **C64 hardware documentation / Qdrant training** → CLAUDE.md / training process

---

## References

- [LSP Specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)
- [ca65-vscode-extension](https://github.com/hobbett/ca65-vscode-extension) -- Architecture reference (TypeScript LSP for 6502)
- [KickAssembler Manual](http://www.theweb.dk/KickAssembler/webhelp/content/index.html)
- Appendices in [kickassembler-lsp-extension.md](kickassembler-lsp-extension.md) for detailed analysis of existing extensions
