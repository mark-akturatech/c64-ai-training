# NMOS 6510 — ISC (ISB / INS) Undocumented Opcode Table

**Summary:** ISC (also known as ISB or INS) is an undocumented opcode in the 6510/6502 microprocessors. This instruction increments the value at a specified memory location and then subtracts it from the accumulator, effectively combining the operations of `INC` (increment memory) and `SBC` (subtract with carry). The following table details the opcode bytes, addressing modes, instruction sizes, cycle counts, and flag status effects associated with ISC.

**Opcode Summary**

The table below outlines the opcode byte, mnemonic, addressing mode, instruction size (in bytes), cycle count, and the effects on processor flags (N, V, Z, C) for each variant of the ISC instruction:

| Opcode | Mnemonic | Addressing Mode | Size (Bytes) | Cycles | N | V | Z | C |
|--------|----------|-----------------|--------------|--------|---|---|---|---|
| $E7    | ISC      | Zero Page       | 2            | 5      | o | o | i | o |
| $F7    | ISC      | Zero Page,X     | 2            | 6      | o | o | i | o |
| $E3    | ISC      | (Zero Page,X)   | 2            | 8      | o | o | i | o |
| $F3    | ISC      | (Zero Page),Y   | 2            | 8      | o | o | i | o |
| $EF    | ISC      | Absolute        | 3            | 6      | o | o | i | o |
| $FF    | ISC      | Absolute,X      | 3            | 7      | o | o | i | o |
| $FB    | ISC      | Absolute,Y      | 3            | 7      | o | o | i | o |

**Legend:**

- **N (Negative):** Set if the result is negative; cleared otherwise.
- **V (Overflow):** Set if signed overflow occurs; cleared otherwise.
- **Z (Zero):** Set if the result is zero; cleared otherwise.
- **C (Carry):** Set if a borrow does not occur; cleared if a borrow occurs.

**Flag Status Symbols:**

- **o:** Flag is affected based on the result of the operation.
- **i:** Flag is affected but the exact behavior is undefined or inconsistent.
- **x:** Flag is not affected by the operation.

**Notes:**

- The cycle counts listed are typical; however, certain addressing modes may incur an additional cycle if a page boundary is crossed during address calculation.
- The behavior of the V (Overflow) flag is inconsistent and may vary depending on the specific implementation of the 6510/6502 processor.

**Instruction Semantics**

The ISC instruction performs the following operations:

1. Increments the value at the specified memory address.
2. Subtracts the incremented value from the accumulator (A) using the `SBC` operation, which includes the carry flag in the subtraction.

This can be expressed as:


Where `addr` is the effective address determined by the addressing mode, and `C` is the carry flag before the operation.

**Flag Effects:**

- **N (Negative):** Set if the result in the accumulator is negative; cleared otherwise.
- **V (Overflow):** Set if signed overflow occurs; cleared otherwise.
- **Z (Zero):** Set if the result in the accumulator is zero; cleared otherwise.
- **C (Carry):** Set if no borrow occurs (i.e., if the subtraction does not require borrowing); cleared if a borrow occurs.

**Decimal Mode Behavior:**

When the decimal mode flag (D) is set, the `SBC` operation within ISC performs binary-coded decimal (BCD) subtraction. However, the behavior of the N, V, and Z flags in decimal mode is undefined and may not reflect the correct status of the result. The C flag continues to function as in binary mode, indicating borrow status. Due to these inconsistencies, caution is advised when using ISC in decimal mode.

**Test Results and Flag Outcomes:**

The flag outcomes for ISC are consistent across all addressing modes, with the exception of potential additional cycles for page boundary crossings. The N, Z, and C flags are set or cleared based on the result of the subtraction operation. The V flag's behavior is inconsistent and may vary between different 6510/6502 implementations.

## Source Code

```
Memory[addr] = Memory[addr] + 1
A = A - Memory[addr] - (1 - C)
```


## References

- "NMOS 6510 Unintended Opcodes — No More Secrets" by Groepaz, detailing undocumented opcodes and their behaviors.
- "6502 Instruction Set" by Masswerk.at, providing comprehensive information on both documented and undocumented instructions.
- "CPU Unofficial Opcodes" on NESdev Wiki, discussing the behavior and usage of undocumented 6502 instructions.

## Mnemonics
- ISC
- ISB
- INS
