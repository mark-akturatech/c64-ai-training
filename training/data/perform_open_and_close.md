# BASIC OPEN and CLOSE entry points (ROM $E1BE–$E1D1)

**Summary:** ROM entry points for BASIC OPEN and CLOSE (JSR $E219 parameter parsing, KERNAL OPEN $FFC0, KERNAL CLOSE $FFC3). Shows flow control using BCS/BCC for error handling and where BASIC I/O error handling is invoked (JMP $E0F9).

**Description**
This chunk documents the BASIC-level OPEN and CLOSE entry sequences in the C64 ROM:

- **OPEN sequence (starts at $E1BE):**
  - `JSR $E219` — Calls the BASIC parameter parser shared by OPEN/CLOSE to fetch device, filename, and logical file parameters.
  - `JSR $FFC0` — Invokes the KERNAL OPEN routine.
  - `BCS $E1D1` — If the KERNAL OPEN sets the carry flag (error), branch to the BASIC I/O error handler.
  - `RTS` — On success, return to caller.

- **CLOSE sequence (starts at $E1C7):**
  - `JSR $E219` — Same parameter parser as OPEN/CLOSE.
  - `LDA $49` — Load the logical file number (zero page BASIC variable) required by the KERNAL CLOSE.
  - `JSR $FFC3` — Invoke the KERNAL CLOSE routine (takes file number in A).
  - `BCC $E194` — If carry clear (no error), branch to $E194 to finish/exit.
  - If carry set (error), execution falls through to $E1D1.
  - `$E1D1: JMP $E0F9` — Unconditional jump to BASIC I/O error handling routine.

**Notes:**
- The KERNAL conventions used here: carry set indicates an error from OPEN/CLOSE (branch on carry to handle errors).
- Parameter parsing is centralized at $E219 (see referenced chunk "get_params_for_open_close" for full parsing/default rules).

## Source Code
```asm
        ; *** perform OPEN
.,E1BE  20 19 E2    JSR $E219       ; get parameters for OPEN/CLOSE
.,E1C1  20 C0 FF    JSR $FFC0       ; KERNAL OPEN
.,E1C4  B0 0B       BCS $E1D1       ; branch if error (carry set)
.,E1C6  60          RTS             ; return on success

        ; *** perform CLOSE
.,E1C7  20 19 E2    JSR $E219       ; get parameters for OPEN/CLOSE
.,E1CA  A5 49       LDA $49         ; load logical file number (zero page)
.,E1CC  20 C3 FF    JSR $FFC3       ; KERNAL CLOSE (A = file number)
.,E1CF  90 C3       BCC $E194       ; branch if no error (carry clear)
.,E1D1  4C F9 E0    JMP $E0F9       ; go handle BASIC I/O error
```

## Key Registers
- **$49**: Logical file number (used by KERNAL CLOSE)
- **$E219**: Subroutine for parsing parameters for OPEN/CLOSE
- **$E194**: Continuation/exit code after successful CLOSE
- **$E0F9**: BASIC I/O error handling routine

## References
- "get_params_for_open_close" — expands on OPEN/CLOSE parameter parsing and defaults
- "get_params_for_load_save" — shared patterns for parsing device/filename parameters

## Labels
- OPEN
- CLOSE
