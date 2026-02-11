# LSTSHF ($028E) — Last SHIFT/CTRL/Logo Key Pattern

**Summary:** LSTSHF (decimal 654, $028E) stores the last pattern of SHIFT/CTRL/Logo keypress. Used with SHFLAG and keyboard table selection logic to debounce special SHIFT keys and prevent rapid character-set toggling.

## Description
LSTSHF is a one-byte system variable holding the last detected pattern for the special SHIFT keys (SHIFT, CTRL, Logo). The kernel uses this value together with SHFLAG and the keyboard table selection mechanism to:

- Debounce the special SHIFT keys (preventing spurious changes caused by switch bounce).
- Prevent the SHIFT/logo combination from switching character sets repeatedly during a single physical press of both keys.

The source text does not provide a bit-level layout for the stored pattern; it is described only as "last pattern of SHIFT/CTRL/Logo keypress". For detailed interaction with SHFLAG and the keyboard tables, see the referenced cross-chunk topic.

## Key Registers
- $028E - RAM - Last pattern of SHIFT/CTRL/Logo keypress; used to debounce special SHIFT keys and with SHFLAG to select keyboard tables

## References
- "shflag_shift_ctrl_logo_flag_and_keyboard_tables" — expands on how SHFLAG and keyboard tables work together with LSTSHF to select keyboard tables and debounce special SHIFT keys

## Labels
- LSTSHF
