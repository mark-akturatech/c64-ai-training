# SID Frequency Reference (6581/8580)

**Summary:** Frequency calculation for SID oscillators: 16-bit frequency registers (per voice) mapped into a 24-bit phase accumulator produce output frequency Fout = Fn * Clock / 2^24; relevant SID register block starts at $D400 (voice frequency registers $D400/$D401, $D407/$D408, $D40E/$D40F).

**Frequency Reference**

The SID oscillator uses a 24-bit phase accumulator. Each voice has a 16-bit frequency register (low and high bytes). The 16-bit register value Fn is promoted into the 24-bit increment used by the accumulator; the resulting output frequency is proportional to the SID clock.

Primary formulas:
- Fout = Fn * Clock / 2^24
- Fn = round(Fout * 2^24 / Clock)

(2^24 = 16,777,216)

Typical SID clock values used on the C64:
- PAL C64: Clock ≈ 985,248 Hz
- NTSC C64: Clock ≈ 1,022,727 Hz

Notes:
- The formula is the same for 6581 and 8580 (filter/analog differences do not change the digital frequency calculation).
- Fn is a 16-bit unsigned integer stored as two bytes (FREQ_LO, FREQ_H) for each voice; the phase accumulator is 24-bit internally.
- Small variations in system clock (drive crystal tolerances, PAL/NTSC variants) will slightly shift pitch; use measured clock if accurate tuning is required.

Example calculations (rounded to nearest integer register value):
- A4 = 440.000 Hz
  - PAL: Fn ≈ 440 * 16,777,216 / 985,248 ≈ 7,493
  - NTSC: Fn ≈ 440 * 16,777,216 / 1,022,727 ≈ 7,218
- C4 ≈ 261.6256 Hz
  - PAL: Fn ≈ 261.6256 * 16,777,216 / 985,248 ≈ 4,457
  - NTSC: Fn ≈ 261.6256 * 16,777,216 / 1,022,727 ≈ 4,290

Use the inverted formula to compute the two bytes:
- FREQ_LO = Fn & $FF
- FREQ_H  = (Fn >> 8) & $FF

## Source Code

```text
SID 6581/8580 Frequency Calculation Example

; Compute Fn for a desired frequency (Fout)
; Fn = round(Fout * 2^24 / Clock)

; Example: Compute Fn for A4 (440 Hz) on a PAL C64

Fout = 440.0
Clock = 985248.0
Fn = round(Fout * 16777216 / Clock)
; Fn ≈ 7493

; Split Fn into low and high bytes
FREQ_LO = Fn & $FF
FREQ_HI = (Fn >> 8) & $FF

; FREQ_LO = $45
; FREQ_HI = $1D
```

## Key Registers

- $D400-$D406 - SID - Voice 1 registers (FREQ_LO/FREQ_H, PW_LO/PW_H, CONTROL, ADSR)
- $D407-$D40D - SID - Voice 2 registers (FREQ_LO/FREQ_H, PW_LO/PW_H, CONTROL, ADSR)
- $D40E-$D414 - SID - Voice 3 registers (FREQ_LO/FREQ_H, PW_LO/PW_H, CONTROL, ADSR)
- $D415-$D418 - SID - Filter, resonance, pot and control registers

## References

- Commodore 64 Programmer's Reference Guide
- MOS Technology SID 6581 Datasheet
- MOS Technology SID 8580 Datasheet