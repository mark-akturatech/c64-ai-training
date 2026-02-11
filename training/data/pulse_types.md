# Datassette Encoding — Pulse Length Categories (NTSC / PAL)

**Summary:** Defines the three datassette pulse length categories (Short, Medium, Long) and their nominal durations for NTSC and PAL used in Commodore tape encoding; these pulse types are the building blocks for bits and markers in tape data (see "bit_encoding").

## Pulse Types
Three pulse types are used by the Commodore datassette tape format to encode bits and markers. Nominal durations differ slightly between NTSC and PAL timing.

- Short — the shortest pulse used.
- Medium — the middle-length pulse used.
- Long — the longest pulse used.

Exact nominal durations are listed in the Source Code section below. These three pulse lengths are combined (see "bit_encoding") to form bit patterns and marker sequences; TAP file numeric values for the standard pulses are documented in "tap_file_format".

## Source Code
```text
Pulse Types

Type      NTSC         PAL
Short     176 µs       182.7 µs
Medium    256 µs       265.7 µs
Long      336 µs       348.8 µs
```

## References
- "bit_encoding" — expands on how short/medium/long pulses are combined to form bits and markers
- "tap_file_format" — expands on TAP numeric values for standard pulses
