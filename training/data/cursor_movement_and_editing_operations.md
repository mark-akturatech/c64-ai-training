# KERNAL: Cursor Movement, Editing, and Insert/Delete Logic (NXT1..NXT3, NXTX, BKLN, BAK1UP, SCOLOR, DSPP)

**Summary:** This document provides a disassembly of the Commodore 64 KERNAL routines responsible for cursor movement, editing, and insert/delete operations. The disassembly covers addresses $E703–$E769, detailing the implementation of cursor movement, backspace/line-wrap checks, print/character-insert logic (NXT1/NXT3/NXTX labels), and updates to display/color pointers (SCOLOR, DSPP). It includes manipulation of KERNAL workspace variables such as PNTR ($D3), PNT ($D1/$D2), LNMX ($D5), TBLX ($D6), DATA ($D7), CRSW ($D0), INSRT ($D8), and the use of the USER pointer ($F3).

**Overview**

This fragment of the KERNAL ROM disassembly implements portions of the cursor and editing subsystem:

- **Entry/Exit Sequence and PNTR/TBLX Restore (Starts at $E703):** Handles stack clean-up (PLA x2), updates PNTR/TBLX, and calls STUPT before returning.

- **Print Routine (PRT at $E716):** Pushes registers, stores the character byte (DATA), clears CRSW, and dispatches to various NXT* handlers depending on the byte value and insertion mode.
  - Carriage return (0x0D) jumps to NXT1 ($E891, not in this fragment).
  - Printable character handling branches to insertion/print paths (NXT3, NXTX).
  - Performs case conversion for ASCII lower-case (AND #$DF) and calls into QTSWC for quoting/shift handling.

- **Insert/Delete and Backspace Handling:**
  - Checks INSRT ($D8) to decide whether to perform insertion (INS3/INS1 not present here) or simple overwrite.
  - Backspace/line-decrement path: Calls CHKBAK and related labels (BAK1UP and BKLN/BKLN1) to adjust table index (TBLX), PNTR, and LNMX as needed.

- **Color/Display Pointer Updates:**
  - Calls SCOLOR ($EA24) to fix color pointers after moving bytes around.
  - Uses indirect addressing (LDA (PNT),Y and STA (PNT),Y) to copy bytes; similar copies for (USER),Y via $F3.

Control flow is implemented with conditional branches to labels NJT1, NJT8, NJT9, NTCN, CNC3X, etc. Many referenced labels (LOOP2, NXTX, NXT1, NXT3, NC3, INS3/INS1, STUPT, QTSWC, CHKBAK, SCOLOR) are outside this fragment.

The exact assembly listing is provided in the Source Code section below for detailed reference.

## Source Code
