# KERNAL poll/wait sequence around $F817–$F837

**Summary:** KERNAL polling/wait loop that calls subroutine $F82E (which sets A=#$10 and tests $01 with BIT), invokes device/listener routines at $F12F and $F8D0, loops while the result flags indicate work to do, then clears carry and returns. Searchable terms: $F82E, $F12F, $F8D0, BIT $01, CLC, RTS, polling loop.

## Description
This code implements a short KERNAL poll/wait sequence:

- Entry at $F817 immediately calls the local helper at $F82E. That helper loads A=#$10 and performs BIT $01 (twice inside the helper) to set processor flags based on zero/result of (A & $01).
- Execution returns to $F81A where BEQ $F836 may branch to the exit (CLC; RTS) depending on the zero flag left by the helper. If BEQ is taken, the routine ends cleanly.
- If the BEQ is not taken, the routine sets Y=#$1B and calls $F12F (a device/listener routine). It then calls $F8D0 (another device/listener routine).
- After those calls it again calls $F82E to re-check the condition; BNE $F821 loops back to re-run the device/listener calls while the zero flag indicates further activity.
- If the loop exits, it falls through to set Y=#$6A and JMP $F12F (a direct jump variant to the same device/listener handler), then the helper at $F82E contains the final BIT checks, clears carry (CLC) and RTS.

Behavioral notes (as shown by the code):
- The subroutine at $F82E determines the zero flag state used by the BEQ/BNE tests at $F81A and $F827.
- The sequence uses LDY with two different constants ($1B and $6A) before invoking $F12F; these values are passed in Y to the listener/device routine.
- The routine ends by clearing the carry flag and returning (CLC; RTS).

## Source Code
```asm
.,F817 20 2E F8 JSR $F82E
.,F81A F0 1A    BEQ $F836
.,F81C A0 1B    LDY #$1B
.,F81E 20 2F F1 JSR $F12F
.,F821 20 D0 F8 JSR $F8D0
.,F824 20 2E F8 JSR $F82E
.,F827 D0 F8    BNE $F821
.,F829 A0 6A    LDY #$6A
.,F82B 4C 2F F1 JMP $F12F
.,F82E A9 10    LDA #$10
.,F830 24 01    BIT $01
.,F832 D0 02    BNE $F836
.,F834 24 01    BIT $01
.,F836 18       CLC
.,F837 60       RTS
```

## Key Registers
- $0001 - CPU port (processor port) - tested with BIT $01 to set/clear Zero flag used by the loop control (checks A & $01).

## References
- "increment_a6_and_check_limit" — expands on invoked after counter updates
- "initialize_system_and_device_state_for_io" — expands on higher-level init uses this wait loop