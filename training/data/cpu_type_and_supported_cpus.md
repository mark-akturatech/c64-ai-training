# ca65 --cpu type option

**Summary:** ca65 assembler option --cpu sets the default CPU type (affects accepted mnemonics and instruction encodings). Supported CPU type names and short descriptions are listed below.

## Description
Set the default CPU type for the assembler with the option:
--cpu type

The parameter type must be one of the supported CPU names. This determines which instruction set (legal and undocumented opcodes, CMOS/extended instructions, or target-specific CPU variants) ca65 accepts by default.

Supported types:
- 6502 - NMOS 6502 (all legal instructions)
- 6502X - NMOS 6502 with all undocumented instructions (includes illegal opcodes)
- 6502DTV - the emulated CPU of the C64DTV device
- 65SC02 - first CMOS instruction set (no bit-manipulation instructions, no WAI/STP)
- 65C02 - CMOS with Rockwell extensions
- W65C02 - full CMOS instruction set (includes bit-manipulation and WAI/STP)
- 65CE02 - CMOS with CSG extensions
- 4510 - the CPU of the Commodore C65
- 45GS02 - the CPU of the Commodore MEGA65
- HuC6280 - the CPU of the PC Engine (TurboGrafx-16)
- M740 - Microcontroller by Mitsubishi
- 65816 - the CPU used in the SNES and the SCPU (65xx extended 16-bit architecture)
- sweet16 - an interpreter for a pseudo 16-bit CPU

## Source Code
(omitted — no assembly listings or register maps in this chunk)

## Key Registers
(none)

## References
- "target_system_option" — expands on how the target option may set a default CPU type
- "smart_mode_option" — explains 65816-specific smart-mode behavior for operand sizes