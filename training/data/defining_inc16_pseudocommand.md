# Kick Assembler: .pseudocommand inc16

**Summary:** Kick Assembler .pseudocommand definition for a 16-bit increment (inc16) that uses `inc` and `bne` to increment the low byte and, on carry/overflow, increments the high byte via `_16bitnextArgument(arg)`.

## Description
This pseudocommand implements a 16-bit increment across two consecutive 8-bit arguments. Behavior:
- `inc arg` increments the low byte (the provided argument).
- `bne over` branches to the end if the low byte did not roll over to zero (no carry).
- If the low byte did roll over (was $FF -> $00), execution falls through to `inc _16bitnextArgument(arg)`, which increments the high byte (the next argument as resolved by Kick Assembler helper `_16bitnextArgument`).
- `over:` is the label used as the branch target to continue after the operation.

The macro relies on an auxiliary function/macro `_16bitnextArgument(arg)` that resolves the high-byte argument corresponding to the given low-byte argument. See references for related 16-bit helpers.

## Source Code
```asm
.pseudocommand inc16 arg {
inc arg
bne over
inc _16bitnextArgument(arg)
over:
}
```

## References
- "constructing_cmdargument_and_16bit_next_argument_function" — expands on how `_16bitnextArgument` finds the high byte argument  
- "mov16_and_add16_pseudocommands" — other 16-bit helpers for move and add operations
