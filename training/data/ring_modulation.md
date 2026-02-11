# SID Ring Modulation (6581/8580)

**Summary:** SID ring modulation (6581/8580) uses control bits in the voice control registers ($D404, $D40B, $D412) to replace a voice's triangle output with the product of that voice's triangle waveform and another voice's oscillator, producing sum/difference frequencies (F1±F2) and metallic/bell-like timbres.

## Ring modulation
Ring modulation multiplies a voice's triangle waveform by the oscillator waveform of a designated modulating voice. The audible result contains frequencies at F1+F2 and F1−F2 (and their harmonics), where F1 is the modulated voice's frequency and F2 is the modulator's frequency. If F1 and F2 are harmonically related the sound is tonal; if not, it is bell-like or metallic.

Voice pairing (same pairing as sync):
- Voice 1 ring-modulated by Voice 3 — control bit 2 of $D404
- Voice 2 ring-modulated by Voice 1 — control bit 2 of $D40B
- Voice 3 ring-modulated by Voice 2 — control bit 2 of $D412

Requirements:
- The TRIANGLE waveform bit must be set on the ring-modulated voice (triangle bit = bit 4 in that voice's control register).
- The modulating voice's oscillator must be running (frequency > 0).
- The modulating voice does not need to be gated or audible.

Practical example (bell/chime):
- Set Voice 1 frequency high (example: $0082 — high byte ≈ 130)
- Set Voice 3 frequency to a non-harmonic ratio (example: $001E — high byte ≈ 30)
- Enable RING MOD on Voice 1 (set bit 2 of $D404)
- Set TRIANGLE on Voice 1 (set bit 4 of $D404)
- Use short attack, medium decay for a percussive bell envelope (ADSR settings on the modulated voice)

## Key Registers
- $D400-$D406 - SID - Voice 1 registers (frequency low/high, pulse width low/high, CONTROL, ADSR)
- $D407-$D40D - SID - Voice 2 registers (frequency low/high, pulse width low/high, CONTROL, ADSR)
- $D40E-$D414 - SID - Voice 3 registers (frequency low/high, pulse width low/high, CONTROL, ADSR)
- $D404 - SID - Voice 1 CONTROL register: bit 2 = RING MOD (modulated by Voice 3); bit 4 = TRIANGLE waveform enable
- $D40B - SID - Voice 2 CONTROL register: bit 2 = RING MOD (modulated by Voice 1); bit 4 = TRIANGLE waveform enable
- $D412 - SID - Voice 3 CONTROL register: bit 2 = RING MOD (modulated by Voice 2); bit 4 = TRIANGLE waveform enable

## References
- "waveforms_triangle" — triangle waveform requirement and behavior
- "voice3_modulation_source" — using Voice 3 as modulator / LFO