# Kick Assembler — Preprocessor directives (concise reference)

**Summary:** Concise reference for Kick Assembler preprocessor directives: #define, #undef, #import, #importif, #importonce, #if, #endif, #else, #elif. Includes directive syntax and short descriptions for use inside assembly source and preprocessor expressions.

## Directives
- #define NAME  
  Defines a preprocessor symbol by the given NAME.

- #undef NAME  
  Removes the symbol definition for NAME, if any.

- #import "filename"  
  Imports the named file at the current place in the source (textually includes it).

- #importif EXPR "filename"  
  Imports the named file only if the preprocessor expression EXPR evaluates to true.

- #importonce  
  Ensures the current file is imported only once (subsequent imports are ignored).

- #if EXPR  
  Starts a conditional block; the following source is discarded if EXPR evaluates to false.

- #endif  
  Ends an #if / #else / #elif block.

- #else  
  Introduces the alternative branch of a conditional block started by #if.

- #elif EXPR  
  Equivalent to combining #else and #if: introduces a conditional alternative evaluated if previous #if/#elif branches were false.

(Note: EXPR uses the preprocessor Boolean operators — see referenced documentation.)

## Source Code
```text
Table: Preprocessor directives

Directive              Description

#define NAME           Defines a preprocessor symbol by the given name

#undef NAME            Removes the symbol definition of the given name, if any.

#import "filename"    Imports a file at the given place in the source.

#importif EXPR "filename"
                      Imports a file if a given expression evaluates to true.

#importonce            Makes sure the current file is only imported once

#if EXPR              Discards the following source if the given expression evaluates to false.

#endif                Ends an #if or #else block.

#else                 Creates an else block.

#elif EXPR            The combination of an #else and an #if directive
```

## References
- "preprocessor_boolean_operators" — details of operators available inside preprocessor expressions (#if/#elif/#importif)