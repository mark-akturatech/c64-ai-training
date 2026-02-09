# CRSW ($D0) — Input-from keyboard-or-screen flag

**Summary:** Zero-page flag at $00D0 (decimal 208) used by the Kernal CHRIN routine ($F157 / 61783) to indicate input source: 3 = input available from the screen, 0 = request a new line from the keyboard.

## Description
CRSW is a one-byte flag located at zero page address $00D0 (208). The Kernal CHRIN routine (address $F157, decimal 61783) examines this flag to decide where to obtain input:

- Value 3: input is available from the screen (CHRIN will read from the screen buffer).
- Value 0: no screen input available — CHRIN should obtain a new line from the keyboard.

The flag is part of the Kernal input handling state and affects how CHRIN selects its input source.

## Key Registers
- $00D0 - RAM - CRSW: Input-from keyboard-or-screen flag used by Kernal CHRIN ($F157); 3 = screen input available, 0 = request keyboard input

## References
- "ndx_keyboard_buffer_count_and_dynamic_keyboard" — keyboard buffer usage and dynamic keyboard/input-source behavior