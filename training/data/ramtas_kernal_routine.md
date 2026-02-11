# RAMTAS (KERNAL $FF87)

**Summary:** KERNAL routine at $FF87 (65415) that tests RAM, sets top/bottom memory pointers (memtop/membot), clears $0000-$0101 and $0200-$03FF, allocates the cassette buffer, and sets the screen base to $0400. Call with JSR RAMTAS; communicates via A, X, Y.

## Description
Performs a system RAM test and adjusts the KERNAL top- and bottom-of-memory pointers accordingly. The routine also:

- Clears memory ranges $0000-$0101 and $0200-$03FF.
- Allocates the cassette buffer (address allocated by the KERNAL; exact buffer pointer is set internally).
- Sets the screen base to $0400.
- Is intended to be used during system or cartridge initialization.

Call conventions and effects:
- Call address: $FF87 (hex) / 65415 (decimal).
- Communication registers: A, X, Y.
- Preparatory routines: None required.
- Error returns: None documented.
- Stack requirements: 2 bytes.
- Registers affected: A, X, Y (contents may be changed).

Typical usage:
- JSR RAMTAS

## Key Registers
- $FF87 - KERNAL - RAMTAS entry point (callable routine)
- $0000-$0101 - RAM - cleared by RAMTAS
- $0200-$03FF - RAM - cleared by RAMTAS
- $0400 - RAM - screen base (set to $0400 by RAMTAS)

## References
- "memtop_kernal_routine" — expands on RAMTAS sets top-of-memory pointer
- "membot_kernal_routine" — expands on RAMTAS sets bottom-of-memory pointer

## Labels
- RAMTAS
