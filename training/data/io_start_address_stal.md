# STAL ($C1-$C2) — I/O Start Address (KERNAL pointer)

**Summary:** STAL is a two-byte KERNAL pointer at $C1-$C2 that holds the little-endian start address in RAM used for LOAD/SAVE I/O operations (cassette buffer for tape I/O). It marks the RAM area used for data blocks after the initial header.

## Description
STAL ($C1-$C2) is a two-byte pointer in the KERNAL workspace that points to the beginning address of the RAM area currently being used for I/O during LOAD and SAVE operations. For cassette (tape) I/O this points to the cassette buffer in RAM; subsequent data blocks are transferred directly to/from the RAM area referenced by STAL. STAL therefore designates where blocks that follow the initial file header will be placed (LOAD) or taken from (SAVE).

- Two-byte pointer stored little-endian (low byte at $C1, high byte at $C2).
- Used by KERNAL cassette/tape routines and other LOAD/SAVE handlers to locate the working buffer for block data.
- Works in conjunction with other KERNAL workspace pointers (e.g., filename/buffer pointers and block-count pointers) during file transfers.

## Key Registers
- $C1-$C2 - KERNAL workspace - I/O Start Address pointer (STAL), little-endian two-byte pointer

## References
- "pointer_current_filename_fnadr" — expands on STAL works together with filename/buffer pointers during LOAD/SAVE operations
- "cassette_block_count_fsblk" — expands on STAL identifies where tape blocks are stored while FSBLK counts blocks remaining

## Labels
- STAL
