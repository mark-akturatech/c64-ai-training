# Commodore 64 — High-level architecture (6510, VIC-II, SID, CIAs, RAM, ROMs)

**Summary:** High-level list of the C64 main components: 6510 CPU, 6567/6569 VIC‑II video controller, 6581 SID sound chip, two 6526 CIAs, 64KB DRAM main memory, 1KB (0.5KB usable bytes) Color RAM, 16KB + 4KB ROMs; notes that most ICs are NMOS implementations.

## Overview
The Commodore 64 hardware is built from a small set of dedicated ICs and memories integrated on the system bus:

- CPU: 6510 8‑bit microprocessor (variant of the 6502 with an integrated I/O port).
- Video: MOS 6567/6569 VIC‑II graphics chip (handles bitmap/character display, sprites, raster timing).
- Sound: MOS 6581 SID chip (three‑voice analog/digital synthesizer).
- I/O: Two 6526 CIAs (Complex Interface Adapter) providing timers, serial bus, parallel I/O, and interrupt control.
- Main memory: 64 KB DRAM (64K × 8 bit).
- Color RAM: 1K × 4‑bit static RAM (reported as 0.5 KB of byte storage because four bits per cell), used for per‑character color attributes.
- ROMs:
  - 16 KB ROM (system ROM containing the Kernal/operating system and BASIC interpreter).
  - 4 KB ROM (character generator / font data).
- Technology: Most chips in the original C64 are manufactured in NMOS process.

This node is a concise inventory of the primary C64 components and their memory sizes; detailed signal, register, and timing information is provided in linked chunks.

## References
- "6510_processor" — expands on 6510 signals and bus timing
- "vic_chip_and_signals" — expands on VIC‑II role and signals