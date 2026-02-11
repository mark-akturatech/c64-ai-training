# Kick Assembler — Preprocessor (Chapter 8: 8.1–8.2)

**Summary:** Describes Kick Assembler's preprocessor (runs before the main parser), symbol definition via command-line (-define) or #define/#undef, directive recognition (line starting with '#'), and conditional inclusion using #if/#elif/#else/#endif; untaken #if blocks are not seen by the main parser (so any content is allowed). Examples include assembler lines such as inc $D020.

## Overview
The preprocessor runs before the main parser and is unaware of mnemonics, the script language, or assembler syntax. Its sole job is to include or discard portions of the source based on preprocessor symbols and directives. The behavior is modelled after C#'s preprocessor but also provides #import, #importif and #importonce (see referenced chunks for import details).

Key points:
- Preprocessing happens before parsing; discarded text is never seen by the main parser.
- Symbols are boolean: they are either defined or not; they carry no numeric or string value.
- The first non-whitespace character on a line determines whether it is a preprocessor directive: if it is '#', the line is handled by the preprocessor.

## Defining and undefining symbols
Two ways to define a preprocessor symbol:

- From the command line (example):
  - java -jar KickAss.jar -define TEST

- In source using directives:
  - #define NAME
  - #undef NAME

Symbols have no associated values — only a defined/unset state.

Recognizing directives:
- A preprocessor directive is any line whose first non-whitespace character is '#'. Only those lines are processed by the preprocessor.

## Conditional inclusion (#if / #elif / #else / #endif)
- Use #if SYMBOL to include the following block only if SYMBOL is defined.
- Close the block with #endif.
- #else provides an alternate block when the #if condition is false.
- #elif is equivalent to an #else immediately followed by an #if (i.e., #elif = #else + #if).
- #if blocks can be nested to any depth. Indentation/whitespace is irrelevant to preprocessing—it's solely for human readability.
- Crucial behavior: any lines inside an untaken (#if false) block are completely invisible to the main parser. That means you may place arbitrary, syntactically-invalid, or non-assembler text inside an untaken block without causing parse errors.

Note: #import, #importif and #importonce exist but their semantics and practical usage are documented separately (see References).

## Source Code
```text
# Command-line definition example
java -jar KickAss.jar -define TEST
```

```asm
// Simple if block
#if TEST
inc $d020
#endif
// <- Use an endif to close this if block

// You can also use else
#if A
.print "A is defined"
#else
.print "A is not defined"
#endif

#undef UNDEFINED_SYMBOL
#if UNDEFINED_SYMBOL
Here we can write anything since it will never be seen by the main parser...
#endif

#if X
.print "X"
#elif Y
.print "Y"
#elif Z
.print "Z"
#else
.print "Not X, Y and Z"
#endif

// Nested example
#if A
  #if B
    .print "A and B"
  #endif
#else
  #if X
    .print "not A and X"
  #elif Y
    .print "not A and Y"
  #endif
#endif
```

## References
- "importing_source_code_preprocessor_usage" — practical use of #import/#importif/#importonce for source inclusion  
- "preprocessor_imports_and_importonce" — import semantics and #importonce usage