# SCREEN EDITOR — QUOTE MODE & INSERT MODE (Commodore 64 BASIC)

**Summary:** Behavior of the C64 SCREEN EDITOR when editing listed program lines: the editor reads only two physical screen lines (80-character logical limit); QUOTE MODE (cursor/control keys inserted inside quoted strings are shown as reversed-character tokens and act as control characters when printed) and INSERT MODE (SHIFT+INST opens inserted space; cursor/color controls show reversed tokens; DEL/INST behave differently). Includes examples of embedding cursor moves and DEL/INST sequences in PRINT strings and warnings about editing lines that contain embedded control characters.

**Screen editor overview**
The SCREEN EDITOR operates on text shown on the screen after a LIST. When you edit a listed program line and press RETURN anywhere on that line, the editor reads the entire 80-character logical screen line and passes it to the BASIC interpreter for tokenization and storage. The editor only reads two physical screen lines, so any BASIC line that expands (via keyword abbreviations or otherwise) beyond the 80-character display will be truncated — excess characters are lost when the line is re-edited. This is also why INPUT cannot be used for more than a total of 80 characters (as displayed).

Under certain conditions, cursor/control keys are handled differently:

- If the cursor is positioned to the right of an odd number of double-quote characters (`"`) the editor enters QUOTE MODE: characters typed are treated as string data but cursor and color controls are shown as reversed-character tokens (they do not move the editor cursor while still in QUOTE MODE).
- INSERT MODE is entered by holding SHIFT and pressing INST (Insert). It opens space by shifting characters right and remains until the opened space is filled or the mode is cancelled.

**Quote mode (controls inside strings)**
- **Trigger:** Cursor positioned to the right of an odd number of double quotes (inside a quoted string while editing).
- **Behavior:**
  - Data characters are entered normally and will be part of the string.
  - Cursor control keys and color control keys do not move the screen cursor while in QUOTE MODE; instead, they produce reversed-character tokens that represent the control being embedded in the string.
  - These reversed tokens become active when the string is printed (or otherwise output): the embedded cursor and color controls perform cursor positioning and color changes as part of the printed string.
  - The only exception: the DEL key is NOT affected by QUOTE MODE — DEL functions normally (it deletes) while other cursor controls do not move the cursor.
- **Cancel QUOTE MODE:**
  - Complete the line and press RETURN (the line will be tokenized and then can be edited normally).
  - Alternatively, if you do not need further cursor controls in the string, press RUN/STOP + RESTORE to cancel QUOTE MODE while still editing.
- **Limitations/warnings:**
  - Because cursor controls inside strings are represented as tokens, editing a line that already contains embedded control tokens can be difficult or impossible in-place.
  - The editor’s behavior in QUOTE MODE allows building strings that perform complex cursor/color actions when printed.

**Insert mode (SHIFT+INST)**
- **Trigger:** Hold SHIFT and press INST while editing (not in QUOTE MODE).
- **Behavior:**
  - The editor shifts characters to the right of the cursor to open space; it then operates in INSERT MODE until the opened space is filled or canceled.
  - Cursor and color controls show as reversed-character tokens in INSERT MODE (same visual tokenization effect as QUOTE MODE for those keys).
  - DEL and INST behave differently compared to QUOTE MODE:
    - In QUOTE MODE: DEL functions normally (deletes); INST produces a reversed-character token.
    - In INSERT MODE: DEL produces a reversed `<T>` token (does not delete), and INST inserts spaces normally (performs insertion).
  - INSERT MODE can be cancelled by:
    - Pressing RETURN
    - Pressing SHIFT + RETURN
    - Pressing RUN/STOP + RESTORE
    - Filling all the inserted spaces
- **Practical effect:**
  - INSERT MODE permits embedding DEL tokens in strings (because DEL acts differently), which can be used to delete previous characters at display time; however, such lines are hard to edit later.

**Examples (reference — raw keystrokes and listed appearance)**
See Source Code section for exact keystroke sequences, listed appearances, and printed output for:
- Embedding cursor controls in a PRINT string so that printing the string moves the cursor (example uses tokens shown as (R)/(L) in the example transcription).
- Using DEL and INST tokens within a PRINT string so that printed output deletes previously printed characters (example turning "HELLO" into "HELP" via embedded DEL/INST sequence).
- Note: source examples show the typed sequence, how it appears when listed, and the printed result.

## Source Code
```basic
10 PRINT"A(R)(R)B(L)(L)(L)C(R)(R)D": REM (R)=CRSR RIGHT, (L)=CRSR LEFT
```

```text
(Example as shown in manual)
You type -->         10 PRINT"A(R)(R)B(L)(L)(L)C(R)(R)D": REM(R)=CRSR
                            RIGHT, (L)=CRSR LEFT

Computer prints -->  AC BD
```

```basic
10 PRINT"HELLO"<DEL><INST><INST><DEL><DEL>P"
```

```text
(Keystroke sequence shown above, appearance when listed below)
10 PRINT"HELP"

When RUN the word displayed will be: HELP
```

```text
Table 2-2. Cursor Control Characters in QUOTE MODE
-------------------------------------------------------------------------
  Control Key                      Appearance
-------------------------------------------------------------------------
  CRSR up                          ↑
  CRSR down                        ↓
  CRSR left                        ←
  CRSR right                       →
  CLR                              
  HOME                             
  INST                             
-------------------------------------------------------------------------
```

```text
Table 2-3. Color Control Characters in QUOTE MODE
-------------------------------------------------------------------------
  Control Key Combination           Color
-------------------------------------------------------------------------
  CTRL + 1                           Black
  CTRL + 2                           White
  CTRL + 3                           Red
  CTRL + 4                           Cyan
  CTRL + 5                           Purple
  CTRL + 6                           Green
  CTRL + 7                           Blue
  CTRL + 8                           Yellow
  C= + 1                             Orange
  C= + 2                             Brown
  C= + 3                             Light Red
  C= + 4                             Grey 1
  C= + 5                             Grey 2
  C= + 6                             Light Green
  C= + 7                             Light Blue
  C= + 8                             Grey 3
-------------------------------------------------------------------------
```

## References
- "print_statement_and_quote_mode" — expands on how quote-mode control characters behave when printed
- "keyboard_buffer_and_basic_key_handling" — expands on interaction with control keys (RVS, CTRL)
