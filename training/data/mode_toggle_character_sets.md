# MODE (location 657 / $0291) — SHIFT+Logo character-set toggle flag

**Summary:** Flag at $0291 (decimal 657) controls the SHIFT+Commodore-logo key toggle between uppercase/graphics and upper/lowercase character sets. Toggle via POKE (POKE 657,128 to disable, POKE 657,0 to enable) or by printing CHR$(8)/CTRL‑H (disable) and CHR$(9)/CTRL‑I (enable); see $D018 (VIC‑II dot-table base) and $C000 (ROM) for related character-set control.

## Description
This RAM flag enables or disables the special keyboard feature that swaps the character ROM/table when the user presses SHIFT together with the Commodore logo key. It only affects that special SHIFT+Logo set-toggle behavior — it does not change how SHIFTed characters print.

- Value 0: feature enabled (SHIFT+Logo toggles character set).
- Value 128 ($80): feature disabled (SHIFT+Logo does nothing).
- Equivalently controlled by outputting control characters:
  - CHR$(8) (CTRL‑H): disable the SHIFT+Logo toggle.
  - CHR$(9) (CTRL‑I): enable the SHIFT+Logo toggle.

This flag is distinct from the VIC‑II dot-table base ($D018) and ROM locations (e.g. $C000) that determine which character set graphics are used; those addresses are referenced for changing the dot-table/character base.

## Source Code
```basic
10 REM Disable SHIFT+Logo character-set toggle
20 POKE 657,128

30 REM Enable SHIFT+Logo character-set toggle
40 POKE 657,0

50 REM Alternate: send control characters to achieve same effect
60 PRINT CHR$(8)   : REM CTRL-H disables toggle
70 PRINT CHR$(9)   : REM CTRL-I enables toggle
```

## Key Registers
- $0291 - System RAM - MODE flag: enable (0) / disable ($80) SHIFT+Logo character-set toggle
- $D018 - VIC‑II - Dot-table / character memory base (affects character appearance)
- $C000 - ROM - Character-set control / related ROM routines (referenced for charset control)

## References
- "shflag_shift_ctrl_logo_flag_and_keyboard_tables" — SHFLAG selects tables; MODE controls the SHIFT+Logo set-toggle feature
- "hibase_screen_memory_top_page" — Changing dot-table base address ($D018) also changes character appearance

## Labels
- MODE
- D018
