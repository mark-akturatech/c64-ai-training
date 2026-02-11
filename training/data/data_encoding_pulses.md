# C64 tape pulse encoding (CBM C2N)

**Summary:** Describes Commodore 64 cassette (C2N) data as 50% duty‑cycle square‑wave pulses and the three standard CBM pulse periods/frequencies (long ≈672 µs / 1488 Hz, medium ≈512 µs / 1953 Hz, short ≈352 µs / 2840 Hz). Notes that data bits are encoded using pairs of pulses (medium + short) and that pulse names refer to period.

## Data Encoding
C64 cassette data is carried as back‑to‑back square waves (50% duty cycle) on the C2N audio line; each contiguous square wave is called a pulse. The standard Commodore encoding uses three distinct pulse periods (shown with their approximate frequency equivalents):

- Long pulse: period ≈ 672 µs — frequency ≈ 1488 Hz  
- Medium pulse: period ≈ 512 µs — frequency ≈ 1953 Hz  
- Short pulse: period ≈ 352 µs — frequency ≈ 2840 Hz

Note: the names "long/medium/short" describe the pulse period (time per cycle), not the frequency. Period and frequency are related by period = 1 / frequency.

Data bits are encoded by sequences of pulses — specifically the standard CBM loader uses combinations of the medium and short pulses to represent bits (each data bit is encoded by a couple of pulses). This chunk does not include the detailed bit-to-pulse mapping, header/sync patterns, or TAP file format specifics; those are covered by the CBM loader documentation and other referenced material.

For related topics, see the CBM loader (ROM loader) discussion and material on pulse sampling/edge detection and on turbo loaders (which contrast by using two pulse lengths rather than CBM's three).

## References
- "loaders:ROM_Loader" — CBM Loader structure and software details  
- "pulse_sample_and_edge_detection" — how pulses appear on the C2N READ pin and edge detection details  
- "turbo_loader_pulses" — contrast with Turbo Loader using two pulse lengths  
- Nick Hampshire — referenced book covering CBM loader internals