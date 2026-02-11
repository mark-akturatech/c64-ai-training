# Commodore 64 — Keyboard buffer, matrix scan (CIA #1), PEEK(197) and POKE injection (631–640)

**Summary:** Describes the C64 ten-character keyboard buffer (type-ahead), example loop to empty it (GET JUNK$), reading the numeric key code via PEEK(197) (returns 64 when no key pressed), keyboard matrix scanning performed by CIA #1 using $DC00/$DC01 (columns/rows, bits 0–7), control-key decoding, and inserting characters into the buffer via POKE 631–640 and setting count in 198 to auto-execute direct-mode commands.

**Keyboard buffer and type-ahead**
The KERNAL maintains a 10-character FIFO keyboard buffer used to queue keystrokes (type-ahead). Keystrokes are stored in order and processed FIFO so rapid typing won’t drop characters. An accidental keystroke can remain in the buffer and be processed later (for example after a RETURN), so programs sometimes explicitly empty the buffer before prompting for input.

**Emptying the buffer (GET JUNK$)**
A simple loop using GET to drain the keyboard buffer:

- Example: loop repeatedly calling GET JUNK$ until it returns an empty string, discarding queued characters.

This guarantees the buffer is empty before prompting or reading intended input.

**Reading a raw key code with PEEK(197)**
Location 197 (decimal) / $00C5 contains the numeric value resulting from the KERNAL keyboard scan:

- PEEK(197) returns an integer code that corresponds to the currently decoded key (KERNAL numeric key value).
- If no key is being held at the instant of the PEEK, the value returned is 64.
- The numeric-to-character mapping (PETSCII/CHR$ conversions) is documented in system reference tables (Appendix C referenced in the source).

Example: loop until a key is pressed, then convert code to character:
- 10 AA = PEEK(197): IF AA = 64 THEN 10
- 20 BB$ = CHR$(AA)

**Keyboard matrix scanning (CIA #1, MOS 6526)**
The keyboard is wired as an 8×8 matrix (64 switch positions). The KERNAL scans the matrix via CIA #1 (MOS 6526):

- CIA register 0 (address $DC00 / decimal 56320) is used for keyboard columns (bits 0–7 → columns 0–7).
- CIA register 1 (address $DC01 / decimal 56321) is used for keyboard rows (bits 0–7 → rows 0–7).
- The KERNAL writes column values in sequence and reads row bits to detect switch closures; the decoded result becomes the numeric key value placed in location 197.
- Control keys (<RVS ON>, <CTRL>, <C=>) and <SHIFT> are decoded separately by the KERNAL (it “remembers” control-key state) and alter the code placed in 197 (additional values beyond the 64 matrix positions).

**Inserting characters into the keyboard buffer (POKE 631–640 and setting 198)**
You can write characters directly into the keyboard buffer and cause the system to process them by setting the character count:

- Locations decimal 631–640 hold character bytes that will be treated as pending keystrokes when the count is set.
- Location decimal 198 ($00C6) holds the number of characters present in the buffer; POKEing a count there tells the KERNAL how many of the 631–640 bytes to consume.
- This can be used to automatically execute direct-mode commands: print a statement (so it appears on screen), place carriage-returns in the buffer, set the count, and the system will process those direct commands (for example, to print to the printer and then resume execution).

Provided example (corrected for syntax/OCR punctuation):
- 10 PRINT CHR$(147)"PRINT#1: CLOSE 1: GOTO 50"
- 20 POKE 631,119: POKE 632,13: POKE 633,13: POKE 198,3
- 30 OPEN 1,4: CMD 1: LIST
- 40 END
- 50 REM PROGRAM RE-STARTS HERE

(Notes: CHR$(147) clears the screen; values poked at 631–633 are PETSCII bytes representing characters/carriage-returns as in the original example; exact PETSCII encoding for the printed text depends on internal character codes.)

## Source Code
```basic
10 GET JUNK$: IF JUNK$ <> "" THEN 10
```

```basic
10 AA = PEEK(197): IF AA = 64 THEN 10
20 BB$ = CHR$(AA)
```

```basic
10 PRINT CHR$(147)"PRINT#1: CLOSE 1: GOTO 50"
20 POKE 631,119: POKE 632,13: POKE 633,13: POKE 198,3
30 OPEN 1,4: CMD 1: LIST
40 END
50 REM PROGRAM RE-STARTS HERE
```

Keyboard/CIA register quick map (reference):
```text
$DC00 (decimal 56320) — CIA #1, register 0
  Bits 0-7 = keyboard columns 0-7 (drive outputs / column strobes)

$DC01 (decimal 56321) — CIA #1, register 1
  Bits 0-7 = keyboard rows 0-7 (readback inputs showing closed switches)
```

Memory locations for buffer / status:
```text
Decimal 197 = $00C5 — KERNAL keycode result (PEEK(197)); 64 = no key pressed
Decimal 198 = $00C6 — key buffer count (set to N to tell KERNAL N characters at 631–640)
Decimal 631–640 = $0277–$0280 — keyboard buffer bytes (BASIC's referenced buffer area)
```

## Key Registers
- $DC00-$DC0F - CIA #1 - I/O registers; keyboard columns at $DC00 (register 0), keyboard rows at $DC01 (register 1)
- $00C5 - RAM/KERNAL - keyboard scan result (PEEK(197)); 64 means no key pressed
- $00C6 - RAM/KERNAL - keyboard buffer count (PEEK/POKE 198 decimal)
- $0277-$0280 - RAM - keyboard buffer bytes (decimal 631–640) for injected keystrokes

## References
- "cia_registers_and_ports" — expands on CIA #1 and CIA #2 I/O registers used for keyboard and bank selection
- "peek_function" — expands on reading key state via PEEK(197)

## Labels
- $DC00
- $DC01
- $00C5
- $00C6
- $0277-$0280
