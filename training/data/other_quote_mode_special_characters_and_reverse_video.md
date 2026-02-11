# Quote-mode special characters: SHIFT+RETURN (<SHIFT+M>), RVS (CTRL+RVS), CHR$(18)/CHR$(146)

**Summary:** How to insert quote-mode special characters (SHIFT+RETURN / <SHIFT+M>, reversed-case and graphics switches via N / <SHIFT+N>, and reverse-video via CTRL+RVS) into BASIC strings; use of CHR$(18) to start reversed numeric output and CHR$(146) or a carriage-return to cancel; printer character-set switching when sending reversed N to the printer; LIST editing implications.

## Inserting special characters into quoted strings
These characters are not normally typed directly into a quoted string from normal typing. Procedure to embed them in a program line:
- Leave empty space(s) where the special character should go in the quoted string.
- Press RETURN to accept the line.
- Re-enter edit mode on that program line and, while editing the quoted string, hold down the CTRL key and press the special key (see list below). The special-key action is inserted into the string at the blank position.

Key mappings shown in the source:
- Shifted RETURN — entered as <SHIFT+M>
- Switch to upper/lower case — entered as <N>
- Switch to upper/graphics — entered as <SHIFT+N>

Notes on behavior:
- Holding SHIFT and pressing RETURN (<SHIFT+M>) during quote-mode insertion produces a carriage-return/line-feed on the screen but does NOT end the string. This character works inside PRINT and LIST output as well; because it creates an embedded line-break, editing LIST output or program lines that contain this character becomes extremely difficult.
- The case/graphics switches (<N> and <SHIFT+N>) appear as reversed characters (visual reversed glyph) when inserted; when output is redirected to a printer via CMD, these reversed-N characters command the printer to change its character set (see Printer section below).

## Reverse video (RVS) inside strings
- To start reverse-video (reverse printing) inside a quoted string while editing, hold CTRL and press the RVS (Reverse) key; a reversed "R" glyph is shown in the quotes to indicate the toggle.
- All subsequent characters print in reverse video until reverse is turned off.
- To end reverse-video output, hold CTRL and press RVS OFF (the reversal toggle); the end toggle also prints a reversed "R" glyph in the string.
- Numeric data can be forced into reverse-video by outputting CHR$(18). Reverse video is cancelled by outputting CHR$(146) or by a carriage-return.

## Printer behavior (CMD redirection)
- When the screen output is switched to the printer with CMD, the reversed-N character (lower/upper switch) causes the printer to select its upper-lower case character set.
- The reversed SHIFT+N (upper/graphics switch) causes the printer to select its upper-case/graphics character set.
- In other words, the same reversed-case/graphics toggle characters embedded in a string that affect screen output also send character-set switching commands to a printer when output is redirected.

## Editing and practical caveats
- Because <SHIFT+M> (Shift+Return) inserts a CR/LF without terminating the string, and because reversed characters are embedded as control-like glyphs, program LISTing and line editing becomes nearly impossible when these special characters are present in program lines.
- Reverse-video sequences (CTRL+RVS on/off) insert toggle glyphs inside strings; these toggles must be explicitly cancelled (CHR$(146) or CR) to resume normal video output.

## References
- "screen_editor_and_quote_insert_modes" — expands on editing implications of embedding special characters in program lines
- "print_statement_and_quote_mode" — expands on using reverse video and special sequences in PRINT strings
