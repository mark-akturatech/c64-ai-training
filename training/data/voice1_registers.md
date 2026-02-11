# SID Voice 1 registers $D400-$D406 (6581 / 8580)

**Summary:** Voice 1 SID registers $D400-$D406 — 16-bit frequency (PAL/NTSC clock and Fout formula), 12-bit pulse width (PWn, PW%), control bits (waveforms, TEST, RING MOD, SYNC, GATE), and ADSR (Attack/Decay and Sustain/Release nibbles). Notes on combined waveforms and noise LFSR lockup for 6581 vs 8580.

## Voice 1 overview
These six write-only registers control SID Voice 1's oscillator frequency, pulse width, waveform selection and modulation, and envelope (ADSR). Frequency is a 16-bit value split across $D400/$D401; PW is a 12-bit value split across $D402/$D403. The control register enables individual waveform outputs (their outputs are ANDed when multiple bits are set), TEST, ring modulation (with Voice 3), oscillator sync (to Voice 3), and the GATE bit to start/stop ADSR. ADSR uses 4-bit nibbles for rates and level.

Important numeric/behavioral points:
- Frequency calculation (Fn is the 16-bit register value 0–65535):
  - Fout = (Fn * Clock) / 2^24  — rearranged in source as Frequency = (Fout * 16777216) / Clock (same relation).
  - PAL clock = 985,248 Hz → Fout ≈ Fn * 0.058725 Hz
  - NTSC clock = 1,022,727 Hz → Fout ≈ Fn * 0.060959 Hz
- Pulse width:
  - 12-bit PWn (0–4095). PW% = PWn / 40.95
  - PWn = 2048 (0x800) ≈ 50% duty (square)
  - PWn = 0 or 4095 produces silence (fully on or fully off)
- Control register behavior:
  - Multiple waveform bits set → logical AND of selected waveforms (combined waveforms). On 6581 combined outputs are audible but attenuated; on 8580 combined waveforms are quieter and can sometimes be silent.
  - Combining noise with any other waveform can lock the noise LFSR (noise output may lock up).
  - Ring modulation replaces the triangle output with ring-modulated output; triangle must also be selected for ring mod to take effect.
  - SYNC resets Voice 1 oscillator accumulator on each cycle of Voice 3.
- ADSR:
  - $D405: Attack (high nibble 0–15) and Decay (low nibble 0–15)
  - $D406: Sustain level (high nibble 0–15, 15 = peak) and Release (low nibble 0–15)

## Source Code
```text
$D400 / 54272 - VOICE 1: FREQUENCY LOW BYTE (Write-only)
  Bits 7-0: Low 8 bits of the 16-bit frequency value
  Combined with $D401 to form the oscillator frequency.

$D401 / 54273 - VOICE 1: FREQUENCY HIGH BYTE (Write-only)
  Bits 7-0: High 8 bits of the 16-bit frequency value
  Frequency = (Fout * 16777216) / Clock
    PAL  Clock = 985248 Hz  -> Fout = Fn * 0.058725 Hz
    NTSC Clock = 1022727 Hz -> Fout = Fn * 0.060959 Hz
  Where Fn is the 16-bit register value (0-65535).

$D402 / 54274 - VOICE 1: PULSE WIDTH LOW BYTE (Write-only)
  Bits 7-0: Low 8 bits of the 12-bit pulse width value

$D403 / 54275 - VOICE 1: PULSE WIDTH HIGH BYTE (Write-only)
  Bits 3-0: High 4 bits of the 12-bit pulse width value
  Bits 7-4: Unused
  Pulse Width % = (PWn / 40.95)
  PWn = 2048 ($800) produces a 50% duty cycle (square wave).
  PWn = 0 or 4095 produces silence (fully on or fully off).

$D404 / 54276 - VOICE 1: CONTROL REGISTER (Write-only)
  Bit 7: NOISE     - Select noise waveform
  Bit 6: PULSE     - Select pulse/rectangle waveform
  Bit 5: SAWTOOTH  - Select sawtooth waveform
  Bit 4: TRIANGLE  - Select triangle waveform
  Bit 3: TEST      - Reset oscillator and hold at zero; lock pulse at high
  Bit 2: RING MOD  - Ring modulate Voice 1 with Voice 3 oscillator
                      (replaces triangle output with ring modulated output;
                       triangle bit must also be set)
  Bit 1: SYNC      - Synchronize Voice 1 oscillator with Voice 3 oscillator
                      (Voice 3 resets Voice 1's oscillator accumulator on
                       each cycle of Voice 3)
  Bit 0: GATE      - 1 = Start Attack/Decay/Sustain cycle
                      0 = Start Release cycle

  NOTE: Setting multiple waveform bits simultaneously produces combined
  waveforms (logical AND of the selected waveforms). On the 6581 this
  produces audible but attenuated results. On the 8580 combined waveforms
  are quieter and sometimes silent. The noise waveform combined with any
  other waveform can lock up the noise LFSR.

$D405 / 54277 - VOICE 1: ATTACK / DECAY (Write-only)
  Bits 7-4: ATTACK rate (0-15)
  Bits 3-0: DECAY rate (0-15)
  Register value = (Attack * 16) + Decay

$D406 / 54278 - VOICE 1: SUSTAIN / RELEASE (Write-only)
  Bits 7-4: SUSTAIN level (0-15, where 15 = peak volume)
  Bits 3-0: RELEASE rate (0-15)
  Register value = (Sustain * 16) + Release
```

## Key Registers
- $D400-$D401 - SID - Voice 1 frequency (16-bit low/high) — Fn → Fout (PAL/NTSC clocks shown)
- $D402-$D403 - SID - Voice 1 pulse width (12-bit PWn, PW% = PWn/40.95; 0x800 ≈ 50%)
- $D404 - SID - Voice 1 control (waveform selects, TEST, RING MOD, SYNC, GATE)
- $D405 - SID - Voice 1 Attack/Decay (nibbles: Attack hi, Decay lo)
- $D406 - SID - Voice 1 Sustain/Release (nibbles: Sustain hi, Release lo)

## References
- "voice2_registers" — Voice 2 registers (identical register layout)
- "waveforms_triangle" — triangle waveform behavior and ring modulation details
- "adsr_overview" — ADSR rates and interaction with GATE and envelope timing