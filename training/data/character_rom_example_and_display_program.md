# Character ROM: '@' glyph example and BASIC viewer (reads $D000 character ROM)

**Summary:** Example showing character ROM byte values (60,102,110,110,96,98,60,0) broken into 8-bit patterns to form the '@' glyph and a BASIC program that temporarily switches memory via POKE 1 to PEEK the character generator ROM at $D000 and display the 8×8 bitmap and numeric byte values for any character number (0–511). Searchable terms: $D000, $0001, $D020, $D021, $DC0D, character ROM, BASIC viewer.

**Character ROM byte → pixel mapping**
The chunk shows the eight byte values for the '@' glyph and demonstrates how each byte's bits map to the eight horizontal pixels of an 8×8 character cell. Each byte represents one row; bit values (128..1) indicate which pixels in that row are lit.

The example bytes (decimal): 60, 102, 110, 110, 96, 98, 60, 0 correspond to the rows of the glyph. The BASIC program below reads the character ROM (at $D000) and prints both a visual 8×8 representation and the numeric byte value for each row.

**[Note: Source may contain an error — the printed breakdown lists the second row total as 101 while the binary 01100110 equals 102; the correct decimal for 01100110 is 102.]**

**How the provided BASIC program works (summary)**
- DIM and build bit masks T%(0..7) = 2^I.
- Change screen/border/background color with POKE 53281 and POKE 53280 (decimal), i.e. POKE $D021 and POKE $D020.
- Use POKE 1 (address $0001) with different values (51 / 55) to change memory configuration so the character ROM is visible for PEEK reads.
- Use POKE 56333 (decimal) — $DC0D (CIA1 Interrupt Control Register) — around the ROM read (the program writes 127 then later 129). This is to disable and then re-enable interrupts during the ROM access to prevent potential timing issues. ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))
- Read character byte rows with PEEK(53248 + C*8 + I) where 53248 = $D000 (character ROM base); C is character number (0–511), I is row 0–7.
- Display numeric values and write character pixels into screen memory (POKE to screen addresses).
- Repeats input loop for new character numbers.

Do not modify the program; it uses plain BASIC POKEs/PEEKs to switch visibility and render output.

## Source Code
```text
Byte values for '@' glyph (decimal):
60, 102, 110, 110, 96, 98, 60, 0

Bit breakdown (binary → decimal):
00111100   0 +   0 +  32 +  16 +   8 +   4 +   0 +   0 =  60
01100110   0 +  64 +  32 +   0 +   0 +   4 +   2 +   0 = 102
01101110   0 +  64 +  32 +   0 +   8 +   4 +   2 +   0 = 110
01101110   0 +  64 +  32 +   0 +   8 +   4 +   2 +   0 = 110
01100000   0 +  64 +  32 +   0 +   0 +   0 +   0 +   0 =  96
01100010   0 +  64 +  32 +   0 +   0 +   0 +   2 +   0 =  98
00111100   0 +   0 +  32 +  16 +   8 +   4 +   0 +   0 =  60
00000000   0 +   0 +   0 +   0 +   0 +   0 +   0 +   0 =   0
```

```basic
10 DIM B%(7),T%(7):FOR I=0 TO 7:T%(I)=2^I:NEXT
20 POKE 53281,2:PRINT CHR$(147):POKE 53281,1:POKE 53280,0:POKE 646,11
30 POKE 214,20:PRINT:INPUT" CHARACTER NUMBER (0-511)";C$
40 C=VAL(C$):GOSUB 80:FOR I=0 TO 7
50 POKE 214,6+I:PRINT:PRINT TAB(23);B%(I);CHR$(20);"   "
60 FOR J=7 TO 0 STEP-1:POKE 1319+(7-J)+I*40,32-128*((B%(I)ANDT%(J))=T%(J))
70 NEXT J,I:POKE 214,20:PRINT:PRINT TAB(27)"    ":GOTO 30
80 POKE 56333,127:POKE 1,51:FOR I=0 TO 7
90 B%(I)=PEEK(53248+C*8+I):NEXT:POKE 1,55:POKE 56333,129:RETURN
```

## Key Registers
- $0001 - CPU port (memory configuration / bank switching) — used with POKE 1,51 and POKE 1,55 to change ROM/RAM visibility.
- $D000-$DFFF - Character Generator ROM (4 KB, 512 characters × 8 bytes) — read via PEEK(53248 + char*8 + row).
- $D020 - VIC-II border color register (decimal 53280) — the program POKEs 53280.
- $D021 - VIC-II background color register (decimal 53281) — the program POKEs 53281.
- $DC0D - CIA1 Interrupt Control Register (decimal 56333) — the program POKEs 56333 (decimal) before/after ROM access to disable and re-enable interrupts.

## References
- "character_generator_rom_overview_and_bit_values" — expands on context for the displayed byte-to-pixel mapping and bit-value table
- "sample_bank3_switch_program" — machine-language sample that copies character ROM to RAM