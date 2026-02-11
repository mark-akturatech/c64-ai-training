# NMOS 6510 — Undocumented ISC (ISB / INS) absolute,X and absolute,Y ($FF, $FB)

**Summary:** The undocumented ISC (also known as ISB or INS) instruction on the NMOS 6510 combines the effects of the INC (increment memory) and SBC (subtract with borrow) instructions. Specifically, opcodes $FF (ISC abs,X) and $FB (ISC abs,Y) perform the following operations:

1. Increment the memory location by one (equivalent to INC M).
2. Subtract the new memory value from the accumulator with borrow (equivalent to SBC M), where SBC respects the decimal mode if the decimal flag (D) is set.

This sequence effectively performs an increment followed immediately by a subtraction with borrow on the incremented operand. The flags affected are those modified by the SBC instruction, and the SBC step adheres to decimal-mode arithmetic when the decimal flag is set.

**Operation**

The ISC instruction operates as follows:

1. Increment the memory operand by one.
2. Subtract the incremented memory value from the accumulator, considering the current state of the carry flag and the decimal mode flag.

This operation is functionally equivalent to executing an INC instruction followed by an SBC instruction on the same memory location.

**Addressing Modes and Opcodes**

The ISC instruction is available in the following addressing modes:

- **Absolute,X**: Opcode $FF, 3 bytes, 7 cycles.
- **Absolute,Y**: Opcode $FB, 3 bytes, 7 cycles.

Note: The cycle count for the Absolute,X mode is 7 cycles, which includes an additional cycle for page boundary crossing.

**Flags Affected**

The ISC instruction affects the following processor status flags:

- **Negative (N)**: Set if the result of the SBC operation is negative; cleared otherwise.
- **Overflow (V)**: Set if the SBC operation results in a signed overflow; cleared otherwise.
- **Zero (Z)**: Set if the result of the SBC operation is zero; cleared otherwise.
- **Carry (C)**: Set if there is no borrow in the SBC operation; cleared if there is a borrow.

The Decimal (D) flag influences the SBC operation if set, causing the subtraction to be performed in binary-coded decimal (BCD) mode.

**Timing Considerations**

The ISC instruction has a base cycle count of 7 cycles for both Absolute,X and Absolute,Y addressing modes. This cycle count accounts for potential page boundary crossings, which add an extra cycle to the operation.

There are no known differences in the behavior or timing of the ISC instruction between NMOS and CMOS versions of the 6502 processor.

## References

- "NMOS 6510 Unintended Opcodes - No More Secrets v0.99" by Groepaz, December 24, 2024.
- "6502 Instruction Set" by Masswerk.at.

## Mnemonics
- ISC
- ISB
- INS
