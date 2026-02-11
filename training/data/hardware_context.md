# A 256 Byte Autostart Fast Loader for the Commodore 64 — Hardware overview

**Summary:** Hardware context for a C64 autostart fast loader: Commodore 64 (MOS 6502 family CPU @ ~1 MHz, 64 KB RAM), Commodore 1541 disk drive (separate 6502 @ ~1 MHz, 2 KB RAM), and the IEC serial bus wiring (ATN, CLK, DATA from computer to drive; CLK, DATA return lines). Mentions VIC-II DMA timing ($D012 raster/badline relevance) and IEC handshake considerations.

## Hardware Context
- Commodore 64
  - CPU: MOS 6502-family (CPU clock ~1 MHz; timing depends on NTSC/PAL system but approximate 1 MHz class).
  - Main RAM: 64 KB addressable memory (system memory used by loader and program).
  - VIC-II (graphics chip) DMA can steal cycles (badlines) and affects CPU timing; raster register access (e.g., $D012) and badline avoidance are relevant when designing tight byte-level loaders.

- Commodore 1541 disk drive
  - Independent computer: its own 6502-family CPU running ~1 MHz and ~2 KB of RAM (used for drive side loader/firmware).
  - Communicates with host C64 over IEC serial bus; the drive executes its own code for disk I/O and handshaking.

- IEC serial bus wiring (as used by C64 ↔ 1541)
  - Signal lines (direction noted as in source):
    - ATN, CLK, DATA — lines from computer to drive.
    - CLK, DATA — return lines from drive to computer.
  - These lines form the logical IEC serial link used by fast loaders; correct use of ATN/CLK/DATA and the IEC handshake protocol is required for reliable autostart transfers.

- Relevance to a 256-byte autostart fast loader
  - Loader timing must account for both IEC handshake timings (drive-side responsiveness) and C64 internal timing effects (VIC-II DMA/badlines affecting CPU cycle availability).
  - The hardware split (separate 6502 in the drive) means the loader interacts with a second CPU over a low-bandwidth serial bus — efficient byte-level protocols and tight synchronization are essential.

## References
- "handshake_protocol" — IEC bus signaling used during transfer (ATN/CLK/DATA handshake details)
- "badline_avoidance" — VIC-II DMA timing that affects CPU synchronization (raster/badline effects, $D012 relevance)