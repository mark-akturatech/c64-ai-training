# SET START OF LINE ($E9F0)

**Summary:** KERNAL routine at $E9F0 that builds the 16-bit start-of-screen-line pointer PNT in zero page ($D2:$D1) for a given line number (X). Uses ROM table at $ECF0 for the low byte, the screen-link table at $D9,X and HIBASE ($0288) to derive the high byte.

## Description
On entry: X = screen line number.

Operation sequence:
- Load low byte of the screen-line address from the ROM table at $ECF0 + X and store it into $D1 (PNT low).
- Load a link byte from the screen link table at $D9 + X (LDTB1). Mask it with #$03 (only low 2 bits used).
- OR the masked value with the HIBASE byte at $0288 to form the high byte of the screen-line address, and store it into $D2 (PNT high).
- Return to caller. The result is a 16-bit pointer in $D2:$D1 pointing to the start of the specified screen line.

Notes:
- The link table entries supply only the low two bits of the high byte (page index); HIBASE ($0288) supplies the page base.
- This routine is typically called when iterating screen lines (e.g., scrolling) or when synchronising per-line color pointers.

## Source Code
```asm
.,E9F0 BD F0 EC LDA $ECF0,X     table of screen line to bytes
.,E9F3 85 D1    STA $D1         <PNT, current screen line address
.,E9F5 B5 D9    LDA $D9,X       LDTB1, screen line link table
.,E9F7 29 03    AND #$03
.,E9F9 0D 88 02 ORA $0288       HIBASE, page of top screen
.,E9FC 85 D2    STA $D2         >PNT
.,E9FE 60       RTS
```

## Key Registers
- $D1 - Zero page - low byte of current screen line address pointer (PNT low)
- $D2 - Zero page - high byte of current screen line address pointer (PNT high)
- $D9 - Zero page - LDTB1: screen line link table (indexed by X)
- $0288 - C64 RAM - HIBASE: page high-byte base for top screen (used with link bits)
- $ECF0 - KERNAL ROM - table of screen-line low bytes (indexed by X)
- $E9F0-$E9FE - KERNAL ROM - SET START OF LINE routine

## References
- "synchronise_colour_pointer" — synchronises colour pointer for that line
- "scroll_screen" — used when iterating over lines to move or clear during scroll

## Labels
- SET_START_OF_LINE
- PNT
- LDTB1
- HIBASE
