# Character ROM, User-Defined Characters, and Multicolor Text (C64)

**Summary:** Explains C64 character ROM layout (8 bytes per 8×8 glyph), bit-value mapping (bits 0..7 = 1,2,4,8,16,32,64,128), example breakdown for the '@' glyph, a BASIC program that displays any ROM character (PEEK from 53248/$D000), VIC-II 16K bank limitations, copying ROM to RAM for user-defined character sets, and multicolor text mode enabled via Bit 4 of $D016 (53270).

## Character ROM layout and byte-to-pixel mapping
Each screen character is an 8×8 bitmap described by eight consecutive bytes (one byte per display row). Within a byte, the eight bits represent the eight horizontal pixels for that row. Bit weights are (bit 0 .. bit 7) = 1, 2, 4, 8, 16, 32, 64, 128 (standard binary weighting). A byte value is the sum of the bit weights for set bits; 0 means a fully blank row.

Interpreting bytes:
- A bit set to 1 produces a dot rendered in the character's foreground/Color RAM color; a 0 bit produces background color.
- For multicolor text mode (see below), bytes are interpreted as 4 pairs of bits per row (each pair selects one of four color sources), so horizontal resolution is halved (4 color-wide "pixels" per row) and each is twice as wide.

Example: the first eight bytes of the ROM character shown correspond to the commercial at-sign (@). Breaking the bytes into binary and summing their bit weights yields the pattern shown in Source Code.

## Displaying a ROM character from BASIC
The included BASIC program reads eight bytes from the character ROM (PEEK 53248 + char_index*8 + row) and renders an on-screen representation of the character plus the numeric values for each byte. The program uses POKE/PEEK to manipulate screen colors and to access the ROM data via the CPU-visible mapping at 53248 ($D000).

(Note: the program accesses hardware registers directly for color/screen control and temporarily writes to system registers to read ROM; it restores values afterward.)

## VIC-II memory映apping and user-defined character sets
- The VIC-II chip can only address a single 16K memory bank at a time for all display data (screen memory, character shape data, sprites). Because of this, character graphics must reside within the 16K block visible to the VIC-II.
- The C64 makes the character ROM visible to the VIC-II by mapping an image of the ROM into VIC-visible addresses $1000-$1FFF and $9000-$9FFF. The ROM image is not present in every possible VIC 16K bank; when the VIC-II's current bank does not include those mapped ROM images, characters must come from RAM (user-defined character set) or from another visible area.
- To use user-defined characters you must:
  - Select an appropriate 16K VIC-II bank (see the memory-bank selection bits referenced in the source).
  - Set the character memory pointer in $D018 (53272) to the 2K area containing your 256×8-byte character set.
  - Provide the 8-byte rows for each character (either by copying ROM data to RAM or generating your own character bytes).

Copying ROM to RAM: the text references a machine-language routine (see the cited sample at $DD00/$DD?? in source cross-reference) to transfer ROM shape data into RAM for the visible VIC bank. Many commercial character editors exist to author custom character sets interactively.

## Multicolor text mode
- Enabled by setting Bit 4 of $D016 (53270). In multicolor text mode:
  - Each byte of shape data is treated as four 2-bit color indices (bit-pairs), so each horizontal character row has four wide color pixels instead of eight single-width pixels.
  - The four color sources for each pair are: Background Color Register #0 (00), Background Color Register #1 (01), Background Color Register #2 (10), and the nybble in Color RAM for that screen cell (11).
  - Because of the reduced horizontal resolution, characters intended for multicolor text typically require a new character set designed for 4-wide pixels (i.e., user-defined characters) to look correct.

## Source Code
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

Binary/decimal breakdown for the example '@' character (first 8 bytes):
```text
Decimal bytes: 60, 102, 110, 110, 96, 98, 60, 0

00111100   0 +   0 +  32 +  16 +   8 +   4 +   0 +   0 =  60
01100110   0 +  64 +  32 +   0 +   0 +   4 +   2 +   0 = 102
01101110   0 +  64 +  32 +   0 +   8 +   4 +   2 +   0 = 110
01101110   0 +  64 +  32 +   0 +   8 +   4 +   2 +   0 = 110
01100000   0 +  64 +  32 +   0 +   0 +   0 +   0 +   0 =  96
01100010   0 +  64 +  32 +   0 +   0 +   0 +   2 +   0 =  98
00111100   0 +   0 +  32 +  16 +   8 +   4 +   0 +   0 =  60
00000000   0 +   0 +   0 +   0 +   0 +   0 +   0 +   0 =   0
```

(Reminder: bit weights per position = 128,64,32,16,8,4,2,1.)

## Key Registers
- $D000-$D02E - VIC-II - video control registers (includes $D016/$D018; Bit 4 of $D016 enables multicolor text; $D018 points to character memory base)
- $DD00-$DD0F - CIA 2 - (source references Bits 0-1 of $DD00 for VIC memory bank selection considerations)

## References
- "vic_memory_blocks_and_considerations_for_graphics" — expands on where to place user-defined characters in VIC-II banks
- "changing_vic_memory_banks_from_basic_and_sample_program" — sample ML/BASIC routines to copy ROM to RAM