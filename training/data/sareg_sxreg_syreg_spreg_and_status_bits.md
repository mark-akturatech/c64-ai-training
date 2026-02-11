# Storage areas for .A/.X/.Y/.P (780-$30C .. 783-$30F)

**Summary:** Defines memory locations $030C-$030F (decimal 780–783) used as storage areas for .A, .X, .Y and .P registers; documents the 6502 status (.P) flag bit assignments (Negative, Overflow, unused, BREAK, Decimal, Interrupt Disable, Zero, Carry) and shows example BASIC POKE values (POKE 783,0 and POKE 783,251) with a warning about the Interrupt Disable (I) flag / SEI effect.

## Description
Four consecutive system memory locations are used as storage areas for the CPU registers when invoking machine-code routines (SYS calls):

- $030C (decimal 780) — SAREG — Storage area for .A (Accumulator)
- $030D (decimal 781) — SXREG — Storage area for .X index register
- $030E (decimal 782) — SYREG — Storage area for .Y index register
- $030F (decimal 783) — SPREG — Storage area for .P (Processor Status) register

The Status (.P) register bit assignments (bit values shown in decimal) are:

- Bit 7 = 128 -> Negative (N)
- Bit 6 = 64  -> Overflow (V)
- Bit 5 = 32  -> Not used (unused)
- Bit 4 = 16  -> BREAK (B)
- Bit 3 = 8   -> Decimal (D)
- Bit 2 = 4   -> Interrupt Disable (I)
- Bit 1 = 2   -> Zero (Z)
- Bit 0 = 1   -> Carry (C)

Notes and cautions:
- Clearing all flags is done by POKE 783,0 (sets SPREG = 0). That clears the Interrupt Disable flag as well; clearing I can make the system ignore IRQs that service the keyboard and other devices.
- A 1 in the Interrupt Disable bit corresponds to the effect of executing SEI (Set Interrupt Disable) — IRQs are disabled while I=1.
- The source gives POKE 783,247 as an example to "set all flags except Interrupt disable", but that value does not match the described bit mapping. 247 decimal does not equal the sum of all bit values except 4. The correct value to set all bits except Interrupt Disable (bit value 4) is 251 (128+64+32+16+8+2+1 = 251). **[Note: Source may contain an error — POKE 783,247 appears incorrect; use POKE 783,251 to set all flags except I.]**

Practical BASIC examples (use with care):
- POKE 783,0     ; clear all status flags (including Interrupt Disable)
- POKE 783,251   ; set all flags except Interrupt Disable (preserve IRQs disabled = 0)

## Source Code
```text
Register list (decimal / hex / name)
780    $30C    SAREG    Storage Area for .A Register (Accumulator)
781    $30D    SXREG    Storage Area for .X Index Register
782    $30E    SYREG    Storage Area for .Y Index Register
783    $30F    SPREG    Storage Area for .P (Status) Register
```

```text
Status (.P) bit assignments:
Bit 7 (128) = Negative (N)
Bit 6 (64)  = Overflow (V)
Bit 5 (32)  = Not Used
Bit 4 (16)  = BREAK (B)
Bit 3 (8)   = Decimal (D)
Bit 2 (4)   = Interrupt Disable (I)
Bit 1 (2)   = Zero (Z)
Bit 0 (1)   = Carry (C)
```

```basic
10 REM examples - use with caution
20 POKE 783,0        : REM clear all flags (includes Interrupt Disable)
30 REM To set all flags except Interrupt Disable:
40 POKE 783,251      : REM 128+64+32+16+8+2+1 = 251
```

## Key Registers
- $030C-$030F - Memory - Storage areas for CPU registers: .A (SAREG), .X (SXREG), .Y (SYREG), .P (SPREG)

## References
- "register_storage_area_for_sys_and_usr" — Examples of using these storage locations before SYS calls

## Labels
- SAREG
- SXREG
- SYREG
- SPREG
