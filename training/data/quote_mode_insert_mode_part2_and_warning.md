# COMMODORE 64 - Insert Mode (part 2) and DEL/INST example

**Summary:** Describes DEL and INST special characters in quote-mode/insert-mode, an example BASIC PRINT line that uses <DEL> and <INST> to produce deletions/insertions (resulting in "HELP"), the WARNING that these characters affect LIST output and make lines hard to edit, and the condition that insert mode ends on RETURN/SHIFT+RETURN or after typing as many characters as were inserted.

**Description**
- <INST> (the insert-space special character when created in quote mode) inserts spaces normally inside quoted strings.
- Using <DEL> within a quoted PRINT string can create deletions that take effect when the line is RUN (these delete characters are not representable in normal quote-mode printing).
- Example behavior: a PRINT line can be constructed so that characters are deleted and later characters replace them; the example below shows a line that displays HELP when RUN because the last two letters of HELLO are deleted and a P is placed in their place.
- WARNING: These delete characters affect LIST output as well as PRINT output, so editing or reading lines that contain <DEL>/<INST> characters will be difficult (the deleted characters appear deleted in LIST).

- Insert-mode termination: the insert-mode condition is ended when the RETURN (or SHIFT+RETURN) key is pressed, or when as many characters have been typed as the number of spaces that were inserted.

## Source Code
```basic
10 PRINT"HELLO"<DEL><INST><INST><DEL><DEL>P"
```

## References
- "quote_mode_insert_mode_part1" — expands on previous insert-mode mechanics and differences from quote mode
- "quote_mode_other_special_characters" — expands on other reversible special characters that can be embedded in quotes
