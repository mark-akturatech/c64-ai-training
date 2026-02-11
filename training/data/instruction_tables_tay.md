# TAY — Transfer Accumulator to Index Y (opcode $A8)

**Summary:** TAY is a 6502 implied instruction that copies A -> Y and updates the N and Z flags. Opcode $A8, 1 byte, 2 cycles; affects flags N and Z only (C I D V unchanged).

## Operation
Transfers the current accumulator value into the Y index register (Y := A). After the transfer:
- Z is set if Y == 0
- N is set from bit 7 of Y (sign bit)
- C, I, D, V are unaffected

(Addressing mode: Implied. Reference: 7.13)

## Source Code
```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Implied       |   TAY                 |    A8   |    1    |    2     |
+----------------+-----------------------+---------+---------+----------+
Flags (reported): N Z C I D V
                    / / _ _ _ _
```

```asm
; Example usage (assembly)
        LDA #$80    ; load accumulator
        TAY         ; transfer A -> Y (Y = $80), sets N=1, Z=0
        LDA #$00
        TAY         ; Y = $00, sets Z=1, N=0
```

Pseudocode:
```text
Y := A
P.Z := (Y == 0)
P.N := (Y & 0x80) != 0
```

## References
- "instruction_operation_tay" — expands on TAY pseudocode

## Mnemonics
- TAY
