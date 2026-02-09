# Commodore 64 Character Generator ROM and CPU/VIC Mapping

**Summary:** Describes the character generator ROM at $D000-$DFFF, how CPU access is controlled by processor port $0001 (bit 2 / CHAREN), and how the VIC-II sees images of the character generator at $1000-$1FFF and $9000-$9FFF under certain memory-bank selections. Includes interaction rules for using those VIC-visible areas for graphics or custom fonts.

**Overview**
The Commodore 64 contains a built-in character-generator ROM physically mapped at $D000-$DFFF. The CPU cannot always read that ROM because the same address range is also used by the hardware I/O registers; which view the CPU sees is selected by bit 2 (CHAREN) of the processor I/O port at $0001. With CHAREN = 1 ($0001 bit 2 = 1) the I/O hardware registers are visible to the CPU at $D000-$DFFF; with CHAREN = 0 the CPU can read the character generator ROM at that range.

The VIC-II does not access the character generator at $D000-$DFFF. Instead, the VIC-II is provided an image of the character generator at CPU addresses $1000-$1FFF and $9000-$9FFF (these are VIC-visible areas that can mirror the character ROM depending on the chosen memory bank). Because the CPU and VIC-II see the character generator in different address ranges, the CPU may use the VIC-visible areas for its own data without interfering with the VIC, provided the chosen bank mapping places the VIC image where it is expected.

Typical practice is to select memory banks so the VIC image of the character generator does not interfere with program data. If you require textual characters in a program, you can either copy the ROM character data into RAM (so you can modify or reference it from CPU-visible RAM) or supply your own custom character set in RAM.

**Details and behavior**
- Physical character generator ROM: $D000-$DFFF (CPU-visible only when CHAREN=0).
- Processor port $0001 controls memory/view selection; CHAREN (bit 2, mask $04) toggles CPU visibility of I/O vs character ROM.
  - CHAREN = 1 (bit set): CPU reads hardware I/O registers at $D000-$DFFF.
  - CHAREN = 0 (bit clear): CPU reads character-generator ROM at $D000-$DFFF.
- VIC-II character-generator image locations (VIC-visible):
  - $1000-$1FFF — image of character generator (when bank mapping places it there)
  - $9000-$9FFF — alternate image of character generator (when bank mapping places it there)
- The VIC's view of the character generator is independent of the CPU's $D000-$DFFF view; this separation avoids conflicts when the CPU places data in the CPU address ranges that the VIC is using as character ROM images.
- Commonly selected banks for graphics aim to avoid the VIC image colliding with critical program data; banks 1 and 3 do not have the character ROM image, allowing full use of RAM in those areas.
- To use text:
  - Copy character-generator ROM data into RAM (then modify or reference).
  - Or create and place a custom character set in RAM and point the VIC to it.

**VIC-II Memory Banks and Character ROM Visibility**

The VIC-II can access one of four 16 KB memory banks, selected by bits 0 and 1 of the CIA #2 port A register at $DD00. The mapping of these banks and the visibility of the character ROM within them are as follows:

| Bank Number | $DD00 Bits 1-0 | Address Range | Character ROM Visibility |
|-------------|----------------|---------------|--------------------------|
| 0           | 11             | $0000-$3FFF   | Yes, at $1000-$1FFF      |
| 1           | 10             | $4000-$7FFF   | No                       |
| 2           | 01             | $8000-$BFFF   | Yes, at $9000-$9FFF      |
| 3           | 00             | $C000-$FFFF   | No                       |

In banks 0 and 2, the character ROM is visible to the VIC-II, appearing at $1000-$1FFF in bank 0 and at $9000-$9FFF in bank 2. In banks 1 and 3, the character ROM is not visible, allowing the use of these memory areas for custom character sets or other data without interference.

## Source Code
```text
Character generator / memory mapping summary:

- Physical CPU-visible character generator ROM:
  $D000 - $DFFF

- Processor port:
  $0001 (CPU port / memory configuration)
    Bit 2 (CHAREN, mask $04):
      1 = I/O hardware registers visible at $D000-$DFFF
      0 = Character-generator ROM readable at $D000-$DFFF

- VIC-visible images of character generator (mirrors):
  $1000 - $1FFF (in VIC bank 0)
  $9000 - $9FFF (in VIC bank 2)

- VIC-II memory banks and character ROM visibility:

  | Bank Number | $DD00 Bits 1-0 | Address Range | Character ROM Visibility |
  |-------------|----------------|---------------|--------------------------|
  | 0           | 11             | $0000-$3FFF   | Yes, at $1000-$1FFF      |
  | 1           | 10             | $4000-$7FFF   | No                       |
  | 2           | 01             | $8000-$BFFF   | Yes, at $9000-$9FFF      |
  | 3           | 00             | $C000-$FFFF   | No                       |

Notes:
- The VIC-II does not access $D000-$DFFF directly; it uses the mirrored images above when the memory configuration directs it.
- To modify or use character glyphs at runtime, copy $D000-$DFFF contents into RAM or supply a custom character set in RAM and adjust the VIC pointers accordingly.
```

## Key Registers
- $0001 - CPU - Processor port / memory configuration; bit 2 (CHAREN, mask $04) selects CPU view: 1 = I/O registers at $D000-$DFFF, 0 = character generator ROM at $D000-$DFFF
- $DD00 - CIA #2 Port A - VIC-II memory bank selection; bits 1-0 select one of four 16 KB banks
- $D000-$DFFF - ROM - Physical character generator ROM (CPU-visible when CHAREN=0)
- $1000-$1FFF - VIC-II - Image/mirror of character generator ROM (VIC-visible in bank 0)
- $9000-$9FFF - VIC-II - Image/mirror of character generator ROM (VIC-visible in bank 2)

## References
- "Commodore 64 Programmer's Reference Guide" – Chapter 3: Programming Graphics
- "Mapping the Commodore 64" – Memory Map and VIC-II Details
- "C64-Wiki" – Articles on VIC Bank and Character Set