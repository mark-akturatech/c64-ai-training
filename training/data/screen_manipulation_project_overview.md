# Windowed screen edit using indirect-indexed addressing (per-line zero-page pointers)

**Summary:** Use 6502 (indirect),Y addressing with a fixed zero-page pointer that is reloaded per screen line from a table of 16-bit start addresses to modify a rectangular window on the Commodore screen. This technique allows modification of multi-line, multi-column areas that span more than 256 addresses.

**Description**

**Goal:** Modify a rectangular window on the text screen spanning several lines and a contiguous set of columns per line. Ordinary indexed addressing (e.g., base+Y where base is a single 8-bit base) cannot address more than a single 256-byte page; indirect-indexed addressing allows a full 16-bit base pointer plus an 8-bit Y offset.

**Main idea:**

- Build a table of 16-bit start addresses (one pointer per line) that point to the first column of the window on each screen line.
- Maintain a fixed zero-page pointer pair (PTR_VEC) that the instruction STA (PTR_VEC),Y (or LDA (PTR_VEC),Y) uses. Before processing each line, copy the appropriate 16-bit pointer from the table into PTR_VEC.
- Use Y as the column index (0..column_count-1) within the inner loop: STA (PTR_VEC),Y writes to the screen byte at pointer+Y.
- After finishing the inner loop for a line, advance to the next table entry (next 2-byte pointer) and reload PTR_VEC, then repeat.

**Advantages:**

- Works even when the window spans multiple 256-byte pages.
- Avoids 16-bit arithmetic in the inner column loop; only per-line pointer reload is required.
- Compatible with relocated screen RAM (you must compute pointer table entries using the actual screen base).

**Caveats and important details:**

- The fixed zero-page pointer used by (ptr),Y must itself be in zero page (e.g., $FB/$FC).
- Y is 8-bit; columns per line must be ≤ 255 (practically ≤ 40 on C64 text screen).
- Populate the pointer table with correct 16-bit addresses (screen base + line_index * line_width + column_start).
- On C64, the VIC-II register $D018 selects screen and charset memory locations; screen RAM base may not be $0400. Read $D018 (or rely on system variables) when computing the pointer table.
- Each pointer table entry is two bytes: low then high.
- The copy of a pointer into PTR_VEC is done with two byte stores (STA PTR_VEC, STA PTR_VEC+1). This is done once per line (cheap).
- If you generate the pointer table at runtime, do 16-bit addition for pointer increment (add line_width to low byte, propagate carry to high byte).

**Algorithm (step summary)**

1. Determine SCREEN_BASE (16-bit) where the text window starts on the first selected screen line (may come from system variables or derived from $D018).
2. For number_of_lines:
   - Compute and store a 16-bit pointer (low, high) for each line start in a pointer-table (normal memory or zero page).
   - Typically pointer_for_line[i] = SCREEN_BASE + i * BYTES_PER_SCREEN_LINE + COLUMN_START.
3. Reserve a fixed zero-page pointer PTR_VEC (two bytes).
4. Main loop over lines:
   - Copy the two bytes pointer_for_line[line_index] -> PTR_VEC, PTR_VEC+1.
   - LDY #0 ; start column offset
   - Inner loop: STA (PTR_VEC),Y ; (or LDA then modify then STA)
     INY
     CPY #COLUMN_COUNT
     BNE inner_loop
   - Advance to next pointer_for_line entry; repeat until done.

**Variants and implementation notes**

- **Pointer table location:**
  - If pointer table entries are stored outside zero page, they can be read with absolute,X addressing when building PTR_VEC: LDA table_lo,X ; STA PTR_VEC ; LDA table_hi,X ; STA PTR_VEC+1; then INX by 2.
- **Building table at runtime:**
  - Start with SCREEN_BASE low/high and repeatedly add BYTES_PER_SCREEN_LINE (e.g., 40) to compute next pointer, storing bytes into the table.
  - Use ADC with carry for 16-bit increments (add to low, ADC to high).
- If you only change a few lines, you may compute each PTR_VEC on the fly instead of keeping a full table.
- Avoid using the stack or indexed indirect (e.g., (zp,X)) for this pattern since (zp),Y is the convenient addressing form for base+Y.

## Source Code

```asm
; Example: mark a rectangular window on the screen by writing $01 to each screen cell.
; Assumptions:
;  - SCREEN_BASE = 16-bit address of first character of the top window line
;  - LINE_BYTES  = bytes per full screen line (40 for C64 text mode)
;  - LINES       = number of lines to change
;  - COL_START   = column offset within line (0..39)
;  - COL_COUNT   = number of columns to change (≤40)
;
; Zero-page layout (choose free zp addresses):
PTR_VEC = $FB    ; PTR_VEC (low) at $FB, PTR_VEC+1 (high) at $FC
; Pointer table (can be anywhere in RAM; here shown at label ptr_table)
; Each entry: low byte then high byte for that line start
; ptr_table: .res LINES*2   ; space reserved

        .org $0801      ; example origin (change as needed)

; --------- parameters (change as needed) ---------
SCREEN_BASE = $0400    ; default screen RAM base (may be moved via $D018)
LINE_BYTES  = 40
LINES       = 5
COL_START   = 10
COL_COUNT   = 20
; -----------------------------------------------

; Build pointer table at runtime
        LDX #0
        LDY #0         ; Y reused for arithmetic carry handling
        LDA #<SCREEN_BASE
        STA ptr_table   ; store low of first entry
        LDA #>SCREEN_BASE
        STA ptr_table+1 ; store high of first entry
        LDX #2          ; X = offset into ptr_table for next entry

build_table_loop:
        ; compute next pointer = previous + LINE_BYTES
        ; load previous low/high (we refer to address (ptr_table + X - 2))
        LDA ptr_table-2,X
        CLC
        ADC #<LINE_BYTES
        STA ptr_table,X       ; store new low
        LDA ptr_table-1,X
        ADC #>LINE_BYTES
        STA ptr_table+1,X     ; store new high
        INX
        INX
        CPX #(LINES*2)
        BNE build_table_loop

; Main routine: loop lines and columns
        LDY #0
        LDX #0                ; X = index into ptr_table (0,2,4,...)
line_loop:
        ; copy pointer table entry (2 bytes) into zero-page PTR_VEC ($FB/$FC)
        LDA ptr_table,X
        STA PTR_VEC
        LDA ptr_table+1,X
        STA PTR_VEC+1

        LDY #0                ; start column index = 0
col_loop:
        LDA #$01              ; example: mark with $01
        STA (PTR_VEC),Y       ; write to screen at pointer+Y
        INY
        CPY #COL_COUNT
        BNE col_loop

        INX
        INX
        CPX #(LINES*2)
        BNE line_loop

        RTS

; --- data ---
ptr_table:
        .res LINES*2
```

## Key Registers

- $D018 - VIC-II - screen/character memory pointer control (selects where screen RAM/charset memory is mapped)

## References

- "indirect_indexed_addressing" — expands on the (addr),Y addressing mode used in this project