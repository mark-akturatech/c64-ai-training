# Kick Assembler AsmInfo file format

**Summary:** Describes the Kick Assembler AsmInfo file layout: section headers ([name]), semicolon-separated fields, the special "source range" five-integer format (startline,startpos,endline,endpos,fileindex), and the [files], [syntax], and [errors] section field formats.

## Format overview
- File is divided into sections; each section starts with a single-line header in square brackets, e.g. [files], [syntax], [errors].
- Lines inside sections are semicolon-separated fields.
- The AsmInfo format uses a special "source range" field to represent character ranges as five integers: startline, startpos, endline, endpos, fileindex (example: 38,8,38,17,1).
- Important: file paths may contain semicolons — the filepath field is allowed to include semicolons and must be handled accordingly by a parser.

## Files section
- Header: [files]
- Each line has the form:
  index;filepath
- index is an integer file index used by the fileindex field in source ranges.
- filepath is the file identifier; it may include semicolons and can include archive-style prefixes (example: KickAss.jar:/include/autoinclude.asm indicates the file was included from inside KickAss.jar).

## Source range
- Represented as five comma-separated integers:
  startline, startpos, endline, endpos, fileindex
- Positions are character offsets (columns) within the respective lines.
- Example source-range value: 21,20,21,20,0 (start and end on line 21, position 20, in file index 0).

## Syntax section
- Header: [syntax]
- Current format (fields):
  type;sourcerange
- type is a token type (e.g., operator).
- sourcerange uses the five-integer representation above.
- The format is planned to be extended with additional fields (for example: label definition location when the entry is a label reference).

## Errors section
- Header: [errors]
- Format:
  level;sourcerange;message
- level is an error severity string (e.g., Error).
- sourcerange is the five-integer source range.
- message is the diagnostic text (can be truncated in some examples).

## Source Code
```text
[files]
0;KickAss.jar:/include/autoinclude.asm
1;test1.asm

[syntax]
operator;21,20,21,20,0

[errors]
Error;41,2,41,7,1;Unknown preprocessor directive #defin
```

## References
- "asminfo_option_and_output_format" — expands on AsmInfo file layout and additional fields/options