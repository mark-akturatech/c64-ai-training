# Short JMP dispatch entries used during reset/startup ($FF81, $FF84, $FF87)

**Summary:** Short JMP dispatch points in the C64 Kernal ROM that forward reset/startup execution to shared initialization routines: $FF81 -> $FF5B (VIC-II init), $FF84 -> $FDA3 (SID/CIA/IRQ init), $FF87 -> $FD50 (RAM test / find RAM end).

**Description**
These three ROM bytes are small JMP stubs used during reset/startup to reuse larger initialization routines elsewhere in the Kernal. They keep the reset entry sequence compact by branching to the routine that performs the requested initialization:

- $FF81 — JMP $FF5B — dispatch to the VIC-II initialization routine (initialize VIC).
- $FF84 — JMP $FDA3 — dispatch to the SID/CIA/IRQ initialization routine (comment: "initialize SID, CIA and IRQ, unused").
- $FF87 — JMP $FD50 — dispatch to the RAM test routine that finds the RAM end.

These entries are simple absolute jumps (opcode 4C), each three bytes long, used as dispatch points during reset/startup to centralize initialization code. The source labels indicate the intended purpose and note that the SID/CIA/IRQ entry is unused.

## Source Code
```asm
.; Short JMP entries to reuse initialization routines
.; .,FF81 4C 5B FF JMP $FF5B       initialise screen and keyboard
.; .,FF84 4C A3 FD JMP $FDA3       initialise I/O devices
.; .,FF87 4C 50 FD JMP $FD50       initialise memory pointers
```

## References
- "reset_hardware_startup" — expands on reset usage of these short jumps during boot