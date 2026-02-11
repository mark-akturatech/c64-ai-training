# LINE 200 — Waveform control subroutine (first sound effect)

**Summary:** BASIC subroutine that toggles the first SID voice waveform/control register using POKE (POKE S+4,129 to enable sound; POKE S+4,128 to disable). A RETURN sends execution back to the caller (end of line 70). (S = SID base address $D400)

**Description**
Line 200 is a short BASIC subroutine invoked to control a sound effect for the first voice. It writes immediate values to the SID waveform/control register (offset +4 from the SID base) to turn the waveform on or off, then returns to the caller so program execution resumes after the GOSUB that invoked it.

- POKE S+4,129 — write 129 to the waveform/control register; sets bits that enable the sound effect.
- POKE S+4,128 — write 128 to the waveform/control register; clears the enable bit(s) to turn the sound off.
- RETURN — ends the subroutine and resumes execution at the instruction following the GOSUB that called line 200 (noted as “end of line 70” in source).

(Short note: S in POKE S+4 is the SID base address variable — commonly $D400 on the C64.)

## Source Code
```basic
10 S = 54272
...
70 GOSUB 200
...
200 POKE S+4,129
    POKE S+4,128
    RETURN
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (waveform/control at $D404; POKE S+4 writes here)

## References
- "sprite_pointer_sound_triggers_gosub200_and_gosub300" — covers how sprite-pointer or P triggers invoke GOSUB 200 and GOSUB 300 (IF P=192 THEN GOSUB200).
- "waveform_control_subroutine_line_300" — analogous subroutine controlling the second voice (invoked for P=193).

## Labels
- SID
