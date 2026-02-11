# SID: Voice 3 → Filter Cutoff Modulation (wah‑wah)

**Summary:** Use SID Voice 3 as a low-frequency oscillator (LFO) and read $D41B, scale/add its output to the filter cutoff registers ($D415/$D416) to perform automatic filter sweeps (wah‑wah). Waveform selection (triangle, sawtooth, pulse, noise) controls the sweep shape.

## Description
Procedure:
1. Configure Voice 3 as a low-frequency oscillator (set its frequency low and choose a waveform).  
2. Periodically read $D41B and compute a scaled/offset value appropriate for the filter cutoff range.  
3. Write the computed value into the filter cutoff registers ($D415/$D416). Repeating this produces automatic filter sweeps (wah‑wah).

Notes on behavior:
- Triangle waveform — smooth up-and-down sweep (continuous, bipolar-like motion).  
- Sawtooth waveform — ramp in one direction with a sudden reset (asymmetric sweep).  
- Pulse waveform — abrupt alternation between two cutoff values (stepped switching).  
- Noise waveform — random sample-and-hold style modulation (irregular, per-sample variations).

Practical considerations (from source implications):
- The two cutoff registers ($D415/$D416) hold the filter cutoff value; updates should be scaled to match the SID filter range used by your patch.  
- The value read from $D41B is intended as the modulation source (Voice 3 LFO sample) and must usually be scaled and offset before adding to the cutoff to get musically useful sweeps.  
- Waveform choice on Voice 3 determines the character of the sweep; frequency of Voice 3 sets sweep speed.

## Key Registers
- $D415-$D416 - SID - Filter cutoff registers (cutoff frequency MSB/LSB)  
- $D41B - SID - Readback used as Voice 3 LFO/sample (read modulation source)

## References
- "filter_cutoff_frequency" — expands on target registers $D415/$D416 and mapping  
- "vibrato_technique" — expands on using Voice 3 as an LFO for different parameters

## Labels
- $D415
- $D416
- $D41B
