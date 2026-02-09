# CONTROL REGISTER (Register 04)

**Summary:** SID voice control register (Voice 1 / Oscillator 1) at $D404 — eight control bits: Gate, Sync, Ring Mod, Test, and four waveform enable bits (Triangle, Sawtooth, Pulse, Noise). Use to trigger envelope (GATE), reset/sync oscillators, select/mix waveforms.

**Control Register (Register 04) — Description**
This is the control register for SID Oscillator 1 (Voice 1). It is the fourth register (offset $04) from the SID base $D400, therefore located at $D404 ($D400 + $04). The register is an 8-bit bitfield where:
- Bit 0 is the GATE (key on/off) that drives the ADSR generator.
- Bits 1–3 contain control/status flags for oscillator interaction and testing (SYNC, RING MOD, TEST).
- Bits 4–7 independently enable waveform outputs (Triangle, Saw, Pulse, Noise). Multiple waveform bits may be set simultaneously to mix waveforms (hardware-dependent behavior between 6581 and 8580).

Behavior notes (concise, from SID hardware behavior):
- GATE (bit 0): A transition from 0->1 starts the ADSR attack phase; 1->0 begins release. The envelope is controlled by the global ADSR circuitry.
- SYNC (bit 1): Hard-syncs this oscillator to the previous voice's phase generator (forces phase reset on sync event).
- RING MOD (bit 2): Enables ring modulation using the previous voice (complex interaction depends on selected waveforms).
- TEST (bit 3): When set, resets the oscillator's phase generator and may force defined output state; typically used for oscillator testing/reset.
- Waveform bits (bits 4–7): Each enables its named waveform; combinations produce mixed outputs and some combined behaviors differ between 6581 and 8580 SID revisions.

## Source Code
```text
SID Voice 1 Control Register ($D404) - Bit map (MSB -> LSB)
Bit 7  Bit 6  Bit 5  Bit 4   Bit 3   Bit 2    Bit 1   Bit 0
NOISE  PULSE  SAW    TRI     TEST    RINGMOD  SYNC    GATE

Meaning:
  Bit 7 (0x80) - Noise waveform enable
  Bit 6 (0x40) - Pulse waveform enable
  Bit 5 (0x20) - Sawtooth waveform enable
  Bit 4 (0x10) - Triangle waveform enable
  Bit 3 (0x08) - TEST (reset oscillator/phase)
  Bit 2 (0x04) - Ring Modulation enable (with previous voice)
  Bit 1 (0x02) - Synchronize to previous oscillator
  Bit 0 (0x01) - Gate (key on/off for ADSR)

Address calculation:
  SID base = $D400
  Register 04 offset = $04
  => Control Register = $D400 + $04 = $D404

Example (assembly) — enable triangle+pulse, set GATE:
```asm
    LDA #$51       ; $50 = TRI+PULSE (0x10 + 0x40), +$01 for GATE -> $51
    STA $D404      ; write to SID Voice 1 Control Register
```
```

## Key Registers
- $D404 - SID - Voice 1 (Oscillator 1) Control Register (GATE, SYNC, RING MOD, TEST, waveform bits)

## References
- "control_register_overview_and_gate" — expands on Overview and GATE (Bit 0) description