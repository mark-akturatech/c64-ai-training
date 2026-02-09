# Commodore 64 — Cartridge expansion slot full pinout (pins 1–22, edge A–Z)

**Summary:** Complete physical pinout for the C64 cartridge edge connector: physical pins 1–22 (power, GND, data D0–D7, R/W, /IRQ, /NMI, /RESET, /ROML, /ROMH, /EXROM, /GAME, /DMA, Dot Clock, I/O1/I/O2, BA) and the A–Z edge-letter mapping to address lines A0–A15, GND and a few control signals.

## Pinout overview
This packet provides the exact per-pin signal names for the Commodore 64 cartridge expansion slot: the 22 numbered physical pins along the board edge and the lettered pads A–Z that map primarily to address lines (A0–A15), ground and a small set of control signals.

- Numbered pins 1–22 are the conventional physical contacts (power, bus control, DMA, IRQ/NMI/RESET, 8-bit data bus D0–D7, Dot Clock, I/O1/I/O2, /GAME, /EXROM, /ROML, /ROMH, BA).
- Lettered pads A–Z are the labelled edge pads found around the cartridge connector; they include A0–A15 (non-sequential order around the edge), two GND pads (A and Z), and a few control lines (/RESET, /NMI, /ROMH, I/O2). Use the Source Code section for the authoritative table and ASCII edge diagram.

**[Note: Source may contain an OCR artifact — the original printed entry for letter E read "02"; it has been interpreted and corrected here as "I/O2" (I/O2 is a standard cartridge signal).]**

## Source Code
```text
Cartridge Expansion Slot — Pin table (physical pins 1–22)

 Pin | Signal
-----+---------
  1  | GND
  2  | +5V
  3  | +5V
  4  | /IRQ
  5  | R/W
  6  | Dot Clock
  7  | I/O1
  8  | /GAME
  9  | /EXROM
 10  | I/O2
 11  | /ROML
 12  | BA         ; Bus Available (BA)
 13  | /DMA
 14  | D7
 15  | D6
 16  | D5
 17  | D4
 18  | D3
 19  | D2
 20  | D1
 21  | D0
 22  | GND

Edge-letter pads (A–Z) mapping — around the cartridge edge

 Letter | Signal
--------+--------
   A    | GND
   B    | /ROMH
   C    | /RESET
   D    | /NMI
   E    | I/O2         ; corrected from "02" in source (OCR)
   F    | A15
   G    | (no entry / not used)
   H    | A14
   I    | (no entry / not used)
   J    | A13
   K    | A12
   L    | A11
   M    | A10
   N    | A9
   O    | (no entry / not used)
   P    | A8
   Q    | (no entry / not used)
   R    | A7
   S    | A6
   T    | A5
   U    | A4
   V    | A3
   W    | A2
   X    | A1
   Y    | A0
   Z    | GND

ASCII edge-connector diagram (from source)
+---@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@---+
|                                                 |
+---@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@-@---+
    Z Y X W V U T S R P N M L K J H F E D C B A

(Physical pins 1–22 correspond to the separate numbered contact side; see the numbered table above.)
```

## Key Registers
- (omitted) — This chunk documents connector pin signals and edge-pad mappings, not memory-mapped chip registers.

## References
- "appendix_i_pinouts_intro" — expands on Appendix overview
- "audio_video_and_serial_io_connectors" — expands on nearby connector pinouts (Audio/Video, Serial) shown on the same appendix pages