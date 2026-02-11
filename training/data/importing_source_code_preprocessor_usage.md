# Kick Assembler: #import / #importif / #importonce (Section 3.8)

**Summary:** Describes Kick Assembler preprocessor import directives (#import, #importif, #importonce), search path order (current directory then -libdir entries), and the legacy v3.x .import / .importonce support and behavioral difference.

## Importing source code
Use the preprocessor to include other assembly source files. Preprocessor commands start with # and are evaluated by the preprocessor.

- #import "File.asm" — unconditionally include the named source file (import happens immediately by the preprocessor).
- #importif SYMBOL "File.asm" — include the file only if SYMBOL is defined (SYMBOL is a preprocessor symbol).
- #importonce — placed at the top of a library file to ensure that file is only imported a single time, even if referenced multiple times.

Search order when resolving imported file names:
1. Current directory (the directory of the source being assembled).
2. Directories supplied via the -libdir command-line parameter, searched in the order they are given.

This lets you keep reusable libraries in shared directories and reference them without path qualifiers.

Legacy support:
- v3.x-style directives (.import source "file.asm" and .importonce) are still supported.
- Difference: preprocessor imports are performed immediately (imported source is inserted/evaluated at preprocessor time). The old .import mechanism first parses the entire file, then imports external files during evaluation — the order of evaluation differs. The preprocessor directives are recommended for a more natural/eager import order.

## Source Code
```asm
; Basic preprocessor import examples
#import "MyLibrary.asm"
#importif STAND_ALONE "UpstartCode.asm"

; Example showing #importonce usage inside a library file:
; File1.asm
#importonce
.print "This will only be printed once!"

; File2.asm
#import "File1.asm" ; This will import File1
#import "File1.asm" ; This will not import anything (due to #importonce)
```

```text
; Command-line example: current dir searched first, then -libdir entries
java -jar kickass.jar myProgram.asm -libdir ..\music -libdir c:\code\stdlib
```

```asm
; Legacy v3.x import syntax (still supported, but preprocessor recommended)
.import source "myfile.asm"
.importonce
```

## References
- "preprocessor_intro_and_symbol_definitions" — detailed preprocessor directives and symbol handling (Chapter 8)
- "importing_data" — data import (.import) is separate from source import and covered there
