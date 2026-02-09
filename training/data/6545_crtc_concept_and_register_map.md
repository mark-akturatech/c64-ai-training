# 6545-1 CRT Controller (CRTC) overview and register map

**Summary:** 6545-1 CRTC indexed register set R0–R17 for horizontal/vertical timing, sync widths, display start address, cursor position, and light-pen capture. Contains register names and stored information (e.g., Horizontal Total, Vertical Total Adjust, Mode Control, Scan Line, Cursor Start/End, Display Start Addr, Light Pen registers).

## Concept
The 6545-1 is a CRT Controller that interfaces 6500-family CPUs to raster CRT/TV displays. It provides an indexed register set (R0–R17) that defines horizontal timing (total/displayed characters, sync position/width), vertical timing (total/adjust/displayed rows, sync position), per-character scanline control, display start address, hardware cursor position and scanline definitions, and light-pen capture registers. Registers are selected by index and read/write via the device bus.

## Register summary (brief descriptions)
- R0 — Horizontal Total: number of character clocks per scan line (total character columns).
- R1 — Horizontal Displayed: number of character columns actually displayed.
- R2 — Horizontal Sync Position: horizontal character count where HSYNC begins.
- R3 — VSYNC/HSYNC Widths: encoded HSYNC and VSYNC width fields (bit fields shown in the full map).
- R4 — Vertical Total: number of character rows per frame (total).
- R5 — Vertical Total Adjust: additional scan-line adjustment for vertical total (fine vertical adjust).
- R6 — Vertical Displayed: number of character rows displayed.
- R7 — Vertical Sync Position: row number where VSYNC begins.
- R8 — Mode Control: mode and control flags affecting display behaviour.
- R9 — Scan Line: current scan line count within a character row (sub-row count).
- R10 — Cursor Start: cursor start scan-line and associated control bits (e.g., blink bits B1/B0 in the original map).
- R11 — Cursor End: cursor end scan-line.
- R12 — Display Start Address (High): high-order bits of display start address.
- R13 — Display Start Address (Low): low-order bits of display start address.
- R14 — Cursor Position (High): high-order bits of cursor RAM address (hardware cursor position).
- R15 — Cursor Position (Low): low-order bits of cursor RAM address.
- R16 — Light Pen Register (High): high-order captured address on light-pen event.
- R17 — Light Pen Register (Low): low-order captured address on light-pen event.

Notes on bit notation in the original map: the table uses '.' to indicate binary bit positions and 'x' to indicate unused bits (unused bits read as '0'). The original table also includes an R/W column with short flags (e.g., "n Y", "Y Y", "Y n"); the meanings of those exact flags are not defined in the provided source (see note below).

**[Note: Source may contain an error — the R/W column uses flags like "n" and "Y" but the source does not define their meaning.]**

## Source Code
```text
  +----+----------------------+---------------+---+------------------------+
  |Reg#|Register Name         |Stored Info    |R W| 7  6  5  4  3  2  1  0 |
  +----+----------------------+---------------+---+------------------------+
  |R0  |Horiz Total           |# Chars        |n Y| .  .  .  .  .  .  .  . |
  |R1  |Horiz Displayed       |# Chars        |n Y| .  .  .  .  .  .  .  . |
  |R2  |Horiz Sync Position   |# Chars        |n Y| .  .  .  .  .  .  .  . |
  |R3  |VSYNC, HSYNC Widths   |# Scan Lines & |n Y| V3 V2 V1 V0 H3 H2 H1 H0|
  |    |                      |# Char Times   |   |                        |
  +----+----------------------+---------------+---+------------------------+
  |R4  |Vert Total            |# Char Rows    |n Y| x  .  .  .  .  .  .  . |
  |R5  |Vert Total Adjust     |# Scan Lines   |n Y| x  x  x  .  .  .  .  . |
  |R6  |Vert Displayed        |# Char Rows    |n Y| x  .  .  .  .  .  .  . |
  |R7  |Vert Sync Position    |# Char Rows    |n Y| x  .  .  .  .  .  .  . |
  +----+----------------------+---------------+---+------------------------+
  |R8  |Mode Control          |               |n Y| .  .  .  .  .  .  .  . |
  |R9  |Scan Line             |# Scan Lines   |n Y| x  x  x  .  .  .  .  . |
  |R10 |Cursor Start          |Scan Line #    |n Y| x  B1 B0 .  .  .  .  . |
  |R11 |Cursor End            |Scan Line #    |n Y| x  x  x  .  .  .  .  . |
  |R12 |Display Start Addr (H)|               |n Y| x  x  .  .  .  .  .  . |
  |R13 |Display Start Addr (L)|               |n Y| .  .  .  .  .  .  .  . |
  |R14 |Cursor Position (H)   |               |Y Y| x  x  .  .  .  .  .  . |
  |R15 |Cursor Position (L)   |               |Y Y| .  .  .  .  .  .  .  . |
  |R16 |Light Pen Reg (H)     |               |Y n| x  x  .  .  .  .  .  . |
  |R17 |Light Pen Reg (L)     |               |Y n| .  .  .  .  .  .  .  . |
  +----+----------------------+---------------+---+------------------------+

Notes:
. Designates binary bit
x Designates unused bit.  Reading this bit is always "0", except for R31,
  which does not drive the data bus at all, and for CS "1" which operates
  likewise.
```

## References
- "bseries_6545_crtc_registers" — expands on typical register values for the B-series 6545 mapping