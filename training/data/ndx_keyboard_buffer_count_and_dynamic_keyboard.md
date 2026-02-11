# NDX ($C6) — Number of characters in the keyboard buffer (queue)

**Summary:** $C6 (decimal 198) holds the number of characters currently queued in the keyboard buffer starting at $0277 (631). The buffer capacity is controlled by $0289 (649, default 10). Useful operations: clear the buffer with POKE 198,0, or inject PETSCII codes into $0277+ and set NDX to simulate typed input.

## Description
NDX (location 198 / $C6) is a one-byte counter that indicates how many characters are waiting in the keyboard buffer beginning at location 631 ($0277). The maximum number of characters allowed in that buffer is stored at location 649 ($0289), which defaults to 10.

Behavior:
- If INPUT or GET is executed while characters are already in the buffer, those characters are read as part of the input stream.
- To discard any pending characters before an INPUT/GET, POKE 198,0 (set NDX to 0) causes the buffer to be ignored.
- Spurious keypresses (for example, caused by joystick noise in controller port 1) can deposit unwanted characters; clearing NDX prevents these from affecting subsequent input.

Dynamic keyboard (keyboard programming / input injection):
- You can simulate keyboard input by POKEing PETSCII character values into the buffer at $0277, $0278, ... and then setting NDX ($C6) to the number of characters you placed. The next INPUT/GET or editor action will consume those characters as if typed.
- This allows a running program to insert or modify program lines in direct mode, or to supply quoted strings so INPUT does not treat commas/colons as separators.
- Example technique to force quoted INPUT (uses PETSCII decimal codes): POKE 198,3 : POKE 631,34 : POKE 632,34 : POKE 633,20
  - This places two quote characters (34 decimal, PETSCII quote) and a delete (20 decimal) into the buffer and sets NDX to 3. The first quote lets INPUT read commas/colons inside the string, the second quote exits quote mode, and the delete removes that trailing quote.
- Note: PETSCII numeric codes are used for characters when injecting into the buffer (e.g., 34 = quote in PETSCII decimal).

## Source Code
```basic
POKE 198,0            : REM Clear keyboard buffer (set NDX to 0)
POKE 198,3:POKE 631,34:POKE 632,34:POKE 633,20
: REM Example — place two quotes and a delete into the buffer and set NDX=3
```

## Key Registers
- $00C6 - RAM - NDX: number of characters in keyboard buffer (queue)
- $0277 - RAM - keyboard buffer start (location 631)
- $0289 - RAM - keyboard buffer size limit (location 649, defaults to 10)

## References
- "lstx_last_key_matrix_coordinate" — debounce/state of last key pressed (complements keyboard buffer handling)
- "sfdx_keyscan_matrix_coordinate_and_keymap" — keyboard matrix interpretation used when injecting characters

## Labels
- NDX
