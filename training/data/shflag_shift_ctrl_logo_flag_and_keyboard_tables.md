# SHFLAG ($28D, 653)

**Summary:** SHFLAG at $028D (decimal 653) is a RAM flag that encodes current SHIFT/CTRL/Commodore-logo key state (bits: 1=SHIFT, 2=Logo, 4=CTRL). The OS uses it to select one of four keyboard lookup tables ($00F5) and SHIFT+Logo toggles the character set by changing the dot-table base at $D018 unless disabled by MODE ($0291).

## Description
This byte indicates which of the special modifier keys are currently depressed:

- Bit meanings:
  - 1 = SHIFT key down
  - 2 = Commodore logo key down
  - 4 = CTRL key down
- Values add for combinations (e.g., value 3 = SHIFT + Logo).

Behavior and usage:
- The Operating System reads SHFLAG to choose which of four keyboard translation tables to use when converting a key matrix position into a PETSCII character (the four tables cover the 64-key matrix; see $00F5 for the tables).
- Pressing SHIFT+Commodore-logo toggles the active character set between uppercase/graphics and lowercase/uppercase, provided the MODE flag at $0291 has not disabled this behavior.
- The character-set toggle is implemented by changing the character dot data table base (VIC-II register $D018). This is a global screen-wide change and differs from printing SHIFTed characters (which affect output of a single character via the keyboard translation tables).
- The same visible effect as the SHIFT+Logo toggle can be achieved by directly POKEing $D018 with the appropriate value.

## Key Registers
- $028D - RAM - SHFLAG: SHIFT / Commodore-logo / CTRL key state (1=SHIFT, 2=Logo, 4=CTRL)
- $00F5 - RAM - Keyboard lookup table selector/base (four translation tables for 64-key matrix)
- $0291 - RAM - MODE flag (can disable SHIFT+Logo character set toggle)
- $D018 - VIC-II ($D000-$D02E) - Character/dot-data table base (selects active character set ROM/RAM area)

## References
- "mode_toggle_character_sets" — expands on MODE flag disabling SHIFT+Logo character set toggle
- "keylog_vector_and_keyboard_table_setup" — expands on KEYLOG vector and keyboard lookup table setup based on SHFLAG

## Labels
- SHFLAG
- MODE
- D018
