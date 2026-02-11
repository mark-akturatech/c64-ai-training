# SBC — Subtract Memory from Accumulator with Borrow (6502)

**Summary:** SBC performs A - M - (1 - C) → A on the 6502; affects flags N, Z, C, V. Common opcodes: $E9, $E5, $F5, $ED, $FD, $F9, $E1, $F1. Decimal mode (D flag) alters SBC behavior to perform BCD subtraction.

**Operation**
Per instruction: A - M - (1 - C) → A.  
Flags affected: N (negative), Z (zero), C (carry = borrow indicator), V (overflow).

Note: On the 6502, C is used as the borrow bit (C = 1 means no borrow; C = 0 means borrow occurred). Decimal mode (D = 1) changes the arithmetic to BCD subtraction; see pseudocode below for exact behavior and flag semantics.

**Addressing Modes and Opcodes**
The instruction supports immediate, zero page, zero page,X, absolute, absolute,X, absolute,Y, (indirect,X), and (indirect),Y addressing modes. Cycle counts for absolute,X and absolute,Y add 1 cycle if a page boundary is crossed.

## Source Code
```text
SBC — Subtract memory from accumulator with borrow
Operation:  A - M - (1 - C) → A                            N Z C V
Note: C = Borrow

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate      |   SBC #Oper           |    E9   |    2    |    2     |
| Zero Page      |   SBC Oper            |    E5   |    2    |    3     |
| Zero Page,X    |   SBC Oper,X          |    F5   |    2    |    4     |
| Absolute       |   SBC Oper            |    ED   |    3    |    4     |
| Absolute,X     |   SBC Oper,X          |    FD   |    3    |    4*    |
| Absolute,Y     |   SBC Oper,Y          |    F9   |    3    |    4*    |
| (Indirect,X)   |   SBC (Oper,X)        |    E1   |    2    |    6     |
| (Indirect),Y   |   SBC (Oper),Y        |    F1   |    2    |    5     |
+----------------+-----------------------+---------+---------+----------+

* Add 1 when page boundary is crossed.
```

**Pseudocode and BCD Handling**
The SBC instruction performs subtraction of the memory operand and the complement of the carry flag from the accumulator. The operation varies depending on the state of the decimal mode flag (D):

**Binary Mode (D = 0):**

**Decimal Mode (D = 1):**
In decimal mode, the subtraction is adjusted to account for BCD representation, applying corrections when necessary to ensure valid BCD results. ([stackoverflow.com](https://stackoverflow.com/questions/29193303/6502-emulation-proper-way-to-implement-adc-and-sbc?utm_source=openai))

**Examples**

**Binary Mode (D = 0):**

1. **No Borrow:**

2. **With Borrow:**

**Decimal Mode (D = 1):**

1. **No Borrow:**

2. **With Borrow:**
In these examples, the carry flag indicates whether a borrow occurred (C = 0) or not (C = 1). The zero flag (Z) is set if the result is zero, and the negative flag (N) reflects the sign of the result. The overflow flag (V) is set if the signed result is invalid. ([stackoverflow.com](https://stackoverflow.com/questions/29193303/6502-emulation-proper-way-to-implement-adc-and-sbc?utm_source=openai))

## Source Code

```
temp = A - M - (1 - C)
C = (temp >= 0) ? 1 : 0
V = ((A ^ temp) & (A ^ M) & 0x80) ? 1 : 0
N = (temp & 0x80) ? 1 : 0
Z = (temp & 0xFF) == 0 ? 1 : 0
A = temp & 0xFF
```

```
temp = A - M - (1 - C)
if ((A & 0x0F) - (M & 0x0F) - (1 - C) < 0)
    temp -= 6
if (temp < 0)
    temp -= 0x60
C = (temp >= 0) ? 1 : 0
V = ((A ^ temp) & (A ^ M) & 0x80) ? 1 : 0
N = (temp & 0x80) ? 1 : 0
Z = (temp & 0xFF) == 0 ? 1 : 0
A = temp & 0xFF
```

   ```
   A = $50, M = $20, C = 1
   SBC M
   Result: A = $30, C = 1, Z = 0, N = 0, V = 0
   ```

   ```
   A = $20, M = $30, C = 1
   SBC M
   Result: A = $F0, C = 0, Z = 0, N = 1, V = 0
   ```

   ```
   A = $25, M = $13, C = 1
   SED
   SBC M
   Result: A = $12, C = 1, Z = 0, N = 0, V = 0
   ```

   ```
   A = $12, M = $25, C = 1
   SED
   SBC M
   Result: A = $87, C = 0, Z = 0, N = 1, V = 0
   ```


## References
- "6502 Emulation Proper Way to Implement ADC and SBC" — Stack Overflow discussion on ADC and SBC implementation details. ([stackoverflow.com](https://stackoverflow.com/questions/29193303/6502-emulation-proper-way-to-implement-adc-and-sbc?utm_source=openai))

## Mnemonics
- SBC
