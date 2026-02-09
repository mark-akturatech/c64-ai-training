# Superchart — PETSCII / PET character sets

**Summary:** Describes the "superchart" mapping PETSCII (PET ASCII), Commodore screen codes (screen memory), BASIC token/code values, and included 6502 machine-opcode column; covers differences in meaning for the same byte depending on context and the display conventions used in the chart.

## Overview
A single byte value on a Commodore PET/C64 can have several distinct meanings depending on context (typed/printed text, screen memory, inside BASIC programs, or when interpreted as machine-code). The superchart arranges those meanings into columns to show how the same numeric code maps to:
- PET ASCII (characters as input or printed)
- Screen codes (values stored in screen memory; results of POKE/PEEK on screen RAM)
- BASIC codes (byte values used inside BASIC programs/tokens)
- 6502 machine opcodes (included for reference)

## Columns explained
- ASCII (PET ASCII): Characters as they are input from the keyboard or printed by the system (PETSCII). This is the textual interpretation used by the system I/O.
- Screen: Commodore screen codes used in screen memory (text RAM). POKEing these values into screen memory or PEEKing from it yields these codes. Note: the numeric character set is identical between Screen and PET ASCII.
- BASIC: Codes as stored/used inside BASIC programs (token/code values). For printable characters, BASIC codes are similar to PET ASCII in the range $20–$5F.
- 6502 opcodes: Machine-language opcodes are listed in the chart purely for convenience and completeness; they are not a character set but show which byte values correspond to which 6502 instructions.

## Display notes and conventions used in the chart
- A single byte can map to multiple visual forms; the chart reflects context-specific meanings rather than a single canonical glyph.
- Any PETSCII character that could not be represented in the chart rendering is replaced by a tilde (~).
- For the ASCII and SCREEN columns, when two glyphs are shown the first is the uppercase/graphics character (standard PET uppercase/graphics set) and the second (if present) is the lowercase character (the alternate lowercase character set).
- Characters prefixed with "r" indicate reverse-video versions of that character (inverse foreground/background).
- Machine-opcode column entries are for reference and use the usual 6502 mnemonic interpretation of the byte values.

## Availability
- A complete graphical list of PETSCII and screen codes (full chart) is available online: http://fly.to/theflame

## References
- "appendix_d_petscii_table" — full PETSCII and code mapping table (expanded chart)