# Subroutine: accept numeric keys, echo, convert ASCII to binary ($033C-$0351)

**Summary:** Machine-language subroutine at $033C-$0351 that loops waiting for a key, filters for ASCII digits ($30-$39), echoes the digit (JSR $FFD2), converts ASCII to a 4-bit binary value with AND #$0F, and returns to the caller with RTS. Uses KERNAL/JOS calls at $FFE1, $FFE4 and $FFD2 and branches on the zero flag (BEQ) and carry (BCS) / carry clear (BCC).

## Description
This routine accepts a single numeric keypress (ASCII '0'..'9'), echoes it to the screen, converts the ASCII code to its binary digit value, and returns to the caller. Flow and semantics:

- JSR $FFE1 — call a KERNAL routine; the following BEQ checks the zero flag returned by that call and will exit the subroutine immediately if Z=1 (BEQ $0351). This allows an early return condition determined by the called routine.
- JSR $FFE4 — call another KERNAL routine that prepares/returns a character (result is tested next).
- CMP #$30 / BCC $033C — compare the returned character with ASCII '0' (0x30). If less than '0' (unsigned), branch back to the start to wait for another key.
- CMP #$3A / BCS $033C — compare with ASCII ':' (0x3A). If greater-than-or-equal to ':' (i.e., >= 0x3A), branch back to the start; this effectively accepts only characters in the range $30..$39 (ASCII digits '0'..'9').
- JSR $FFD2 — call KERNAL character-output routine to echo the accepted digit to the display.
- AND #$0F — convert ASCII digit (0x30..0x39) to its 4-bit binary value 0..9 by masking the low nibble.
- RTS — return to the caller (BASIC or another ML routine). The digit's binary value is left in the accumulator upon return.

Flags and registers:
- Accumulator (A) holds the ASCII character returned by the JSR $FFE4 call and then holds the converted binary digit after AND #$0F.
- Zero flag (Z) is checked immediately after JSR $FFE1 (BEQ $0351) for an early exit condition.
- Branches use unsigned comparisons (BCC / BCS) to confine accepted range to $30..$39.

This subroutine is reusable: RTS returns control to whatever called it (BASIC or another ML routine). It can be composed into larger programs (e.g., calculators) that rely on digit input and immediate echoing.

## Source Code
```asm
      .A 033C  JSR $FFE1
      .A 033F  BEQ $0351
      .A 0341  JSR $FFE4
      .A 0344  CMP #$30
      .A 0346  BCC $033C
      .A 0348  CMP #$3A
      .A 034A  BCS $033C
      .A 034C  JSR $FFD2
      .A 034F  AND #$0F
      .A 0351  RTS
```

## References
- "addition_program_using_subroutine" — expands on reuse of this subroutine to build a small calculator example
