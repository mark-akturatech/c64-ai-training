# MOVFM / MOV2F / MOVFA / MOVAF / MOVEF / ROUND (floating-point move & rounding helpers)

**Summary:** ROM routines for five-byte floating-point transfers and rounding: MOVFM ($BBA2) loads FAC1 from memory using A (low) and Y (high) as pointer; MOV2F ($BBC7) stores FAC1 to memory at $005C-$0060 or $0057-$005B depending on entry point; MOVFA ($BBFC) copies FAC2→FAC1; MOVAF ($BC0C) rounds FAC1 and moves to FAC2; MOVEF ($BC0F) copies FAC1→FAC2 without rounding; ROUND ($BC1B) adjusts the rounding byte at $0070 and may increment FAC1.

## Description
- MOVFM (48034 / $BBA2)
  - Loads the five‑byte floating point value pointed to by the 16‑bit address formed by the Accumulator (low byte) and the Y register (high byte) into FAC1.

- MOV2F (48071 / $BBC7)
  - Stores FAC1 to memory. The routine writes five bytes to one of two zero‑page buffers depending on entry point:
    - bytes 92–96 (decimal) / $005C–$0060
    - or bytes 87–91 (decimal) / $0057–$005B

- MOVFA (48124 / $BBFC)
  - Copies the five bytes of FAC2 into FAC1 (FAC2 → FAC1).

- MOVAF (48140 / $BC0C)
  - Rounds FAC1 as required and moves the result into FAC2 (FAC1 → FAC2 with rounding).

- MOVEF (48143 / $BC0F)
  - Copies FAC1 into FAC2 without performing rounding (straight copy of five bytes).

- ROUND (48155 / $BC1B)
  - Adjusts the rounding byte stored at zero‑page location 112 (decimal) / $0070. The routine doubles the rounding byte; if the doubled value exceeds 128, FAC1 is incremented by 1. (Effect: the rounding byte controls whether a unit should be added to FAC1 when rounding threshold is crossed.)

Notes:
- All operations refer to five‑byte floating‑point accumulators (FAC1, FAC2) used by the ROM floating‑point package.
- MOV2F supports two destination buffers depending on how the routine is entered (caller selects which buffer by branching to the appropriate entry offset).

## Source Code
```text
ROM routine addresses (decimal / hex) and names:
48034   $BBA2   MOVFM   - Move five-byte FP from memory into FAC1 (A=low, Y=high pointer)
48071   $BBC7   MOV2F   - Move FAC1 to memory (to $005C-$0060 or $0057-$005B depending on entry)
48124   $BBFC   MOVFA   - Move FAC2 to FAC1
48140   $BC0C   MOVAF   - Round and move FAC1 to FAC2
48143   $BC0F   MOVEF   - Copy FAC1 to FAC2 without rounding
48155   $BC1B   ROUND   - Adjust rounding byte at $0070; may increment FAC1

Zero-page addresses (decimal → hex) referenced by the routines:
87  - $0057
88  - $0058
89  - $0059
90  - $005A
91  - $005B

92  - $005C
93  - $005D
94  - $005E
95  - $005F
96  - $0060

112 - $0070  (rounding byte used by ROUND)
```

## Key Registers
- $0057-$005B - Zero Page - FAC1 store buffer (bytes 87–91 decimal)
- $005C-$0060 - Zero Page - FAC1 store buffer (bytes 92–96 decimal)
- $0070 - Zero Page - Rounding byte (used by ROUND routine)

## References
- "qint_and_int_integer_conversion" — routines that convert between floating point and integer formats (relies on these move/round helpers)
- "fin_string_to_fp_finlog_and_constants" — MOVFM/MOV2F usage during FIN/FOUT string conversion and related constants

## Labels
- MOVFM
- MOV2F
- MOVFA
- MOVAF
- MOVEF
- ROUND
