# ROM Reset Vector Entry: JSR $FC93 / BEQ $FC54 ($FCB8-$FCBB)

**Summary:** Reset-vector entry code at ROM $FCB8 calls JSR $FC93 (restore everything for STOP) and then executes BEQ $FC54 (annotated as a "branch always" to the restore/exit path). Searchable terms: $FCB8, $FCBB, $FC93, $FC54, JSR, BEQ, reset vector.

## Description
This ROM fragment is used as a reset-vector handler entry point. At $FCB8 the code performs a subroutine call to $FC93 — labeled "restore everything for STOP" in the disassembly — to restore CPU/stack/register state expected after a STOP. Immediately after returning, execution falls through to a BEQ instruction at $FCBB whose operand targets $FC54; the original disassembly annotates this BEQ as a "branch always" to the routine that restores registers and exits the interrupt/stop state.

Exact behavior (why BEQ is always taken) is not expanded here in the fragment; the annotation indicates the branch is intended to unconditionally transfer control to the restore/exit sequence at $FC54.

## Source Code
```asm
.,FCB8 20 93 FC    JSR $FC93       ; restore everything for STOP
.,FCBB F0 97       BEQ $FC54       ; restore registers and exit interrupt, branch always
```

## References
- "restore_everything_for_STOP" — expands on the subroutine called at $FC93 and what state is restored