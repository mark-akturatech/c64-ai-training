# C64 Tape Loaders — Data Encoding and Context

**Summary:** Introduces how the Commodore 64 CPU exchanges data with the cassette unit (C2N), and frames why understanding C64 I/O hardware and timing is required before converting to/working with TAP format; keywords: C2N, cassette I/O, CBM pulse types, pulse-based bit encoding, TAP format, timing, Kernal.

## Data Encoding
This chunk introduces the data-transfer context for C64 tape loaders: the electrical and timing relationship between the 6510/6502 CPU (via C64 I/O hardware/Kernal) and the Commodore cassette unit (C2N). It establishes that:

- Tape data is conveyed as pulses (CBM pulse types) whose durations encode bits (pulse-based bit encoding).
- Accurate TAP-file representation depends on capturing C64 timing precisely (pulse lengths, gaps, leader/sync patterns).
- Before attempting TAP format conversion or emulation, one must understand the C64 tape I/O path and timing constraints implemented by the machine's hardware and Kernal routines (see below for the recommended reference).

This node is an orienting entry; detailed pulse types, bit-encoding schemes, and TAP-format specifics are covered in dedicated nodes.

## Further reading
- For a detailed hardware-level discussion of cassette I/O, see section 4.5 of Nick Hampshire's "The Commodore 64 Kernal and Hardware Revealed" (publisher: Collins) — cited here as the primary external reference for C2N transfer mechanics and timing.
- See the related nodes:
  - data_encoding_pulses — CBM pulse classifications and pulse-based bit-encoding formats
  - tap_format_conversion — how TAP files represent C64 tape timing and conversion caveats

## References
- "nick_hampshire_kernal_and_hardware_revealed" — Section 4.5: C64 cassette (C2N) hardware and data-transfer timing
- "data_encoding_pulses" — CBM pulse types and pulse-based bit encoding (pulse length, leader/sync, bit cell formats)
- "tap_format_conversion" — TAP file timing representation and conversion dependencies (pulse timing → TAP samples)