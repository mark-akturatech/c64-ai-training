# I/O Area ($D000-$DFFF)

**Summary:** Overview of the C64 I/O area $D000-$DFFF: addresses used by VIC‑II ($D000... mirrored), SID ($D400... registers), CIAs ($DC00/$DD00), Color RAM ($D800-$DBFF), and the expansion/cartridge I/O region ($DE00-$DEFF). Details device register blocks, mirroring behavior, and banking examples.

**Overview**

The range $D000–$DFFF on the Commodore 64 is the system I/O area: CPU accesses to this block are interpreted as accesses to on‑board devices rather than ordinary RAM. Major devices and services present in this block include:

- **VIC‑II Graphics Chip Registers ($D000–$D02E):** Controls sprites, screen pointers, raster, character modes, and more. These registers are mirrored across the full $D000–$D3FF block due to partial address decoding, meaning reads/writes to mirrored addresses access the same VIC registers. ([retrocomputing.stackexchange.com](https://retrocomputing.stackexchange.com/questions/16757/why-does-the-vic-ii-duplicate-its-registers-c64?utm_source=openai))

- **SID Sound Chip Registers ($D400–$D41C):** Handles sound generation with voice and filter/control registers. The SID registers are mirrored every 32 bytes within the $D400–$D7FF range. ([ar.c64.org](https://ar.c64.org/wiki/Hiding_kilobytes_C%3DHacking_Issue_7.txt?utm_source=openai))

- **Color RAM ($D800–$DBFF):** 1 KB of separate 4-bit-per-cell RAM for screen color nybbles.

- **CIA1 and CIA2 (6526) Registers ($DC00–$DC0F and $DD00–$DD0F):** Provide timers, Time-of-Day (TOD) clock, serial port, and joystick/keyboard matrix interface. Each CIA has 16 registers, mirrored throughout their respective 256-byte ranges.

- **Expansion/Cartridge I/O Area ($DE00–$DEFF):** Used by cartridges and external hardware for additional functionality.

**Mirroring and Access Notes:**

- **VIC‑II Registers:** The VIC‑II's 47 registers are mirrored throughout the $D000–$D3FF range due to incomplete address decoding; only the lower 6 bits of the address are used, causing each register to appear at multiple addresses within this range. ([retrocomputing.stackexchange.com](https://retrocomputing.stackexchange.com/questions/16757/why-does-the-vic-ii-duplicate-its-registers-c64?utm_source=openai))

- **SID Registers:** The SID's 29 registers are mirrored every 32 bytes within the $D400–$D7FF range, resulting from the chip's internal address decoding which only considers the lower 5 bits of the address. ([ar.c64.org](https://ar.c64.org/wiki/Hiding_kilobytes_C%3DHacking_Issue_7.txt?utm_source=openai))

- **CIA Registers:** Each CIA has 16 registers, mirrored throughout their respective 256-byte ranges ($DC00–$DCFF for CIA1 and $DD00–$DDFF for CIA2), due to the use of only the lower 4 bits for internal address decoding.

- **Cartridge Banking:** Cartridges can map ROM or RAM into the $D000–$DFFF range by controlling the memory configuration through the PLA (Programmable Logic Array) and manipulating the memory control register at $01. This allows for dynamic switching between different memory configurations, enabling cartridges to extend the system's capabilities.

## Source Code

```text
VIC‑II Register Mirroring Pattern:
Address Range: $D000–$D3FF
Mirroring Period: 64 bytes

SID Register Mirroring Pattern:
Address Range: $D400–$D7FF
Mirroring Period: 32 bytes

CIA1 Register Mirroring Pattern:
Address Range: $DC00–$DCFF
Mirroring Period: 16 bytes

CIA2 Register Mirroring Pattern:
Address Range: $DD00–$DDFF
Mirroring Period: 16 bytes
```

## Key Registers

- **$D000–$D02E:** VIC‑II primary register block (sprite control, raster, screen pointers)
- **$D000–$D3FF:** VIC‑II mirrored register block (mirrors of $D000–$D02E across $D000–$D3FF)
- **$D400–$D41C:** SID registers (voice and filter/control registers)
- **$D800–$DBFF:** Color RAM (screen color nybbles, 1 KB)
- **$DC00–$DC0F:** CIA1 (6526) registers (timers, TOD, serial, interrupt control, keyboard/joystick matrix interface)
- **$DD00–$DD0F:** CIA2 (6526) registers (timers, TOD, serial, interrupt control, user port/serial lines)
- **$DE00–$DEFF:** Expansion/cartridge I/O (cartridge registers, user/joystick lines, and expansion port I/O)

## References

- "vic_sprite_registers" — expands on VIC‑II sprite and related registers (located under $D000 area)
- "sid_registers_voice1" — expands on SID Voice 1 registers (located at $D400)