# Kick Assembler — Appendix A.4: Assembler directives (part 4) and Value Types

**Summary:** Continued directives for Kick Assembler: .return, .segment/.segmentdef, .segmentout, .struct, .te/.text, .var, .while, .wo/.word, .zp; plus the value types accepted by directives/pseudocommands (BinaryFile, Boolean, Char, Hashtable, List, Matrix, Null, Number, OutputFile, Picture, SidFile, String, Struct).

## Covered directives
This chunk continues the listing of assembler directives (names only, as in the source):
- .return — used in functions
- .segment / .segmentdef — segments and definitions
- .segmentout — output intermediate segment bytes
- .struct — user-defined structures
- .te / .text — text bytes
- .var — variables
- .while — while loops
- .wo / .word — word output
- .zp — mark unresolved labels as zeropage

## Value Types
Table A.8 lists the value types that Kick Assembler directives and pseudocommands accept. The types named in the source are: BinaryFile, Boolean, Char, Hashtable, List, Matrix, Null, Number, OutputFile, Picture, SidFile, String, Struct. See the reference table in the Source Code section for examples and short descriptions.

## Source Code
```text
Table A.8. Value Types

Type        Example                      Description
BinaryFile  LoadBinary("file.bin", "")   A value containing byte data.
Boolean     true                         Either true or false.
Char        'x'                          A character.
Hashtable   Hashtable()                  A value representing a hashtable.
List        List()                       A list value.
Matrix      Matrix()                     Represents a 4x4 matrix.
Null        null                         A null value.
Number      27.4                         A floating point number.
OutputFile  createFile("breakpoints.txt") An value representing an output file.
Picture     LoadPicture("blob.gif")      The contents of a loaded picture.
SidFile     LoadSid("music.sid")         The contents of a sid file.
String      "Hello"                      A string value.
Struct      MyStruct(1,2)                Represents a user defined structure.
```

## Key Registers
(omitted — this chunk documents assembler directives and value types only)

## References
- "assembler_directives_a4_part3" — expands on function, macro, and segment directives
- "value_types_a5" — expands on value types accepted by directives