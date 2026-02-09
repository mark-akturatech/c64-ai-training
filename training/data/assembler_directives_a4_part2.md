# Kick Assembler — Appendix A.4: Selected Assembler Directives (part 2)

**Summary:** Quick reference for Kick Assembler directives: .import (binary/text/c64/source), .importonce, .label, .lohifill, .macro, .memblock, .modify, .namespace, .pc, .plugin, .print/.printnow; mentions deprecations and behavior (e.g. .import c64 ignores two address bytes). See referenced chunk for related preprocessor/conditional directives.

## Directives (concise descriptions)

- .import (file import variants)
  - .import binary — import raw binary blob.
  - .import c64 — import binary but ignore the two-byte load address at start (use for standard C64 PRG format).
  - .import source — imports another source file (deprecated; use #import instead).
  - .import text — import a text file as data.
  - .importonce — skip importing the current file if it was already imported (deprecated; use #importonce instead).
  - Notes: filenames are given as string arguments to the directive.

- .label
  - Assigns a label to a value or expression (e.g., set a symbolic name to an expression result).

- .lohifill
  - Generates two tables (low and high bytes) for a given expression sequence. The address of each generated table can be referenced by labels produced by the directive.

- .macro
  - Defines an assembler macro with parameters and a body; expanded at assembly time.

- .memblock
  - Declares/starts a new named memory block at the current assembly location (a logical segment).

- .modify
  - Wraps a code block whose output will be post-processed by a modifier (e.g., encryption). Modifier is specified with call-like syntax and a block body.

- .namespace
  - Creates a local namespace scope for symbols.

- .pc
  - Sets the program counter (same as the '*' assignment). Used to relocate the current assembly origin.

- .plugin
  - Instructs the assembler to load a Java plugin by package path.

- .print / .printnow
  - .print prints a message to the console during the last pass.
  - .printnow prints immediately (no example in this chunk).

- Deprecated/mentioned but not expanded in this chunk
  - The header lists additional directives (.encoding, .enum, .error/.errorif, .eval, .file, .filemodify, .filenamespace, .fill/.fillword, .for, .function, .if). Those are referenced here but not detailed in this source; see related preprocessor/conditional directive documentation.

## Source Code
```asm
.import binary "Music.bin"
.import c64
.import c64 "Music.c64"
.import source
.import source "MyLib.asm"
.import text
.import text "scroll.txt"
.importonce
.label color=$d020
.lohifill $100, i*40
.macro BasicUpstart() {...}
.memblock "New block"
.modify Encrypt(27) {...}
.namespace myspace {..}
.pc=$1000
.plugin "plugins.macros.MyMacro"
.print "Hello"
```

## Key Registers
- (none) — this chunk documents assembler directives and contains no CPU or I/O register addresses.

## References
- "preprocessor_directives_a2" — expands on preprocessor directives and conditional compile related to .if / .eval

**[Note: Source explicitly marks .import source and .importonce as deprecated — use #import / #importonce instead.]**