# MOS 6567 / 6569 VIC-II — Overview

**Summary:** VIC‑II (MOS 6567 NTSC / 6569 PAL) — video modes (40x25 text, 320x200 and 160x200 bitmap), 8 sprites, fixed 16‑color palette, Color RAM (4‑bit, 1K), DRAM control (up to 16KB, RAS/CAS and refresh), lightpen and four interrupt sources; external signals A0–A13, D0–D11, IRQ, BA, AEC, LP, ΦIN, Φ0.

## 6567 / 6569 overview
The MOS 6567 (NTSC) and 6569 (PAL) are the VIC‑II family video interface controllers used in the Commodore 64 (functionally equivalent later parts: 8562/8565). They provide:

- Video modes
  - Text modes: three text modes using 40×25 characters, 8×8 pixel character matrix.
  - Bitmap modes: two bitmap modes — native high‑resolution 320×200 and multicolor 160×200 (each pixel mode derived from VIC timing and character/bitmap fetch behavior).
- Graphics
  - Eight hardware sprites (independent, hardware multiplexing possible).
  - Fixed 16‑color palette.
- Memory and DRAM interfacing
  - Addresses up to 16 KB of DRAM directly; generates RAS/CAS signals and performs DRAM refresh.
  - Has a separate 4‑bit wide static Color RAM (1024 addresses; addressed with A0–A9) for per‑character color attributes.
- Interrupts and lightpen
  - Four interrupt sources: raster line match (raster interrupt), sprite‑sprite collisions, sprite‑graphics collisions, and negative edge on lightpen input.
  - Lightpen input latches current beam position into LPX and LPY on a negative edge; the pin is shared with the keyboard matrix and can be read by software.
- Variants
  - Several mask steppings exist; 6567R56A differs slightly. 6566 exists for static RAM but was not used in production C64s.

## Important VIC‑II external signals
- A0–A13 — 14‑bit video address bus addressing up to 16KB. A0–A5 and A8–A13 are multiplexed in pairs on single pins (A0/A8, A1/A9, …, A5/A13). Bits A6–A11 are additionally available on separate lines.
- D0–D11 — 12‑bit data bus used by the VIC for memory accesses: lower 8 bits connect to main DRAM / CPU data bus; upper 4 bits connect to the 4‑bit Color RAM (static, 1024 entries addressed by A0–A9).
- IRQ — interrupt request output wired to the CPU IRQ input; asserted for any of the four VIC interrupt sources.
- BA — Bus Available: indicates to the CPU when the VIC needs the bus during the second clock phase. Normally high; goes low three cycles before VIC accesses that require the bus in phase 2 (character pointers, sprite data), and remains low until those accesses complete. BA ties into the CPU RDY behavior (CPU will be stalled accordingly).
- AEC — Address/Enable Control (tri‑state control): reflects VIC’s data/address driver state. When AEC is high, VIC drivers are tri‑stated. Normally AEC is low during phase 1 (VIC bus ownership) and high during phase 2 (CPU bus ownership); if VIC must access the bus in phase 2, AEC stays low.
- LP — Lightpen input: negative edge latches raster position (LPX/LPY). Shares line with keyboard matrix; accessible by software.
- ΦIN — Pixel clock input: crystal‑derived pixel clock (≈8.18 MHz NTSC, ≈7.88 MHz PAL). VIC displays eight pixels per bus clock cycle (per Φ2).
- Φ0 — System clock output derived by dividing ΦIN by eight: ≈1.023 MHz (NTSC) or ≈0.985 MHz (PAL). This feeds the CPU, which derives Φ2 from it.

## References
- "c64_overview" — expands on VIC as one of the main C64 chips
- "vic_block_diagram" — internal functional blocks and signal flow of the VIC
- "memory_map_vic" — VIC 16KB addressing and the use/layout of Color RAM
