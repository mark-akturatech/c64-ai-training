# CHROUT wrapper ($FFD2) — JMP ($0326) KERNAL vector

**Summary:** The ROM entry at $FFD2 is a simple JMP ($0326) indirect vector to the KERNAL CHROUT routine; call with the character byte in A after selecting an output channel with OPEN ($FFC0) / CHKOUT ($FFC9). Care: serial devices receive data on all open output channels.

## Description
This entry is the standard KERNAL character-output entry (CHROUT) exposed at $FFD2. The single instruction there is an indirect JMP through the KERNAL vector stored at $0326, so the actual implementation can be relocated by changing that vector.

Usage and behavior (from ROM documentation):
- Load the byte to be output into the accumulator (A) and call the routine at $FFD2 (or JMP/JSR via the vector at $0326).  
- Before calling, set up the output device/channel with OPEN ($FFC0) and CHKOUT ($FFC9). If those are omitted, output goes to the default device (device 3 — the screen).  
- The channel remains open after the call. To avoid sending data to unintended serial devices, close other open output channels on the serial bus (use the KERNAL close-channel routine) before outputting.  
- The ROM wrapper itself does no processing other than jumping through the vector; all work is done by the routine addressed by the word at $0326.

## Source Code
```asm
.; ROM entry: output character to channel
.,FFD2  6C 26 03    JMP ($0326)    ; do output character to channel (CHROUT)
```

## Key Registers
- $FFD2 - ROM - CHROUT wrapper (JMP ($0326))
- $0326 - RAM/KERNAL vector table - contains low/high address of actual CHROUT routine

## References
- "kernal_vectors_list" — expands on CHROUT vector at $0326

## Labels
- CHROUT
