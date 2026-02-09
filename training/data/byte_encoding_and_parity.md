# Datassette Byte Encoding (Complete byte format and parity)

**Summary:** Describes the Datassette byte format: a byte begins with a byte marker (long+medium), followed by 8 data bits recorded LSB-first, then an odd parity bit; per-byte duration ≈ 8.96 ms. Searchable terms: Datassette, byte marker, LSB-first, odd parity, S/M, M/S, 8.96 ms.

**Byte Encoding**

A recorded byte on the Commodore Datassette tape stream starts with a byte marker (specified as long+medium). After the marker, the eight payload bits are recorded least-significant-bit (LSB) first. An odd parity bit follows the eight data bits; the parity bit is calculated so the total number of '1' bits (eight data bits plus parity) is odd. The source expresses this as:

- parity = XOR(all eight data bits) XOR 1  (so XOR(data bits, parity) = 1)

Each recorded byte occupies approximately 8.96 ms on tape.

The compact schematic for the byte shows the marker and the sequence of bit encodings and the trailing parity bit. Details of how individual bits are encoded as pulse pairs (short/medium/long pulses) are covered in the referenced "bit_encoding" document; checksum calculation over payload bytes is covered in the referenced "checksum_calculation" document.

## Source Code

```text
Complete byte structure:

    L/M    S/M  S/M  S/M  S/M  S/M  S/M  S/M  S/M  M/S
    marker bit0 bit1 bit2 bit3 bit4 bit5 bit6 bit7 parity

Notes from source:
- A byte begins with the byte marker (long+medium), followed by 8 bits recorded LSB first, then an odd parity bit (parity = XOR of all 8 data bits XOR 1 yields 1 for odd parity).
- Each recorded byte takes ~8.96 ms.
- Compact representation: L/M (marker), S/M bit0, S/M bit1, ..., S/M bit7, M/S parity.
```

## Key Registers

- **Byte Marker:** L/M (Long pulse followed by Medium pulse)
- **Bit 0 Encoding:** S/M (Short pulse followed by Medium pulse)
- **Bit 1 Encoding:** M/S (Medium pulse followed by Short pulse)
- **Parity Bit Encoding:** M/S (Medium pulse followed by Short pulse)

## References

- "bit_encoding" — expands on bit-level pulse pairs used to encode each bit
- "checksum_calculation" — expands on checksum is computed over payload bytes