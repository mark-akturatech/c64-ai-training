# LINE 40 — Title print with TAB(160) and in-string color codes

**Summary:** Demonstrates using PRINT TAB(160) to position a title near the top of the C64 screen and embedding in-string PETSCII color codes (entered with Ctrl+<WHT> and C=+7) to change the color of subsequent printed text.

## Description
PRINT TAB(160) is used here to move the print cursor far enough from the top-left character position that the resulting output begins visually "six lines down" on a cleared 40×25 screen (the source describes this as equivalent to four rows beneath the CLEAR command). The example embeds C64 color control characters directly inside quoted strings; when you type the control-key combinations inside quotes the PETSCII control character appears (visualized in the source as a "reversed E" for white and a "reversed diamond" for light blue). These control characters set the text color for all subsequent characters printed until another color code is printed (color codes are stateful and persist across the rest of the PRINT output).

Key points from the source:
- PRINT TAB(160) — advances the output cursor by 160 character positions from the top-left; source states this places the message on the sixth line down.
- Insert the white color code by holding Ctrl and pressing the key labeled WHT while inside quotation marks; the PETSCII control appears (described as a "reversed E") and sets subsequent printed text to white.
- Insert the light-blue color code by holding Commodore key (C=) and 7 while inside quotation marks; the PETSCII control appears (described as a "reversed diamond") and sets subsequent printed text to light blue.
- The example PRINT output shown across multiple printed lines is:
  I AM THE
  DANCING
  MOUSE!
  (with the white code before the text, and the light-blue code at the end to restore screen color)

(Parenthetical: PETSCII control character)

## Source Code
```basic
170 REM PROGRAMMING GRAPHICS

REM LINE 40 (title print with color codes)
40 PRINT TAB(160)        : REM Tabs 160 spaces from top-left; positions title near 6th line down
REM The author shows the literal strings and where to insert color-control characters:

REM Enter inside quotation marks:
REM   {white}    (hold down <CTRL> and press the key marked <WHT> — a "reversed E" appears)
REM This sets following printed text to WHITE.

PRINT "{white}I AM THE"
PRINT "DANCING"
PRINT "MOUSE!"

REM At end of the PRINT statement insert:
REM   {light blue}   (hold down <C=> and press <7> — a "reversed diamond" appears)
REM This resets the color back to LIGHT BLUE.

REM === Notes ===
REM The braces {white} and {light blue} above represent the PETSCII control characters inserted
REM by the specified key combinations (they are shown as placeholders here).
```

## References
- "sprite_color_and_y_position" — expands on Printed color codes correspond to sprite/text color settings
- "sprite_pointer_setting_p_equals_192" — expands on Printout appears while sprite pointer animation runs