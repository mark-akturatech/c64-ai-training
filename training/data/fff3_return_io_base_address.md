# KERNAL $FFF3 — Return I/O base address

**Summary:** KERNAL routine at $FFF3 that returns the base address of memory-mapped I/O devices by setting the X/Y registers (16-bit address pair). Use the returned XY address plus device-specific offsets to access VIC-II, SID, CIAs, color RAM, etc.

## Description
JSR $FFF3 sets the X and Y registers to the start (base) address of the memory region where memory-mapped I/O devices live. The returned XY pair is intended to be used as a 16-bit base address; add device-register offsets to that base to form the final address for reads/writes.

Typical use: call the routine to obtain the current I/O base (which may vary depending on $01 processor-port bank settings), then compute base + offset to access a particular chip register. The routine itself provides only the base address; it does not perform the access.

(Short note: X/Y form a 16-bit address pair for address arithmetic.)

## Key Registers
- $D000-$D02E - VIC-II - video chip registers (sprite positions, control/playfield registers)
- $D400-$D414 - SID - Voice registers (Voice 1: $D400-$D406, Voice 2: $D407-$D40D, Voice 3: $D40E-$D414)
- $D415-$D418 - SID - filter and global controls
- $D800-$DBFF - Color RAM - character color memory (1 KB region, low 4 bits used)
- $DC00-$DC0F - CIA 1 - system I/O, timers, serial, IRQ
- $DD00-$DD0F - CIA 2 - user I/O, timers, serial, NMI

## References
- "ff81_initialise_vic_and_screen_editor" — expands on accessing the VIC-II base via memory-mapped I/O
