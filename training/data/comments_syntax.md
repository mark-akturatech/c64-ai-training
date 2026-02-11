# Kick Assembler — Comments (Section 3.10)

**Summary:** Kick Assembler supports C/C++/Java-style line comments (`//`) and block comments (`/* ... */`). Traditional 65xx semicolon (`;`) comments are not supported because `;` is used by Kick Assembler's script `.for` loops.

## Supported comment styles
- Line comments: `//` — everything from `//` to the end of the current source line is ignored by the assembler.
- Block comments: `/* ... */` — everything between `/*` and the next `*/` is ignored; block comments may span lines and can appear between tokens (inline) or on their own lines.
- The semicolon (`;`) is not a comment marker in Kick Assembler (it is syntactically significant in the script language, e.g. `.for` loops), so use `//` or `/* ... */` instead.

## Examples and placement
- Full-line block comment:
  - Use `/* ... */` on its own line(s) for longer comments or disabled blocks of code.
- End-of-line comment:
  - Use `//` after an instruction to comment the remainder of that line.
- Inline block comment:
  - `/* ... */` can be placed between tokens, for example between an instruction and its operand.

(Examples are provided in the Source Code section below.)

## Source Code
```asm
/*---------------------------------------------------------
This little program is made to demonstrate comments
---------------------------------------------------------*/
lda #10
sta $d020 // This is also a comment
sta /* Comments can be placed anywhere */ $d021
rts
```

## References
- "getting_started_example_interrupt" — expands on example code uses comments
