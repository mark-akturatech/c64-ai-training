# RPTFLAG ($028A) — Key Repeat Control

**Summary:** RPTFLAG at decimal 650 ($028A) is a RAM flag that controls which keys auto-repeat when held; default 0 allows only cursor keys, Insert/Delete, and Space to repeat. POKE 650,128 ($80) enables repeating for all keys; POKE 650,64 ($40) disables repeating entirely.

**Description**

RPTFLAG (location 650 decimal, $028A hex) selects which keyboard keys will auto-repeat while held down. Default value = 0: only cursor movement keys, the Insert/Delete key, and the space bar repeat. Other keys require release before they will produce another character.

Values:
- 0 — default behavior: only cursor keys, Insert/Delete, and Space repeat.
- 128 ($80) — enable repeating for all keys.
- 64 ($40) — disable repeating for all keys.

Use BASIC POKE to change the flag, e.g.:
- `POKE 650,128`  (set all keys to repeat)
- `POKE 650,64`   (disable all key repeat)

Timing and the actual repeat rate are controlled by the following memory locations:

- **KOUNT ($028B, 651 decimal):** Repeat speed counter. Default value is 4. POKEing with values from 0 to 255 varies the time before keys repeat. Values of 0 and 255 will give the longest delay times. ([book6502.altervista.org](https://book6502.altervista.org/files/books/The_Master_Memory_Map_for_the_Commodore_64.pdf?utm_source=openai))

- **DELAY ($028C, 652 decimal):** Repeat delay counter. Default value is 16. This counter determines how long a key must be held down before it starts repeating. The value here is decremented every 1/60 second (one jiffy). When it reaches 0, the key starts repeating. ([scribd.com](https://www.scribd.com/doc/170569167/Mapping-the-64?utm_source=openai))

By adjusting these values, you can control the delay before repeating begins and the speed of repetition.

## Key Registers

- $028A - RAM - RPTFLAG: controls which keys auto-repeat (default 0; $80 = all repeat; $40 = none repeat)
- $028B - RAM - KOUNT: repeat speed counter (default 4)
- $028C - RAM - DELAY: repeat delay counter (default 16)

## References

- "Mapping the Commodore 64" — provides detailed information on keyboard repeat control and timing parameters. ([scribd.com](https://www.scribd.com/doc/170569167/Mapping-the-64?utm_source=openai))
- "The Master Memory Map for the Commodore 64" — offers insights into memory locations related to key repeat functionality. ([book6502.altervista.org](https://book6502.altervista.org/files/books/The_Master_Memory_Map_for_the_Commodore_64.pdf?utm_source=openai))

## Labels
- RPTFLAG
- KOUNT
- DELAY
