# SEC — Set Carry Flag

**Summary:** SEC sets the processor Carry flag (C) to 1. Instruction SEC, opcode $38, implied addressing, 1 byte, 2 cycles; updates only the Carry flag (affects ADC/SBC carry/borrow behavior).

## Description
Operation: 1 -> C. SEC forces the C flag to 1; other status flags (N, Z, I, D, V) are unchanged. Typical use is to prepare for addition/subtraction instructions where the carry/borrow input matters (e.g., ADC/SBC).

Flags after SEC:
- N: unchanged
- Z: unchanged
- C: set (1)
- I: unchanged
- D: unchanged
- V: unchanged

Encoding/Timing:
- Addressing mode: Implied
- Opcode: $38
- Size: 1 byte
- Cycles: 2

**[Note: Source lists opcode as "38" (no $). Interpreted here as hex $38.]**

## Source Code
```text
SEC                        SEC Set carry flag                         SEC

Operation:  1 -> C                                    N Z C I D V
                                                      _ _ 1 _ _ _
                                (Ref: 3.0.1)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   SEC                 |    38   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
```

```asm
; Example encoding (machine code)
        .byte $38   ; SEC
```

## References
- "sbc_subtract_with_borrow" — expands on SBC carry/borrow interaction
- "sed_set_decimal" — expands on SED (decimal flag set)
- "sei_set_interrupt_disable" — expands on SEI (interrupt disable flag set)

## Mnemonics
- SEC
