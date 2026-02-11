# MSGFLG ($009D) — Kernal Message Control Flag

**Summary:** MSGFLG at $009D (zero page) is the Kernal message control flag set by SETMSG ($FE18). It controls display of Kernal error and control messages with values 192/$C0, 128/$80, 64/$40 and 0.

## Description
MSGFLG (zero page $009D) is written by the Kernal routine SETMSG (65048, $FE18) and selects whether Kernal error messages and/or control messages are displayed:

- 192 ($C0) — both Kernal error and control messages enabled. (Rare under BASIC; BASIC prefers its own plain-text errors.)
- 128 ($80) — control messages only (e.g. SEARCHING, SAVING, FOUND). Typical in BASIC direct/immediate mode.
- 64 ($40) — Kernal error messages only.
- 0 — suppress all Kernal messages. This value is placed here when BASIC enters program or RUN mode.

Notes:
- BASIC often suppresses Kernal messages because it supplies its own error text; Kernal messages may still be useful for machine-language monitors or during SAVE/LOAD operations when the Kernal's numeric I/O ERROR is used.
- SETMSG ($FE18) is the documented Kernal entry that modifies this flag.

## Key Registers
- $009D - Kernal - Message control flag (MSGFLG): 192 ($C0)=error+control, 128 ($80)=control only, 64 ($40)=error only, 0=suppress all

## References
- "kernal_zero_page_overview_0x90_0xff" — overview of Kernal control flags in zero page  
- "ldtnd_open_files_count_and_index_0x98" — file operations that may generate Kernal messages

## Labels
- MSGFLG
- SETMSG
