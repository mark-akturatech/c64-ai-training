# KickAssembler VS Code Extension

## 1. Project Overview

A VS Code extension for KickAssembler - the most popular modern Commodore 64 assembler - with AI integration via MCP.

**This extension wraps the [KickAssembler LSP core library](kickassembler-lsp.md)** with VS Code-specific features: TextMate grammar, snippets, diagnostics, debug adapter, and MCP integration. The core parser, symbol table, scope tracking, and cross-file resolution live in the LSP library (see [plans/kickassembler-lsp.md](kickassembler-lsp.md)).

```
kickassembler-lsp (core library - TypeScript)    <-- See plans/kickassembler-lsp.md
    │
    ├──> THIS PROJECT: kickassembler-vscode (VS Code extension)
    │    Adds: TextMate grammar, snippets, diagnostics, debug adapter, Serena/MCP
    │
    └──> c64-disasm-mcp (Python disassembler MCP - connects as LSP client)
         See: plans/ai-disassembler-mcp.md
```

**No production-ready KickAssembler LSP exists today.** Three existing VS Code extensions (CaptainJiNX, sanmont, paulhocker) were analysed. All three shell out to Java for every operation and lack their own parser.

### What It Will Do

| Capability | Source | Description |
|-----------|--------|-------------|
| **Code Navigation** | LSP core | Go-to-definition, find all references, rename across files |
| **Autocompletion** | LSP core + extension | Context-aware suggestions with VS Code UX |
| **Hover Info** | LSP core | 6502 instructions, KickAssembler directives, C64 hardware registers |
| **Diagnostics** | Extension only | Real-time error reporting via KickAssembler compiler (`-asminfo`) |
| **Scope Awareness** | LSP core | Proper handling of `{}` scoping, namespaces, macros |
| **Scripting Support** | LSP core | Track symbols from `.for` loops, `.function`, `.var`, `.eval`, `.struct`, `.enum` |
| **AI Integration (Serena)** | Extension only | Expose LSP through Serena MCP adapter for standard code navigation tools |
| **AI Integration (Custom MCP)** | Extension only | Composite tools bridging LSP + Qdrant C64 hardware knowledge |
| **Debug Adapter** | Extension only | DAP integration with VICE emulator |

### Why Build This

- **AI gap**: Qdrant gives the AI hardware knowledge (what `$D018` does), but no semantic understanding of code structure (where `$D018` is used, what scope a label belongs to)
- **No alternative**: No production-ready KickAssembler LSP exists
- **Community value**: Large KickAssembler user base; can be published as open-source
- **Composability**: LSP + Qdrant through MCP gives AI a unified view of both code and hardware
- **Shared foundation**: Same LSP powers both VS Code and the AI disassembler MCP

---

## 2. Current Tooling

What we already have in `/home/mark/Development/c64/c64-training`:

- **KickAssembler v5.25** as primary assembler (`java -jar KickAss.jar`)
- **Qdrant** vector DB with 355 semantic chunks from 3.2 MB of C64/6502 documentation
- **OpenAI embeddings** (text-embedding-3-large) for semantic search
- **MCP integration** (sequential-thinking, zen, qdrant)

Qdrant solves the **domain knowledge** problem. The LSP solves the **code navigation** problem. The custom MCP server bridges both.

---

## 3. Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Language** | TypeScript | Same as ca65-extension (proven for LSP), familiar ecosystem |
| **Runtime** | Node.js | Standard for VS Code extensions |
| **Parser** | Hand-rolled regex scanner (Phase 1) | Proven approach (ca65 uses this), fast to build. Migrate to tree-sitter if needed in Phase 2+ |
| **LSP Transport** | VS Code IPC (client-server) | Standard pattern, well-documented |
| **Diagnostics** | Shell to KickAssembler with `-asminfo` | All three existing extensions use this; the invocation pattern is well-documented |
| **Scope Model** | Linked-list scope chain with brace counting | Learned from paulhocker's failed numeric ID approach; inspired by ca65's nested Scope objects |
| **Debug Protocol** | VICE binary monitor (not text) | sanmont used text protocol with fragile regex parsing; binary protocol (VICE 3.5+) is more reliable |
| **MCP Integration** | Serena adapter (quick win) + custom C64-aware MCP server | Standard tools from Serena, composite tools from custom server |

