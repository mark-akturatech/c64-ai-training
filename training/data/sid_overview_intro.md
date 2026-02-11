# C64 SID ($D400-$D41C) — 6581 Sound Interface Device Registers

**Summary:** Registers $D400-$D41C (54272–54300) map to the 6581 Sound Interface Device (SID) on the Commodore 64. The SID provides three voices with 16-bit frequency control, waveform selection, ADSR envelopes, sync/ring modulation, and programmable filters (low/high/band-pass).

**Overview**
Memory locations $D400-$D41C address the 6581 SID. The SID is a 3-voice synthesizer chip whose voice and filter registers are typically write-only; only a few final/status registers are readable on some revisions. Each voice offers:
- 16-bit frequency control (two 8-bit registers),
- waveform selection and control bits (including sync and ring modulation),
- pulse-width control,
- an ADSR envelope generator (Attack, Decay, Sustain, Release),
- and a gate/control bit to start/stop the envelope.

The SID also provides programmable filters (low-pass, high-pass, band-pass) with cutoff and resonance controls and filter enable bits affecting voice outputs. Producing sound normally requires setting multiple registers in concert — e.g., program frequency (low/high), set waveform/control (including gate), set ADSR registers, and enable/filter as needed.

**Register Map and Bitfields**

Below is the detailed register map for the SID, including bitfield descriptions for each register.

### Voice 1 Registers ($D400–$D406)
- **$D400/$D401: Frequency Control (Low/High Byte)**
  - **$D400 (FREQ LO):** Bits 0–7 of the 16-bit frequency value.
  - **$D401 (FREQ HI):** Bits 8–15 of the 16-bit frequency value.

- **$D402/$D403: Pulse Width Control (Low/High Byte)**
  - **$D402 (PW LO):** Bits 0–7 of the 12-bit pulse width value.
  - **$D403 (PW HI):** Bits 4–7 of the 12-bit pulse width value (Bits 0–3 are unused).

- **$D404: Control Register**
  - **Bit 7 (NOISE):** 1 = Enable noise waveform.
  - **Bit 6 (PULSE):** 1 = Enable pulse waveform.
  - **Bit 5 (SAWTOOTH):** 1 = Enable sawtooth waveform.
  - **Bit 4 (TRIANGLE):** 1 = Enable triangle waveform.
  - **Bit 3 (TEST):** 1 = Test mode (forces oscillator to 0).
  - **Bit 2 (RING MOD):** 1 = Enable ring modulation with previous voice.
  - **Bit 1 (SYNC):** 1 = Synchronize oscillator with previous voice.
  - **Bit 0 (GATE):** 1 = Start attack/decay/sustain cycle; 0 = Start release cycle.

- **$D405: Attack/Decay Register**
  - **Bits 4–7 (ATTACK):** Attack rate (0–15).
  - **Bits 0–3 (DECAY):** Decay rate (0–15).

- **$D406: Sustain/Release Register**
  - **Bits 4–7 (SUSTAIN):** Sustain level (0–15).
  - **Bits 0–3 (RELEASE):** Release rate (0–15).

### Voice 2 Registers ($D407–$D40D)
- **$D407/$D408: Frequency Control (Low/High Byte)**
  - **$D407 (FREQ LO):** Bits 0–7 of the 16-bit frequency value.
  - **$D408 (FREQ HI):** Bits 8–15 of the 16-bit frequency value.

- **$D409/$D40A: Pulse Width Control (Low/High Byte)**
  - **$D409 (PW LO):** Bits 0–7 of the 12-bit pulse width value.
  - **$D40A (PW HI):** Bits 4–7 of the 12-bit pulse width value (Bits 0–3 are unused).

- **$D40B: Control Register**
  - **Bit 7 (NOISE):** 1 = Enable noise waveform.
  - **Bit 6 (PULSE):** 1 = Enable pulse waveform.
  - **Bit 5 (SAWTOOTH):** 1 = Enable sawtooth waveform.
  - **Bit 4 (TRIANGLE):** 1 = Enable triangle waveform.
  - **Bit 3 (TEST):** 1 = Test mode (forces oscillator to 0).
  - **Bit 2 (RING MOD):** 1 = Enable ring modulation with previous voice.
  - **Bit 1 (SYNC):** 1 = Synchronize oscillator with previous voice.
  - **Bit 0 (GATE):** 1 = Start attack/decay/sustain cycle; 0 = Start release cycle.

- **$D40C: Attack/Decay Register**
  - **Bits 4–7 (ATTACK):** Attack rate (0–15).
  - **Bits 0–3 (DECAY):** Decay rate (0–15).

