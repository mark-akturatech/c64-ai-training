# SID Voice 3 Registers ($D40E-$D414)

**Summary:** SID 6581/8580 Voice 3 register map for $D40E-$D414: frequency low/high ($D40E/$D40F), pulse width low/high ($D410/$D411), control register $D412 (Bit 2 = RING MOD with Voice 2, Bit 1 = SYNC with Voice 2), ADSR envelopes $D413/$D414. Voice 3 output/readback for modulation is available at $D41B/$D41C.

**Voice 3 register descriptions**
All registers below are described as in the source: addresses (hex and decimal) and short function notes. Registers are write-only where noted.

- $D40E / 54286 — VOICE 3: FREQUENCY LOW BYTE (Write-only)  
- $D40F / 54287 — VOICE 3: FREQUENCY HIGH BYTE (Write-only)  
- $D410 / 54288 — VOICE 3: PULSE WIDTH LOW BYTE (Write-only)  
- $D411 / 54289 — VOICE 3: PULSE WIDTH HIGH BYTE (Write-only)  
- $D412 / 54290 — VOICE 3: CONTROL REGISTER (Write-only)  
  - Bit 7: NOISE — Selects noise waveform  
  - Bit 6: PULSE — Selects pulse waveform  
  - Bit 5: SAWTOOTH — Selects sawtooth waveform  
  - Bit 4: TRIANGLE — Selects triangle waveform  
  - Bit 3: TEST — Puts oscillator into test mode  
  - Bit 2: RING MOD — Ring-modulate Voice 3 with Voice 2 oscillator  
  - Bit 1: SYNC — Synchronize Voice 3 with Voice 2 oscillator  
  - Bit 0: GATE — Controls envelope generator (1 = start attack/decay/sustain cycle, 0 = start release cycle)  
- $D413 / 54291 — VOICE 3: ATTACK / DECAY (Write-only)  
  - Bits 7-4: ATTACK — Attack rate (0-15)  
  - Bits 3-0: DECAY — Decay rate (0-15)  
- $D414 / 54292 — VOICE 3: SUSTAIN / RELEASE (Write-only)  
  - Bits 7-4: SUSTAIN — Sustain level (0-15)  
  - Bits 3-0: RELEASE — Release rate (0-15)  

Note: Voice 3 can be read back as a modulation source at $D41B/$D41C. The readback at $D41B provides the current output of the Voice 3 oscillator, while $D41C provides the current output of the Voice 3 envelope generator. These values can be used for modulation purposes.

## Source Code
```text
$D40E / 54286 - VOICE 3: FREQUENCY LOW BYTE (Write-only)
$D40F / 54287 - VOICE 3: FREQUENCY HIGH BYTE (Write-only)
$D410 / 54288 - VOICE 3: PULSE WIDTH LOW BYTE (Write-only)
$D411 / 54289 - VOICE 3: PULSE WIDTH HIGH BYTE (Write-only)
$D412 / 54290 - VOICE 3: CONTROL REGISTER (Write-only)
  Bit 7: NOISE     - Selects noise waveform
  Bit 6: PULSE     - Selects pulse waveform
  Bit 5: SAWTOOTH  - Selects sawtooth waveform
  Bit 4: TRIANGLE  - Selects triangle waveform
  Bit 3: TEST      - Puts oscillator into test mode
  Bit 2: RING MOD  - Ring-modulate Voice 3 with Voice 2 oscillator
  Bit 1: SYNC      - Synchronize Voice 3 with Voice 2 oscillator
  Bit 0: GATE      - Controls envelope generator (1 = start attack/decay/sustain cycle, 0 = start release cycle)
$D413 / 54291 - VOICE 3: ATTACK / DECAY (Write-only)
  Bits 7-4: ATTACK - Attack rate (0-15)
  Bits 3-0: DECAY  - Decay rate (0-15)
$D414 / 54292 - VOICE 3: SUSTAIN / RELEASE (Write-only)
  Bits 7-4: SUSTAIN - Sustain level (0-15)
  Bits 3-0: RELEASE - Release rate (0-15)
```

## Key Registers
- $D40E-$D414 - SID (6581/8580) - Voice 3: Frequency, Pulse Width, Control, ADSR
- $D41B-$D41C - SID (6581/8580) - Voice 3 readback/output for modulation

## References
- "voice3_modulation_source" — expands on using Voice 3 oscillator/envelope as LFO/modulation source  
- "read_only_registers" — expands on location and behavior of $D41B/$D41C readbacks

## Labels
- VOICE3_FREQUENCY_LOW
- VOICE3_FREQUENCY_HIGH
- VOICE3_PULSE_WIDTH_LOW
- VOICE3_PULSE_WIDTH_HIGH
- VOICE3_CONTROL
- VOICE3_ATTACK_DECAY
- VOICE3_SUSTAIN_RELEASE