---

## 4. Implementation Plan

### Estimated Savings from Prior Art

Studying the three KickAssembler extensions and the ca65 extension saves approximately **12-13 days**:

| Component | Without prior art | With lessons learned | Saving |
|-----------|------------------|---------------------|--------|
| TextMate grammar | Build from scratch (2-3 days) | Improve existing shared grammar (0.5-1 day) | ~2 days |
| Hover data (opcodes) | Curate instruction database | Use ca65's `6502_mnemonics.json` as reference | ~2 days |
| Hover data (C64 registers) | Research + write all registers | Existing SID + VIC-II data as starting point, add CIA | ~1 day |
| KickAssembler directive data | Research + write all directives | paulhocker's ~40 directive definitions as reference | ~1 day |
| Built-in symbol docs | Research KickAss manual | paulhocker's LoadSid/LoadPicture/List/etc. method docs as reference | ~1 day |
| Diagnostics integration | Figure out KickAss CLI flags | Exact `-asminfo` invocation pattern documented | ~1 day |
| Completion context rules | Trial and error | paulhocker's context detection logic documented | ~2 days |
| Scope tracking | Design from scratch, likely iterate | Learn from paulhocker's two failed attempts + ca65's working model | ~2 days |
| Snippets | Write from scratch | Expand existing 7 + add missing patterns | ~0.5 day |

---

### Phase 1: MVP (2-3 weeks) - 80% of the value

**Prerequisites:** [KickAssembler LSP core library](kickassembler-lsp.md) Phases 1-2 complete (parser, symbols, LSP server).

**Goal:** Working VS Code extension with core navigation and completion, powered by the LSP core library.

**Scope:**
- VS Code extension scaffolding (client activation, LSP client wiring)
- Improve existing TextMate grammar (add missing directives, fix scope names, add repository structure)
- Diagnostics via `java -jar KickAss.jar -asminfo errors -asminfotostdout`
- Completion provider with VS Code UX (context rules from paulhocker, data from LSP core)
- Hover provider with VS Code rendering (instruction/register/directive data from LSP core)
- Expanded snippets (existing 7 + BasicUpstart2, .function, .pseudocommand, raster interrupt, etc.)

**Not in Phase 1:**
- Scripting language evaluation (`.for` loop unrolling, `.function` body evaluation) -- Phase 2 of LSP core
- Debug adapter
- MCP integration

| Task | Estimate | Notes |
|------|----------|-------|
| Project scaffolding + LSP client wiring | 1-2 days | Import LSP core as dependency |
| Improve TextMate grammar | 0.5-1 day | Existing grammar as baseline |
| Diagnostics integration | 0.5-1 day | Exact invocation pattern known |
| Completion provider (VS Code UX) | 2-3 days | Context rules from paulhocker, symbol data from LSP core |
| Hover provider (VS Code rendering) | 1-2 days | Data from LSP core data files |
| Snippets | 0.5 day | Expand existing set |
| Testing and edge cases | 2-3 days | |

**Note:** Parser, symbol table, scope tracking, cross-file resolution, reference finding, and rename are ALL in the LSP core library. This extension only adds VS Code-specific features on top.

---

### Phase 2: Scripting Awareness (2-3 weeks)

**Prerequisites:** [KickAssembler LSP core library](kickassembler-lsp.md) Phase 4 complete (scripting awareness).

**Goal:** Handle KickAssembler's scripting features in the VS Code UX.

