# NMOS 6510 — Using undocumented NOPs (DOP/TOP/etc.) for IRQ acknowledgement and skipping instructions

**Summary:** Undocumented 6502/6510 NOP opcodes exist in single-, two- and three‑byte forms (examples: $1A, $04, $0C) that perform memory reads with the addressing mode of the pseudo‑instruction; these reads can be used to acknowledge hardware (CIA) registers (e.g. $DC0D) or to skip/disable following instructions without changing registers or flags.

## Undocumented NOP behaviour and practical uses
- Many undocumented opcodes on NMOS 6510 act as "NOPs" but use addressing modes (zero page, absolute, absolute,X, etc.). They consume 1–3 bytes and perform a memory read from the addressed location, leaving CPU registers and flags unchanged.
- Because they perform a memory read, they can trigger side effects in memory‑mapped I/O (for example reading a CIA register). On the C64 this can be used to acknowledge or clear interrupt conditions by reading the appropriate CIA register (example below reads $DC0D).
- These NOP variants are useful when you need to:
  - Acknowledge an IRQ via a read without altering A/X/Y or the processor status.
  - Skip the next instruction(s) while preserving flags and registers (preferred over BIT $xx which modifies flags).
  - Temporarily "disable" an instruction by replacing it with a multi‑byte NOP of the same length.
- Caveat: use the exact NOP whose byte length matches the instruction(s) you need to skip. Absolute,X variants may cross page boundaries and change timing/which address is read (see references).

## Source Code
```asm
; Example: acknowledge IRQ by reading CIA ICR ($DC0D)
; Assemble bytes: 0C 0D DC  -> opcode $0C (abs NOP), operand low=0x0D, high=0xDC (address $DC0D)
        .org $0800
ack_irq:
        .byte $0C, $0D, $DC    ; NOP $DC0D  ; performs a read from $DC0D (CIA1 ICR)

; Example: skip next instruction (two-byte skip) using zero-page NOP ($04)
; Replace BIT $zz (2 bytes) with $04 zz which does a read from zero page and leaves flags intact.
entry1:
        LDX #$00
TOP:
        .byte $0C             ; Example using $0C as a multi-byte NOP (3-byte absolute in other contexts)
        LDX #$20              ; this instruction is skipped if a 3-byte NOP is placed instead of BIT

entry2:
common_path:

; Example: disable a one-byte instruction by inserting a one-byte undocumented NOP ($1A or $3A etc.)
entryA:
        SEC
        .byte $04, $00        ; use $04 $00 (zero-page read) instead of BIT $24 $00 -> skips next 2-byte BIT
        CLC                   ; one-byte instruction (if a one-byte NOP is desired, use $1A)
entryB:
common_path:

; Notes: replace the .byte forms with assembler mnemonics if your assembler supports undocumented opcodes.
```

## Key Registers
- $DC00-$DC0F - CIA 1 - CIA register block (reading ICR / interrupt control/status at $DC0D can be used for IRQ acknowledgement)

## References
- "absolute_nops_and_abs_x_variants" — expands on abs,X NOPs, IRQ acknowledgment and page-cross behavior
- "zero_page_nops" — expands on using zero-page and zero-page,X NOPs as one- or two-byte skips depending on instruction size

## Mnemonics
- NOP
- DOP
- TOP
