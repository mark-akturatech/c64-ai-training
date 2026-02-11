# CSTE1 / CS10 / CS25 — "PRESS PLAY..." cassette-wait routine ($F817-$F837)

**Summary:** CSTE1 ($F817) prompts "PRESS PLAY..." (via CS30/MSG) and loops, using TSTOP ($F8D0) to watch the STOP key and CS10 ($F82E) to poll the cassette port. CS10 samples bit $10 of the 6510 I/O port ($0001) with a simple debounce (two BITs); routine returns with carry clear on success.

## Description
This KERNAL fragment implements the user prompt and wait-for-play-switch used by tape routines:

- Entry point CSTE1 at $F817:
  - Calls CS10 ($F82E) to sample the cassette port bit.
  - If the sample indicates the PLAY switch is already closed, the routine returns immediately (CS25 path).
  - If not, it loads the message index for "PRESS PLAY..." (LDY #$1B) and calls MSG (CS30) to display the prompt.
  - Enters a loop that:
    - Calls TSTOP (CS40 / $F8D0) to monitor the STOP key (if user presses STOP exit/watch behavior).
    - Calls CS10 to re-sample the cassette switch.
    - If the sample still indicates not-pressed (Z=0), branches back to re-check TSTOP (loop).
    - When the sample indicates pressed (Z=1), it loads LDY #$6A for the "OK" message and JMPs to MSG to display it, then returns to caller.

- CS10 at $F82E:
  - Loads A with $10 (bit mask).
  - BIT $01 (test 6510 I/O port, 0-page $01) — if the bit is set, branch immediately to CS25 (no debounce).
  - If the first test shows bit clear, perform a second BIT $01 to confirm (debounce).
  - CS25 ($F836) clears the carry (CLC) and returns (RTS). The carry is therefore clear on success.

Behavioral details:
- The cassette input is bit $10 (mask $10) of the 6510 port at $0001.
- BIT sets the Z flag when (A & M) == 0. The routine interprets Z=1 as the PLAY switch closed (active low).
- Debounce strategy: if the first BIT shows set (A&M != 0) it returns immediately; if the first BIT shows clear it repeats BIT to confirm the read before returning.
- The routine relies on the Z flag returned from CS10 to decide branching in the caller:
  - After JSR CS10, BEQ (branch on Z=1) jumps to CS25 (immediate success) — i.e., PLAY already active.
  - In the wait loop, after JSR CS10 a BNE (branch on Z=0) loops back to monitor STOP and wait again.

Register/flag effects:
- Z flag is used to signal switch state to the caller.
- Carry is explicitly cleared (CLC) at CS25 before RTS (success path). No JSR path sets carry in this snippet; callers expecting carry semantics should note CLC is performed here.

Addresses / labels referenced in this fragment:
- CSTE1 — $F817 entry point
- CS30 / MSG — message print routine (JSR $F12F)
- CS40 / TSTOP — STOP-key watcher (JSR $F8D0)
- CS10 — cassette-port test ($F82E)
- CS25 — debounce-confirm / return (starts at $F836)

## Source Code
```asm
                                ;STAYS IN ROUTINE D2T1LL PLAY SWITCH
                                ;
.,F817 20 2E F8 JSR $F82E       CSTE1  JSR CS10
.,F81A F0 1A    BEQ $F836       BEQ    CS25
.,F81C A0 1B    LDY #$1B        LDY    #MS7-MS1        ;"PRESS PLAY..."
.,F81E 20 2F F1 JSR $F12F       CS30   JSR MSG
.,F821 20 D0 F8 JSR $F8D0       CS40   JSR TSTOP       ;WATCH FOR STOP KEY
.,F824 20 2E F8 JSR $F82E       JSR    CS10            ;WATCH CASSETTE SWITCHES
.,F827 D0 F8    BNE $F821       BNE    CS40
.,F829 A0 6A    LDY #$6A        LDY    #MS18-MS1       ;"OK"
.,F82B 4C 2F F1 JMP $F12F       JMP    MSG
                                ;SUBR RETURNS <> FOR CASSETTE SWITCH
                                ;
.,F82E A9 10    LDA #$10        CS10   LDA #$10        ;CHECK PORT
.,F830 24 01    BIT $01         BIT    R6510           ;CLOSED?...
.,F832 D0 02    BNE $F836       BNE    CS25            ;NO. . .
.,F834 24 01    BIT $01         BIT    R6510           ;CHECK AGAIN TO DEBOUNCE
.,F836 18       CLC             CS25   CLC             ;GOOD RETURN
.,F837 60       RTS             RTS
```

## Key Registers
- $0001 - 6510 I/O port - cassette input bit mask $10 (bit 4), tested via BIT $01

## References
- "increment_buffer_pointer" — expands on preceding utility in same TAPECONTROL area
- "record_prompt_check" — expands on parallel routine used for 'PRESS PLAY & RECORD' prompt
- "tape_completion_wait_loop" — expands on later uses of TSTOP to watch for STOP key during tape operations

## Labels
- CSTE1
- CS10
- CS25