- Surface `.for`/`.var`/`.eval` symbols in completion and outline (data from LSP core)
- `.function` and `.pseudocommand` signature help (parameter info from LSP core)
- `.struct` member completion (member data from LSP core)
- `.enum` value completion
- Built-in object method completion (paulhocker's LoadSid/List/Hashtable method docs as reference)

---

### Phase 3: MCP/AI Integration (2-3 weeks total)

**Goal:** Expose the LSP to AI assistants, then build C64-aware composite tools.

#### Phase 3a: Serena Adapter (2-3 days) - Quick Win

Write a thin Python adapter (~100-200 lines) following Serena's [adding new language guide](https://github.com/oraios/serena/blob/main/.serena/memories/adding_new_language_support_guide.md).

**What we get for free (Serena's standard MCP tools):**
- `find_symbol` - locate definitions
- `find_referencing_symbols` - find all usages
- `get_hover_info` - symbol/instruction info
- `get_document_symbols` - outline of a file
- `search_symbols` - workspace-wide search
- Symbol-level editing tools (insert/replace at symbol boundaries)

**Pros:** Minimal work, battle-tested MCP interfaces, works with any MCP client (Claude Code, Claude Desktop, Cursor, etc.), immediate value.

**Cons:** Extra dependency (Serena + Python runtime), tools are generic with no C64 hardware awareness, can't combine LSP + Qdrant in a single call.

This is the same approach that works well for the Angular/Rails codebase.

#### Phase 3b: Custom C64-Aware MCP Server (1-2 weeks) - The Real Power

Build a TypeScript MCP server wrapping our LSP AND Qdrant, exposing composite tools:

| Tool | What it does | Combines |
|------|-------------|----------|
| `explain_address` | "What is $D018 and where is it used?" | Qdrant (hardware docs) + LSP (find references) |
| `trace_routine` | "What does the `init` subroutine do?" - definition + code listing + instruction hover + hardware register explanations | LSP (definition, outline) + Qdrant (register docs) |
| `analyse_memory_usage` | "What lives at $0400-$07FF?" - Screen RAM description + all labels/symbols placed there | LSP (symbols, segments) + Qdrant (memory map) |
| `find_hardware_interaction` | "Show me all SID register writes" - finds all `sta $D4xx` with register context | LSP (find references) + Qdrant (SID register descriptions) |
| `explain_effect` | "How does the raster interrupt work?" - interrupt setup, handler code, VIC-II interactions, timing | LSP (call hierarchy) + Qdrant (VIC-II docs) |

**Why this matters:** Right now Qdrant knows what `$D018` does but not where it's used. LSP knows where `$D018` is referenced but not what it does. The composite server bridges this gap, reducing AI round-trips.

**Recommendation:** Run Serena (3a) and custom MCP (3b) in parallel. Serena provides standard IDE-level tools. Custom MCP provides C64-specific composite intelligence. Both connect to the same underlying LSP server.

---

### Phase 4: Advanced Features (ongoing)

#### Debug Adapter (informed by sanmont's architecture)

- DAP implementation using inline debug adapter pattern (`DebugAdapterInlineImplementation`)
- Target VICE's **binary** monitor protocol (not text) for reliability
- Class decomposition: Launcher / Transport / Protocol / SourceMap / DAP session
- Command queue serialisation with immediate-bypass for interrupt ops (learned from sanmont)
- Two-phase breakpoints: `.vs` file pre-connect + live `break`/`del` post-connect
- Source mapping via KickAssembler `.dbg` XML (`-debugdump` flag)
- Register inspection (hex/decimal/binary + individual flags + timing)
- Watch expressions with pointer dereference and format specifiers
- Alternative: simple mode that just launches VICE with `-moncommands` for users who prefer VICE's own monitor

#### Other Advanced Features

- Expression evaluation for `.fill` preview
- `.modify` block awareness
- Segment visualization
- Memory map overlay (combine LSP symbol data with C64 memory map from Qdrant)

---

## 5. Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|------------|
| KickAssembler scripting is Turing-complete | Can't fully evaluate all symbol-generating code | Phase 1 skips scripting; Phase 2 handles common patterns statically |
| KickAssembler is closed-source Java | Can't inspect parser internals, rely on `-asminfo` output | Our parser is independent; `-asminfo` only used for diagnostics |
| VICE binary protocol may change | Debug adapter breakage | Abstract transport layer; text protocol as fallback |
| Serena API may change | Phase 3a adapter breakage | Thin adapter (~100 lines), easy to update |
| Java/KickAssembler not installed | Diagnostics unavailable | Parser-based navigation works without Java; diagnostics gracefully degrade |

---

## Appendix A: Existing 6502 LSP Landscape

| Project | Type | Status | Notes |
|---------|------|--------|-------|
| [ca65-vscode-extension](https://github.com/hobbett/ca65-vscode-extension) | Full LSP (go-to-def, refs, hover, diagnostics, completion) | Active (Sep 2025) | Best architecture reference |
| [6502_LS](https://github.com/jkeresman01/6502_LS) | LSP server (C++) | "Under heavy restructuring" | Too unstable |
| [mos](https://github.com/datatrash/mos) | Full toolchain + LSP + DAP (Rust) | Dead since 2022 | Abandoned |
| [kickassembler-lsp](https://github.com/Heplaphon/kickassembler-lsp) | Minimal LSP (Go) | Educational project | Too minimal |
| [vscode-language-merlin6502](https://github.com/dfgordon/vscode-language-merlin6502) | Full LSP (Rust) | Active (2026) | Apple II only |

---

## Appendix B: Existing KickAssembler Extensions - Analysis & Lessons Learned

Three existing VS Code extensions for KickAssembler were analysed to understand what approaches have been tried, what works, and what gaps remain.

### Extension Comparison

| Feature | CaptainJiNX kickass-c64 | sanmont kickass-studio | paulhocker 8-Bit Retro Studio |
|---------|------------------------|------------------------|-------------------------------|
| **Installs** | 7,261 | 5,769 | 4,459 |
| **Last Updated** | Aug 2025 | Jun 2021 | Apr 2024 |
| **License** | MIT | MIT | MIT |
| **Language** | JavaScript | TypeScript | TypeScript |
| **LSP Server** | Yes (minimal) | Yes | Yes |
| **Own Parser** | No | No | No |
| **Syntax Highlighting** | TextMate grammar | Same TextMate grammar | Same TextMate grammar |
| **Diagnostics** | Via KickAssembler | Via KickAssembler | Via KickAssembler |
| **Go-to-Definition** | No | Yes (labels + .const only) | No |
| **Find References** | No | Yes (flat string match, no scope awareness) | No |
| **Autocompletion** | 7 static snippets | No | Yes (scope-aware, cross-file) |
| **Hover** | Static dictionary (opcodes + registers) | Same static dictionary | Opcodes + directives + built-ins |
| **Document Outline** | No | No | Yes (hierarchical) |
| **Signature Help** | No | No | Yes (macro/function params) |
| **VICE Debug** | Run only | DAP integration (breakpoints, registers, memory) | Run + debug |

### Critical Finding: All Three Shell Out to KickAssembler

**None have their own parser.** All rely on `java -jar KickAss.jar` with `-asminfo` for structured data.

KickAssembler's `-asminfo` output provides:
- `[files]` - all source files (resolving `#import` chains)
- `[syntax]` - every token classified by type with line/column ranges
- `[errors]` - compilation errors with locations

Token types: `label`, `directive`, `ppdirective`, `symbolreference`, `objfieldreference`, `macroexecution`, `mnemonic`, `pseudoCommandExecution`, `comment`

**Invocation pattern (KickAssembler 5+):**
```
java -cp <kickAssJar> kickass.KickAssembler <file> \
  -noeval \
  -asminfo allSourceSpecific \
  -asminfotostdout \
  -replacefile <originalFile> <tempBufferFile> \
  -nooutput
```

Key flags:
- `-noeval` - parse without evaluating (faster, catches syntax errors)
- `-asminfo allSourceSpecific` - full token classification
- `-replacefile A B` - substitute file A with B (enables unsaved-file diagnostics)
- `-asminfotostdout` - structured output to stdout
- `-nooutput` - don't generate .prg binary

**ASMINFO output format:**
```
[files]
0;/path/to/main.asm
1;/path/to/imported.asm
[syntax]
label;0;10;0;10;14
directive;0;15;0;15;20
[errors]
error;startRow,startCol,endRow,endCol,fileNumber;Error message text
```

### Lesson 1: A Standalone Parser is Essential

The KickAssembler-delegation approach has severe limitations:
- **Performance**: Every keystroke spawns a JVM process. No debouncing in sanmont's extension
- **Blocking**: sanmont uses `spawnSync` which freezes the LSP server during Java execution
- **Availability**: All features break if Java or KickAssembler JAR is missing
- **No incremental updates**: Entire project re-assembled on every change

**Our approach**: Own TypeScript parser for symbols/scopes (fast, always available). KickAssembler as *optional* backend for compilation diagnostics only.

### Lesson 2: The -asminfo Output is Valuable but Underutilised

sanmont only extracts labels and `.const` from `-asminfo`, ignoring macros, functions, pseudocommands. paulhocker does better - extracts all symbol types.

**Our approach**: Use `-asminfo errors` for accurate compiler errors. Don't depend on `-asminfo` for symbol navigation.

### Lesson 3: Scope Awareness is Critical

sanmont's find-references does flat string matching - two labels named `loop:` in different scopes both returned. paulhocker built scope tracking but ended up with two competing implementations (numeric IDs replaced by linked-list chain).

**Our approach**: Start with linked-list scope chain (like ca65-extension's nested `Scope` objects), adapted for brace-delimited scoping.

### Lesson 4: The TextMate Grammar Already Exists

All three share the same TextMate grammar (from Swoffa's Sublime package). Covers:
- All legal (57) and illegal (45) 6502 opcodes
- KickAssembler directives, control flow, definitions, preprocessor
- Built-in functions (31 math, 4 string, 4 file, 6 3D/vector), constants, labels, numbers, comments, strings

**Weaknesses to improve:**
- Flat pattern list with no nested/repository structure
- Non-standard scope names (bare `keyword`, `illegal`)
- Missing newer directives: `.segment`, `.segmentdef`, `.plugin`, `.modify`, `.disk`, `.file`, `.define`
- No operator highlighting, only 12 of ~150+ opcode constants covered

**Our approach**: Existing grammar as starting point, improve it.

### Lesson 5: Hover Data Provides a Foundation

CaptainJiNX: Legal opcodes (56), illegal opcodes (17), SID registers ($D400-$D41C, 29 entries), VIC-II registers ($D000-$D02E, 47 entries), preprocessor directives (9).

paulhocker: 160+ instruction definitions (6502, illegal, DTV, 65C02, 65CE02, 45GS02), ~40 directive descriptions, built-in symbol docs (LoadSid, LoadPicture, List, Hashtable).

**Gaps:** No CIA registers ($DC00-$DDFF), no addressing mode tables in CaptainJiNX, no user-defined symbol hover in any.

**Our approach**: ca65-extension's `6502_mnemonics.json` (richest 6502 reference) as instruction data reference. Supplement with C64-specific register data and KickAssembler built-in docs. Add CIA registers.

### Lesson 6: Build/Debug Integration Patterns

**Build patterns:**
- Startup file convention: look for `startup.*` as project entry point (CaptainJiNX)
- Build annotations: `// @kickass-build "file" : "output.prg"` (CaptainJiNX)
- Entry point detection: files containing `BasicUpstart` are runnable (sanmont)
- Auto-discovery: recursive scan for `.asm` files (sanmont)

**Debug adapter (sanmont) - architecture:**

| Class | Responsibility |
|-------|---------------|
| `ViceLauncher` | Spawns VICE with `-remotemonitor -remotemonitoraddress 127.0.0.1:<port>` |
| `WaitingSocket` | TCP with retry (100 attempts, 500ms), message queuing |
| `ViceInspector` | VICE monitor commands (`g`, `n`, `z`, `ret`, `break`, `registers`, `m`, `bt`) |
| `SourceMap` | Parses KickAssembler `.dbg` XML for address <-> source line mapping |
| `KickAssemblerDebug` | DAP session, wires VS Code events to VICE |
| `ViceInitializer` | Pre-connect breakpoint bootstrap via `.vs` file |

**Key patterns:**
1. **Command queue serialisation**: VICE can't handle concurrent commands. `queuableFunction` serialises all outgoing commands. `immediate: true` bypasses queue for interrupt ops. `dontWaitForResult: true` for fire-and-forget.
2. **Two-phase breakpoints**: Pre-connect via `.vs` file + `-moncommands`. Post-connect via live `break`/`del`. Full-replace per-file when breakpoints change.
3. **KickAssembler `.dbg` XML format** (`-debugdump` flag):
   ```xml
   <C64debugger>
     <Sources>0,/path/to/main.asm\n1,/path/to/include.asm</Sources>
     <Segment><Block>$0801,END,$00,1,1\n$0810,END,$00,5,1</Block></Segment>
     <Labels>0,$0810,myLabel:\n1,$0900,otherLabel:</Labels>
   </C64debugger>
   ```
4. **Watch expression mini-language**: `[*]<address_or_label>[length]:format` - hex, decimal, binary, characters, pointer dereference, address display.
5. **Register inspection** (5 scopes): Hex/Decimal/Binary views of A/X/Y/SP, individual flag bits, timing info (raster line, cycle, stopwatch).
6. **Inline debug adapter**: Runs in-process with extension (`DebugAdapterInlineImplementation`), recommended modern approach.

**What NOT to repeat:**
- Text monitor protocol (use binary instead)
- 100ms debounce on socket data (fragile)
- Linear scan for source mapping (use Map/binary search)
- Declaring unimplemented capabilities
- No error recovery on TCP drop
- Heavy `any` usage
- Deprecated `vscode-debugadapter` library (use `@vscode/debugadapter`)

**paulhocker's simpler alternative**: No DAP - spawns VICE with `.vs` symbols, user debugs in VICE's monitor. Breakpoint sync via VS Code gutter <-> `.break` directives in source.

### Lesson 7: Completion Context Detection Patterns

paulhocker's ~700-line completion provider context rules:

| Context | What to suggest |
|---------|----------------|
| Start of line | Instructions + Macros + PseudoCommands + `*` |
| After instruction (`LDA `) | Variables + Constants + Labels + NamedLabels + Namespaces + Functions |
| After `label:` | Instructions + Macros + PseudoCommands |
| `#` prefix | Preprocessor directives |
| `.` prefix | Assembler directives |
| `!` prefix | Multi-labels with +/- directional suffixes |
| `symbol.` (dot access) | Child symbols in namespace, or object methods |
| Inside string after `#import` | Filesystem file paths |
| After `$`, `#$`, `#%` | Nothing (numeric literal entry) |

### Lesson 8: Snippets are Minimal Across All Extensions

All three share roughly 7 snippets: subroutine, cosine/sine tables, for loop, if, if-else, macro.

**Missing and worth adding:** `.function`, `.pseudocommand`, `.namespace`, `.struct`/`.enum`, `.segment`/`.segmentdef`, C64 init boilerplate, raster interrupt setup, sprite setup, SID sound setup, `BasicUpstart2(main)` template.

---

## Appendix C: ca65-vscode-extension Architecture

### Overview

- **Language:** 100% TypeScript (~5,000 lines)
- **Architecture:** Standard VS Code LSP client-server over IPC
- **Parser:** Hand-rolled regex-based line scanner (not tree-sitter or ANTLR)
- **Runtime:** Node.js

### Key Source Files

| File | Size | Role |
|------|------|------|
| `documentScanner.ts` | 31.7 KB | Core parser - line-by-line regex scanning |
| `completionProvider.ts` | 26.4 KB | Autocompletion + auto-import insertion |
| `symbolTable.ts` | 18.6 KB | Symbol/scope/macro data structures |
| `diagnostics.ts` | 14.6 KB | Shells out to `ca65` + unused symbol detection |
| `symbolResolver.ts` | 12.7 KB | Cross-file symbol resolution with caching |
| `hoverProvider.ts` | 8.8 KB | Symbol/mnemonic/directive hover docs |
| `callHierarchyProvider.ts` | 7.2 KB | Incoming/outgoing call tracking via jsr/jmp |
| `server.ts` | 12.4 KB | LSP server entry, initialization, event wiring |
| `extension.ts` | 7.8 KB | VS Code client, server launch |
| `includesGraph.ts` | 4.6 KB | File dependency DAG (bidirectional) |
| `exportsMap.ts` | 2.8 KB | Global export registry |
| `6502_mnemonics.json` | 30.6 KB | Generic 6502 instruction data (reusable reference) |
| `ca65_directives.json` | 29.2 KB | ca65-specific directive reference (needs KickAssembler equivalent) |

### How the Parser Works

1. `scanDocument()` iterates line by line
2. `parseLine()` splits each line into: label, command, args, comment
3. Directive dispatch via if/else chains on lowercased command
4. `parseQualifiedNames()` extracts symbol references using regex
5. Builds per-file `SymbolTable` objects with scopes, symbols, macros, references
6. `IncludesGraph` tracks file dependencies; `ExportsMap` tracks global exports
7. Caches invalidated per-file URI on document changes

### Symbol Resolution Priority

1. Local scope lookup (current scope, then parent scopes)
2. Include chain lookup (walk IncludesGraph)
3. Import/Export resolution (search ExportsMap)
4. Implicit imports (when enabled, all exports visible everywhere)

### LSP Features Implemented

Go-to-definition, find all references, hover, autocompletion with auto-import, diagnostics, call hierarchy (jsr/jmp), rename (cross-file), document symbols/outline, document highlight, document links (clickable includes), folding ranges, inlay hints, workspace symbols.

---

## Appendix D: ca65 vs KickAssembler Syntax Differences

### Critical Differences (Require Parser Rewrite)

| Feature | ca65 | KickAssembler | Impact |
|---------|------|---------------|--------|
| Comments | `;` | `//` and `/* */` | Lexer-level rewrite. `;` is a statement separator in KickAss |
| Block delimiters | `.endmacro`, `.endif`, `.endscope` | `{ }` curly braces | Fundamentally different AST structure |
| Macros | `.macro Name p1, p2` ... `.endmacro` | `.macro Name(p1, p2) { }` | Different parser logic |
| Scoping | `.proc`/`.scope` with `::` access | `.namespace` with `.` dot access | Different scope resolution |
| Imports | `.import`/`.export` (explicit) | `#import`/`#importonce` (file-level) | Different visibility model |
| Constants | `name = value` | `.const name = value` | Different detection regex |
| Variables | `name .set value` | `.var name = value`, `.eval name = new` | New constructs |
| Conditionals | `.if` ... `.endif` | `.if(expr) { } .else { }` | Brace-delimited |
| Local labels | `@label` | `!label` with `+`/`-` counting | Different navigation logic |
| Equality | `=` / `<>` | `==` / `!=` | Expression parser |
| Preprocessor | None | Separate `#if`/`#define`/`#import` pass | Entirely new layer |

### KickAssembler-Only Features (No ca65 Equivalent)

- **Scripting language**: `.for`, `.while`, `.function`, `.return`, `.eval` with Lists, Hashtables, Vectors, Matrices
- **Pseudocommands**: `.pseudocommand mov src : tar { }` - custom "instructions" that inspect addressing modes
- **`.fill` with expressions**: `.fill 256, 128 + 128*sin(toRadians(i*360/256))` - iterator variable `i`
- **BasicUpstart2**: Built-in BASIC stub generation
- **Disk output**: `.disk [filename="game.d64"]` - direct D64 image creation
- **Java plugins**: `.plugin "plugins.MyPlugin"`
- **`.modify` blocks**: Transform output bytes of a code block
- **Structs with scripting**: `.struct Point { x, y }` with method-like access

### Identical Between Both

- All 6502 mnemonics and addressing modes
- Addressing mode syntax (#$01, $0400,X, ($20),Y, etc.)
- `*` for current program counter
- Number formats: `$hex`, `%binary`, decimal
- Basic data directives: `.byte`, `.word`, `.dword`
- Lo/Hi byte operators: `<expr`, `>expr`

---

## Appendix E: References

### Existing KickAssembler Extensions (Analysed)
- [CaptainJiNX kickass-c64 (GitHub)](https://github.com/CaptainJiNX/vscode-kickass-c64) - MIT, TextMate grammar + diagnostics + hover data + build/run
- [sanmont kickass-studio (GitHub)](https://github.com/sanmont/vscode-kickass-studio) - MIT, go-to-def + find-refs via -asminfo + DAP debug
- [paulhocker 8-Bit Retro Studio (GitLab)](https://gitlab.com/retro-coder/commodore/kick-assembler-vscode-ext) - MIT, completion + outline + signature help + 160 instruction defs

### Other 6502 LSP Projects
- [ca65-vscode-extension (GitHub)](https://github.com/hobbett/ca65-vscode-extension) - Full LSP, best architecture reference
- [6502_LS (GitHub)](https://github.com/jkeresman01/6502_LS) - C++ LSP, under restructuring
- [mos (GitHub)](https://github.com/datatrash/mos) - Rust toolchain + LSP, abandoned 2022
- [vscode-language-merlin6502 (GitHub)](https://github.com/dfgordon/vscode-language-merlin6502) - Full LSP for Apple II

### KickAssembler Documentation
- [KickAssembler Official Manual](http://www.theweb.dk/KickAssembler/webhelp/content/index.html)
- [KickAssembler Labels](http://theweb.dk/KickAssembler/webhelp/content/ch03s04.html)
- [KickAssembler Macros](https://www.theweb.dk/KickAssembler/webhelp/content/ch07s02.html)
- [KickAssembler Pseudocommands](http://theweb.dk/KickAssembler/webhelp/content/ch07s03.html)
- [KickAssembler Preprocessor](http://www.theweb.dk/KickAssembler/webhelp/content/ch08.html)
- [KickAssembler Namespaces](http://www.theweb.dk/KickAssembler/webhelp/content/ch09s02.html)
- [KickAssembler Segments](http://theweb.dk/KickAssembler/webhelp/content/ch10s03.html)
- [KickAssembler Scripting](http://theweb.dk/KickAssembler/webhelp/content/cpt_IntroducingScript.html)
- [KickAssembler Directives Reference](http://theweb.dk/KickAssembler/webhelp/content/apas04.html)

### Serena / MCP Integration
- [Serena (GitHub)](https://github.com/oraios/serena)
- [Serena Adding New Language Guide](https://github.com/oraios/serena/blob/main/.serena/memories/adding_new_language_support_guide.md)
