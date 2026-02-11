# SID 6581/8580 Pulse / Rectangle (Pulse Width, PWM)

**Summary:** Pulse/rectangle waveform on the SID (12-bit PWn) produces variable duty-cycle tones; PWn = 2048 ($0800) = 50% square wave (only odd harmonics). Pulse Width Modulation (PWM) — dynamically sweeping the PWn registers ($D402/$D403 for voice 1) — yields a rich, chorus-like effect.

## Pulse / Rectangle
Produces a rectangular (pulse) waveform with a programmable duty cycle (pulse width). The SID uses a 12-bit pulse-width value (PWn, range 0–4095). Harmonic content depends strongly on duty cycle:

- 50% (PWn = 2048 / $0800): perfect square wave — contains only odd harmonics; described as hollow / clarinet-like.
- 25% or 75%: thinner, more nasal timbre — contains both odd and even harmonics.
- Near 0% or 100%: extremely thin, nearly silent.

Pulse Width Modulation (PWM) = continuously or periodically changing the PWn value (e.g., LFO or envelope writes to the PW registers). PWM produces a moving spectral imbalance that sounds animated or chorus-like.

## Key Registers
- $D402-$D403 - SID - Voice 1 Pulse Width (12-bit PWn: low byte at $D402, high 4 bits in $D403)

## References
- "pwm_technique" — expands on implementation of PWM via $D402/$D403
- "typical_instrument_patches" — patch examples using PWM (Piano, Synth Lead)

## Labels
- PW1
