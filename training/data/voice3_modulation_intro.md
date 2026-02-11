# SID 6581/8580 — Voice 3 as Modulation Source

**Summary:** Voice 3 oscillator and envelope readouts are available at $D41B and $D41C, and Voice 3's audible output can be muted via bit 7 of $D418, allowing Voice 3 to be used as a dedicated modulation source (LFO) for vibrato or filter sweeps on the SID.

## Description
Voice 3 provides two readable outputs useful for modulation: the oscillator output (read at $D41B) and the envelope output (read at $D41C). The audio output of Voice 3 can be disabled by toggling bit 7 of register $D418, so the voice continues to run (oscillator + envelope) while producing no audible sound. This lets Voice 3 act as an internal LFO or modulation source for effects such as vibrato (frequency modulation) or filter modulation without adding its own audible voice.

(See referenced expansions for techniques that use the oscillator readback for frequency modulation and the envelope readback for filter sweeps.)

## Key Registers
- $D418 - SID (6581/8580) - Voice 3 mute control: bit 7 mutes Voice 3's audio output
- $D41B - SID (6581/8580) - Voice 3 oscillator output readback
- $D41C - SID (6581/8580) - Voice 3 envelope output readback

## References
- "vibrato_technique" — expands on frequency modulation using $D41B  
- "filter_sweeps" — expands on filter modulation using Voice 3