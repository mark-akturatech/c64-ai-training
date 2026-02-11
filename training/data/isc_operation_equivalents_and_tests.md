# NMOS 6510 ISC / ISB / INS (undocumented) — Increment memory then SBC

**Summary:** ISC (also called ISB/INS) increments a memory location then performs SBC with that memory; it affects N/V/Z/C like SBC and inherits SBC's decimal-mode behavior. Example opcode shown: E7 (zeropage).

## Operation and behaviour
ISC (ISB/INS) performs two steps: it increases the specified memory operand by one (INC), then subtracts that memory from the accumulator using SBC (subtract with borrow). The instruction chain sets the processor status flags the same way SBC does.

- Operation: Increase memory by one, then perform A - M - (1 - C) (SBC semantics).
- Flags: SBC (and therefore ISC) sets N, V, Z, and C as expected for SBC.
- Carry dependency: The current C (carry) bit affects the SBC portion (borrow semantics).
- Decimal mode: ISC inherits SBC's dependence on the decimal flag (D). For detailed behaviour in decimal mode, consult the decimal-mode notes for SBC / unintended decimal mode: ISC (ISB, INS).

Notes:
- ISC is an undocumented opcode on NMOS 6510 (Commodore 64 family).
- Equivalent visible instruction sequence: INC <mem> followed by SBC <mem>.
- The instruction is commonly used as a compact substitute for INC+SBC sequences in position where the undocumented opcode is acceptable.

## Source Code
```asm
; Example usage (zeropage)
        ISC $FF        ; opcode bytes: E7 FF

; Equivalent instruction sequence
        INC $FF
        SBC $FF

; Test files (from sources referenced)
; Lorenz-2.15/insa.prg
; Lorenz-2.15/insax.prg
; Lorenz-2.15/insay.prg
; Lorenz-2.15/insix.prg
; Lorenz-2.15/insiy.prg
; Lorenz-2.15/insz.prg
; Lorenz-2.15/inszx.prg
; 64doc/dincsbc.prg
```

## References
- "isc_opcode_variants_and_addressing_modes" — opcode hex bytes and addressing modes for ISC
- "isc_examples_and_usage_patterns" — expanded code examples and usage patterns for ISC

## Mnemonics
- ISC
- ISB
- INS
