# UDTIM: BUMP CLOCK (KERNAL jiffy clock increment)

**Summary:** Increments the 3-byte jiffy clock at zero-page $A2:$A1:$A0, tests against threshold $4F1A01 (5184001 jiffies = 24 hours) using SEC/SBC and BCC, and resets the clock to zero when threshold is reached; uses LDX/INC cascade and STX to store zero. Entry referenced from KERNAL UDTIM ($FFEA).

## Description
This KERNAL routine (code at $F69B–$F6BA) increments a 3‑byte jiffy clock stored in zero page as A2 (low), A1 (mid), A0 (high). Incrementing is done with INC on the low byte and cascade increments on carry-out via BNE checks:

- LDX #$00 prepares a zero value in X for later resets.
- INC $A2 increments the low byte; if it wraps to zero, BNE falls through and INC $A1 increments the mid byte.
- If the mid byte wraps, INC $A0 increments the high byte.

To detect 24 hours (5184001 jiffies), the routine subtracts the constant $4F1A01 from the current 3‑byte clock using SEC plus three SBCs (low, mid, high). The SBC sequence preserves proper borrow propagation across bytes:

- SEC
- LDA $A2 / SBC #$01
- LDA $A1 / SBC #$1A
- LDA $A0 / SBC #$4F

The processor Carry flag after the multi-byte subtraction indicates whether the clock was >= threshold: if Carry is set (no borrow), the clock is greater than or equal to $4F1A01 and the routine falls through to reset the three bytes to zero by storing X (which is zero) into $A0–$A2 via STX. If Carry is clear (borrow occurred), BCC branches past the reset — the clock remains unchanged.

After handling the jiffy clock, control continues to the next KERNAL routine that logs the CIA key reading (see referenced "log_cia_key_reading").

## Source Code
```asm
.,F69B A2 00    LDX #$00
.,F69D E6 A2    INC $A2         ; low byte of jiffy clock
.,F69F D0 06    BNE $F6A7
.,F6A1 E6 A1    INC $A1         ; mid byte of jiffy clock
.,F6A3 D0 02    BNE $F6A7
.,F6A5 E6 A0    INC $A0         ; high byte of jiffy clock
.,F6A7 38       SEC
.,F6A8 A5 A2    LDA $A2         ; subtract $4F1A01
.,F6AA E9 01    SBC #$01
.,F6AC A5 A1    LDA $A1
.,F6AE E9 1A    SBC #$1A
.,F6B0 A5 A0    LDA $A0
.,F6B2 E9 4F    SBC #$4F
.,F6B4 90 06    BCC $F6BC       ; if borrow (clock < threshold) skip reset
.,F6B6 86 A0    STX $A0         ; reset jiffy clock (X == 0)
.,F6B8 86 A1    STX $A1
.,F6BA 86 A2    STX $A2
```

## Key Registers
- $A0-$A2 - RAM (Zero Page) - jiffy clock high/mid/low bytes (high = $A0, mid = $A1, low = $A2)

## References
- "log_cia_key_reading" — routine called after bumping the jiffy clock to log CIA key presses

## Labels
- UDTIM
