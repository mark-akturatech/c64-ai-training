# Turbo loader pulse encoding (C64 tape)

**Summary:** Turbo tape loaders for the C64 use two pulse types ("short pulse" and "long pulse") with designer-chosen frequencies/durations; a single pulse length (measured against a threshold) encodes a bit, unlike the standard CBM multi-pulse schemes.

## Pulse encoding used by turbo loaders
Turbo loaders typically reduce the tape signal alphabet to two pulse lengths: a short pulse and a long pulse. Each stored pulse is intended to represent one bit — its duration alone determines whether the bit is a 0 or a 1. The loader on playback measures each pulse length and compares it against a threshold value to decide the bit value (pulse-length threshold detection).

Key characteristics:
- Two pulse types only: "short" and "long".
- Single-pulse-per-bit: no group-of-pulses pattern is required to represent a single bit.
- Pulse timing/frequency parameters (carrier or base timing) are chosen by the loader designer to maximize speed and robustness for that implementation.
- Decoding relies on a threshold comparison of measured pulse length (timing) rather than decoding a fixed CBM medium/short pair encoding.

## Comparison with standard CBM encoding
The Commodore standard (CBM) tape schemes often use multi-pulse patterns and distinct medium/short pairs (and sometimes three-pulse combinations) to encode bits and framing. Turbo loaders depart from that by:
- Using only two pulse lengths instead of multi-pulse sequences.
- Using a timing threshold approach (single measurement) instead of interpreting a predefined pulse pair sequence.
This reduces encoder/decoder complexity and can increase throughput, at the cost of requiring accurate timing and a reliable threshold selection.

## References
- "data_encoding_pulses" — expands on Standard CBM three-pulse encoding vs turbo two-pulse encoding  
- "figuring_out_threshold_value" — explains computing threshold values for turbo loaders using timers
