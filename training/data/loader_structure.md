# IRQ tape loader structure (Threshold $027C, TAP $50, MSbF, Pilot $40, Sync $5A)

**Summary:** This document describes a Commodore 64 tape IRQ loader format with the following characteristics:

- **Threshold:** $027C clock cycles (TAP value: $50).
- **Bit order:** Most Significant bit First (MSbF).
- **Pilot byte:** $40.
- **Sync/Start byte:** $5A.
- **Header layout:**
  - 1 byte: unused (reserved).
  - 2 bytes: Load address (LSB first).
  - 2 bytes: End address + 1 (LSB first).
- **Data:** Followed by a single-byte XOR checksum.

**Loader structure**

**Threshold and timing:**

- **Threshold:** $027C clock cycles (TAP value: $50). This threshold is used to distinguish between bit cells during data decoding.

**Bit order:**

- **Endianness / bit order:** Most Significant bit First (MSbF).

**Framing bytes:**

- **Pilot byte:** $40 — used as the pilot pattern preceding a data block.
- **Start/Sync byte:** $5A — indicates the start of the payload (also known as the Sync Byte).

**Header layout:**

- 1 byte: unused (reserved).
- 2 bytes: Load address (LSB first).
- 2 bytes: End address + 1 (LSB first).

**Data:**

- After the header, payload bytes are encoded in MSbF order.
- **Checksum:** 1 byte, calculated as the XOR of all payload bytes.

**Bit encoding:**

Each bit is represented by a pair of pulses with specific durations:

- **Bit 0:** Short pulse (176 µs) followed by a Medium pulse (256 µs).
- **Bit 1:** Medium pulse (256 µs) followed by a Short pulse (176 µs).

These pulse durations correspond to frequencies of approximately 2840 Hz for short pulses and 1953 Hz for medium pulses. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))

**Timing diagram:**

Below is an ASCII representation of the pulse sequences for bit 0 and bit 1:


Where 'S' denotes a short pulse (176 µs) and 'M' denotes a medium pulse (256 µs).

**Notes:**

- The "Start of payload Byte (1): $5A" is the Sync Byte.
- The XOR checksum is calculated over all payload bytes.

## Source Code

```text
Bit 0:  |---|       |-------|
        | S |  M    |   M   |  S
        |---|       |-------|

Bit 1:  |-------|   |---|
        |   M   | S | S |  M
        |-------|   |---|
```


```text
Threshold: $027C clock cycles (TAP value=$50)
Endianness: MSbF

Pilot Byte: $40
Start of payload Byte (1): $5A

Header:

  1 byte: unused
  2 bytes: Load address (LSB first)
  2 bytes: End address+1 (LSB first)

Data:

  1 byte: XOR checksum

(1) better known as "Sync Byte".
```

## References

- "Datassette Encoding" — C64-Wiki
- "Tape Format" — SID Preservation
- "How Commodore tapes work" — wav-prg.sourceforge.io