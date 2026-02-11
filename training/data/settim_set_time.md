# SETTIM — Set realtime jiffy clock (KERNAL)

**Summary:** KERNAL SETTIM entry (vector $FFDB) — disables IRQs (SEI), stores Y/X/A into zero page clock bytes $A0/$A1/$A2 (low/mid/high), reenables IRQs (CLI) and RTS; jiffy clock resolution 1/60 second. Located at $F6E4 in this ROM dump.

## Description
SETTIM is the KERNAL routine invoked via the vector at $FFDB. It writes the 3-byte realtime "jiffy" clock (1/60 s resolution) into zero page bytes and protects the write with interrupts disabled so the IRQ update routine cannot race with the write.

Behavior (as implemented in this listing):
- SEI — disable interrupts before writing the clock.
- STA $A2 — store accumulator (A) into $A2 (high byte).
- STX $A1 — store X into $A1 (middle byte).
- STY $A0 — store Y into $A0 (low byte).
- CLI — re-enable interrupts.
- RTS — return to caller.

Note: the code enforces the exact mapping (Y -> $A0 low, X -> $A1 mid, A -> $A2 high) shown in the assembly — use that order when calling SETTIM. SEI/CLI are included because the IRQ handler also updates the clock.

## Source Code
```asm
        ; SETTIM: SET TIME
        ; The KERNAL routine SETTIM ($FFDB) jumps to this routine.
        ; On entry, (A/X/Y) must hold the value to be stored in the
        ; clock. The format is high/mid/low, and clock resolution is
        ; 1/60 second. SEI is included since part of the IRQ routine
        ; is to update the clock.
.,F6E4  78        SEI             ; disable interrupt
.,F6E5  85 A2     STA $A2         ; write TIME (high)
.,F6E7  86 A1     STX $A1         ; write TIME (mid)
.,F6E9  84 A0     STY $A0         ; write TIME (low)
.,F6EB  58        CLI             ; enable interrupts
.,F6EC  60        RTS
```

## Key Registers
- $FFDB - KERNAL vector - SETTIM entry (vector points to this routine)
- $F6E4 - KERNAL ROM address - start of SETTIM implementation (this listing)
- $00A0-$00A2 - Zero page - jiffy clock bytes: $00A0 = low (Y), $00A1 = mid (X), $00A2 = high (A)

## References
- "rdtim_get_time" — complementary get/set routines for the jiffy clock

## Labels
- SETTIM
