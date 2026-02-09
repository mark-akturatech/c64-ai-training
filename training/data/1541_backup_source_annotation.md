# 1541 Backup Source Annotation

**Summary:** Describes a BASIC-driver 1541 backup flow using the disk job queue plus machine-language memory-read and memory-write commands to transfer sector data between 1541 RAM and the C64; notes timing asymmetry (reads much slower than writes), C64 internal clock unreliability during disk I/O, and where to bypass bad tracks (BASIC lines 200–340).

## Process Overview
- Read sector from the master diskette into 1541 RAM via the 1541 job queue (BASIC driver).
- Use a machine-language memory-read command to transfer the sector bytes from 1541 RAM into the C64 (host) memory.
- After completing a pass (one or more sectors or tracks), remove the master and insert the blank/target (the clone).
- Use a machine-language memory-write command to transfer the bytes from the C64 back into 1541 RAM (overwrite the drive buffer).
- Use the BASIC driver and the 1541 job queue to write the buffer out to the diskette (final write to the clone).

This routine demonstrates the sequence and invocation pattern for doing memory-read and memory-write operations in machine language while coordinating the BASIC-level job queue to read/write disk buffers on the 1541.

## Timing, Reliability and Error Handling
- Measured behavior: reading 256 bytes from 1541 RAM appears to take almost ten times longer than writing 256 bytes to 1541 RAM.
- The C64 internal clock is unreliable while performing disk I/O; timing measurements or time-based loops should not be trusted during drive operations.
- Bypassing a bad track can be done anywhere between BASIC lines 200–340 (place in the flow where track/sector progression is controlled).
- Any of the prior 11 routines referenced in the source may be reused to recreate or reproduce errors found on the master diskette after a backup is made.

## References
- "how_to_copy_a_file_overview" — higher-level copy procedure context and pointers to the BASIC COPY program  
- "ml_routine_epilogue_and_return" — low-level machine routines invoked during the described backup flow