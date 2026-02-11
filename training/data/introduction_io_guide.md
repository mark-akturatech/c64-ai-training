# I/O: PRINT formatting, logical screen lines, and TV output (intro)

**Summary:** Describes PRINT formatting on the C64: comma and semicolon behavior, quote-delimited literals, RETURN (CHR$(13)) handling, logical vs screen lines, and references to the line link table and TV output/VIC-II. Searchable terms: PRINT, comma, semicolon, CHR$(13), line link table, logical line, VIC chip, TV output.

**PRINT formatting (comma, semicolon, quotes)**
- **Comma in a PRINT list**: Moves the cursor to the start of the next print zone, which is every 10 columns on the C64 screen. If the cursor is already past the last column of the line, the comma causes the cursor to move down to the next screen line. ([manuals.plus](https://manuals.plus/m/25b4bf43dffbf5ba9480c0f1d45f21fe7711ff403a70e7d2e12bc652a88460c0?utm_source=openai))
- **Semicolon in a PRINT list**: Prevents the cursor from advancing to the next line after the PRINT statement. This allows multiple items to be printed on the same line without additional spaces. ([manuals.plus](https://manuals.plus/m/25b4bf43dffbf5ba9480c0f1d45f21fe7711ff403a70e7d2e12bc652a88460c0?utm_source=openai))
- **Double-quote characters (")**: Delimit literal text within a PRINT statement. The first " begins a literal area, and the next " ends it. The final quote mark at the end of a line is not strictly required by the BASIC parser in some cases.

**RETURN (CHR$(13)) and logical vs screen lines**
- **RETURN code (CHR$(13))**: Advances the cursor to the next logical line on the screen, not necessarily the very next physical screen row.
- **Logical lines**: When text typed or PRINTed runs past the end of a physical screen line, BASIC links that physical line to the following screen line; both are treated as a single logical line.
- **Line link table**: These links are stored in the screen line link table located at memory addresses $00D9-$00F2 (decimal 217-242). Each entry in this table corresponds to a screen line and indicates whether it is linked to the next line, forming a logical line. ([pagetable.com](https://www.pagetable.com/c64ref/c64mem/?utm_source=openai))
- **Cursor behavior**: The logical line containing the cursor controls where the <RETURN> key places the cursor; the logical line at the top of the screen controls whether the screen scrolls by one or two lines at a time.

**TV output overview**
- **Primary output device**: The TV is the primary human-readable output device. Beyond PRINTing text, the TV can display graphics objects and is controlled at a hardware level by the VIC-II chip, which determines screen and border colors and screen dimensions.
- **Sound output**: Sound output (speaker) is described in the sound chapter; graphics and VIC-II sections explain object motion, colors, and screen size changes for TV output.

## References
- "output_to_tv_section" — expands on Output to the TV (graphics, VIC-II control, and TV-specific commands)
