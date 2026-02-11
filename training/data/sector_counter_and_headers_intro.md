# TAIL GAP — transition into header creation (JSR *C100)

**Summary:** Marks the transition from setup into the header-creation routine: label/comment for tail/gap, a comment for sector counter, a JSR to *C100 (LED ON), and the "CREATE HEADERS" header comment. Contains 6502 mnemonic JSR and inline comments.

**Description**
This short assembly fragment serves as the boundary between setup/initialization and the header-creation code. Elements present:

- "TAIL GAP" — a label or marker indicating the tail/gap area used for disk/tape formatting.
- "; SECTOR COUNTER" — a comment indicating a sector index/counter variable is relevant here.
- "JSR *C100  ; LED ON" — calls a subroutine at *C100 to turn an LED on. (JSR is the 6502 subroutine call mnemonic.)
- ";* CREATE HEADERS *" — comment/header marking the beginning of the header-creation routine.

This chunk does not contain the header-creation code itself; it is the transition point where header generation begins immediately after.

## Source Code
```asm
TAIL  GAP 

;    SECTOR  COUNTER 

JSR  *C100  ;    LED  ON 

;*  CREATE   HEADERS  * 
```

## References
- "tail_gap_and_sector_variables" — expands on variables initialized for tail/gap and sector indices
- "header_creation_routine" — header creation code begins immediately after these introductory lines