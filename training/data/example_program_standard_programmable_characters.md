# BASIC example: copy 64 characters from ROM to RAM and define programmable characters (page114.prg)

**Summary:** Demonstrates copying 64 character patterns (8 bytes each) from the character ROM window (peek at $D000+) into RAM at $3000, temporarily disabling keyboard and I/O via CIA/processor-port pokes, setting the VIC-II character pointer ($D018) to $3000, programming characters with DATA/POKE, printing them with chr$, and restoring defaults.

## Description
This BASIC program performs these steps:
- Temporarily disable keyboard scanning and I/O to safely manipulate character memory (POKE 56334 and POKE 1).
- Copy characters 0–63 from the ROM image accessible through the VIC window (PEEK starting at 53248 / $D000) into RAM starting at decimal 12288 ($3000). Each character is 8 bytes.
- Re-enable keyboard and I/O.
- Set the VIC-II character pointer so the VIC reads character bitmaps from $3000 (via POKE 53272 / $D018).
- Provide DATA statements for four custom characters (60–63) and POKE those bytes into the RAM area at $3000+(8*char)+byte.
- Clear the screen and print the new characters using CHR$(60)–CHR$(63); wait for a key.
- Restore the VIC character pointer to the normal default (POKE 53272,21).

Notes:
- The program uses POKE 1 to change the CPU port memory configuration (enable/disable I/O). (CPU port is zero page address $0001.)
- The program manipulates the VIC-II character pointer at $D018 (decimal 53272) using arithmetic on the register value to preserve high bits.
- Character ROM is read via the VIC window starting at $D000 (decimal 53248) with PEEK; these reads pull the ROM bitmap bytes for copying.

## Source Code
```basic
10 rem * example 1 *
20 rem creating programmable characters
31 poke 56334,peek(56334)and254: rem turn off kb
32 poke 1,peek(1)and251: rem turn off i/o
35 for i=0to63: rem character range to be copied
36 for j=0to7: rem copy all 8 bytes per character
37 poke 12288+I*8+j,peek(53248+i*8+j): rem copy a byte
38 next j:next i: rem goto next byte or character
39 poke 1,peek(1)or4:poke 56334,peek(56334)or1: rem turn on i/O and kb
40 poke 53272,(peek(53272)and240)+12: rem set char pointer to mem. 12288
60 for char=60to63: rem program characters 60 thru 63
80 for byte=0to7: rem do all 8 bytes of a character
100 read number: rem read in 1/8th of character data
120 poke 12288+(8*char)+byte,number: rem store the data in memory
140 next byte:next char: rem also could be next byte, char
150 print chr$(147)tab(255)chr$(60);
155 print chr$(61)tab(55)chr$(62)chr$(63)
160 rem line 150 puts the newly defined characters on the screen
170 get a$: rem wait for user to press a key
180 if a$=""then goto170: rem if no keys were pressed, try again!
190 poke 53272,21: rem return to normal characters
200 data 4,6,7,5,7,7,3,3: rem data for character 60
210 data 32,96,224,160,224,224,192,192: rem data for character 61
220 data 7,7,7,31,31,95,143,127: rem data for character 62
230 data 224,224,224,248,248,248,240,224: rem data for character 63
240 end
```

## Key Registers
- $0001 - CPU port - memory configuration (zero page port; used to disable/enable I/O)
- $D000-$D02E - VIC-II - VIC register window and character ROM read area (PEEK from $D000 used to read ROM bitmaps)
- $D018 ($D018 / decimal 53272) - VIC-II - character pointer / memory-bank select (sets character base to $3000 in this program)
- $DC00-$DC0F - CIA 1 - keyboard / interrupt and I/O control registers (POKE 56334 / $DC0E used to disable/enable keyboard)

## References
- "copy_characters_from_ROM_to_RAM_example_program" — expands on copy routine and interrupt handling
- "creating_character_patterns_and_worksheet" — expands on DATA-driven character programming