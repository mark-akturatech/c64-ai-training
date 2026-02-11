# KERNAL jump table continuation (GETIN / CLALL / UDTIM / SCREEN / PLOT / IOBASE)

**Summary:** Continuation of the Commodore 64 KERNAL jump table entries at $FFE4–$FFF3 showing indirect JMP vectors (JMP ($032A), JMP ($032C)) and direct ROM JMPs ($F69B, $E505, $E50A, $E500). Includes routine names: GETIN, CLALL, UDTIM, SCREEN, PLOT, IOBASE.

## Description
This chunk is a fragment of the KERNAL jump table (ROM entry points). It lists six KERNAL entry points in ROM:

- $FFE4 — JMP ($032A) — GETIN: read input from keyboard. This is an indirect JMP: the 6502 fetches the 16-bit target address from $032A (low byte) and $032B (high byte), then jumps there. Vectored entries like this allow the destination routine to be relocated/overridden by changing the two-byte pointer in RAM.
- $FFE7 — JMP ($032C) — CLALL: close all files and channels. Also a vectored entry (pointer at $032C/$032D).
- $FFEA — JMP $F69B — UDTIM: increment realtime clock. This is a fixed ROM jump to $F69B (not vectored).
- $FFED — JMP $E505 — SCREEN: return screen organization. Fixed ROM jump.
- $FFF0 — JMP $E50A — PLOT: read/set cursor X/Y position. Fixed ROM jump.
- $FFF3 — JMP $E500 — IOBASE: return IOBASE address. Fixed ROM jump.

Behavioral notes:
- Indirect JMP (JMP (addr)) semantics: the operand is a 16-bit pointer to the actual target address (little-endian). Modifying the bytes at that pointer changes where the JMP goes, enabling runtime redirection of KERNAL services.
- Direct JMPs (JMP $HHHH) go to ROM addresses fixed at assembly time and are not affected by the vector table.

This fragment continues the ROM-level routing of standard KERNAL calls through either vectored pointers (for overrideable services) or direct ROM routines.

## Source Code
```asm
.,FFE4 6C 2A 03 JMP ($032A)     GETIN, get input from keyboard
.,FFE7 6C 2C 03 JMP ($032C)     CLALL, close all files and channels
.,FFEA 4C 9B F6 JMP $F69B       UDTIM, increment realtime clock
.,FFED 4C 05 E5 JMP $E505       SCREEN, return screen organisation
.,FFF0 4C 0A E5 JMP $E50A       PLOT, read/set cursor X/Y position
.,FFF3 4C 00 E5 JMP $E500       IOBASE, return IOBASE address
```

## References
- "kernal_jump_table" — expands and completes the I/O/vector list for KERNAL entry points

## Labels
- GETIN
- CLALL
- UDTIM
- SCREEN
- PLOT
- IOBASE

## Mnemonics
- JMP
