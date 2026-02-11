# $D400-$D401 — SID Voice 1 Frequency (FRELO1 / FREHI1)

**Summary:** $D400 (FRELO1) and $D401 (FREHI1) are the two SID registers (SID at $D400-$D41F) that form the 16-bit Frequency control word for Voice 1; the combined 16-bit value is used by the SID oscillator phase accumulator to determine output pitch (Hz = FREQ * clock / 2^24).

## Description
- $D400 is the low byte (FRELO1) and $D401 is the high byte (FREHI1) of Voice 1's 16-bit frequency control word.
- Combine as a 16-bit unsigned value:
  - FREQ = (FREHI1 << 8) | FRELO1
- The SID oscillator uses a 24-bit phase accumulator; the effective output frequency (Hz) is:
  - Frequency(Hz) = FREQ * clock / 2^24 (where 2^24 = 16,777,216)
- Typical system clocks:
  - PAL C64: clock ≈ 985,248 Hz
  - NTSC C64: clock ≈ 1,022,727 Hz
- To set a pitch, compute FREQ = round(Hz * 2^24 / clock), then write low and high bytes to $D400 and $D401 respectively.
- Writing either byte updates the register immediately (no implicit latching); update both bytes to change pitch cleanly.
- These registers are per-voice; Voice 2 and Voice 3 use their own FRELO/FREHI pairs at the SID register block.

## Source Code
```text
Register map (excerpt)
$D400        FRELO1       Voice 1 Frequency Control (low byte)
$D401        FREHI1       Voice 1 Frequency Control (high byte)
```

```asm
; Example: store a 16-bit constant 'value' into Voice 1 frequency (assembler)
LDA #<value     ; load low byte
STA $D400
LDA #>value     ; load high byte
STA $D401

; Example: compute and set FREQ from A (low) / X (high) already prepared:
; (This is just a storage example; frequency calculation happens off-chip)
STA $D400
STX $D401
```

```basic
10 REM Example in BASIC (decimal addresses)
20 FREQ = 4457      : REM computed desired frequency word
30 POKE 53248, FREQ AND 255      : POKE $D400 (53248 decimal) low byte
40 POKE 53249, INT(FREQ/256)     : POKE $D401 (53249 decimal) high byte
```

## Key Registers
- $D400-$D401 - SID - Voice 1 frequency low/high bytes

## References
- "voice1_frequency_control" — expands on Frequency combining formula

## Labels
- FRELO1
- FREHI1
