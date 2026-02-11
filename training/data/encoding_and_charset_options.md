# Kick Assembler: .encoding directive and supported encodings

**Summary:** Describes Kick Assembler's .encoding directive, its effect on .text and .import text (character→byte conversions), the default encoding (screencode_mixed), and the supported encodings: ascii, petscii_mixed, petscii_upper, screencode_mixed, screencode_upper.

**Description**
- `.text` writes bytes into output memory representing the characters in the quoted string. The byte values are produced according to the currently active encoding.
- The default encoding is "screencode_mixed" (VIC-II screen codes for a charset with both uppercase and lowercase letters).
- Use `.encoding "<name>"` to change the active encoding. The new encoding affects every assembler operation that converts source characters to byte values (for example, `.text` and `.import text`).
- Supported encodings: ascii, petscii_mixed, petscii_upper, screencode_mixed, screencode_upper. See Source Code for the explicit mapping table.

**Examples**
The following example illustrates switching encodings and emitting `.text` in different encodings. Note that `.import text` and any other directive that maps characters to bytes use the active encoding at the time they are processed.

- Switch to `screencode_upper`, emit an uppercase text string.
- Switch back to `screencode_mixed` to allow mixed-case characters.
- Any subsequent `.text` or `.import text` uses the currently active encoding.


To demonstrate `.import text` usage with different encodings:


In this example:
- The content of `uppercase_text.txt` is imported using the `petscii_upper` encoding.
- The content of `mixedcase_text.txt` is imported using the `petscii_mixed` encoding.

## Source Code

```asm
; Set encoding to screencode_upper
.encoding "screencode_upper"
.text "THIS IS WRITTEN IN UPPERCASE SINCE LOWERCASE CHARS ARE USED FOR GFX SIGNS"

; Switch back to screencode_mixed
.encoding "screencode_mixed"
.text "In this ENCODING we have both UPPER and lower case chars."
.text "Remember to switch to a charset that fits the encoding."
```

```asm
; Set encoding to petscii_upper
.encoding "petscii_upper"
.import text "uppercase_text.txt"

; Switch to petscii_mixed
.encoding "petscii_mixed"
.import text "mixedcase_text.txt"
```

```text
Table 3.5. Encodings
Name               Description
ascii              The ASCII representation
petscii_mixed      The PETSCII representation of the charset with both upper and lower case characters.
petscii_upper      The PETSCII representation of the charset with upper case and graphics characters.
screencode_mixed   The screencode representation of petscii_mixed
screencode_upper   The screencode representation of petscii_upper
```

## References
- "data_directives_and_fill" — expands on how `.text` interacts with other data directives and fill behavior
- "importing_data" — expands on `.import text` and usage with the active encoding