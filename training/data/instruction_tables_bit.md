# 6502: BIT (Test bits in memory with accumulator)

**Summary:** BIT tests bits of a memory operand with the accumulator (A & M), sets Z based on the AND result, and copies memory bits 7 and 6 into the Negative (N) and Overflow (V) flags. Opcodes: $24 (Zero Page), $2C (Absolute); bytes and cycles: 2/3 and 3/4 respectively.

**Operation and flags**
BIT performs a bitwise AND between the accumulator and a memory operand, but does not store the result — it only updates flags:

- Operation: A AND M
- Z (Zero): Set if (A & M) == 0, cleared otherwise.
- N (Negative): Loaded from bit 7 of the memory operand (M7).
- V (Overflow): Loaded from bit 6 of the memory operand (M6).
- C, I, D: Unaffected by BIT.
- The accumulator (A) is not changed.

Behavioral notes:
- Useful to test both the zero result of A & M and to sample the sign (bit 7) and overflow (bit 6) flags from a memory byte in a single instruction.
- Exact flag semantics: N and V are direct copies of memory bits 7 and 6 respectively; Z reflects the AND result only.

## Source Code
```text
Pseudocode:
    temp = A & M
    Z = (temp == 0)
    N = (M >> 7) & 1    ; copy memory bit 7 to N
    V = (M >> 6) & 1    ; copy memory bit 6 to V

Opcode table:
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
|  Zero Page     |   BIT Oper            |    $24  |    2    |    3     |
|  Absolute      |   BIT Oper            |    $2C  |    3    |    4     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "instruction_operation_bit" — expands on BIT pseudocode and behavior

## Mnemonics
- BIT
