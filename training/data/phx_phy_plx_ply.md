# Kick Assembler: 65C02 index push/pop instructions (PHX/PHY/PLX/PLY)

**Summary:** 65C02-only stack-index instructions PHX ($DA), PHY ($5A), PLX ($FA), PLY ($7A) — push and pull X/Y registers to/from the hardware stack; supported by Kick Assembler when assembling for 65C02.

## Description
The 65C02 adds four single-byte stack operations that push and pull the X and Y index registers. These are not present on original NMOS 6502 cores.

Behavior:
- PHX ($DA) — Push X: write X to 0x0100 + SP, then decrement SP (stack grows downward). Does not affect processor flags.
- PHY ($5A) — Push Y: write Y to 0x0100 + SP, then decrement SP. Does not affect processor flags.
- PLX ($FA) — Pull X: increment SP, read from 0x0100 + SP into X, and set N and Z flags according to the loaded value.
- PLY ($7A) — Pull Y: increment SP, read from 0x0100 + SP into Y, and set N and Z flags according to the loaded value.

Notes:
- These instructions are single-byte opcodes on the 65C02; assembler must target 65C02 (or compatible) CPU for correct encoding.
- PLX/PLY update the Negative (N) and Zero (Z) flags in the same manner as LDX/LDY; PHX/PHY do not modify flags.
- Stack addressing is the standard 6502 stack page at $0100; SP wraps within $00-$FF as usual for the processor.

## Source Code
```asm
; opcode bytes and short examples (65C02)
; PHX  - push X register (opcode $DA)
PHX        ; opcode $DA
    .byte $DA

; PHY  - push Y register (opcode $5A)
PHY        ; opcode $5A
    .byte $5A

; PLX  - pull X register (opcode $FA)
PLX        ; opcode $FA
    .byte $FA

; PLY  - pull Y register (opcode $7A)
PLY        ; opcode $7A
    .byte $7A

; Example usage
    LDX #$12
    PHX        ; push $12
    LDX #$00
    PLX        ; pulls $12 back into X (sets N/Z accordingly)

    LDY #$34
    PHY        ; push $34
    LDY #$00
    PLY        ; pulls $34 back into Y (sets N/Z accordingly)
```

## References
- "ora_instruction_encodings" — expands on instructions that manipulate accumulator/index registers in code sequences
- "rmb_instructions" — expands on stack usage patterns when manipulating memory bits or handling interrupts

## Mnemonics
- PHX
- PHY
- PLX
- PLY
