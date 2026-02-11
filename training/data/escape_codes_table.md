# Kick Assembler: @-prefixed string escape codes (Table 4.2)

**Summary:** Table of Kick Assembler escape codes for @-prefixed strings: supported escapes are \b, \f, \n, \r, \t, \\, \", and \$ (inserts two-digit hex). Covers syntax examples using @"..." and brief descriptions.

## Description
Kick Assembler supports an escape-prefix for string literals when the string is prefixed with @ (e.g. @"..."). When @ is used, the following escape codes are recognized inside the quoted string and expanded as shown. The \$ escape inserts a two-digit hexadecimal byte value into the string (e.g. \$ff inserts byte $FF).

Supported escape codes: \b, \f, \n, \r, \t, \\, \", \$ (two-digit hex value).

## Source Code
```text
Table 4.2. Escape codes

Code    Example                         Description
\b      @"\b"                           Backspace
\f      @"\f"                           Form feed
\n      @"Line1\nLine2"                 Newline
\r      @"\r"                           Carriage return
\t      .print @"Hello\tWorld"          Tab
\\      @"c:\\tmp\\myfile.txt"         Backslash
\"      @"It's called \"Bodiam Castle\"" Double quotes
\$      @"Hello world\$ff"              Two digit hex values
```

Additional example usages (verbatim):
```text
@"\b"
@"\f"
@"Line1\nLine2"
@"\r"
.print @"Hello\tWorld"
@"c:\\tmp\\myfile.txt"
@"It's called \"Bodiam Castle\""
@"Hello world\$ff"
```

## References
- "string_literal_syntax_and_escape_prefix" — expands on context and examples showing how @ enables these escape codes
- "string_methods_overview" — expands on string operations you can perform on strings that may contain escape codes