- **$D40D: Sustain/Release Register**
  - **Bits 4–7 (SUSTAIN):** Sustain level (0–15).
  - **Bits 0–3 (RELEASE):** Release rate (0–15).

### Voice 3 Registers ($D40E–$D414)
- **$D40E/$D40F: Frequency Control (Low/High Byte)**
  - **$D40E (FREQ LO):** Bits 0–7 of the 16-bit frequency value.
  - **$D40F (FREQ HI):** Bits 8–15 of the 16-bit frequency value.

- **$D410/$D411: Pulse Width Control (Low/High Byte)**
  - **$D410 (PW LO):** Bits 0–7 of the 12-bit pulse width value.
  - **$D411 (PW HI):** Bits 4–7 of the 12-bit pulse width value (Bits 0–3 are unused).

- **$D412: Control Register**
  - **Bit 7 (NOISE):** 1 = Enable noise waveform.
  - **Bit 6 (PULSE):** 1 = Enable pulse waveform.
  - **Bit 5 (SAWTOOTH):** 1 = Enable sawtooth waveform.
  - **Bit 4 (TRIANGLE):** 1 = Enable triangle waveform.
  - **Bit 3 (TEST):** 1 = Test mode (forces oscillator to 0).
  - **Bit 2 (RING MOD):** 1 = Enable ring modulation with previous voice.
  - **Bit 1 (SYNC):** 1 = Synchronize oscillator with previous voice.
  - **Bit 0 (GATE):** 1 = Start attack/decay/sustain cycle; 0 = Start release cycle.

- **$D413: Attack/Decay Register**
  - **Bits 4–7 (ATTACK):** Attack rate (0–15).
  - **Bits 0–3 (DECAY):** Decay rate (0–15).

- **$D414: Sustain/Release Register**
  - **Bits 4–7 (SUSTAIN):** Sustain level (0–15).
  - **Bits 0–3 (RELEASE):** Release rate (0–15).

### Filter and Miscellaneous Registers ($D415–$D41C)
- **$D415/$D416: Filter Cutoff Frequency (Low/High Byte)**
  - **$D415 (FC LO):** Bits 0–7 of the 11-bit cutoff frequency value.
  - **$D416 (FC HI):** Bits 3–7 of the 11-bit cutoff frequency value (Bits 0–2 are unused).

- **$D417: Filter Resonance and Voice Routing**
  - **Bits 4–7 (RES):** Resonance control (0–15).
  - **Bit 3 (FILT 3):** 1 = Apply filter to Voice 3.
  - **Bit 2 (FILT 2):** 1 = Apply filter to Voice 2.
  - **Bit 1 (FILT 1):** 1 = Apply filter to Voice 1.
  - **Bit 0 (FILT EXT):** 1 = Apply filter to external input.

- **$D418: Filter Mode and Volume**
  - **Bit 7 (FILTER ENABLE):** 1 = Enable filter.
  - **Bit 6 (FILTER HP):** 1 = High-pass filter mode.
  - **Bit 5 (FILTER BP):** 1 = Band-pass filter mode.
  - **Bit 4 (FILTER LP):** 1 = Low-pass filter mode.
  - **Bits 0–3 (VOLUME):** Master volume control (0–15).

- **$D419: Paddle X (Read-Only)**
  - **Bits 0–7:** 8-bit value representing the position of Paddle X.

- **$D41A: Paddle Y (Read-Only)**
  - **Bits 0–7:** 8-bit value representing the position of Paddle Y.

- **$D41B: Oscillator 3 Output (Read-Only)**
  - **Bits 0–7:** Current output value of Oscillator 3.

- **$D41C: Envelope 3 Output (Read-Only)**
  - **Bits 0–7:** Current envelope value of Voice 3.

## Key Registers
- **$D400–$D41C:** SID (6581) - Full SID register block (three voices, filters, master controls).
- **$D400–$D406:** SID - Voice 1 registers (16-bit frequency, pulse width, waveform/control, ADSR).
- **$D407–$D40D:** SID - Voice 2 registers (16-bit frequency, pulse width, waveform/control, ADSR).
- **$D40E–$D414:** SID - Voice 3 registers (16-bit frequency, pulse width, waveform/control, ADSR).
- **$D415–$D418:** SID - Filter controls (cutoff, resonance, filter mode/enable).

## References
- "sid_voice_registers_overview" — expands on Voice registers and common control sequence.
- "sid_filter_controls" — expands on Filter controls and cutoff/resonance registers.