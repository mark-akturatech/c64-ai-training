# MOVE A SCREEN LINE (KERNAL $E9C8)

**Summary:** KERNAL routine at $E9C8 copies one 40-character screen line down, moving both screen RAM and the matching colour RAM bytes using zero-page indirect pointers ($AC/$AE source, $D1/$F3 destination). It first prepares the colour pointer by calling $E9E0 (synchronise_colour_transfer) and sets the high-byte screen page via ORA $0288 (HIBASE).

## Description
This routine moves a single 40-character screen line (character-by-character) and simultaneously moves the corresponding colour bytes.

Steps:
- A (accumulator) is masked with AND #$03 to keep only the lower 2 bits (page select), then ORA $0288 (HIBASE) to form the high byte of the screen scroll pointer; the result is stored in zero-page $AD (>SAL).
- JSR $E9E0 synchronises the colour transfer (prepares/adjusts temporary colour RAM pointer — see referenced routine).
- Y is loaded with #$27 (decimal 39). The code uses indexed indirect addressing with Y to copy 40 bytes (indices 39 down to 0).
- Loop body:
  - LDA ($AC),Y — read a screen character from the source screen pointer at zero page $AC/$AD.
  - STA ($D1),Y — store the character to the destination screen pointer at $D1/$D2.
  - LDA ($AE),Y — read the matching colour byte from the source colour pointer at $AE/$AF.
  - STA ($F3),Y — store the colour byte to the destination colour pointer at $F3/$F4.
  - DEY and BPL loop until Y underflows past -1 (40 iterations).
- RTS returns to caller.

Notes:
- Uses zero-page indirect,Y addressing: ($AC),Y and ($AE),Y are source pointers; ($D1),Y and ($F3),Y are destination pointers.
- Y = #$27 copies 40 bytes because indices 39..0 inclusive are processed.

## Source Code
```asm
.,E9C8 29 03    AND #$03
.,E9CA 0D 88 02 ORA $0288       HIBASE, top of screen page
.,E9CD 85 AD    STA $AD         store >SAL, screen scroll pointer
.,E9CF 20 E0 E9 JSR $E9E0       synchronise colour transfer
.,E9D2 A0 27    LDY #$27        offset for character on screen line
.,E9D4 B1 AC    LDA ($AC),Y     move screen character
.,E9D6 91 D1    STA ($D1),Y
.,E9D8 B1 AE    LDA ($AE),Y     move character colour
.,E9DA 91 F3    STA ($F3),Y
.,E9DC 88       DEY             next character
.,E9DD 10 F5    BPL $E9D4       till all 40 are done
.,E9DF 60       RTS
```

## Key Registers
- $00AC - Zero Page - source screen RAM pointer (low byte) for indirect,Y reads
- $00AD - Zero Page - stored high byte of screen scroll pointer (>SAL)
- $00AE - Zero Page - source colour RAM pointer (low byte) for indirect,Y reads
- $00D1 - Zero Page - destination screen RAM pointer (low byte) for indirect,Y writes
- $00F3 - Zero Page - destination colour RAM pointer (low byte) for indirect,Y writes
- $0288 - RAM - HIBASE (top-of-screen page), ORA'd into accumulator to form high-byte

## References
- "synchronise_colour_transfer" — prepares the temporary colour RAM pointer before moving a line
- "synchronise_colour_pointer" — explains the colour pointer mechanism used to map screen addresses to colour RAM addresses

## Labels
- MOVE_A_SCREEN_LINE
