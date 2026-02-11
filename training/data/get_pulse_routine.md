# get_pulse — Minimal Datasette pulse-measure routine

**Summary:** Measures a cassette pulse by polling the CIA tape-input bit ($DC0D) with BIT/BEQ/BNE, samples the low byte of CIA-II Timer B ($DD06), restarts Timer B via $DD0F, and returns the (negative) pulse length in A while setting the C flag for "short" pulses.

**Operation**
This subroutine times a single tape pulse using CIA Timer B and a CIA input bit:

- The accumulator is loaded with a bitmask (LDA #$10) and BIT $DC0D is used to poll the tape input bit until the pulse transitions (BIT sets Z depending on A & M).
- When the first transition (pulse start) is detected, the routine proceeds to wait for the pulse end by re-polling the same masked bit (BIT $DC0D with BEQ/BNE).
- On pulse end, it reads the low byte of CIA-II Timer B at $DD06 (LDA $DD06). Timer B is then restarted by writing the previously prepared X register value into CIA-II control register B at $DD0F (STX $DD0F).
- Finally, the code compares the sampled timer value against a threshold to distinguish short pulses (CMP #$ff-threshold_short_medium) and returns via RTS with the accumulator containing a signed/negative-length value and the C flag indicating a short pulse.

Notes:
- BIT is used for masked polling (BIT sets Z if (A & M) == 0).
- Timer B low byte ($DD06) is used; the routine assumes Timer B was running down so the read value encodes pulse length relative to the timer.
- The CMP immediate uses a named constant expression in the source.

## Source Code
```asm
get_pulse:
    lda #$10
p1: bit $dc0d       ;wait for start
    bne p1          ;of pulse

    ldx #%01011001  ;value to restart timer b
p2: bit $dc0d       ;wait for end
    beq p2          ;of pulse

    lda $dd06       ;read timer b
    stx $dd0f       ;restart timer b
    cmp #$ff-threshold_short_medium
    rts             ;c=1: short
```

## Key Registers
- $DC0D - CIA-I Interrupt Control Register: Bit 4 (MASK) corresponds to the tape read line; BIT $DC0D with A=$10 masks for this bit.
- $DD06 - CIA-II Timer B Low Byte: Used to read the timer value.
- $DD0F - CIA-II Control Register B: Used to restart Timer B.

## References
- "pulse_thresholds" — expands on compares timer reading to threshold_short_medium  
- "get_byte_routine" — uses get_pulse to assemble bits/bytes