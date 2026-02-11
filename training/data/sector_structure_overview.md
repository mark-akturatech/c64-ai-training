# Layout of a Sector (Commodore 1541 / DOS)

**Summary:** Each physical sector on a formatted Commodore 1541 disk contains a header block followed by a 256‑byte data block; sectors are separated by inter-record gaps, and each block begins with a SYNC MARK (10+ one bits, typically 40). During formatting, the DOS writes all 683 sectors' header blocks; data blocks are rewritten when user data is recorded. The 1541 hardware detects the SYNC MARK; GCR encoding prevents $FF runs in data from being misinterpreted as sync.

**Layout of a Sector**

During the formatting ("newing") process, the DOS records all 683 sectors/blocks that will be used on the diskette. Each sector consists of two sequential parts on the track:

- **Header block** — Identifies the sector (sector number, track, disk ID fields, etc.). Header blocks are written only during formatting.
- **Data block** — Contains 256 bytes of stored data. Data blocks are rewritten when the drive writes or updates file data.

Sectors are written in numerical sequence around the circular track. Each header block is followed immediately by its corresponding data block. Adjacent sectors are separated by an inter-record gap.

A SYNC MARK (special bit pattern) precedes every header and every data block. The SYNC MARK is a run of 1 bits at least 10 bits long (typically 40 ones) that only occurs at block starts; the 1541 drive hardware detects this pattern and signals the DOS that a header or data block is beginning.

Note on $FF sequences: Plain runs of $FF bytes inside a data block are not interpreted as SYNC MARKs because the disk uses a GCR encoding scheme that prevents the raw bit pattern for sync from appearing inside normal encoded data.

The diagram below illustrates how these parts are arranged:

## Source Code

```text
+-----------------+-----------------+-----------------+-----------------+
| SYNC MARK       | HEADER BLOCK    | INTER-RECORD GAP| SYNC MARK       |
| (40+ '1' bits)  | (10 bytes)      | (variable size) | (40+ '1' bits)  |
+-----------------+-----------------+-----------------+-----------------+
| DATA BLOCK      | INTER-RECORD GAP|                 |                 |
| (256 bytes)     | (variable size) |                 |                 |
+-----------------+-----------------+-----------------+-----------------+
```

## References

- "header_block_structure_and_fields" — Byte-by-byte description of header block fields and format
- "data_block_structure_and_fields" — Data block layout, checksums, padding/off‑bytes, and tail gap details