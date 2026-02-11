# FLNMI — FLAG NMI helper (KERNAL ROM $FF07–$FF2D)

**Summary:** FLNMI primes CIA‑2 Timer 2 and receive-bit counters for mid‑bit sampling: it loads a precomputed half‑bit timer from KERNAL workspace ($0295/$0296) into CIA‑2 Timer2 ($DD06/$DD07), enables Timer2 via CIA‑2 CRB ($DD0F), toggles ENABL ($02A1) to disable FLAG and enable T2, presets the countdown to $FFFF, loads BITNUM ($0298) into BITCI ($00A8), and returns (RTS).

## Purpose and behavior
FLNMI is called from the FLAG NMI handler to position the first sampling point at the middle of the start/first data bit. It does this by:

- Reading the precomputed half‑bit timer value (M51AJB, two bytes at $0295/$0296) and writing it to CIA‑2 Timer 2 low/high ($DD06/$DD07).
- Enabling Timer 2 by writing the control value (#$11) to CIA‑2 Control Register B ($DD0F).
- Toggling the ENABL flag in the KERNAL workspace ($02A1) via EOR/STA so the hardware FLAG input is disabled and Timer2-driven sampling is enabled.
- Presetting Timer2 to $FFFF immediately (ensures the timer counts down from full) so the first Timer2 underflow/interrupt will occur after the intended half‑bit delay.
- Loading BITNUM (the configured number of bits to receive at $0298) into the receiver bit counter BITCI ($00A8).
- Returning with RTS so the NMI handler can resume; T2NMI will perform mid‑bit sampling.

This routine does not perform sampling itself — it prepares timers and counters so the Timer2 NMI (T2NMI) will sample in the centre of bits. It is a short, deterministic setup used in serial/bit‑timing input handling.

## Source Code
```asm
.,FF07 AD 95 02 LDA $0295              LDA M51AJB
.,FF0A 8D 06 DD STA $DD06              STA D2T2L
.,FF0D AD 96 02 LDA $0296              LDA M51AJB+1
.,FF10 8D 07 DD STA $DD07              STA D2T2H
                                ;
.,FF13 A9 11    LDA #$11               LDA #$11        ;ENABLE TIMER
.,FF15 8D 0F DD STA $DD0F              STA D2CRB
                                ;
.,FF18 A9 12    LDA #$12               LDA #$12        ;DISABLE FLAG, ENABLE T2
.,FF1A 4D A1 02 EOR $02A1              EOR ENABL
.,FF1D 8D A1 02 STA $02A1              STA ENABL
                                ;ORA #$82
                                ;STA D2ICR
                                ;
.,FF20 A9 FF    LDA #$FF               LDA #$FF        ;PRESET FOR COUNT DOWN
.,FF22 8D 06 DD STA $DD06              STA D2T2L
.,FF25 8D 07 DD STA $DD07              STA D2T2H
                                ;
.,FF28 AE 98 02 LDX $0298              LDX BITNUM      ;GET #OF BITS IN
.,FF2B 86 A8    STX $A8                STX BITCI       ;PUT IN RCVRCNT
.,FF2D 60       RTS                    RTS
```

## Key Registers
- $DD06-$DD07 - CIA 2 - Timer 2 low/high (D2T2L / D2T2H)
- $DD0F - CIA 2 - Control Register B (D2CRB; Timer2 control)
- $0295-$0296 - KERNAL workspace - M51AJB / M51AJB+1: precomputed half‑bit timer value
- $0298 - KERNAL workspace - BITNUM (# of bits to receive)
- $02A1 - KERNAL workspace - ENABL (flag enable/disable)
- $00A8 - KERNAL workspace - BITCI (receive bit counter / RCVRCNT)

## References
- "t2nmi_subroutine_sample_and_timer_update" — expands on FLNMI priming and the Timer2 NMI sampling loop
- "t2_and_flag_nmi_handlers_and_rti" — shows FLNMI's call context within the FLAG NMI path

## Labels
- FLNMI
- D2T2L
- D2T2H
- D2CRB
- M51AJB
- BITNUM
- ENABL
- BITCI
