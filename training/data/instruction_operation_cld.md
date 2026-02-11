# CLD — Clear Decimal Flag (6502)

**Summary:** CLD clears the processor status Decimal flag (D, bit 3, mask $08) on the 6502; opcode $D8, implied addressing, 1 byte, 2 cycles. Affects BCD (decimal) behavior of ADC/SBC (decimal mode = BCD arithmetic).

## Description
CLD (Clear Decimal) clears the Decimal flag in the 6502 status register P. When D = 0 the CPU performs binary arithmetic for ADC and SBC; when D = 1 ADC/SBC perform BCD (binary-coded decimal) adjustments. CLD only changes the D bit — no other status flags (N,V,B,I,Z,C) are modified.

- Mnemonic/Assembly: CLD
- Effect on status register: P := P & ~$08 (clear bit 3)
- Addressing mode: Implied
- Size: 1 byte
- Cycles: 2
- Opcode (hex): $D8

Hardware/variant note: some 6502-derived chips have quirks (for example, the NES Ricoh 2A03 ignores decimal mode for ADC/SBC), but CLD still clears the D flag on those variants.

## Source Code
```asm
; CLD - Clear Decimal Flag
; Opcode: $D8, Bytes: 1, Cycles: 2, Addressing: Implied

        .org $1000
        CLD         ; opcode $D8
        .byte $D8

; Pseudocode (from source)
; /* CLD */
;     SET_DECIMAL((0));
; Equivalent:
P = P & ~$08    ; clear Decimal flag (bit 3)
```

```text
; 6502 Processor Status (P) bit layout (for reference)
; Bit7 Bit6 Bit5 Bit4 Bit3 Bit2 Bit1 Bit0
;  N    V   -    B    D    I    Z    C
; Masks: $80 $40 $20 $10 $08 $04 $02 $01
```

## References
- "instruction_tables_cld" — expands on CLD opcode and instruction table entries

## Mnemonics
- CLD
