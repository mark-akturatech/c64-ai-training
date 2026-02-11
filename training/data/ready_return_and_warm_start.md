# READY return to BASIC after device operations (C64 ROM $E195-$E1BB)

**Summary:** Handles the READY return path after device I/O in the C64 ROM: calls $FFB7 to read the I/O status word, masks the error bit with AND #$BF, branches to error handling (JSR $A437) if an error is present, and otherwise returns to BASIC — either immediate (prints "READY." and warm-starts) or non-immediate (set execute pointer, rebuild line chain, RESTORE/return). Key addresses: $E195-$E1BB, JSR targets $FFB7, $A437, $AB1E, $A52A, $A68E, $A533, $A677; zero-page variables $2D/$2E and $7B are used.

## Operation overview
This ROM fragment implements the "return to BASIC" sequence after device operations (LOAD/VERIFY/etc.). Sequence:

- JSR $FFB7 — read I/O status word into accumulator.
- AND #$BF — mask the status (clears the read-error bit).
- BEQ $E1A1 — if zero (no error after masking), continue to return-to-BASIC path.
- On non-zero (error present): LDX #$1D (sets BASIC error code $1D) and JMP $A437 to run error handling which performs a warm start.
- If no error, check the BASIC execute pointer ($7B):
  - If $7B indicates immediate mode ($02xx), set start-of-variables ($2D/$2E) from X/Y, set the pointer to the string "READY." (A9 #$76 / A0 #$A3 → $A376), JSR $AB1E to print the null-terminated string, then JMP $A52A to perform warm start (reset execution state, clear variables, flush stack, rebuild BASIC chain).
  - If not immediate, JSR $A68E to set the BASIC execute pointer to start-of-memory - 1, JSR $A533 to rebuild BASIC line chaining, then JMP $A677 which finishes rebuild, does RESTORE and returns to BASIC.

## Control-flow and effects
- Error path: sets an explicit BASIC error ($1D) and jumps to the ROM error handler at $A437 — that handler performs error message/output and then warm-start semantics.
- Immediate mode path:
  - Uses X/Y (already loaded earlier) to set zero-page start-of-variables at $2D/$2E. This establishes where new variables may be allocated for immediate (direct) mode.
  - Prints "READY." via the ROM string printer at $AB1E using the pointer set by A9/A0.
  - Performs warm start and BASIC warm initialization at $A52A.
- Non-immediate path:
  - Sets the BASIC execute pointer (start of program execution) via $A68E.
  - Rebuilds internal BASIC line chaining structures with $A533 and $A677, does a RESTORE, then returns to BASIC command mode with program intact.

## Source Code
```asm
.,E195 20 B7 FF JSR $FFB7       read I/O status word
.,E198 29 BF    AND #$BF        mask x0xx xxxx, clear read error
.,E19A F0 05    BEQ $E1A1       branch if no errors
.,E19C A2 1D    LDX #$1D        error $1D, load error
.,E19E 4C 37 A4 JMP $A437       do error #X then warm start
.,E1A1 A5 7B    LDA $7B         get BASIC execute pointer high byte
.,E1A3 C9 02    CMP #$02        compare with $02xx
.,E1A5 D0 0E    BNE $E1B5       branch if not immediate mode
.,E1A7 86 2D    STX $2D         set start of variables low byte
.,E1A9 84 2E    STY $2E         set start of variables high byte
.,E1AB A9 76    LDA #$76        set "READY." pointer low byte
.,E1AD A0 A3    LDY #$A3        set "READY." pointer high byte
.,E1AF 20 1E AB JSR $AB1E       print null terminated string
.,E1B2 4C 2A A5 JMP $A52A       reset execution, clear variables, flush stack,
                                rebuild BASIC chain and do warm start
.,E1B5 20 8E A6 JSR $A68E       set BASIC execute pointer to start of memory - 1
.,E1B8 20 33 A5 JSR $A533       rebuild BASIC line chaining
.,E1BB 4C 77 A6 JMP $A677       rebuild BASIC line chaining, do RESTORE and return
```

## Key Registers
- $FFB7 - ROM routine - read I/O status word (JSR target)
- $A437 - ROM routine - error handler / warm start entry (JMP target on error)
- $AB1E - ROM routine - print null-terminated string (JSR target used to print "READY.")
- $A52A - ROM routine - warm start / reset execution state (JMP target after printing READY)
- $A68E - ROM routine - set BASIC execute pointer to start-of-memory - 1 (JSR target)
- $A533 - ROM routine - rebuild BASIC line chaining (JSR target)
- $A677 - ROM routine - finalize rebuild, RESTORE and return (JMP target)
- $7B - zero page - BASIC execute pointer high byte (checked for immediate mode)
- $2D-$2E - zero page - start-of-variables pointer (low/high) set from X/Y in immediate mode
- $A376 - ROM data (pointer assembled by A9 #$76 / A0 #$A3) - "READY." string location (pointer set before JSR $AB1E)

## References
- "perform_verify_and_load" — expands the LOAD/VERIFY completion path that arrives here on success
- "perform_sys_routine" — expands SYS return conventions and how BASIC resumes from machine-code calls