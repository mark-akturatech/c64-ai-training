# BASIC: Copy character ROM to RAM and create multicolor programmable characters (page119.prg)

**Summary:** BASIC program that copies character ROM bytes (peek 53248 / $D000) to RAM at 12288 ($3000), sets the VIC-II character pointer ($D018) to $3000, enables multicolor text mode via $D016 (poke 53270 OR 16), sets VIC-II background color registers ($D020..$D023), defines custom multicolor character bit patterns for characters 60–63, displays them, then restores normal character pointer and mode.

## Description
This program demonstrates making multicolor programmable characters on the C64 by copying the built-in character ROM into RAM, pointing the VIC-II at the RAM copy, enabling multicolor, writing new character bitmaps for specific character codes, and finally restoring the original settings.

Key steps performed by the program:
- Temporarily change system port and CIA register flags (POKE 1 and POKE 56334) to allow the required memory/IO changes (the program toggles these before/after copying).
- Copy characters 0–63 from the character ROM area accessed via PEEK(53248 + offset) into RAM at address 12288 ($3000). Each character is 8 bytes (8 rows).
  - Copy loop: for i = 0 to 63, for j = 0 to 7, POKE 12288 + i*8 + j, PEEK(53248 + i*8 + j)
- Set the VIC-II character pointer ($D018 / decimal 53272) to point at 12288 by clearing the nibble used for the pointer and adding 12: POKE 53272,(PEEK(53272) AND 240) + 12. (Lower 4 bits select the character-generator block; value 12 → base 12*1024 = 12288.)
- Enable multicolor text mode by setting bit 4 of $D016 (decimal 53270): POKE 53270, PEEK(53270) OR 16. Later this bit is cleared with AND 239.
- Set background colors (multicolor character mode uses three background colors in addition to the per-character color):
  - POKE 53281,0 (background color 0 = black)
  - POKE 53282,2 (background color 1 = red)
  - POKE 53283,7 (background color 2 = yellow)
  - (These are VIC-II background color registers starting at $D021; $D020 is border color.)
- Program new multicolor bit patterns for characters 60..63 by POKEing 8 bytes per character into the RAM-based character generator at 12288 + (8 * char) + byte; the data are provided by DATA statements.
- Display the newly defined characters with CHR$() on the screen.
- Wait for a key press, then restore the character pointer (POKE 53272,21) and clear the multicolor bit (POKE 53270, PEEK(53270) AND 239), returning to normal character mode.

Notes on mode/control bits (as used by the program, reflected exactly in the code):
- Enabling multicolor text mode: POKE 53270, PEEK(53270) OR 16 (sets bit 4 of $D016).
- Disabling multicolor text mode: POKE 53270, PEEK(53270) AND 239 (clears bit 4).
- Character generator base is selected by the low nibble of $D018 (53272); the program sets that nibble to 12 to select address 12288.

## Source Code
```basic
10 rem * example 2 *
20 rem creating multi color programmable characters
31 poke 56334,peek(56334)and254:poke1,peek(1)and251
35 fori=0to63:rem character range to be copied from rom
36 forj=0to7:rem copy all 8 bytes per character
37 poke 12288+i*8+j,peek(53248+i*8+j):rem copy a byte
38 next j,i:rem goto next byte or character
39 poke 1,peek(1)or4:poke 56334,peek(56334)or1:rem turn on i/o and kb
40 poke 53272,(peek(53272)and240)+12:rem set char pointer to mem. 12288
50 poke 53270,peek(53270)or16
51 poke 53281,0:rem set background color #0 to black
52 poke 53282,2:rem set background color #1 to red
53 poke 53283,7:rem set background color #2 to yellow
60 for char=60to63:rem program characters 60 thru 63
80 for byte=0to7:rem do all 8 bytes of a character
100 read number:rem read 1/8th of the character data
120 poke 12288+(8*char)+byte,number:rem store the data in memory
140 next byte,char
150 print"{clear}"tab(255)chr$(60)chr$(61)tab(55)chr$(62)chr$(63)
160 rem line 150 puts the newly defined characters on the screen
170 get a$:rem wait for user to press a key
180 if a$=""then170:rem if no keys were pressed, try again
190 poke53272,21:poke53270,peek(53270)and239:rem return to normal chars
200 data129,37,21,29,93,85,85,85: rem data for character 60
210 data66,72,84,116,117,85,85,85: rem data for character 61
220 data87,87,85,21,8,8,40,0: rem data for character 62
230 data213,213,85,84,32,32,40,0: rem data for character 63
240 end
```

## Key Registers
- $D000-$D02E - VIC-II - VIC register block (program reads from $D000 area for character ROM peek and uses control registers in this block)
- $D016 ($D000 + $16 / decimal 53270) - VIC-II - control register (bit 4 used by this program to enable/disable multicolor text mode)
- $D018 ($D000 + $18 / decimal 53272) - VIC-II - character pointer / memory pointers (low nibble set to 12 to point to 12288)
- $D020-$D023 - VIC-II - border and background color registers (background colors set at $D021..$D023 by the program)
- $DC00-$DC0F - CIA1 - used by the program (POKE 56334 / decimal 56334 is $DC0E)
- $0001 - Processor port/system port - the program POKEs address 1 to change I/O/keyboard bank bits

## References
- "copy_characters_from_ROM_to_RAM_example_program" — expands on copying characters into RAM from ROM
- "multi_color_mode_bit_pairs_and_color_registers" — expands on multicolor bit pairing and the VIC-II color registers