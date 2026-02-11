# Kick Assembler - Appendix A.4 — Assembler directives (part 3)

**Summary:** Lists Kick Assembler directives and their concise semantics: .import/.importonce (binary/C64/source/text imports), .macro, .pc/.pseudopc, .segment/.segmentdef/.segmentout, .text/.te, .word/.wo, .zp, .var, .while, .pseudocommand, .print/.printnow, .plugin, .namespace, .memblock, .modify, .label, .lohifill, .struct, .return. Includes small syntax examples for searchability.

## Directives
- .import (binary / c64 / source / text)
  - Imports external content into the assembly (binary blobs, C64 PRG, source files, plain text). Use variant to select handling mode.
- .importonce
  - Import a file only once (prevents duplicate includes).
- .label
  - Assign an expression to a label (explicit label assignment).
- .lohifill
  - Fill low/high tables (used for generating LO/HI tables for addresses).
- .macro
  - Define a macro. See plugin/macro interface references for advanced macro plugins.
- .memblock
  - Define a named memory block (for organizing emitted bytes / memory output).
- .modify
  - Apply a modifier (transformer) to a code block.
- .namespace
  - Create a local namespace scope for labels and definitions.
- .pc
  - Set the program counter (assembly origin) to a specific value.
- .plugin
  - Register a Java plugin (see auto_include_file_plugins for AutoIncludeFile usage).
- .print / .printnow
  - .print emits a message (deferred/collected). .printnow prints a message to the console immediately.
- .pseudocommand
  - Define a pseudocommand (user-defined assembler command); syntax example in Source Code.
- .pseudopc
  - Set a program counter for pseudo-ops (lets pseudo-ops assume a different PC than actual output).
- .return
  - Used inside functions to return a value (e.g., .return 27).
- .segment
  - Switch to another segment (named segment).
- .segmentdef
  - Define a segment, optionally with parameters (e.g., start address).
- .segmentout
  - Output bytes of an intermediate segment into the current memory block (select segments to emit).
- .struct
  - Create a user-defined structure (named fields).
- .te
  - Alias for .text (same behavior).
- .text
  - Dump text bytes (ASCII/encoded) into memory.
- .var
  - Define a variable (compile-time value).
- .while
  - Create a while loop (assembler-time repetition).
- .wo
  - Alias for .word.
- .word
  - Output 16-bit words (two-byte values).
- .zp
  - Mark unresolved labels as being in the zero page (affects allocation/resolution).

## Source Code
```asm
; Examples / syntax snippets from Appendix A.4

.printnow "Hello now"        ; print immediately

.pseudocommand mov src:tar { ... }   ; define a pseudocommand with parameters

.pseudopc $2000 { ... }      ; set pseudo-op program counter for enclosed block

.return 27                   ; return value from a function

.segment Data "My Data"      ; switch to segment named Data

.segmentdef Data [start=$1000] ; define segment Data with start address

.segmentout
[segments="DRIVE_CODE"]      ; output intermediate segment DRIVE_CODE to current block

.struct Point {x,y}          ; define structure Point with fields x,y

.te "hello"                  ; alias for .text

.text "hello"                ; dump text bytes to memory

.var x=27                    ; define assembler variable x

.while(i<10) { ... }         ; assembler-time while loop

.wo $1000,$1012              ; alias for .word

.word $1000,$1012            ; emit two 16-bit words

.zp { label: .byte 0 ... }   ; mark label as zeropage (unresolved labels in this block)
```

## References
- "auto_include_file_plugins" — expands on .plugin and AutoIncludeFile usage
- "macro_plugins_interface" — expands on .macro directive and macro plugin interface
