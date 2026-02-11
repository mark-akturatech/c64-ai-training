# Initialise VIC and screen editor; detect PAL/NTSC

**Summary:** JSR $E518 initialises the screen and keyboard; the code polls VIC-II raster register $D012 waiting for raster line $00, reads VIC interrupt flags at $D019, masks bit 0 (raster interrupt), stores the result to $02A6, then JMPs $FDDD to continue system initialisation. Searchable terms: $D012, $D019, VIC-II, raster, JSR $E518, JMP $FDDD.

## Description
This short routine synchronises to the start of the video frame, samples the VIC-II interrupt status to detect the raster interrupt bit (used here to distinguish PAL/NTSC timing), and records that result for later use.

- JSR $E518 — called to initialise the screen editor and keyboard before timing-sensitive operations.
- Poll $D012 — the VIC-II raster compare register is read repeatedly until it equals $00; the loop uses BNE to continue while the value is non-zero (wait for raster line 0; frame start synchronization).
- Read $D019 and mask bit 0 — $D019 is the VIC-II interrupt status register; AND #$01 isolates the raster interrupt flag (bit 0).
- STA $02A6 — the masked result (0 or 1) is stored at RAM location $02A6 for use later in the reset/initialisation sequence (e.g., PAL/NTSC detection logic).
- JMP $FDDD — continue to the next stage of ROM initialisation.

Behavioral details preserved from the listing:
- The raster-wait is a tight polling loop reading $D012 and branching with BNE $FF5E until a zero value is observed.
- The code does not clear any interrupts; it only samples $D019 and stores the masked bit.
- The stored value is a single byte 0x00 or 0x01 at $02A6.

## Source Code
```asm
        ; *** initialise VIC and screen editor
.,FF5B  20 18 E5    JSR $E518       ; initialise the screen and keyboard
.,FF5E  AD 12 D0    LDA $D012       ; read the raster compare register
.,FF61  D0 FB       BNE $FF5E       ; loop if not raster line $00
.,FF63  AD 19 D0    LDA $D019       ; read the vic interrupt flag register
.,FF66  29 01       AND #$01        ; mask the raster compare flag
.,FF68  8D A6 02    STA $02A6       ; save the PAL/NTSC flag
.,FF6B  4C DD FD    JMP $FDDD       ; continue initialisation
```

## Key Registers
- $D012 - VIC-II - Raster compare / current raster line (read)
- $D019 - VIC-II - Interrupt status register (bit 0 = raster interrupt flag)

## References
- "initialise_sid_cia_and_irq" — expands on earlier called routines in the system reset sequence

## Labels
- $D012
- $D019
