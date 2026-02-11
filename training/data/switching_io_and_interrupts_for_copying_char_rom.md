# Switching out I/O and switching in the Character ROM (C64)

**Summary:** Procedure for switching out I/O and switching in the character ROM so the CPU can copy/inspect character ROM (addresses $D000-$DFFF), using the CPU port at $0001 and the keyboard/interrupt bit at $DC0E (decimal 56334). Shows the exact POKE/PEEK sequences (BASIC) and warns that interrupts must be disabled because I/O registers are required to service them (VIC-II / CIA interaction).

## Procedure and explanation
The VIC-II and the character ROM share the $D000-$DFFF address window (53248–57343). They do not occupy the same locations simultaneously: the character ROM is banked into that 16K region for the VIC-II when the VIC needs character data; otherwise the region is occupied by I/O control registers. To let the CPU read or copy the character ROM you must:
- Switch the I/O registers out and the character ROM in (via the CPU port at $0001).
- Disable normal interrupts (keyboard scanning and other CIA-driven interrupts) because the I/O registers (CIA/VIC) are needed to service interrupts. If an interrupt fires while I/O is switched out, the interrupt handling will fail and unpredictable behavior will occur.
- Perform the ROM copy/inspection.
- Restore I/O and re-enable interrupts.

The text-provided BASIC POKEs perform these steps: disable keyboard/interrupt scanning, switch in the character ROM, then later restore I/O and re-enable keyboard scanning. The character ROM area is $D000-$DFFF while it's banked in.

Cautions:
- Do not allow interrupts or keyboard scanning during the period I/O is switched out.
- The examples below use BASIC POKE/PEEK operations on decimal addresses as shown in the original source.

## Source Code
```basic
' Turn interrupts (keyboard scan) OFF
POKE 56334, PEEK(56334) AND 254   ' decimal 56334 = $DC0E

' Switch out I/O and switch CHARACTER ROM in
POKE 1, PEEK(1) AND 251            ' POKE 1, PEEK(1) AND 0xFB

' ... CPU may now read/copy character ROM mapped at $D000-$DFFF ...
' Character ROM is in locations 53248-57343 ($D000-$DFFF)

' Switch I/O back into $D000 for normal operation
POKE 1, PEEK(1) OR 4               ' POKE 1, PEEK(1) OR 0x04

' Turn interrupts (keyboard scan) ON
POKE 56334, PEEK(56334) OR 1      ' decimal 56334 = $DC0E
```

```text
Notes:
- Decimal 56334 == hex $DC0E (CIA1 register area)
- Character ROM mapped into $D000-$DFFF (decimal 53248-57343) while banked in
- CPU port at address 1 controls memory banking (use PEEK(1)/POKE 1)
```

## Key Registers
- $0001 - CPU port - memory configuration / bank switching (controls whether I/O or ROM is visible at $D000-$DFFF)
- $D000-$DFFF - VIC-II / Character ROM imaging region (character ROM is mapped here when banked in)
- $DC00-$DC0F - CIA 1 - keyboard / interrupt related registers (keyboard scan interrupt bit referenced at $DC0E decimal 56334)

## References
- "vic_character_rom_imaging_and_bank_mapping" — expands on VIC-II ROM imaging and bank notes
- "copy_characters_from_ROM_to_RAM_example_program" — expands on an example that uses these steps