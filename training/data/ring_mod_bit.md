# SID RING MOD (Bit 2) — Voice 1

**Summary:** SID ring modulation (RING MOD, Control bit 2 in Voice 1) replaces Oscillator 1's Triangle output with a ring‑modulated combination of Oscillators 1 and 3; requires Triangle selected on Voice 1 and a non-zero frequency on Voice 3. Search terms: SID, ring mod, $D404, Voice 1, Oscillator 3.

## Behavior
When the RING MOD bit (bit 2) of Voice 1's Control/Waveform register is set, the Triangle waveform output normally produced by Oscillator 1 is replaced by a ring‑modulated signal derived from Oscillators 1 and 3. Varying the frequency relationship between Oscillator 1 and Oscillator 3 produces a wide range of non‑harmonic overtone structures commonly used for bell/gong sounds and special effects. For ring modulation to be audible:

- The Triangle waveform bit for Voice 1 must be selected.
- Oscillator 3 must have a frequency other than zero.  
- Other parameters of Voice 3 (PW, ADSR, etc.) do not affect the audible ring modulation—only Oscillator 3's frequency matters.

(Brief parenthetical: ring modulation = multiplicative combination of two oscillator signals.)

## Source Code
```text
SID registers (relevant ranges)
$D400-$D406 - Voice 1
  $D400 - FREQ LO (Voice 1)
  $D401 - FREQ HI (Voice 1)
  $D402 - PW LO   (Voice 1)
  $D403 - PW HI   (Voice 1)
  $D404 - CONTROL / WAVEFORM (Voice 1)  <-- contains RING MOD (bit 2)
  $D405 - ATT/DEC   (Voice 1)
  $D406 - SUS/REL   (Voice 1)

$D40E-$D414 - Voice 3
  $D40E - FREQ LO (Voice 3)   <-- Oscillator 3 frequency must be non-zero for ring mod
  $D40F - FREQ HI (Voice 3)
  $D410 - PW LO   (Voice 3)
  $D411 - PW HI   (Voice 3)
  $D412 - CONTROL / WAVEFORM (Voice 3)
  $D413 - ATT/DEC   (Voice 3)
  $D414 - SUS/REL   (Voice 3)

Control / Waveform register bit map (example: $D404 for Voice 1)
Bit 7 (0x80) - NOISE
Bit 6 (0x40) - PULSE
Bit 5 (0x20) - SAWTOOTH
Bit 4 (0x10) - TRIANGLE
Bit 3 (0x08) - TEST
Bit 2 (0x04) - RING MOD     ← replaces Triangle output of V1 with ring-mod of V1 & V3
Bit 1 (0x02) - SYNC
Bit 0 (0x01) - GATE

Notes:
- To produce audible ring modulation, ensure TRIANGLE (bit 4) and RING MOD (bit 2) are set in $D404 and that Voice 3 frequency ($D40E/$D40F) ≠ 0.
- Other Voice 3 register settings (PW, ADSR) do not affect ring modulation audibility.
```

## Key Registers
- $D400-$D406 - SID - Voice 1 frequency, pulse width, control/waveform (RING MOD is bit 2 of $D404)
- $D40E-$D414 - SID - Voice 3 frequency, pulse width, control/waveform (Oscillator 3 frequency enables ring mod)

## References
- "sync_bit" — expands on SYNC (Bit 1) — another form of interaction with Oscillator 3
- "test_bit" — expands on TEST (Bit 3) — oscillator reset/lock behavior that affects outputs