# NMOS 6510 Decimal (BCD) Mode — Concise Summary

**Summary:** BCD/decimal mode encodes each decimal digit in one 4-bit nibble (packed BCD); it affects ADC and SBC (all addressing-mode variants). The NMOS 6510 performs a binary ALU operation, computes overflow from the binary result, then applies nibble-based decimal correction (add/subtract 0x06/0x60) and sets C, N, Z from the corrected result while V is computed from the binary (pre-adjust) result.

**BCD encoding**
- Packed BCD: one decimal digit per 4-bit nibble. A register/byte 0x45 represents decimal 45 (tens=4 in high nibble, ones=5 in low nibble). Valid digit range per nibble: 0..9 (0x0..0x9).

**Instructions affected**
- Decimal mode only changes behavior of:
  - ADC (Add with Carry) — all addressing modes (immediate, zeropage, absolute, indexed, (indirect,X), (indirect),Y, etc.)
  - SBC (Subtract with Carry) — all addressing modes
- Decimal flag (D) is set with SED and cleared with CLD. If D=0, ADC/SBC operate as binary.

**ALU treatment and BCD fixup rules**

General model used by NMOS 6502 (performed internally as a binary operation, then corrected for decimal):

ADC (A + M + C) in Decimal mode
1. Binary add: temp = A + M + C (0x00 .. 0x1FF).
2. Overflow (V): computed from the binary result (pre-adjust) using two's‑complement overflow rule:
   - V = ((~(A ^ M) & (A ^ temp)) & 0x80) != 0
   (overflow set when A and M have same sign and result has different sign).
3. Low-nibble correction: if ((A & 0x0F) + (M & 0x0F) + C) > 9 then temp += 0x06.
4. High-nibble/carry correction: if temp > 0x99 then temp += 0x60 and set carry; otherwise clear carry.
   - Many descriptions equivalently test temp > 0x99 to decide adding 0x60 and setting C.
5. Result: A = temp & 0xFF.
6. Flags:
   - C: set if decimal-corrected result produced a carry out of the high nibble (temp > 0x99 after initial add), cleared otherwise.
   - Z: set if A == 0 (after correction).
   - N: set from bit 7 of the corrected A.
   - V: as computed in step 2 (from binary result before decimal adjust).

SBC (A − M − (1−C)) in Decimal mode
1. Binary subtract: temp = A - M - (1 - C). (Implementation often as A + ~M + C in two's complement.)
2. Overflow (V): computed from the binary subtraction (pre-adjust) using two's‑complement rule:
   - V = (((A ^ M) & (A ^ temp)) & 0x80) != 0
   (overflow set when A and M have different signs and result's sign differs from A's).
3. Low-nibble borrow correction: if ((A & 0x0F) - (M & 0x0F) - (1 - C)) < 0 then temp -= 0x06.
4. High-nibble/borrow correction: if temp < 0 (i.e., borrow from high nibble), then temp -= 0x60 and clear carry; otherwise set carry.
   - Practically: if after binary subtract (and low-nibble adjust) the result is negative then borrow occurred → C = 0; else C = 1.
5. Result: A = temp & 0xFF.
6. Flags:
   - C: set if no borrow (result >= 0) after decimal correction; cleared if borrow occurred.
   - Z: set if A == 0 (after correction).
   - N: set from bit 7 of the corrected A.
   - V: as computed in step 2 (from binary result before decimal adjust).

Notes on the implementation model
- The processor performs the arithmetic as binary first to determine overflow semantics, then applies decimal corrections to produce the visible packed-BCD result.
- N and Z reflect the post-adjusted (final) accumulator value; V reflects the binary (pre-adjust) overflow condition.
- The low-nibble adjustment (±0x06) fixes individual decimal digits; the high-nibble adjustment (±0x60) handles tens carry/borrow.

**Opcode Table for ADC and SBC Instructions**

The following table lists the opcodes, addressing modes, and cycle counts for the ADC and SBC instructions:

| Instruction | Addressing Mode | Opcode | Bytes | Cycles |
|-------------|-----------------|--------|-------|--------|
| ADC         | Immediate       | $69    | 2     | 2      |
| ADC         | Zero Page       | $65    | 2     | 3      |
| ADC         | Zero Page,X     | $75    | 2     | 4      |
| ADC         | Absolute        | $6D    | 3     | 4      |
| ADC         | Absolute,X      | $7D    | 3     | 4 (+1 if page crossed) |
| ADC         | Absolute,Y      | $79    | 3     | 4 (+1 if page crossed) |
| ADC         | (Indirect,X)    | $61    | 2     | 6      |
| ADC         | (Indirect),Y    | $71    | 2     | 5 (+1 if page crossed) |
| SBC         | Immediate       | $E9    | 2     | 2      |
| SBC         | Zero Page       | $E5    | 2     | 3      |
| SBC         | Zero Page,X     | $F5    | 2     | 4      |
| SBC         | Absolute        | $ED    | 3     | 4      |
| SBC         | Absolute,X      | $FD    | 3     | 4 (+1 if page crossed) |
| SBC         | Absolute,Y      | $F9    | 3     | 4 (+1 if page crossed) |
| SBC         | (Indirect,X)    | $E1    | 2     | 6      |
| SBC         | (Indirect),Y    | $F1    | 2     | 5 (+1 if page crossed) |

*Note: Cycle counts may increase by 1 if a page boundary is crossed during the operation.*

**Timing Diagram for ADC Instruction in Decimal Mode**

The following ASCII timing diagram illustrates the execution of the ADC instruction in decimal mode:

## Mnemonics
- ADC
- SBC
