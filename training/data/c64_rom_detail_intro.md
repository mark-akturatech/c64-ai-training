# MACHINE - Commodore 64 ROM detail introduction

**Summary:** Introductory guidance on using a ROM memory map for disassembly and identifying built-in ROM subroutines; warns against relying on ROM routines across machines and recommends the KERNAL jump table ($FFD2, $FFE4, $FFE1, $FFC6, $FFC9, $FFCC) for portable calls.

## Purpose
This ROM memory map is intended for browsing the C64's internal code so you can disassemble areas of interest and identify subroutines a section of ROM calls. It is a research and reverse‑engineering aid: use it to understand why the computer behaves a certain way and to find routine entry points used by system firmware.

## Warnings and recommendations
- Do not rely on undocumented ROM subroutines for production code: their behavior may not match your needs and their addresses can change between machine revisions.
- Prefer using the documented KERNAL jump table entries (stable across Commodore machines) instead of calling ROM routines by fixed addresses.
- The KERNAL entries called out here are stable and intended as the supported interface for I/O and related services.

## KERNAL jump table entries referenced
- $FFD2 — output (use for sending characters to the current output device)
- $FFE4 — get input (read a character from current input device)
- $FFE1 — check RUN/STOP key
- $FFC6 — switch input (select a different input device)
- $FFC9 — switch output (select a different output device)
- $FFCC — restore normal input/output

These entries are the supported, portable method to perform basic console I/O and related functions on Commodore systems.

## References
- "Mapping the Commodore 64" — in-depth study of the ROM and system internals
- "c64_rom_vectors_a000_to_ba80" — expands the list of ROM routine addresses with brief descriptions