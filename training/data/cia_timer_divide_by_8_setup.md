# Minimal C64 Datasette Loader — CIA timer divide-by-8 configuration

**Summary:** 6502 assembly that configures CIA 2 timers ($DD04/$DD05, $DD06/$DD07, $DD0E) so Timer A counts 7→0 and Timer B counts Timer-A underruns (cascade), producing an effective divide-by-8 on the measured pulses.

## Explanation
This snippet programs CIA 2 timers to use Timer A as a short divider and Timer B to count the number of Timer-A underflows (cascade mode). Procedure used:

- Load the 16-bit timer value (low then high) for Timer A with 7 (low = $07, high = $00) so A will count 7 down to 0 — when A underflows, it generates a pulse the CIA can make available to Timer B in cascade mode.
- Write the CIA control register for Timer A to start it (CRA at $DD0E).
- Initialize Timer B to $FFFF so that each Timer-A underflow decrements Timer B (Timer B acts as an 8× prescaled counter if Timer A is 7).
- The code uses X register as a byte source ($FF) via DEX to quickly write TB low and high.

Effect: Timer B advances once per Timer-A full cycle (8 clock ticks when A loaded with 7), so reading Timer B gives values in units of 8 timer-A clock cycles.

Note: CIA register offsets used are on CIA 2 ($DD00-$DD0F). Control register CRA is at $DD0E (Timer A control). Timer A low/high are $DD04/$DD05; Timer B low/high are $DD06/$DD07.

## Source Code
```asm
        ; divide timer B by 8 via Timer A loaded with 7.
        LDA #$07         ; Timer A low byte = 7
        LDX #$00         ; Timer A high byte = 0
        STA $DD04        ; TALO (CIA 2)
        STX $DD05        ; TAHI (CIA 2)
        LDA #%00010001   ; CRA: start Timer A (control bits written here)
        STA $DD0E        ; CRA (CIA 2) - start Timer A
        DEX              ; X becomes $FF
        STX $DD06        ; TBLO (CIA 2) = $FF  ; set Timer B low
        STX $DD07        ; TBHI (CIA 2) = $FF  ; set Timer B high

; -------------------------------------------------------------------------
; CIA 2 register map (offsets $00-$0F relative to $DD00) — reference only
; $DD00 PRA     - Port A data
; $DD01 PRB     - Port B data
; $DD02 DDRA    - Data direction A
; $DD03 DDRB    - Data direction B
; $DD04 TALO    - Timer A low byte
; $DD05 TAHI    - Timer A high byte
; $DD06 TBLO    - Timer B low byte
; $DD07 TBHI    - Timer B high byte
; $DD08 TOD10TH - Time-of-day 1/10 sec
; $DD09 TODSEC  - Time-of-day seconds
; $DD0A TODMIN  - Time-of-day minutes
; $DD0B TODHR   - Time-of-day hours
; $DD0C SDR     - Serial data register
; $DD0D ICR     - Interrupt control register
; $DD0E CRA     - Control register A (Timer A start/one-shot/etc.)
; $DD0F CRB     - Control register B (Timer B control)
```

## Key Registers
- $DD00-$DD0F - CIA 2 - full register block; relevant offsets used: $DD04/$DD05 (Timer A low/high), $DD06/$DD07 (Timer B low/high), $DD0E (CRA, Timer A control/start)

## References
- "pulse_length_values" — expands on pulse lengths expressed in timer units
- "get_pulse_routine" — routine that reads the configured timers

## Labels
- TALO
- TAHI
- TBLO
- TBHI
- CRA
