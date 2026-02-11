# WAIT FOR PLAY (KERNAL $F817)

**Summary:** KERNAL routine at $F817 polls the cassette sense (JSR $F82E) and, while the PLAY switch is open, displays "PRESS PLAY ON TAPE" (via JSR $F12F with Y index $1B), scans the STOP key (JSR $F8D0) for abort, and loops until the PLAY switch closes (cassette-sense result returned in the Z flag).

## Description
This routine waits for the tape PLAY switch to close before returning control to the caller.

Operation flow:
- JSR $F82E — call the cassette-sense helper; the helper returns a result in the processor Z flag (BEQ taken when PLAY switch is closed).
- If PLAY is already closed (BEQ), exit immediately.
- If the switch is open:
  - LDY #$1B and JSR $F12F — invoke the KERNAL I/O message routine to display the message at index $1B ("PRESS PLAY ON TAPE").
  - JSR $F8D0 — call the routine that scans the STOP key and triggers an abort if STOP was pressed; if STOP is detected this routine does not return here but returns to the original caller (abort path handled by the STOP-scanner).
  - Re-check cassette sense (JSR $F82E) and loop while the switch remains open.
- When PLAY closes:
  - LDY #$6A and JMP $F12F — display "OK" (message index $6A) and return via the message routine's return.

Calling/return conventions observed in this snippet:
- Cassette sense helper communicates via the Z flag (BEQ branches on Z set).
- Y is used as an index into the KERNAL message table before calling $F12F.

## Source Code
```asm
.,F817 20 2E F8 JSR $F82E       ; return cassette sense in Zb
.,F81A F0 1A    BEQ $F836       ; if switch closed just exit
                                ; cassette switch was open
.,F81C A0 1B    LDY #$1B        
                                ; index to "PRESS PLAY ON TAPE"
.,F81E 20 2F F1 JSR $F12F       ; display kernel I/O message
.,F821 20 D0 F8 JSR $F8D0       ; scan stop key and flag abort if pressed
                                ; note if STOP was pressed the return is to the
                                ; routine that called this one and not here
.,F824 20 2E F8 JSR $F82E       ; return cassette sense in Zb
.,F827 D0 F8    BNE $F821       ; loop if the cassette switch is open
.,F829 A0 6A    LDY #$6A        
                                ; index to "OK"
.,F82B 4C 2F F1 JMP $F12F       ; display kernel I/O message and return
```

## References
- "cassette_sense_return" — expands on queries to the 6510 I/O port to detect the cassette switch (called via JSR $F82E)
- "tape_motor_and_spinup_delay" — details motor-control and spin-up delay routines used when starting tape operations

## Labels
- WAIT_FOR_PLAY
