# KERNAL Reset / Startup Sequence (START, START1)

**Summary:** KERNAL reset/startup sequence (addresses $FCE2–$FCFF) disables interrupts, initializes CPU state (SEI, TXS, CLD), calls the $A000-ROM presence test (A0INT at $FD02), conditionally jumps to the $A000/$8000 ROM vector, sets VIC refresh via $D016, and sequences IOINIT, RAMTAS, RESTOR and CINT before enabling interrupts and jumping to BASIC at ($A000). Searchable terms: $FCE2, $FCFF, $D016, VIC-II, A0INT, IOINIT, RAMTAS, RESTOR, CINT, START, START1.

## Description
This chunk documents the KERNAL cold/warm-start entry at $FCE2 (label START) and the follow-up label START1. Behavior:

- LDX #$FF / SEI / TXS / CLD: standard CPU init on reset — set stack pointer to $FF, disable interrupts, clear decimal mode.
- JSR $FD02 (A0INT): call the routine that tests for the presence of an alternate ROM at $A000 (the $8000/$A000 ROM signature test referenced by comments as checking locations $8004–$8008 == 'CBM80' with MSB set).
  - If A0INT returns Z = 0 (BNE), execution branches to START1 (continue KERNAL startup).
  - If A0INT indicates an active $A000 ROM, execution follows through JMP ($8000) to let the $A000 ROM perform its initialization (hard start).
- START1: STX $D016 — write X (initially #$FF but comment implies using low bits .X=<5) to VIC refresh register to set up memory refresh/related VIC-II control.
- Sequence of JSRs:
  - JSR $FDA3 — IOINIT: initialize I/O devices and ports.
  - JSR $FD50 — RAMTAS: run RAM tests and detect memory top.
  - JSR $FD15 — RESTOR: set up KERNAL indirect vectors after RAM init.
  - JSR $FF5B — CINT: initialize screen/console.
- CLI then re-enables interrupts.
- Final JMP ($A000) transfers control to BASIC via vectored entry at $A000 (or alternate ROM if previously vectored).

Labels mentioned: START (reset entry), START1 (post-ROM-test continuation). The listing preserves original comments about the 'CBM80' signature test and warm/hard-start behavior.

## Source Code
```asm
                                ; IF LOCS $8004-$8008
                                ; = 'CBM80'
                                ;    ^^^  > THESE HAVE MSB SET
                                ; KERNAL EXPECTS...
                                ; $8000- .WORD INITILIZE (HARD START)
                                ; $8002- .WORD PANIC (WARM START)
                                ; ... ELSE BASIC SYSTEM USED
                                ; ******************TESTING ONLY***************
                                ; USE AUTO DISK/CASSETTE LOAD WHEN DEVELOPED...
                                ;
.,FCE2 A2 FF    LDX #$FF        START  LDX #$FF
.,FCE4 78       SEI                    SEI
.,FCE5 9A       TXS                    TXS
.,FCE6 D8       CLD                    CLD
.,FCE7 20 02 FD JSR $FD02              JSR A0INT       ;TEST FOR $A0 ROM IN
.,FCEA D0 03    BNE $FCEF              BNE START1
.,FCEC 6C 00 80 JMP ($8000)            JMP ($8000)     ; GO INIT AS $A000 ROM WANTS
.,FCEF 8E 16 D0 STX $D016       START1 STX VICREG+22   ;SET UP REFRESH (.X=<5)
.,FCF2 20 A3 FD JSR $FDA3              JSR IOINIT      ;GO INITILIZE I/O DEVICES
.,FCF5 20 50 FD JSR $FD50              JSR RAMTAS      ;GO RAM TEST AND SET
.,FCF8 20 15 FD JSR $FD15              JSR RESTOR      ;GO SET UP OS VECTORS
                                ;
.,FCFB 20 5B FF JSR $FF5B              JSR CINT        ;GO INITILIZE SCREEN
.,FCFE 58       CLI                    CLI             ;INTERRUPTS OKAY NOW
.,FCFF 6C 00 A0 JMP ($A000)            JMP ($A000)     ;GO TO BASIC SYSTEM
```

## Key Registers
- $D016 - VIC-II - VIC refresh / control register (written with X in START1 to set refresh)

## References
- "a0rom_test_tbla0r_table" — expands the $8000 ROM signature check used by this startup sequence
- "ioinit_configure_io_devices_and_ports" — IOINIT device and port initialization
- "ramtas_memory_initialization_and_top_detection" — RAMTAS memory test and sizing
- "restore_and_vector_initialization" — RESTOR sets up KERNAL indirect vectors and OS vector table

## Labels
- START
- START1
- A0INT
- IOINIT
- RAMTAS
- RESTOR
- CINT
