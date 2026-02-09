# VIC-II $D016 — Bit 3: Border cover for 40/38-column display (coarse scrolling)

**Summary:** VIC-II register $D016 Bit 3 controls covering the first and last screen columns with the border to select a 40-column (1) or 38-column (0) visual display; used as a cosmetic aid when performing coarse horizontal scrolling (see Bits 0–2).

## Description
Bit 3 of the VIC-II control register at $D016 masks the leftmost and rightmost character columns by drawing the border over them. When those edge columns are covered, characters placed there are hidden from viewers — this prevents visible artifacts when inserting or shifting characters during coarse horizontal scrolling. 

- Setting Bit 3 = 1: enables the normal 40-column visible display (edges uncovered).
- Clearing Bit 3 = 0: covers first and last columns, producing a 38-column visible region (edges hidden).
- Purpose: purely cosmetic; not required for scrolling mechanics but useful to hide characters that move into view during coarse scrolling (coarse scrolling details implemented via Bits 0–2 of $D016).

Behavioral notes:
- This bit does not change character memory layout or text memory addresses — only what is drawn in the visible area.
- Use when you want to avoid showing newly-inserted characters at the extremes while performing coarse (character-column) shifts.

## Source Code
```asm
; Example: set Bit 3 (enable 40-column visible area)
LDA $D016
ORA #$08    ; bit 3 mask
STA $D016

; Example: clear Bit 3 (cover first/last columns => 38-column visible area)
LDA $D016
AND #$F7    ; clear bit 3
STA $D016
```

```text
Register: $D016 (VIC-II control)
Bit 3 description (from source): 
  - When 1: normal 40-column display (first/last columns visible).
  - When 0: border covers first and last screen columns => 38 visible columns.
Reference: works together with Bits 0-2 (coarse horizontal scrolling).
```

## Key Registers
- $D016 - VIC-II - Cover border / 40 vs 38 visible columns (Bit 3 controls covering first/last columns for coarse horizontal scrolling)

## References
- "scrolx_horizontal_fine_scrolling" — expands on Register $D016 and Bits 0–2 (horizontal coarse/fine scrolling)