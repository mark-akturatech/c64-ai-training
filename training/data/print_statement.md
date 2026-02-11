# ********* - PRINT ($AAA0) — Perform PRINT

**Summary:** PRINT at $AAA0 (43680) is the main BASIC output routine; it handles tokens and formatting (TAB, SPC, comma, semicolon, variables, PI, ST, TI, TI$) and converts all output to strings which are emitted character-by-character via the Kernal CHROUT routine.

## Description
PRINT is the central BASIC statement output handler located at $AAA0 (decimal 43680). It implements the various printing options available in BASIC source lines and orchestrates conversion of values and tokens into printable character streams. The routine is split into segments to support the different syntactic/semantic features of the PRINT statement; regardless of the segment, final output is produced one character at a time by calling the Kernal CHROUT vector.

## Segments (overview)
- TAB — handles tabbing to a column (TAB(n) style output control).
- SPC — handles explicit space insertion (SPC(n) style).
- comma (`,`) — manages column/spacing behavior when a comma separates print items.
- semicolon (`;`) — suppresses end-of-item spacing/newline behavior when used between items.
- variables — converts variable values (numeric or string) into printable representations.
- PI — handles PI constant output (as used in BASIC).
- ST — handles ST (system time/statement?) token output (token name taken from source).
- TI / TI$ — handles TI (numeric) and TI$ (string) time-related tokens (as referenced).

Note: the source lists TI and TI$ as segments handled by PRINT; the exact semantics of ST/TI/TI$ are referenced but not expanded in this chunk.

## Output flow
1. PRINT processes the source tokens/expressions for the current PRINT statement via its segment handlers.
2. Each item is converted into a string representation (numbers formatted, strings passed through).
3. The routine emits the resulting string one character at a time by calling the Kernal CHROUT entry point (character output).

## References
- "strout_string_output" — expands on the STRING output helper used by PRINT  
- "cmd_statement_output_channel" — expands on how CMD uses PRINT for actual output

## Labels
- PRINT
