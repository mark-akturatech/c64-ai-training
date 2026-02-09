# Kick Assembler: .break and .watch (Section 3.12)

**Summary:** Kick Assembler directives .break and .watch add debugger/emulator debug information (VICE symbol file, C64Debugger DebugDump) without changing generated code; supports conditional breakpoint arguments (VICE expressions), macro placement behavior, single-address and range watches, and optional text/format arguments.

## Breakpoint directive (.break)
.break inserts a breakpoint record at the current assembly memory position (no code is generated or modified). The directive may carry an optional string argument; the syntax and semantics of that argument depend on the consumer (emulator/debugger). Example usage in Kick Assembler:

- .break alone: marks the current address for a debugger breakpoint.
- .break "..." : attaches a string argument to the breakpoint (e.g. VICE conditional expression "if y<5"); the consumer decides how to interpret the string.
- When placed before a macro invocation, the breakpoint is associated with the first assembled instruction produced by the macro expansion (see macro example below).

Behavior notes from source:
- Breakpoint records are emitted for debug output targets (VICE symbol file or C64Debugger DebugDump).
- The .break directive does not change runtime code or timing.

## Watch directive (.watch)
.watch defines memory watches (for reads/writes) in the debug output. It takes up to three comma-separated arguments:

- First argument: address expression (required).
- Second argument: optional end address (if present, defines a range from first to second); it may be left empty to skip specifying an end address.
- Third argument: optional text string for additional information or mode (consumer-defined; e.g. "store", "hex8").

Examples in source demonstrate:
- Single-address watch: .watch $d018
- Address expression: .watch xpos+1
- Range watch: .watch $d000,$d00f
- Range with mode: .watch xpos,xpos+10,"store"
- Omitted second argument with third present: .watch count,,"hex8"

Behavior notes from source:
- The meaning of the optional third argument is emulator/debugger-specific — consult the consumer manual for supported strings (e.g. VICE, C64Debugger).
- Watches do not modify assembled code.

## Source Code
```asm
; Example 1: breakpoints and conditional argument
ldy #10
loop:
.break
; This will put a breakpoint on 'inc $d020'
inc $d020
dey
.break "if y<5" ; This will add a string as argument for the breakpoint
bne loop

; Example 2: breakpoint placed before a macro call - will mark first nop inside macro
lda #10
.break
MyMacro()
.macro MyMacro() {
    nop
    nop
    nop
}

; Watch examples
.watch $d018
; Watches $d018

.watch xpos+1
; Watches the address xpos+1

.watch $d000,$d00f
; Watches the range $d000-$d00f

.watch xpos,xpos+10,"store"
; Watches a range with the additional parameter "store"

.watch count,,"hex8"
; Second argument left empty; third argument "hex8"
```

## Key Registers
- $D000-$D02E - VIC-II - video chip registers (VIC-II register block; includes addresses such as $D018 and $D020)
- $D018 - VIC-II - memory control / screen/character memory control (commonly watched)
- $D020 - VIC-II - border/background color (example incremented in sample)

## References
- "prg_files_and_d64_disks_overview" — expands on debug output targets and formats (Appendix/Chapter 11 references)