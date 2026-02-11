# RDTIM (KERNAL) — Read realtime jiffy clock (vectored at $FFDE, code at $F6DD)

**Summary:** KERNAL routine (vector $FFDE) that reads the three-byte realtime jiffy clock from zero page $00A0-$00A2 into registers A/X/Y using SEI and LDA/LDX/LDY; clock resolution is 1/60 second.

## Description
RDTIM is the KERNAL entry for reading the system jiffy clock. It is vectored at $FFDE and jumps to the implementation beginning at $F6DD. The routine disables interrupts with SEI because the IRQ handler increments the jiffy clock; it then transfers the three zero-page clock bytes into the CPU registers A, X and Y.

The source describes the clock bytes as stored in $A0/$A1/$A2 in high/mid/low order and states the routine returns time in A/X/Y as high/mid/low. The listed instructions, however, load A from $A2, X from $A1 and Y from $A0 — producing A/X/Y = low/mid/high if $A0 is the high byte. See note below.

Clock resolution: 1/60 second. The routine preserves the clock value (it only reads), and SEI prevents concurrent IRQ updates during the read.

**[Note: Source may contain an error — documentation text claims A/X/Y = high/mid/low ($A0/$A1/$A2), but code loads A<= $A2, X<= $A1, Y<= $A0, implying the opposite byte order.]**

## Source Code
```asm
                                *** RDTIM: GET TIME
                                The KERNAL routine RDTIM ($ffde) jumps to this routine.
                                The three byte jiffy clock is read into (A/X/Y) in the
                                format high/mid/low. The routine exits, setting the time
                                to its existing value in the next routine. The clock
                                resolution is 1/60 second. SEI is included since part of
                                the IRQ routine is to update the clock.
.,F6DD 78       SEI             disable interrupt
.,F6DE A5 A2    LDA $A2         read TIME
.,F6E0 A6 A1    LDX $A1
.,F6E2 A4 A0    LDY $A0
```

## Key Registers
- $00A0-$00A2 - Zero Page - Jiffy clock storage bytes (source text: high/mid/low)

## References
- "udtim_bump_clock" — expands on shared jiffy clock storage ($A0/$A1/$A2)

## Labels
- RDTIM
