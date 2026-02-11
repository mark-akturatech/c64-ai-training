# Drive Memory and Execution Commands (Commodore IEC)

**Summary:** Describes IEC protocol-level drive memory and execution commands M-R (Memory Read), M-W (Memory Write), M-E (Memory Execute) and the user command vectors U3–U8 that provide additional entry points into drive firmware. Searchable terms: M-R, M-W, M-E, U3, U4, U5, U6, U7, U8, IEC, drive RAM, memory execute.

## Drive Memory and Execution Commands
- M-R — Memory Read: read bytes from the disk drive's RAM. Used to fetch data or code residing in the drive's volatile memory.
- M-W — Memory Write: write bytes into the disk drive's RAM. Used to upload data or code into the drive for later use.
- M-E — Memory Execute: initiate execution of code that resides in the drive's RAM. Transfers control to code previously written into memory (via M-W or other mechanisms).

These commands operate on the drive's internal RAM (volatile workspace in drive firmware) rather than the host's memory or block-level disk files. They are commonly used for uploading small routines, patching firmware behaviors, or triggering drive-side actions without performing file/block transfers.

## User Command Vectors (U3–U8)
- U3–U8 — User command vectors provide additional entry points in the drive firmware. They allow invoking alternative or user-defined handling paths inside the drive (additional firmware vectors).
- These vectors are supplemental to the standard M-R/M-W/M-E flow and are often used to expose multiple entry points for custom routines or drive extensions.

## References
- "block_access_api" — block-level operations often combined with memory ops (additional details on combining block transfers with memory read/write/execute).