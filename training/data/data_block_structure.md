# Datassette Data Block Layout

**Summary:** Datassette tape data blocks use a 192-byte payload (recorded twice), a synchronization leader (VIC/Kernal-derived speed correction), countdown byte sequences ($89–$81 and $09–$01), a one-byte checksum (XOR starting from $00 and all payload bytes), and inter-record gaps (long pulse + 60 short pulses).

## Data Block Structure
Each recorded block contains the following elements (preserve exact bytes and timings):

- 192-byte payload
  - The payload is recorded twice (two identical copies) to allow error detection by comparing copies.
- Synchronization leader
  - Consists of short pulses.
  - Length: 10 seconds for the first (initial) block on a tape, 2 seconds for subsequent blocks.
  - During the leader the Kernal computes a speed-correction factor to compensate for tape-speed variation.
- Countdown byte sequences (marker bytes)
  - First copy: sequence from $89 down to $81 (inclusive).
  - Second copy: sequence from $09 down to $01 (inclusive).
  - These countdown sequences precede the corresponding copy (used for byte synchronization and validation).
- One-byte checksum
  - Checksum value is computed as XOR of $00 and all payload bytes (i.e., initial XOR seed $00 then XOR each payload byte).
- Inter-record gaps
  - Gap pattern between records: a long pulse followed by 60 short pulses.

Notes:
- The leader is explicitly short-pulse based and used for timing/speed correction; do not confuse it with the long gap pulse used between records.
- The checksum description uses an explicit initial value of $00 (equivalent to XORing all payload bytes starting from zero).

## References
- "byte_encoding_and_parity" — expands on how bytes within the payload are encoded (bit timing and parity)
- "header_block" — describes the special 192-byte header block layout
- "checksum_calculation" — details how the block checksum is computed and validated