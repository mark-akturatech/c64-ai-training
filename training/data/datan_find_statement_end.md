# DATAN ($A906) — Search program text for the end of the current BASIC statement

**Summary:** Routine at $A906 (DATAN) scans BASIC program text from the current byte and searches forward until it encounters a zero byte (line delimiter) or a colon (statement delimiter) that is not inside a quoted string; recognizes quoted strings so colons inside quotes are ignored.

## Description
Starts scanning at the current byte within BASIC program text and advances until one of two delimiters is found:
- A zero byte (0) — treated as the line delimiter.
- A colon character (':') — treated as the statement delimiter, but only when it is not inside a quoted string.

The routine therefore pays attention to quote state (inside/outside quotes) and skips colons that occur inside quotes. It is intended as a general-purpose scanner for locating the end boundary of the current BASIC statement in memory.

## References
- "data_statement" — expands on DATAN used by DATA to find the next statement offset  
- "rem_statement" — expands on REM which also skips to the next statement delimiter

## Labels
- DATAN
