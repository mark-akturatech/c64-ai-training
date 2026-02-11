# BASIC support routines: CLOSE / CLOSE15, press-return delay loop (lines 700–790)

**Summary:** BASIC subroutines for file/drive cleanup and user prompt handling: closes device 15 with CLOSE15, prints an error/failure message and GOTO 670 for cleanup, implements a press-return delay loop using GET C$ and CHR$(13), prints "OK" and RETURN.

**Description**
This chunk contains small utility subroutines called from the main COPY program:

- **Lines 700–720** implement a CLOSE helper:
  - **Line 710** issues `CLOSE 15` to close channel/device 15.
  - **Line 720** checks for a failure condition; if detected, it prints an error message and branches to line 670 for cleanup.
- **Lines 750–790** implement a "press RETURN to continue" delay and input loop:
  - The routine prints a prompt asking the user to press RETURN.
  - It uses `GET C$` to poll keyboard input; `GET` returns an empty string until a keypress occurs.
  - It loops until `C$` equals `CHR$(13)` (Return / CR).
  - After detecting CR, it prints "OK" and executes `RETURN` to resume the main program.

Behavioral notes:
- `GET C$` is polled and compared against `CHR$(13)` (ASCII/CBM return).
- The error path jumps back to a cleanup/error handler at line 670.
- A final `RETURN` returns execution to the caller in the main BASIC program.

## Source Code
```basic
700 REM CLOSE
710 CLOSE 15
720 PRINT "DRIVE FAILED" : GOTO 670

740 REM DELAY / PRESS RETURN LOOP
750 PRINT "PRESS RETURN TO CONTINUE"
760 GET C$ : IF C$ = "" THEN 760
770 IF C$ <> CHR$(13) THEN 760
780 PRINT "OK"
790 RETURN
```

## References
- "1541_copy_basic_main_program" — main BASIC COPY program calling these helpers
- "initialization_and_error_handling_and_mldata" — related I/O initialization and error-handling routines
