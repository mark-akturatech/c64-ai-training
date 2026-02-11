# PET--Original ROM

**Summary:** Describes the original Commodore PET ROM (startup message `*** COMMODORE BASIC ***`), its limitations (disk incompatibility, poor cassette handling, no built-in machine-language monitor, nonstandard zero page layout, BASIC array limit of 256), and mentions that it can be upgraded by replacing ROM chips (Upgrade ROM) to add disk support.

## PET — Original ROM
The first PET is identified at power-up by the message:
`*** COMMODORE BASIC ***`
(note the asterisks and the absence of a version number after BASIC).

Technical characteristics and limitations:
- Original ROM lacks support for disk hardware.
- Cassette I/O routines perform poorly for data files compared with later ROMs.
- No built-in machine-language monitor is provided in ROM.
- Zero page (page $00) uses an architecture that differs significantly from later PET/CBM models (incompatible zero-page usage).
- BASIC in this ROM is limited; for example, arrays are restricted to a maximum of 256 elements.
- The original machine may be upgraded by replacing the ROM chips with a later ROM set (Upgrade ROM) to add disk support and other improvements.
- These early original-ROM PETs are becoming rare.

## PET/CBM—Upgrade ROM
The Upgrade-ROM PET/CBM is the first PET able to handle disk systems. The source text describing how it is recognized at startup is truncated and not included here.

**[Note: Source truncated — startup message and further Upgrade ROM details omitted from original text.]**

## References
- "pet_original_rom_characteristics" — expands on start-of-PET descriptions and distinctions
