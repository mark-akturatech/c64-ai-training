# Datassette Pulse-Length Encoding

**Summary:** The Commodore Datassette employs pulse-length encoding, where each recorded pulse represents a full HIGH+LOW tape waveform cycle. Varying pulse durations (short, medium, long) encode bits and control markers, and are commonly represented in TAP file lists of pulse lengths.

**Encoding Overview**

- **Pulse Types and Durations:**
  - **Short Pulse:** Approximately 352 µs total duration (176 µs HIGH + 176 µs LOW), corresponding to a frequency of 2840 Hz.
  - **Medium Pulse:** Approximately 512 µs total duration (256 µs HIGH + 256 µs LOW), corresponding to a frequency of 1953 Hz.
  - **Long Pulse:** Approximately 672 µs total duration (336 µs HIGH + 336 µs LOW), corresponding to a frequency of 1488 Hz.

- **Bit and Marker Encoding:**
  - **Bit '0':** Encoded as a short pulse followed by a medium pulse.
  - **Bit '1':** Encoded as a medium pulse followed by a short pulse.
  - **Byte Marker:** Encoded as a long pulse followed by a medium pulse.
  - **End-of-Data Marker:** Encoded as a long pulse followed by a short pulse.

- **TAP File Format:**
  - **Header:**
    - Bytes 0–11: Signature ("C64-TAPE-RAW" or "C16-TAPE-RAW").
    - Byte 12: Version (00, 01, or 02).
    - Byte 13: Machine type (00 for C64/C128, 01 for VIC-20, 02 for C16/Plus4).
    - Byte 14: Video system (00 for PAL, 01 for NTSC).
    - Bytes 16–19: Data block size (excluding header), stored in little-endian format.
  - **Data Section:**
    - Contains pulse length information. Each byte represents the number of machine cycles multiplied by 8 that each pulse lasts.
    - Pulse length calculation: `Pulse_length = Data * (8 / frequency)`, where frequency is the clock speed of the Commodore computer.
    - For example, a value of 0x30 (48 in decimal) in a TAP file for a PAL Commodore 64 (frequency of 985248 Hz) results in a pulse width of approximately 389.74 µs.

## Source Code

```text
Example Waveform Diagram:

Bit '0' Encoding:
  Short Pulse (176 µs HIGH + 176 µs LOW)
  Medium Pulse (256 µs HIGH + 256 µs LOW)

  |<--176 µs-->|<--176 µs-->|<--256 µs-->|<--256 µs-->|
  |    HIGH    |    LOW     |    HIGH    |    LOW     |
  |------------|------------|------------|------------|

Bit '1' Encoding:
  Medium Pulse (256 µs HIGH + 256 µs LOW)
  Short Pulse (176 µs HIGH + 176 µs LOW)

  |<--256 µs-->|<--256 µs-->|<--176 µs-->|<--176 µs-->|
  |    HIGH    |    LOW     |    HIGH    |    LOW     |
  |------------|------------|------------|------------|

Byte Marker:
  Long Pulse (336 µs HIGH + 336 µs LOW)
  Medium Pulse (256 µs HIGH + 256 µs LOW)

  |<--336 µs-->|<--336 µs-->|<--256 µs-->|<--256 µs-->|
  |    HIGH    |    LOW     |    HIGH    |    LOW     |
  |------------|------------|------------|------------|

End-of-Data Marker:
  Long Pulse (336 µs HIGH + 336 µs LOW)
  Short Pulse (176 µs HIGH + 176 µs LOW)

  |<--336 µs-->|<--336 µs-->|<--176 µs-->|<--176 µs-->|
  |    HIGH    |    LOW     |    HIGH    |    LOW     |
  |------------|------------|------------|------------|
```

## References

- [Commodore Free Issue 59](https://www.commodorefree.com/magazine/vol6/issue59.html)
- [Datassette Encoding - C64-Wiki](https://www.c64-wiki.com/wiki/Datassette_Encoding)
- [TAP File Format - Commodore 64 Cassette Tape Image](https://file-extensions.com/docs/tap)
- [Aufzeichnungsformat der Datassette – C64-Wiki](https://www.c64-wiki.de/wiki/Aufzeichnungsformat_der_Datassette)