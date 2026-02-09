# Kick Assembler: asminfo options, realtime editor feedback, and AsmInfo file format

**Summary:** Describes Kick Assembler asminfo selection options (e.g. all, allPredefined, allSourceSpecific, version, libraries, directives, preprocessorDirectives, files, syntax, errors), how the 'meta' category groups sections, editor integration using -replacefile and -noeval for realtime feedback, and the AsmInfo file format including the 5-integer source-range format.

## asminfo selection options and 'meta' usage
- asminfo provides selectable output categories (examples): all, allPredefined, allSourceSpecific, version, libraries, directives, preprocessorDirectives, files, syntax, errors.
- When a selection option has category 'meta', that option selects several of the underlying sections at once; when the category is not 'meta' the option refers to a single specific section. Details of the individual sections are documented in later chapters.
- Use the asminfo options to control which sections are produced by Kick Assembler (for editor integrations or tooling).

## Realtime feedback from the assembler (editor integration)
- To support editor/IDE features that query the assembler while the user edits, call Kick Assembler at suitable times (e.g. on idle).
- Unsaved source: write the current buffer to a temporary file and pass it with -replacefile to substitute the content of the original filename. You may supply multiple -replacefile options. The replacement applies whether the file is the main input or an included file.
- Avoid a full assemble on each invocation by using -noeval. This makes Kick Assembler parse and perform an initial pass without evaluation, which:
  - is faster,
  - prevents overwriting outputs,
  - still detects syntax errors and returns syntax information.

## AsmInfo file format
- The AsmInfo (assembly information) file is divided into sections. A section header is a line beginning with '[' and with the section name between square brackets, e.g. [section1].
- Each following line in a section consists of one or more semicolon-separated fields.
- Special case: in some sections the last field may itself contain semicolons; those cases are noted in the specific section definitions.
- A commonly used field type is a "source range" which encodes a character range in a source file as five integers:
  startline, startposition, endline, endposition, fileindex
  - startposition and endposition are character positions within the respective lines.
  - fileindex is an index referencing an entry in the files section.
  - Example: 38,8,38,17,1

## Source Code
```text
# Command-line examples

# Replace the content of the first file with the temporary file (works for main or included files):
java -jar KickAss.jar mysource.asm -replacefile c:\ka\mysource.asm c:\tmp\tmpSource.asm

# Parse and do an initial pass only (no evaluation), to detect syntax errors without producing output:
java -jar KickAss.jar mysource.asm -noeval ...
```

```text
# AsmInfo file format example

[section1]
field1;field2;field3
field1;field2;field3
field1;field2;field3

[section2]
field1;field2
field1;field2
field1;field2

# Source range example (startline,startpos,endline,endpos,fileindex):
38,8,38,17,1
```

## References
- "asminfo_option_and_output_format" — expands on how to request different sections and exact output formatting.