# $0093 — VERCK (Kernal Load/Verify Flag)

**Summary:** Zero-page flag $0093 (VERCK) used by the Commodore 64 Kernal load routine to select between LOAD (0) and VERIFY (1); the operation also depends on the CPU Accumulator (A) value on entry to the routine.

## Details
VERCK at zero-page address $0093 is a one-byte flag consulted by the Kernal file/tape load routine to decide whether to perform a normal LOAD (write data into memory) or a VERIFY (compare incoming data to memory). Valid values:
- 0 = LOAD
- 1 = VERIFY

The Kernal routine's final decision is a combination of this flag and the value in the A register when the routine is entered; both are used to determine the exact operation performed.

## Key Registers
- $0093 - Kernal (zero page) - VERCK: Load routine flag; 0=LOAD, 1=VERIFY (decision also depends on A register on entry)

## References
- "svxt_tape_read_timing_constant_0x92" — expands on tape timing parameter used during LOAD/VERIFY operations
- "kernal_zero_page_overview_0x90_0xff" — overview of the Kernal zero-page area containing VERCK and related flags

## Labels
- VERCK
