# RUN ($A871) — Perform RUN

**Summary:** Describes the BASIC RUN command entry point at $A871 (43121) which calls the Kernal SETMSG routine ($FE18 / 65048) to set the RUN message flag and then executes a CLR to start program execution; if a line number is supplied, a GOTO to that line is performed after the CLR.

## Description
The BASIC RUN token/jump at $A871 (decimal 43121) implements the RUN statement behavior. Its sequence:

- Calls the Kernal SETMSG routine at $FE18 (decimal 65048) to set the message-flag used for RUN mode.
- Performs a CLR (the BASIC CLR operation) to begin program execution.
- If RUN is followed by a line number token, the implementation performs a GOTO to that specified line after executing the CLR.

This chunk documents the control-flow for the RUN statement in Commodore BASIC: message-flag setup via the Kernal SETMSG vector, followed by the CLR-driven start, with an optional post-CLR GOTO when a line number argument is present.

## References
- "goto_statement" — expands on RUN performing a GOTO to a line after clearing

## Labels
- SETMSG
