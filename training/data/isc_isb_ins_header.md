# ISC (ISB, INS) — NMOS 6510 header

**Summary:** ISC (also called ISB or INS) is an undocumented 6510 instruction that combines incrementing a memory location and subtracting its new value from the accumulator. The operation can be described as:

1. Increment the value at the effective address.
2. Subtract the incremented value from the accumulator, considering the carry flag and decimal mode.

**ISC (ISB, INS)**
Type: Undocumented instruction combining INC and SBC operations.

Mnemonic aliases: ISC, ISB, INS

Function (high-level): {addr} = {addr} + 1; A = A - {addr} - (1 - C)

Notes:
- This instruction is undocumented and not officially supported by MOS Technology.
- The operation first increments the memory location, then performs a subtraction with borrow (SBC) using the incremented value.
- The instruction affects the Negative (N), Zero (Z), Carry (C), and Overflow (V) flags based on the result of the SBC operation.
- Decimal mode (BCD) affects the subtraction phase; refer to the SBC instruction for details on decimal mode behavior.

## Source Code
```text
Opcode Table for ISC (ISB, INS):

Addressing Mode | Mnemonic | Opcode | Bytes | Cycles
-----------------------------------------------------
(Indirect,X)    | ISC      | $E3    | 2     | 8
Zero Page       | ISC      | $E7    | 2     | 5
Absolute        | ISC      | $EF    | 3     | 6
(Indirect),Y    | ISC      | $F3    | 2     | 8
Zero Page,X     | ISC      | $F7    | 2     | 6
Absolute,Y      | ISC      | $FB    | 3     | 7
Absolute,X      | ISC      | $FF    | 3     | 7
```

## Key Registers
- **Accumulator (A):** Updated with the result of the subtraction.
- **Processor Status Register (P):** Flags affected:
  - **Negative (N):** Set if the result is negative; cleared otherwise.
  - **Zero (Z):** Set if the result is zero; cleared otherwise.
  - **Carry (C):** Set if no borrow occurred; cleared if a borrow was needed.
  - **Overflow (V):** Set if signed overflow occurred; cleared otherwise.

## References
- "sbc_instruction_decimal_mode_overview" — expands on SBC decimal-mode behavior
- "SBC" — subtraction instruction; details flag effects and decimal-mode operation

## Mnemonics
- ISC
- ISB
- INS
