# 1541 USER Commands U3–U9 and UJ/UI- anomalies

**Summary:** Describes 1541 USER commands U3–U9 (jump targets $0500–$050F and $FFFA), the job-queue mechanism (FDC scans every 10 ms), and notes anomalies: UJ (warm reset) can hang the drive; U can be used instead, and UI- sets the 1541 to VIC‑20 speed.

## USER commands U3–U9 (1541)
The 1541 contains USER commands U3–U9 that cause the drive's 6502 to jump to predefined RAM/ROM addresses:

- U3–U8: jump into the $0500 page (buffer #2). These six USER commands act like memory-execute/jump entries — they can be used to run machine-code placed in buffer #2.
- U9: jumps to $FFFA — the vector table area (word table) containing the NMI/IRQ/RESET vectors; using U9 performs an alternate reset that bypasses the normal power-on diagnostics.

The text notes it is unclear why Commodore supplied six separate USER jumps into the same $0500 page; however they can double as memory-execute commands.

## Job queue and FDC jobs (1541)
Commands destined for the 1541 are translated into simple "jobs" and poked into the drive's job queue. The drive's Floppy Disk Controller (FDC) scans that queue every 10 milliseconds and executes any pending job. The set of FDC jobs listed includes (as given in source):

1. Read a sector.
2. Write a sector.
3. Verify a sector.
4. Seek a track.
5. Bump the head to track number 1.
6. Jump to a machine language routine in a buffer.
7. Execute a machine language routine in a buffer.

These items show the FDC supports both jump/execute of ML routines inside drive buffers (supporting USER-style memory execute).

## UJ and UI- anomalies (behavior notes)
- UJ: documented/intended as a warm reset for the 1541, but in practice it may hang the drive. The source suggests using the simple "U" command instead of "UJ" where a reset-like behavior is desired.
- UI-: implemented to set the 1541 to VIC‑20 speed (legacy compatibility). The dash indicates a parameter/variation in the command as implemented on the drive.

## Source Code
```basic
120  PRINT#15, "M-W"CHR*(0>CHR*(5)CHR*(1)CHR*(96)
130  PRINT#15, "U3"
140  CLOSE 15
150  END
```

```text
User Number   Jump Address
U3 (UC)       $0500
U4 (UD)       $0503
U5 (UE)       $0506
U6 (UF)       $0509
U7 (UG)       $050C
U8 (UH)       $050F
U9 (UI)       $FFFA
```

```text
Job queue overview (1541):
- Jobs poked into a 1541 RAM area called the job queue.
- The FDC scans the job queue every 10 milliseconds.
- If a job request is found, the FDC executes it.
- Supported jobs: read sector, write sector, verify sector, seek track, bump head to track 1, jump to ML routine in buffer, execute ML routine in buffer.
```

## Key Registers
- $0500-$050F - 1541 RAM - USER jumps (U3–U8) into buffer #2
- $FFFA - 1541 ROM/Vector table - U9 jump / NMI vector word table (alternate reset)

## References
- "memory_execute_command" — expands on how U3–U8 operate similarly to a memory-execute command