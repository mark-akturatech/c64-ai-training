# Kick Assembler — String literal syntax (plain vs @-escape strings)

**Summary:** Describes Kick Assembler string literal rules: plain strings (no backslash escapes) vs @-prefixed escape strings (recognize \n, \", \$hex), usage with .var/.const, examples (@"First line.\nSecond line."), escaping quotes inside @-strings, embedding hex bytes with \$, and why @ exists (prevents breaking file paths like "c:\newstuff").

**String Values**
Kick Assembler supports two string kinds:

- **Plain strings**
  - Written as quoted text: `"text"`.
  - Backslash sequences are not interpreted (no escape processing). Example: `"c:\newstuff"` keeps the characters '\' and 'n' literally.
  - Used in `.var` and `.const` assignments or emitted directly (e.g., `.text message`).

- **@-prefixed escape strings**
  - Start with `@` followed by a quoted string: `@"..."`.
  - Backslash escape sequences are interpreted inside the quoted text: e.g., `\n` → newline, `\"` → double-quote character.
  - Hex/byte insertion inside an @-string uses a backslash-dollar sequence: `\$hh` (example uses `\$ff` to insert byte $FF).
  - This design (plain strings are non-escaping; @-strings escape) is the opposite of C# — chosen to avoid breaking existing file paths and other legacy strings in assembler sources.

- **Usage with assembler directives**
  - `.var`/`.const` can be initialized with either plain or @-strings.
  - `.text` and `.print` emit strings; use @-strings when you need newlines or embedded byte values.

- **Escaping quotes**
  - Inside an @-string use `\"` to include a literal double-quote.
  - Plain strings do not process `\"`, so a backslash remains literal.

For complete escape-code lists and advanced concatenation/printing examples see the referenced chunks in References.

## Source Code
```asm
// Plain strings
.var message = "Hello World"
.text message
.const file = "c:\newstuff"

// Gives .text "Hello World"

// String with escape codes ('\esc') start with @
.print @"First line.\nSecond line."
// Using newline
.print @"He said: \"Hello World\""
// Using " inside the string
.text @"This text will loop now\$ff"
// Placing hex values ($ff) in the text
```

(Note: comments shown above are from the original examples; the `\$ff` sequence inserts the byte $FF into the emitted data.)

**Escape Codes Table**

The supported escape codes in @-prefixed strings are:

| Code | Example                      | Description       |
|------|------------------------------|-------------------|
| \b   | `@"\b"`                      | Backspace         |
| \f   | `@"\f"`                      | Form feed         |
| \n   | `@"Line1\nLine2"`            | Newline           |
| \r   | `@"\r"`                      | Carriage return   |
| \t   | `.print @"Hello\tWorld"`     | Tab               |
| \\   | `@"c:\\tmp\\myfile.txt"`     | Backslash         |
| \"   | `@"It's called \"Bodiam Castle\""` | Double quotes    |
| \$   | `@"Hello world\$ff"`         | Two-digit hex values |

## References
- "escape_codes_table" — Detailed list of supported escape codes used by @-prefixed strings
- "string_concatenation_printing_and_examples" — How to concatenate and print strings (examples follow this section)