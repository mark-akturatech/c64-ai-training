# LDTB1 ($D9-$F2) — Screen line link table / editor temporary storage

**Summary:** LDTB1 at $D9-$F2 is a 25‑byte OS table used by the screen editor and pointer routines; bits 0–3 select which of the four VIC‑II screen memory pages contains the first byte of each physical row, and bit 7 ($80) flags whether the row is the first/only physical line of a logical (80‑column) BASIC line. Uses $ECF0 (low‑byte table) and the starting‑page byte at $0288 to compute full screen addresses.

## Description
- Layout and purpose
  - The table contains 25 entries (one per visible screen row). Each entry serves two functions:
    1. Bits 0–3: indicate which of the four 1KB VIC‑II screen memory pages (0–3) holds the first byte of that physical row. This page value is combined with a low‑byte displacement table to form the full 16‑bit screen start address for the row.
    2. Bit 7 ($80): editor flag — set when the physical row is the first or only line of a logical line; clear when the row is the second half of a logical line (i.e., the continuation of an 80‑character logical line split over two 40‑character physical rows).
- Why high/low tables are needed on the C64
  - Earlier PET systems could use separate low‑ and high‑byte tables for screen rows because screen memory was fixed. On the C64 the screen can be relocated to different 1K pages, so a fixed high‑byte table is not possible.
  - The OS uses a fixed low‑byte table at $ECF0 for the row displacements (low bytes), and computes the high byte by adding:
    - the page number of the current screen memory (stored at decimal 648 / $0288) to the per-row page displacement held in LDTB1.
- Interaction with other routines
  - PNT (pointer routine at decimal 209 / $D1) uses LDTB1 together with the low‑byte table at $ECF0 and the starting page at $0288 to compute the 16‑bit start address of the current logical/physical screen line.
  - The editor (and related routines such as LNMX, TBLX, and cursor/line management) relies on the bit‑7 linkage flag in LDTB1 to treat pairs of physical rows as a single logical 80‑character line for editing.

## Key Registers
- $D9-$F2 - RAM - LDTB1: Screen Line Link Table / editor temporary storage (25 entries; bits 0–3 = screen page 0–3, bit 7 = first/only physical line flag)
- $ECF0 - RAM/ROM (OS table) - Low‑byte displacement table for screen rows (used with LDTB1 to form row start addresses)
- $0288 - RAM - Starting page of screen memory (page number added to displacement/page from LDTB1)

## References
- "pnt_pointer_and_pntr_cursor_column" — expands on PNT using this table to compute the start address of the current logical line
- "lnmx_tblx_and_ascii_temp_cursor_line_info" — expands on LNMX and TBLX relying on the link‑table structure to manage logical/physical lines

## Labels
- LDTB1
