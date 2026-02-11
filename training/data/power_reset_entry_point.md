# POWER RESET ENTRY POINT (KERNAL $FFFC)

**Summary:** Reset entry executed from vector $FFFC; performs early CPU/setup tasks (LDX/TXS/SEI/CLD), checks autostart cartridge at $8000 (JSR $FD02 / JMP ($8000)), writes X to $D016, initializes I/O and system constants (JSR $FDA3, $FD50), runs KERNAL reset ($FD15), configures PAL/NTSC ($FF5B), re-enables IRQs (CLI) and jumps to BASIC coldstart vector ($A000).

## Power/reset flow
This routine is the first KERNAL code executed after a hardware reset (reset vector $FFFC). Sequence and effects:

- LDX #$FF / TXS — initialize the stack pointer to $FF.
- SEI — disable interrupts during initialization.
- CLD — clear decimal mode (ensure binary arithmetic).
- JSR $FD02 — call the cartridge/ROM check routine that inspects $8000 for an autostart ROM. The routine sets the zero flag to indicate presence:
  - If a cartridge autostart is present (zero flag set), execution falls through to
    JMP ($8000) — indirect jump to the cartridge coldstart vector at $8000.
  - If no autostart is present (zero flag clear), BNE is taken and normal init continues.
- STX $D016 — write the X register (#$FF) to $D016 (VIC-II register write present in this sequence).
- JSR $FDA3 — initialize I/O chips.
- JSR $FD50 — initialize system constants.
- JSR $FD15 — perform KERNAL reset tasks.
- JSR $FF5B — setup PAL/NTSC parameters.
- CLI — re-enable interrupts.
- JMP ($A000) — indirect jump to the BASIC coldstart vector at $A000.

This chunk documents the high-level reset startup path, the autostart decision, and the calls into KERNAL routines that finish hardware and system initialization before handing control to BASIC.

## Source Code
```asm
.,FCE2 A2 FF    LDX #$FF
.,FCE4 78       SEI
.,FCE5 9A       TXS             Set stackpointer to #ff
.,FCE6 D8       CLD
.,FCE7 20 02 FD JSR $FD02       Check ROM at $8000
.,FCEA D0 03    BNE $FCEF
.,FCEC 6C 00 80 JMP ($8000)     Jump to autostart vector
.,FCEF 8E 16 D0 STX $D016
.,FCF2 20 A3 FD JSR $FDA3       Init I/O
.,FCF5 20 50 FD JSR $FD50       Init system constants
.,FCF8 20 15 FD JSR $FD15       KERNAL reset
.,FCFB 20 5B FF JSR $FF5B       Setup PAL/NTSC
.,FCFE 58       CLI
.,FCFF 6C 00 A0 JMP ($A000)     Basic coldstart
```

## Key Registers
- $FFFC - Reset vector - entry point for POWER RESET
- $8000 - Cartridge autostart vector (JMP ($8000))
- $A000 - BASIC coldstart vector (JMP ($A000))
- $FD02 - KERNAL - check ROM at $8000 (autostart check)
- $FDA3 - KERNAL - initialize I/O chips
- $FD50 - KERNAL - initialize system constants
- $FD15 - KERNAL - KERNAL reset routine
- $FF5B - KERNAL - PAL/NTSC setup routine
- $D016 - VIC-II - written with X (#$FF) during reset sequence

## References
- "check_for_8rom" — expands on checks ROM autostart parameters at $8004-$8008
- "ioinit_init_io" — expands on initialization of I/O chips after power-on

## Labels
- $FFFC
- $8000
- $A000
- $FD02
- $FDA3
- $FD50
- $FD15
- $FF5B
