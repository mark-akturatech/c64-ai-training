# .CPU pseudo variable (ca65)

**Summary:** .CPU returns a bitfield integer identifying the currently enabled CPU and which instruction-set groups (CPU_ISET_*) it fully supports; used in conditional assembly (replacement for .IFPxx) with bitwise tests (e.g. .bitand) to emit CPU-specific mnemonics (LDA, PHX, PH A, etc.).

## Description
Reading the .CPU pseudo variable yields a constant integer whose bits identify which CPU is enabled and which instruction-set groups that CPU fully supports. The integer should be examined using the provided CPU and CPU_ISET_* constants.

CPU type constants:
- CPU_6502
- CPU_65SC02
- CPU_65C02
- CPU_65816
- CPU_SWEET16
- CPU_HUC6280
- CPU_4510
- CPU_45GS02
- CPU_6502DTV
- CPU_M740

Instruction-set group constants (one per CPU instruction set):
- CPU_ISET_6502
- CPU_ISET_65SC02
- CPU_ISET_65C02
- CPU_ISET_65816
- CPU_ISET_SWEET16
- CPU_ISET_HUC6280
- CPU_ISET_4510
- CPU_ISET_45GS02
- CPU_ISET_6502DTV
- CPU_ISET_M740

Usage:
- Use .CPU with bitwise tests (commonly .bitand) in conditional assembly to select instructions appropriate for the current target CPU.
- .CPU is intended as a replacement for older .IFPxx pseudo instructions and supports constructing complex expressions to query CPU capabilities.

Design note (the "dilemma"):
- The original assumption was that newer/higher CPUs fully implement all instructions of older CPUs. In practice this is not always true (e.g., the 65CE02 changed some instructions and added addressing modes), so newer CPUs are not guaranteed to be source-compatible for all older CPU instructions.
- To remain extensible, .CPU and the CPU_ISET_* bits indicate groups of instructions that are completely supported by that CPU — only bits for instruction groups entirely supported are set. This means:
  - A CPU may have some newer instructions but not fully implement all semantics of older instruction groups, so tests must be against CPU_ISET_* groups, not "CPU >= X".
  - Authors must know which CPU introduced which instructions to write correct conditional assembly.
- See also .CAP, which provides a similar selection mechanism but without this compatibility-bit semantics.

## Source Code
```asm
; Example 1: prefer 65816-index-push (PHX/PHY) when available
.if     (.cpu .bitand CPU_ISET_65816)
        phx
        phy
.else
        txa
        pha
        tya
        pha
.endif
```

```asm
; Example 2: pointer-indirect addressing variants differ between groups
.if (.cpu .bitand CPU_ISET_65SC02)
        ; This will be assembled for the W65C02, 65C02, 65SC02, 65816, HUC6820
        lda     (c_sp)
.elseif (.cpu .bitand CPU_ISET_65CE02)
        ; This will be assembled for the 65CE02, 4510, 45GS02
        ldz     #$00
        lda     (c_sp),z
.else
        ldy     #$00
        lda     (c_sp),y
.endif
```

## Key Registers
(omitted — this chunk documents assembler pseudo variables and CPU/ISET constants, not hardware registers)

## References
- ".CAP" — similar CPU-capability mechanism (alternate selection mechanism)
- "asize_pseudo_variable" — register-size pseudo variable (.ASIZE) and related CPU behavior
- "isize_pseudo_variable" — index-size pseudo variable (.ISIZE) and related behavior
- "pseudo_variables_overview" — overview of ca65 pseudo variables and usage