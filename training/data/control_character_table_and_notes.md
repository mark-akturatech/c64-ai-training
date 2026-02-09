# Commodore 64 listing control-character conventions ({CLR}, {HOME}, {DOWN}, {UP}, {RIGHT}, {LEFT}, {RVS}, {ROFF})

**Summary:** Mapping of listing control-character tokens to Commodore 64 keypresses (CLR/HOME, CRSR keys, CTRL+9/0), plus repetition notation ({DOWN 5}), and the 40-column listing rule requiring exact spaces.

## Conventions and usage
This chunk documents the curly-brace control-character tokens used in program listings and the exact keypresses required on a Commodore 64 keyboard to produce them. Tokens inside { } represent either single keystrokes or a modifier+keystroke combination. A numeric suffix inside the braces (e.g. {DOWN 5}) means repeat the immediately preceding control character that many times.

Important rules:
- Listings are provided in a fixed 40-character width. Type spaces exactly as shown; count character columns when necessary.
- Control characters and special characters are spelled out between curly brackets; otherwise lines are listed exactly as they appear on a C64 display.
- Repetition notation: {TOKEN N} means press TOKEN N times (example: {DOWN 5} → press CRSR/DOWN five times).

## Source Code
```text
When You See      | What It Represents | What You Type
---------------------------------------------------
{CLR}             | Clear Screen       | Hold down SHIFT and press CLR/HOME
{HOME}            | Home Cursor        | Press CLR/HOME
{DOWN}            | Cursor Down        | Press CRSR/DOWN
{UP}              | Cursor Up          | Hold down SHIFT and press CRSR/UP
{RIGHT}           | Cursor Right       | Press CRSR/RIGHT
{LEFT}            | Cursor Left        | Hold down SHIFT and press CRSR/LEFT
{RVS}             | Reverse Field ON   | Hold down CTRL and press 9
{ROFF}            | Reverse Field OFF  | Hold down CTRL and press 0

NOTE 1:
When a number appears inside the curly brackets, it means you repeat the control character immediately to the left of the number that many times.
Example:
{DOWN 5}  means to press CRSR/DOWN five (5) times.

NOTE 2:
All programs have been listed in a column 40 characters wide. Except where special characters have been spelled out between curly brackets, the lines are listed exactly as they appear on a Commodore 64 display. Spaces must be typed in as listed. Where necessary, count the character columns to determine the appropriate number of spaces.
```

## Key Registers
- (none)

## References
- "typing_conventions_and_lister" — expands on why control characters were spelled out in listings