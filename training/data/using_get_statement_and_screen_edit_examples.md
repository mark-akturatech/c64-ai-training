# Commodore 64 BASIC — GET Statement, Keyboard Buffer (10 Chars), and Simple Screen-Editor Examples

**Summary:** This document details the behavior of the Commodore 64's 10-character keyboard buffer, the semantics of the GET statement, common polling loop patterns, simple screen-editor behaviors, and function-key mappings using CHR$ codes.

**Behavior and Usage**

- **Keyboard Buffer:** The C64 hardware maintains a 10-character FIFO (First-In-First-Out) keyboard buffer. If the computer is busy, up to 10 keystrokes can be stored and will be processed in order when the system is ready.

- **GET Statement:** The GET statement reads a single character from the keyboard buffer. If no character is available, GET assigns an empty string ("") to the target variable (e.g., A$).

- **Polling Loop:** A typical loop to wait for a key press:


  This loop continuously checks for a key press and proceeds when a key is detected.

- **Buffer Overflow:** If more than 10 characters are typed before the program reads them, characters beyond the 10th are lost.

- **Cursor Behavior:** GET does not display a cursor; characters typed while GET is looping are printed only if the program explicitly prints them (e.g., PRINT A$).

- **Screen Editors:** GET is useful for implementing simple screen editors by capturing typed characters, mapping special keys via CHR$ codes, and intercepting keys like CLR/HOME to handle them specially.

**Screen-Editor and Function-Key Mapping Examples**

- **Function Keys and Special Keys:** These are represented by PETSCII/CHR$ codes. The CHR$ code chart maps each physical key to a numeric value; these values can be tested in BASIC to trigger specific actions.

- **Example Behaviors in a Minimal GET-Based Editor:**
  - Use GET in a loop to capture each keystroke and then PRINT or process it.
  - Map function keys (via CHR$ numbers) to actions such as changing border/background colors or inserting text phrases.
  - Example mappings use CHR$(133) to CHR$(136) to represent function keys F1 to F4; actions include POKEing color registers and inserting fixed strings with CHR$(13) for a newline.

## Source Code

  ```basic
  10 GET A$: IF A$ = "" THEN 10
  ```


```basic
NEW
10 TI$="000000"
20 IF TI$ < "000015" THEN 20
```

Demonstration of keyboard buffering: RUN the above and then type "HELLO" while the program is busy — the buffer collects up to 10 characters, which appear later.

Polling loop that waits for a key:

```basic
10 GET A$: IF A$ = "" THEN 10
100 PRINT A$;: GOTO 10
```

Example function-key mappings (using CHR$ values from the CHR$ code chart):

```basic
20 IF A$ = CHR$(133) THEN POKE 53280,8: GOTO 10
30 IF A$ = CHR$(134) THEN POKE 53281,4: GOTO 10
40 IF A$ = CHR$(135) THEN A$="DEAR SIR:"+CHR$(13)
50 IF A$ = CHR$(136) THEN A$="SINCERELY,"+CHR$(13)
```

Notes:

- CHR$ numbers correspond to the C64 CHR$/PETSCII code chart.
- CHR$(13) appends a carriage-return/linefeed behavior in BASIC string concatenation.

For reference, here is a portion of the PETSCII code chart relevant to function keys:

```text
DEC  HEX  CHR$  KEY
133  $85  133   F1
134  $86  134   F3
135  $87  135   F5
136  $88  136   F7
```

This chart indicates that CHR$(133) corresponds to the F1 key, CHR$(134) to F3, CHR$(135) to F5, and CHR$(136) to F7.

## Key Registers

- **$D020 (53280):** VIC-II Border Color Register
- **$D021 (53281):** VIC-II Background (Screen) Color Register

## References

- "chr$_function" — expands on CHR$ codes and use in GET-based editors

## Labels
- $D020
- $D021
