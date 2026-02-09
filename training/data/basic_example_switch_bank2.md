# VIC-II Memory Banking and Address Configuration (BASIC example — select VIC bank 2, adjust $D018 and KERNAL screen page)

**Summary:** BASIC example that uses CIA‑2 port and DDR ($DD00/$DD02) to select VIC bank 2 ($8000–$BFFF), writes $D018 to point the VIC charset to the ROM shadow at $9000–$9FFF, and updates the KERNAL screen page pointer (memory location 648) so KERNAL/BASIC I/O target the new screen.

## Overview
This packet contains a minimal BASIC routine and explanation to:
- set CIA‑2 direction bits so the bank‑select lines are outputs (POKE $DD02),
- set CIA‑2 port A ($DD00) to select VIC bank 2 ($8000–$BFFF),
- set VIC register $D018 so the VIC charset pointer points at $9000–$9FFF (ROM shadow),
- update the KERNAL screen page pointer (decimal 648) so KERNAL/BASIC I/O write to the new screen page (128 → $8000/256).

Behavioral notes from the source:
- After switching the VIC bank and $D018, the displayed characters may be garbled (the VIC is showing RAM interpreted as characters). The READY prompt and cursor remain functional.
- BASIC/KERNAL routines must use the updated screen pointer (e.g. POKE 32768,42) to write to the relocated screen; writing to the old screen address (e.g. POKE 1024,42) will not affect the visible screen.

## Source Code
```basic
10 POKE 56578, PEEK(56578) OR 3        ; ensure direction bits are outputs
20 POKE 56576, (PEEK(56576) AND 252) OR 1   ; select VIC bank 2 ($8000-$BFFF)
30 POKE 53272, 4                       ; set $D018 so charset points to ROM shadow at $9000-$9FFF
40 POKE 648, 128                       ; tell KERNAL new text screen page (128 = $8000/256)
```

Condensed example (same as above):
```basic
 10 POKE 56578, PEEK(56578) OR 3
 20 POKE 56576, (PEEK(56576) AND 252) OR 1
 30 POKE 53272, 4
 40 POKE 648, 128
```

Quick usage reminders (from source):
```basic
POKE 1024,42    ; will NOT place an asterisk at top-left after bank change
POKE 32768,42   ; writes to the new screen location after POKE 648,128
```

## Key Registers
- $DD00-$DD0F - CIA 2 - Port A/Port B/DDR registers (port A bits used here for VIC bank selection; DDR at $DD02 controls direction bits).
- $D000-$D02E - VIC‑II - control registers (including $D018 which configures screen/charset pointers).
- $D018 - VIC‑II - screen/charset pointer register (written as decimal 53272 in examples).
- $0288 (decimal 648) - KERNAL RAM location - text screen page pointer (page number; 128 → $8000/256).

## References
- "bank_selection_registers_and_rw" — expands on safe $DD00 modification
- "d018_vmcsb_overview" — expands on $D018 configuration referenced in line 30