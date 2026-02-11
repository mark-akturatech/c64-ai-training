# GET statement (Commodore 64 BASIC)

**Summary:** GET reads single keystrokes from the Commodore 64 keyboard buffer (up to 10 characters). Reading a numeric variable when a non-digit was typed produces ?SYNTAX ERROR; prefer reading into string variables and converting later. Useful to avoid some INPUT limitations.

## Description
GET <variable list> reads each key typed by the user from the system keyboard buffer. Up to 10 characters are held in the buffer; any keys pressed after the 10th are discarded. When GET removes (reads) one character from the buffer, room is made for another keypress.

Behavior specifics:
- GET reads characters in the order they were typed (consumes buffer entries).
- If GET is used with a numeric variable and the character read is not a valid digit, the interpreter reports ?SYNTAX ERROR. To avoid this, read into string variables (A$) and convert to numbers later.
- GET can be used to implement non-blocking or single-keystroke input loops (see examples).
- GET is an alternative to INPUT when you need immediate single-character reads or to bypass INPUT's prompt/line-editing behavior.

## Source Code
```basic
10 GET A$: IF A$ ="" THEN 10: REM LOOPS IN 10 UNTIL ANY KEY HIT
20 GET A$, B$, C$, D$, E$: REM READS 5 KEYS
30 GET A, A$
```

## References
- "keyboard_buffer_and_peek" — expands on keyboard buffer behavior and using PEEK to read key state
- "input_statement" — difference between GET and INPUT, additional examples and usage notes
