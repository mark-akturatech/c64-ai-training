# 1541 binary→GCR mapping: two fundamental constraints

**Summary:** The 1541 disk drive employs a binary-to-GCR (Group Code Recording) conversion that maps 4-bit nybbles to 5-bit GCR codes. This mapping ensures that no combination of two 5-bit codes produces 10 consecutive '1' bits (the sync mark), and that no more than two consecutive '0' bits appear in any 10-bit GCR byte or combination. These constraints prevent false sync detection and aid in clock recovery.

**Properties**

- **Sync Mark Prevention:** No two 5-bit GCR codes, when concatenated, can produce 10 consecutive '1' bits. This design prevents ordinary data sequences from being mistaken for the sync mark pattern by the 1541's read/write electronics.

- **Clock Recovery Enhancement:** No more than two consecutive '0' bits occur within any single 10-bit GCR encoded byte or across combinations of GCR bytes. This constraint improves the reliability of clock recovery when the drive reads bits from the disk.

- **GCR Lookup Table:** These properties are enforced by the binary-to-GCR lookup table that maps 4-bit nybbles to 5-bit GCR symbols. The table is specifically designed to guarantee the above constraints for all valid encoded byte sequences.

- **Practical Consequences:**
  - **Robust Sync Detection:** Sync marks (the reserved all-ones pattern) cannot be emulated by normal data, ensuring reliable detection.
  - **Stable Bitcell Timing:** The phase-locked-loop and clock extraction circuitry are protected from long runs of zeros, which would otherwise complicate bit alignment.

**GCR Lookup Table**

The following table maps each 4-bit nybble to its corresponding 5-bit GCR code:

| Nybble (Hex) | Nybble (Binary) | GCR Code (Binary) | GCR Code (Hex) |
|--------------|-----------------|-------------------|----------------|
| 0            | 0000            | 01010             | 0x0A           |
| 1            | 0001            | 01011             | 0x0B           |
| 2            | 0010            | 10010             | 0x12           |
| 3            | 0011            | 10011             | 0x13           |
| 4            | 0100            | 01110             | 0x0E           |
| 5            | 0101            | 01111             | 0x0F           |
| 6            | 0110            | 10110             | 0x16           |
| 7            | 0111            | 10111             | 0x17           |
| 8            | 1000            | 01001             | 0x09           |
| 9            | 1001            | 11001             | 0x19           |
| A            | 1010            | 11010             | 0x1A           |
| B            | 1011            | 11011             | 0x1B           |
| C            | 1100            | 01101             | 0x0D           |
| D            | 1101            | 11101             | 0x1D           |
| E            | 1110            | 11110             | 0x1E           |
| F            | 1111            | 10101             | 0x15           |

This table ensures that the constraints regarding consecutive '1' and '0' bits are maintained.

**Sync Mark Pattern**

The sync mark is a special pattern used to indicate the start of a header or data block. It consists of 10 or more consecutive '1' bits, typically represented by five consecutive bytes of $FF (each byte being 11111111 in binary), resulting in 40 consecutive '1' bits. This pattern is unique and cannot be produced by any combination of standard GCR-encoded data bytes, ensuring reliable detection of sync marks.

**Concatenation Examples**

To demonstrate that no two GCR codes form 10 consecutive '1's, consider the following examples:

- **Example 1:**
  - GCR Code 1: 01010 (for nybble 0)
  - GCR Code 2: 11010 (for nybble A)
  - Concatenated: 01010 11010
  - Result: No sequence of 10 consecutive '1's.

- **Example 2:**
  - GCR Code 1: 10110 (for nybble 6)
  - GCR Code 2: 10111 (for nybble 7)
  - Concatenated: 10110 10111
  - Result: No sequence of 10 consecutive '1's.

These examples illustrate that the GCR encoding scheme prevents the formation of 10 consecutive '1' bits, thereby avoiding false sync mark detection.

**Clock Recovery Implications**

The design of the GCR encoding ensures that no more than two consecutive '0' bits occur within any 10-bit GCR encoded byte or across combinations of GCR bytes. This limitation is crucial for the drive's clock recovery mechanism.

In magnetic storage systems, the read head relies on transitions between magnetic states to maintain synchronization. Long sequences of '0' bits (which correspond to a lack of transitions) can cause the read head to lose synchronization, leading to data read errors. By limiting the number of consecutive '0' bits, the GCR encoding ensures regular transitions, facilitating reliable clock recovery and data integrity.

## References

- "Inside Commodore DOS" — provides an in-depth explanation of the GCR encoding scheme and its constraints.
- "Commodore 1541 User's Guide" — details the sync mark pattern and its role in data synchronization.