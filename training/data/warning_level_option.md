# ca65: -Wn option (assembler warning level)

**Summary:** The ca65 assembler option -Wn sets the assembler warning level (default 1). Example: -W2 enables additional warnings such as unused imported symbols; setting the level lower than 1 is discouraged.

## Description
-Wn
- Purpose: Set the assembler warning level (n is an integer).
- Default: 1
- Example: -W2 — enables extra checks and will warn about items such as unused imported symbols.
- Notes: The documentation states it would be "silly" to set the level below 1 (i.e., lower warning sensitivity is discouraged).

## References
- "auto_import_option" — interaction between auto-imported symbols and warning levels
- "warnings_as_errors_option" — treating warnings as errors
