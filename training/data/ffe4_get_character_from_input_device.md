# KERNAL $FFE4 — GETIN (Get character from input device)

**Summary:** KERNAL entry $FFE4 (GETIN) returns a character from the current input device; it behaves like CHRIN ($FFCF) for all devices except the keyboard, and reads one character from the IRQ-filled keyboard buffer (returns $00 if buffer empty).

## Description
GETIN ($FFE4) is the KERNAL routine to obtain one character from the current input device. For non-keyboard devices it functions identically to CHRIN ($FFCF). When the keyboard is selected as the current input device, GETIN reads a single character from the keyboard buffer populated by the IRQ keyboard-scanning routine.

If the keyboard buffer is empty, GETIN returns zero in the accumulator. The routine depends on the IRQ handler (keyboard scanning) to place characters into the buffer before GETIN can retrieve them.

## Key Registers
- $FFE4 - KERNAL - GETIN (get character from current input device; keyboard reads from IRQ-filled keyboard buffer)

## References
- "ffcf_input_character_from_channel" — CHRIN vs GETIN differences (keyboard handling)
- "ff9f_scan_the_keyboard" — IRQ keyboard scanning that fills buffer

## Labels
- GETIN
