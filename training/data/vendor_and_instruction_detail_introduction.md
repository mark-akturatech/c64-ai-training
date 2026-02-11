# 6502 ADC & AND Instructions

**Summary:** This document details the 6502 microprocessor's ADC (Add with Carry) and AND (bitwise AND) instructions, including their operations, affected flags, addressing modes, and opcode tables.

**ADC (Add with Carry)**

**Operation:** A ← A + M + C

**Flags Affected:**
- **Negative (N):** Set if bit 7 of the result is set; cleared otherwise.
- **Zero (Z):** Set if the result is zero; cleared otherwise.
- **Carry (C):** Set if the addition results in a carry out of bit 7; cleared otherwise.
- **Overflow (V):** Set if the addition results in a signed overflow; cleared otherwise.

**Addressing Modes:**
- **Immediate (#value):** Adds an immediate value to the accumulator.
- **Zero Page ($LL):** Adds the value from a zero-page address.
- **Zero Page,X ($LL,X):** Adds the value from a zero-page address offset by X.
- **Absolute ($HHLL):** Adds the value from a specified address.
- **Absolute,X ($HHLL,X):** Adds the value from an address offset by X; may incur an additional cycle if a page boundary is crossed.
- **Absolute,Y ($HHLL,Y):** Adds the value from an address offset by Y; may incur an additional cycle if a page boundary is crossed.
- **(Indirect,X) (($LL,X)):** Adds the value from the address obtained by adding X to a zero-page address.
- **(Indirect),Y (($LL),Y):** Adds the value from the address obtained from a zero-page address, offset by Y; may incur an additional cycle if a page boundary is crossed.

**Decimal Mode:**
When the Decimal flag (D) is set, ADC performs Binary Coded Decimal (BCD) addition. In this mode, each nibble (4 bits) is treated as a decimal digit (0–9). The addition is performed in binary, and then the result is adjusted to conform to BCD representation.

**Semantics Notes:**
- **Page Boundary Crossings:** For Absolute,X, Absolute,Y, and (Indirect),Y addressing modes, if the effective address calculation crosses a 256-byte page boundary, the instruction requires an additional cycle.
- **Carry Flag Usage:** The Carry flag (C) acts as a ninth bit in addition operations, allowing for multi-byte arithmetic.

**Timing Example:**
Consider the instruction `ADC $1234,X` with X = $10. If $1234 + $10 results in $1244 (no page boundary crossed), the instruction takes 4 cycles. If X = $F0, then $1234 + $F0 results in $1324 (page boundary crossed), and the instruction takes 5 cycles.

**AND (Bitwise AND)**

**Operation:** A ← A & M

**Flags Affected:**
- **Negative (N):** Set if bit 7 of the result is set; cleared otherwise.
- **Zero (Z):** Set if the result is zero; cleared otherwise.

**Addressing Modes:**
- **Immediate (#value):** Performs a bitwise AND between the accumulator and an immediate value.
- **Zero Page ($LL):** Performs a bitwise AND between the accumulator and the value at a zero-page address.
- **Zero Page,X ($LL,X):** Performs a bitwise AND between the accumulator and the value at a zero-page address offset by X.
- **Absolute ($HHLL):** Performs a bitwise AND between the accumulator and the value at a specified address.
- **Absolute,X ($HHLL,X):** Performs a bitwise AND between the accumulator and the value at an address offset by X; may incur an additional cycle if a page boundary is crossed.
- **Absolute,Y ($HHLL,Y):** Performs a bitwise AND between the accumulator and the value at an address offset by Y; may incur an additional cycle if a page boundary is crossed.
- **(Indirect,X) (($LL,X)):** Performs a bitwise AND between the accumulator and the value at the address obtained by adding X to a zero-page address.
- **(Indirect),Y (($LL),Y):** Performs a bitwise AND between the accumulator and the value at the address obtained from a zero-page address, offset by Y; may incur an additional cycle if a page boundary is crossed.

**Semantics Notes:**
- **Page Boundary Crossings:** For Absolute,X, Absolute,Y, and (Indirect),Y addressing modes, if the effective address calculation crosses a 256-byte page boundary, the instruction requires an additional cycle.

**Decimal Mode:**
The AND instruction is not affected by the Decimal flag; it always performs binary operations.

## Source Code

```text
ADC Opcode Table (6502)
Addressing Mode    Opcode  Bytes  Cycles  Notes
Immediate (#)      $69     2      2
Zero Page          $65     2      3
Zero Page,X        $75     2      4
Absolute           $6D     3      4
Absolute,X         $7D     3      4 (+1 if page crossed)
Absolute,Y         $79     3      4 (+1 if page crossed)
(Indirect,X)       $61     2      6
(Indirect),Y       $71     2      5 (+1 if page crossed)

AND Opcode Table (6502)
Addressing Mode    Opcode  Bytes  Cycles  Notes
Immediate (#)      $29     2      2
Zero Page          $25     2      3
Zero Page,X        $35     2      4
Absolute           $2D     3      4
Absolute,X         $3D     3      4 (+1 if page crossed)
Absolute,Y         $39     3      4 (+1 if page crossed)
(Indirect,X)       $21     2      6
(Indirect),Y       $31     2      5 (+1 if page crossed)
```

## References

- "adc_and_and_instructions" — expands on ADC and AND opcodes
- "instruction_flag_legends" — details flag legends and cycle penalties

## Mnemonics
- ADC
- AND
