# Kick Assembler: Mnemonics and CPU Sets

**Summary:** Describes assembler mnemonics, multiple instructions-per-line (;), the .cpu directive, supported CPU instruction sets (_6502, _6502NoIllegals, dtv, _65c02) and example use (addresses like $D020/$D021, VIC-II registers).

## Mnemonics
Kick Assembler accepts standard assembly mnemonics in the usual form. Example of single instructions:
- lda #0
- sta $d020
- sta $d021

Multiple commands may appear on a single source line if separated by a semicolon:
- lda #0; sta $d020; sta $d021

The assembler supports multiple opcode sets; the default is _6502 which includes the standard 6502 mnemonics plus the illegal opcodes. To change the instruction set use the .cpu directive (see next section).

## .cpu directive and supported CPU instruction sets
Use the .cpu directive to switch the assembler's opcode set. Example switching to the 65c02 instruction set:
- .cpu _65c02

When you change the CPU set, subsequent mnemonics are assembled according to that CPU's supported opcodes and addressing modes. Some mnemonics (for example, bra) exist in non-standard or extended sets and are not available in the standard 6502 instruction set.

Default:
- Kick Assembler default: _6502 (standard 6502 + illegal opcodes)

Available CPU sets are listed in Table 3.1 (below).

## Source Code
```asm
; Basic mnemonics (traditional form)
lda #0
sta $d020
sta $d021

; Multiple commands on one line (semicolon separated)
lda #0; sta $d020; sta $d021

; Switch CPU set to 65c02
.cpu _65c02
loop:
    inc $20
    bra loop   ; bra is not present in standard 6502 mnemonics
```

```text
Table 3.1. CPU's
Name            Description
_6502NoIllegals The standard 6502 instruction set.
_6502           The standard 6502 instruction + the illegal opcodes.
                This is the default setting for KickAssembler.
dtv             The standard 6502 instruction set + the DTV commands.
_65c02          The 65c02 instruction set.

A complete listing of the CPU instructions and their opcodes can be found in the Quick Reference Appendix.
```

## Key Registers
- $D020-$D021 - VIC-II - border/background color registers (examples used in mnemonics)
- $D000-$D02E - VIC-II - VIC-II register range (base $D000)

## References
- "argument_types_and_addressing_modes" — expands on argument/addressing modes used by mnemonics
- "preprocessor_directives_reference_table" — expands on directives and reference tables
- "Quick Reference Appendix" — complete listing of CPU instructions and opcodes