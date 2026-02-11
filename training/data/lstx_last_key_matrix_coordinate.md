# ********* - LSTX ($C5) — Matrix coordinate of the last key pressed

**Summary:** LSTX at zero-page $C5 holds the keyboard matrix coordinate of the last key detected (64 = none). It is updated each normal IRQ for keyboard debouncing and is used by the KERNAL to suppress auto-repeats; values are derived from the keyboard matrix (see SFDX $CB).

## Description
LSTX ($C5) is a zero-page location written during every normal IRQ. On each IRQ the keyboard scan routine places the matrix coordinate of the last keypress into $C5 to support debouncing logic. The Operating System (KERNAL) compares the current key value to the value in LSTX and will suppress repeating the character if the value is unchanged.

Value notes:
- 64 indicates no key pressed (none).
- The numeric codes stored in LSTX correspond to the keyboard matrix mapping described at SFDX ($CB) and the keyboard matrix explanation at $DC00 (56320).

## Key Registers
- $C5 - Zero Page - LSTX: Matrix coordinate of the last key pressed (64 = none pressed). Updated each normal IRQ for keyboard debouncing; used by OS to suppress repeats.

## References
- "sfdx_keyscan_matrix_coordinate_and_keymap" — keyboard matrix values and mapping list used to produce LSTX values (SFDX / $CB)
- "ndx_keyboard_buffer_count_and_dynamic_keyboard" — interaction between key debounce and keyboard buffer usage

## Labels
- LSTX
