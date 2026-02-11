# VIC-20 (Unexpanded) — BASIC front end + machine routine to multiply a 16-bit variable by 10

**Summary:** VIC-20 BASIC lines 100–150 call a machine-language routine at $1080 (decimal 4224) that reads a 16-bit value via indirect addressing ($002D),Y, uses ASL/ROL shifts and ADC/CLC to compute value×10, and stores the 16-bit result back. Registers/addresses used: $002D-$002E, $033C-$033F, $1080; mnemonics: LDA/STA, ASL, ROL, ADC, CLC, RTS.

## Description
This exercise provides a BASIC front end that repeatedly INPUTs a numeric value V% and calls a machine-language routine (via SYS) to multiply that value by ten. The machine code is placed at $1080 (hex), which is decimal 4224; change the BASIC SYS line to SYS 4224 before running.

The machine routine (starting at $1080) performs the following steps:
- Uses indirect indexed addressing LDA ($2D),Y to read the two-byte BASIC variable (variable bytes are accessed through the zero-page pointer at $002D/$002E).
- Copies the 16-bit value into $033C-$033D and duplicates it into $033E-$033F as a preserved original.
- Performs two consecutive ASL/ROL pairs to shift the working 16-bit copy left by 2 bits (multiply by 4).
- Adds the duplicate original ($033E:$033F) to the shifted copy using ADC with CLC to produce 5×value (4× + 1×).
- Performs a final ASL/ROL on the 16-bit result to multiply by 2, producing 10×value.
- Stores the resulting 16-bit value back through ($002D),Y into the BASIC variable storage and returns (RTS).

This algorithm implements value×10 as ((value << 2) + value) << 1 i.e. (4×value + 1×value) × 2 = 10×value. The code expects the BASIC variable bytes to be reachable with offsets Y=#2 and Y=#3 from the pointer at $002D (as used by the LDA ($2D),Y addressing in the listing).

Note: To place BASIC variables above the machine code so the code area isn't overwritten, change the BASIC start-of-variables pointer (SOV) appropriately — see the referenced "vic20_exercise_change_sov" entry for details.

## Source Code
```basic
100 V%=0
110 FOR J=1 TO 5
120 INPUT "VALUE";V%
130 SYS 4224
140 PRINT "TIMES TEN =";V%
150 NEXT J
```

```asm
.A 1080  LDY #$02
.A 1082  LDA ($2D),Y
.A 1084  STA $033C
.A 1087  STA $033E
.A 108A  LDY #$03
.A 108C  LDA ($2D),Y
.A 108E  STA $033D
.A 1091  STA $033F
.A 1094  ASL $033D
.A 1097  ROL $033C
.A 109A  ASL $033D
.A 109D  ROL $033C
.A 10A0  CLC
.A 10A1  LDA $033D
.A 10A4  ADC $033F
.A 10A7  STA $033D
.A 10AA  LDA $033C
.A 10AD  ADC $033E
.A 10B0  STA $033C
.A 10B3  ASL $033D
.A 10B6  ROL $033C
.A 10B9  LDY #$02
.A 10BB  LDA $033C
.A 10BE  STA ($2D),Y
.A 10C0  LDY #$03
.A 10C2  LDA $033D
.A 10C5  STA ($2D),Y
.A 10C7  RTS
```

## Key Registers
- $002D-$002E - Zero page - pointer used with indirect indexed addressing ($002D),Y to access the BASIC variable bytes.
- $033C-$033F - RAM - temporary 16-bit working copy ($033C/$033D) and duplicate/original ($033E/$033F).
- $1080 - RAM - suggested start address for the machine-language routine (hex $1080 = decimal 4224).

## References
- "vic20_exercise_change_sov" — how to change the start-of-variables pointer so BASIC variables sit above the machine-code block