# ERRDIR ($B3A6) — Check for illegal direct-mode execution

**Summary:** Routine at $B3A6 in the BASIC interpreter that enforces non-direct execution by checking the direct-mode flag (set when a line without a line number is entered) and issuing an ILLEGAL DIRECT error to statements that prohibit execution in direct mode.

## Description
ERRDIR is invoked by BASIC statement handlers that must not run in direct mode (for example, DEF and other statements that define program structure). The routine:

- Checks a flag that is set when the user enters a line without a line number (i.e., direct mode).
- If that flag indicates direct mode, causes an ILLEGAL DIRECT error (stops the statement and reports the error).
- Returns control (implicitly) to the calling statement handler when no direct-mode violation is detected.

This routine centralizes the enforcement of "no direct execution" rules so multiple statement handlers can call ERRDIR rather than duplicating the same check and error generation.

## References
- "def_define_function_statement_handling" — expands on DEF and other statement handlers that may call ERRDIR to enforce non-direct execution where required

## Labels
- ERRDIR
