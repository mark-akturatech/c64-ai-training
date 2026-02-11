# TAP byte mapping: Bit 0 = $36, Bit 1 = $65 (observed)

**Summary:** Observed mapping in a specific C64 TAP file: waveform byte value for logical Bit 0 = $36 and for Bit 1 = $65; TAP stream may also contain trailer pulses. Search terms: TAP, TAP file, bit mapping, trailer pulse, $36, $65.

## Observation
In the analyzed TAP file the byte values used in the pulse stream that represent logical bits were:
- Bit 0 -> $36
- Bit 1 -> $65

A brief scan of the TAP stream (pulse-value sequence) will also reveal whether this loader appends any trailer pulses after the encoded data. (trailer pulse = repeated/post-data pulses used by some tape loaders)

This mapping is specific to the analyzed TAP sample — other TAPs/loaders may use different byte values for bit encodings. For details on how those byte values correspond to pulse lengths or timing, see the referenced TAP encoding and loader-structure documents.

## Source Code
```text
Code:
Bit 0: $36
Bit 1: $65
```

## References
- "tap_format_conversion" — expands on TAP encoding of pulse lengths to numeric values
- "loader_structure" — expands on Bit/byte format used by this loader