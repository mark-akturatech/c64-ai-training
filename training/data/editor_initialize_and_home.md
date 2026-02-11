# KERNAL Editor init: CINT / INITV (VIC, editor vars, LDTB1, HOME)

**Summary:** Disassembly of the KERNAL editor initialization (CINT) and HOME routines: VIC/PANIC setup, PET-mode flag ($0291), editor variables (KEYLOG $028F/$0290, XMAX $0289, COLOR $0286, DELAY $028C, KOUNT $028B, blink counters $CD/$CC), filling the high-byte line pointer table LDTB1 ($D9..$F3) using LPS loops, clearing screen lines (JSR $E9FF -> CLRLN), and HOME (NXTD) which resets PNTR/TBLX ($D3/$D6), scans LDTB1 to position PNTR, calls SETPNT (JSR $E9F0) / STUPT to set the hardware cursor and sets LNMX ($D5) before JMP SCOLOR.

**Initialization and variable setup**
This chunk begins at the KERNAL entry CINT. It first calls the VIC/PANIC setup routine (JSR $E5A0). It then initializes KERNAL/editor variables in zero page and system variables:

- Forces PET mode by storing zero into $0291 (MODE).
- Clears the "good character from screen" flag at $CF (BLNON).
- Installs the SHIFT-logic pointer KEYLOG as a 16-bit pointer at $028F/$0290 (low/high) pointing to SHFLOG.
- Sets editor/list constants:
  - XMAX ($0289) = #$0A (maximum type-ahead buffer)
  - DELAY ($028C)
  - COLOR ($0286) = #$0E (light blue)
  - KOUNT ($028B) = #$04 (key repeat delay)
  - BLNCT ($CD) and BLNSW ($CC) initialized to zero (blink counters/switches)

All these are standard KERNAL/editor system variables used later by input and screen routines.

**LDTB1 (high-byte pointer table) fill loop**
The routine fills a line high-byte pointer table (LDTB1) in zero page starting at $D9. Steps:

- Load the high-byte base from $0288 (HIBASE), ORA #$80 and transfer to Y. (Setting bit7 is used as a marker — see runtime tests below.)
- Clear X (start index=0).
- For each line entry:
  - Store Y into LDTB1,X (STY $D9,X).
  - Add LLEN (#$28 = 40) to Y/accumulator to advance the screen pointer; if carry, INY bumps the high byte for the next entry.
  - INX and loop until X == NLINES+1 (CPX #$1A in this disassembly).
- After the loop the code writes $FF into LDTB1 at the next slot (STA $D9,X) to tag end-of-table.

Thus LDTB1 holds the high-byte of the start-of-line pointers for each text line; entries have bit7 set (via ORA #$80) and $FF marks the end.

**Clearing screen lines**
After building LDTB1 the code sets X to NLINES-1 (LDX #$18) and calls JSR $E9FF (CLRLN) repeatedly from the bottom line upward (DEX / BPL loop). CLRLN clears a single text line on the screen — used during initialization to blank the editor screen.

**HOME (NXTD) — reset and cursor positioning**
HOME sequence (label NXTD):

- LDY #$00; STY $D3 (PNTR) — set left column pointer to 0.
- STY $D6 (TBLX) — set top line index to 0.
- Call STUPT (hardware cursor setup) — routine to position VIC cursor using current PNTR/TBLX (JSR not in this chunk).
- To set PNTR correctly for the current line:
  - LDX TBLX; LDA PNTR; LDY LDTB1,X — load the high-byte marker for the line.
  - If bit7 is set (BMI), start-of-line found -> branch to SETPNT (JSR $E9F0) to finalize pointer indirection.
  - Otherwise, add LLEN (#$28) to the pointer and store back to PNTR, decrement X and repeat (scanning left to find the line start).
- To find the line end after setting the start pointer:
  - Load A with LLEN-1 (#$27) and increment X, then scan LDTB1,X until BMI (bit7 set) — that marks the next line boundary.
  - When found, store LLEN-1 into LNMX ($D5).
- Finally JMP SCOLOR to make the color pointer follow (patch noted in comments).

Operational note: LDTB1 entries use bit7 as a line-boundary marker — the HOME code tests LDY ... BMI to detect boundaries. The algorithm scans through LDTB1 entries (moving X / PNTR) to find the start and end boundaries for the current TBLX/PNTR.

**Patches and cross-calls**
- JSR $E5A0 (PANIC / VIC setup)
- JSR $E9FF (CLRLN) used to clear lines
- JSR $E9F0 (SETPNT) to set up pointer indirection
- JMP $EA24 (SCOLOR) to update color pointer
Comments indicate a patch for input logic (tags "901227-03**********").

## Source Code

## Labels
- MODE
- KEYLOG
- XMAX
- COLOR
- LDTB1
- PNTR
- TBLX
- LNMX
