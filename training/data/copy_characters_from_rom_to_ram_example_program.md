# TOK64 page110.prg — Copy 64 characters (512 bytes) from ROM ($D000) to RAM $3000

**Summary:** BASIC program that reserves 512 bytes at $3000, disables the keyboard-scan timer (CIA1 Timer A at $DC0E), switches in the character ROM via the CPU port ($0001 CHAREN bit), copies 512 bytes from character ROM $D000 to RAM $3000, sets the VIC-II character pointer ($D018) to $3000, then restores I/O and re-enables the timer. Searchable terms: $D000, $3000, $0001, $DC0E, $D018, VIC-II, CIA1, CHAREN, POKE 56334.

**Description**
This BASIC listing performs the steps required to put a custom character set into RAM and keep it safe from BASIC:

- Line 5 switches the screen to upper-case mode (PRINT CHR$(142)).
- Line 10 uses POKE 52,48 and POKE 56,48 then CLR to shrink BASIC's available memory so the 512 bytes at $3000 are reserved for the character set (these pokes adjust BASIC's memory pointers).
- Line 20 disables the keyboard-scan timer by clearing bit 0 of CIA1 Control Register A at $DC0E (decimal 56334) to avoid interrupts during the copy.
- Line 30 clears the CHAREN bit in location $0001 (POKE 1,PEEK(1)AND251) to switch in the character ROM at $D000 so it can be read directly. (CHAREN=0 selects ROM; CHAREN=1 selects I/O.)
- Line 40 loops 0..511 to copy 512 bytes from $D000 (decimal 53248) to RAM starting at decimal 12288 ($3000). This moves 64 character bitmaps (8 bytes each).
- Line 45 sets the VIC-II character pointer at $D018 (decimal 53272) to point to the new character data at $3000 by setting bits 1-3 to %110 (decimal 12). This is done with POKE 53272,(PEEK(53272)AND240)OR12. (Bits 1-3 control the character set location in 2K blocks; %110 corresponds to $3000-$37FF.)
- Line 50 restores CHAREN (POKE 1,PEEK(1)OR4) to re-enable I/O.
- Line 60 restarts the CIA1 timer by setting bit 0 at $DC0E (POKE 56334,PEEK(56334)OR1).
- Line 70 ends the program.

## Source Code
```basic
5 PRINT CHR$(142)               :REM switch to upper case
10 POKE 52,48:POKE 56,48:CLR    :REM reserve memory for characters
20 POKE 56334,PEEK(56334)AND254 :REM turn off keyscan interrupt timer
30 POKE 1,PEEK(1)AND251         :REM switch in character ROM
40 FOR I=0 TO 511:POKE I+12288,PEEK(I+53248):NEXT
45 POKE 53272,(PEEK(53272)AND240)OR12 :REM set VIC-II character pointer to $3000
50 POKE 1,PEEK(1)OR4            :REM switch in I/O
60 POKE 56334,PEEK(56334)OR1    :REM restart keyscan interrupt timer
70 END
```

## Key Registers
- $0001 - CPU port - memory configuration (CHAREN bit controls Character ROM vs I/O)
- $DC0E - CIA1 - Control Register A (Timer A control; used here to disable/re-enable keyboard-scan timer)
- $D018 - VIC-II - Character memory pointer (bits 1-3 control character set location in 2K blocks)

## References
- "switching_io_and_interrupts_for_copying_char_rom" — expands on must disable interrupts and switch ROM/I/O while copying
- "standard_character_mode_and_address_formula" — expands on setting the character pointer to RAM via 53272