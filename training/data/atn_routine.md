# KERNAL ATN (arctangent) routine — entry at $E30E

**Summary:** Disassembly of the KERNAL ATN entry that prepares flags/operands, pushes/pops zero-page bytes ($0066, $0061), tests sign/edge conditions, and calls floating-point helper routines ($BB0F, $E043, $B850, $BFB4). References the ATNCON constants table for series-evaluation constants.

## Description
This sequence (entry $E30E) is the KERNAL/BASIC ATN dispatcher that:

- Loads zero-page $66 and pushes it to the stack, then tests the sign bit. If bit7=1 (negative) it jumps to/JSR $BFB4 (edge/exception handler); if positive/zero it continues.
- Loads zero-page $61 and pushes it, compares that byte with #$81 as a threshold. If byte >= $81 it sets A/Y to #$BC/#$B9 and calls $BB0F; otherwise it sets A/Y to #$3E/#$E3 and calls $E043. These JSRs are floating-point helper entry points used to set up or select constants/indices into the ATN table.
- After the helper call it pulls the top of stack (PLA) and re-checks against #$81; if >= #$81 it sets A/Y to #$E0/#$E2 and calls $B850 (another floating-point helper).
- It then pulls the next byte (second PLA) and checks the sign (BPL). If negative it JSRs $BFB4 (same handler as before), otherwise it returns with RTS.

Behavioral notes preserved from code:
- Two zero-page bytes ($0066 and $0061) are pushed in order and later restored with two PLAs.
- Comparisons against #$81 are used twice to select different helper-call paths (addresses passed in A and Y).
- Helper subroutines invoked: $BB0F, $E043, $B850 (floating-point/ATN series evaluation helpers) and $BFB4 (error/edge handler).
- The routine references an ATN constants table (ATNCON) that holds series counters and 5-byte floating-point constants used for series evaluation.

## Source Code
```asm
.,E30E A5 66    LDA $66
.,E310 48       PHA
.,E311 10 03    BPL $E316
.,E313 20 B4 BF JSR $BFB4
.,E316 A5 61    LDA $61
.,E318 48       PHA
.,E319 C9 81    CMP #$81
.,E31B 90 07    BCC $E324
.,E31D A9 BC    LDA #$BC
.,E31F A0 B9    LDY #$B9
.,E321 20 0F BB JSR $BB0F
.,E324 A9 3E    LDA #$3E
.,E326 A0 E3    LDY #$E3
.,E328 20 43 E0 JSR $E043
.,E32B 68       PLA
.,E32C C9 81    CMP #$81
.,E32E 90 07    BCC $E337
.,E330 A9 E0    LDA #$E0
.,E332 A0 E2    LDY #$E2
.,E334 20 50 B8 JSR $B850
.,E337 68       PLA
.,E338 10 03    BPL $E33D
.,E33A 4C B4 BF JMP $BFB4
.,E33D 60       RTS
```

## Key Registers
- $0066 - zero page - first operand pushed (sign tested)
- $0061 - zero page - second operand pushed (compared to #$81 to select helper path)

## References
- "atncon_constants_table" — contains the ATN series counter and 5-byte floating-point constants used by this routine

## Labels
- ATN
