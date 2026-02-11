# LINE 300 — Voice 2 waveform control (POKE S+11)

**Summary:** POKE S+11 writes to the SID voice‑2 control register ($D40B) to toggle the waveform/gate bits; values 129 ($81) and 128 ($80) turn the effect on and off respectively. RETURN passes control back to the caller (end of line 75); this subroutine is invoked by IF P=193 THEN GOSUB300 in the calling code.

## Description
This BASIC subroutine controls the second SID voice's waveform/gate via the control register at SID base + 11 (S+11 → $D40B). The two POKE values used are:

- POKE S+11,129  — decimal 129 = $81; sets the control register to enable the sound effect (waveform/gate bits set as in the source).
- POKE S+11,128  — decimal 128 = $80; clears the additional bit (turns the sound effect off).

RETURN sends execution back to the caller; in the supplied program flow the caller is the end of line 75 (the GOSUB/RETURN pairing returns to where GOSUB300 was called). The subroutine is activated when P=193 (IF P=193 THEN GOSUB300 in the calling context).

(S is the SID base pointer in these listings — commonly S = 53248/$D400.)

## Source Code
```basic
300 POKE S+11,129        REM Waveform control set to 129 turns on the sound effect.
    POKE S+11,128        REM Waveform control set to 128 turns off the sound effect.
    RETURN               REM Return to caller (end of line 75).
```

## Key Registers
- $D40B - SID - Voice 2 control (waveform/gate register; written by POKE S+11)

## References
- "sprite_pointer_sound_triggers_gosub200_and_gosub300" — describes invocation (IF P=193 THEN GOSUB300)
- "waveform_control_subroutine_line_200" — describes Voice 1 subroutine using POKE S+4

## Labels
- $D40B
