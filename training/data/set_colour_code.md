# SET COLOUR CODE (KERNAL)

**Summary:** Compares the ASCII code in A against the 16-entry Commodore ASCII colour code table at $E8DA and, on a match, stores the table offset (colour value) into COLOR at $0286 using STX $0286. Uses LDX #$0F and CMP $E8DA,X loop.

**Description**
This KERNAL routine tests the accumulator (A) against a 16-byte ASCII colour code table located at $E8DA. It initializes X to #$0F and iterates downward (X = 15..0). Each iteration performs CMP $E8DA,X; if a match is found the current X (the table offset / colour value) is written to address $0286 with STX and the routine returns. If no match is found after all 16 entries are tested, the routine returns without modifying $0286.

Behavior details:
- Start: X = #$0F (tests all 16 entries).
- Compare: CMP $E8DA,X compares A to table[$E8DA + X].
- On match: BEQ branches to the store instruction; STX $0286 saves the offset (0–15) to COLOR.
- On no match: after X underflows past 0 the BPL fails and RTS returns.
- Because the loop decrements from 15 downwards, if duplicate ASCII codes exist in the table, the highest-index match (largest X) is the one stored.

## Source Code
```asm
                                *** SET COLOUR CODE
                                This routine is called by the output to screen routine.
                                The Commodore ASCII code in (A) is compared with the ASCII
                                colour code table. If a match is found, then the table
                                offset (and hence the colour value) is stored in COLOR.
.,E8CB A2 0F    LDX #$0F        16 values to be tested
.,E8CD DD DA E8 CMP $E8DA,X     compare with colour code table
.,E8D0 F0 04    BEQ $E8D6       found, jump
.,E8D2 CA       DEX             next colour in table
.,E8D3 10 F8    BPL $E8CD       till all 16 are tested
.,E8D5 60       RTS             if not found, return
.,E8D6 8E 86 02 STX $0286       if found, store code in COLOR
.,E8D9 60       RTS
```

```text
; Commodore ASCII Colour Code Table at $E8DA
; Each byte corresponds to a PETSCII code for a specific colour
; Index  Colour       PETSCII Code
; -----  -----------  ------------
; 0      Black        $90
; 1      White        $05
; 2      Red          $1C
; 3      Cyan         $9F
; 4      Purple       $9C
; 5      Green        $1E
; 6      Blue         $1F
; 7      Yellow       $9E
; 8      Orange       $81
; 9      Brown        $95
; 10     Light Red    $96
; 11     Dark Grey    $97
; 12     Medium Grey  $98
; 13     Light Green  $99
; 14     Light Blue   $9A
; 15     Light Grey   $9B
```

## Key Registers
- $0286 - KERNAL variable - COLOR (stores table offset / colour value 0–15)
- $E8DA-$E8E9 - KERNAL ROM - ASCII colour code table (16 bytes compared against A)

## References
- "colour_code_table" — table of 16 Commodore ASCII codes used for comparison

## Labels
- COLOR
- COLOUR_CODE_TABLE
- BLACK
- WHITE
- RED
- CYAN
- PURPLE
- GREEN
- BLUE
- YELLOW
- ORANGE
- BROWN
- LIGHT_RED
- DARK_GRAY
- GRAY
- LIGHT_GREEN
- LIGHT_BLUE
- LIGHT_GRAY
