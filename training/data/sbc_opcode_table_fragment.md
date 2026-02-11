# NMOS 6510 — SBC (USBC) Indexed Absolute Variants ($F9 / $FD)

**Summary:** The NMOS 6510 microprocessor supports the `SBC` (Subtract with Carry) instruction with indexed absolute addressing modes:

- Opcode `$F9`: `SBC` absolute,Y
- Opcode `$FD`: `SBC` absolute,X

Both instructions are 3 bytes in size and typically execute in 4 cycles, with an additional cycle if a page boundary is crossed. They affect the Negative (N), Overflow (V), Zero (Z), and Carry (C) flags. The Decimal (D) flag influences operation when set, but is not modified by the instruction.

**Opcode Details**

- **Addressing Modes:**
  - `$F9`: Absolute,Y
  - `$FD`: Absolute,X
- **Size:** 3 bytes
- **Cycles:** 4 cycles (+1 if page boundary is crossed)
- **Flags Affected:**
  - **N (Negative):** Set if the result's most significant bit is 1.
  - **V (Overflow):** Set if signed overflow occurs.
  - **Z (Zero):** Set if the result is zero.
  - **C (Carry):** Set if a borrow does not occur; cleared if a borrow occurs.
  - **D (Decimal):** Not affected by the instruction but alters operation when set.
  - **B (Break) and **I (Interrupt Disable):** Not affected.

**Note:** In NMOS 6502/6510 processors, when the Decimal (D) flag is set, `SBC` performs binary-coded decimal (BCD) subtraction. However, the N, V, and Z flags are set based on the binary result before decimal correction, leading to potentially unexpected flag states. Only the C flag is updated correctly in decimal mode. ([nesdev.org](https://www.nesdev.org/wiki/Visual6502wiki/6502DecimalMode?utm_source=openai))

## Source Code

```text
Opcode  Mnemonic    Addressing    Size  Cycles      Flags Affected (N V - B D I Z C)
$F9     SBC         absolute,Y    3     4 (+1)      N V - B D I Z C
$FD     SBC         absolute,X    3     4 (+1)      N V - B D I Z C
```

**Note:** The above table reflects standard NMOS 6502/6510 behavior. The original source fragment contained ambiguous flag representations, which have been clarified here.

## References

- "adc_opcode_table_and_decimal_flags" — related coverage of ADC/SBC flag behavior and decimal-mode effects

## Mnemonics
- SBC
