# Kick Assembler: 16-bit pseudo commands (inc16, mov16, add16) — usage examples

**Summary:** Examples for Kick Assembler 16-bit pseudo commands `inc16`, `mov16`, and `add16` showing calls with labels, immediate values, and zeropage forms; notes on `add16` behavior when the target argument is omitted (AT_NONE). Useful when building extended instruction libraries (pseudo command directive).

**Examples**

The following short usages show common forms accepted by the 16-bit pseudo commands: using a label, an immediate, and a zeropage target. See the Source Code section for the literal examples used.

- `inc16 counter` — increment a 16-bit value at a label (label form).
- `mov16 #irq1 : $0314` — move an immediate (label) 16-bit value into absolute address $0314.
- `mov16 #startAddress : $30` — move an immediate (label) 16-bit value into a zeropage address ($0030).
- `add16 $30 : #128` — add immediate 8-bit value (128) to the 16-bit word pointed to by zeropage $30.
- `add16 $30 : #$1000 : $32` — add immediate 16-bit value ($1000) to the 16-bit word pointed to by zeropage $30, storing the result in the 16-bit word pointed to by zeropage $32.

**Argument behavior (AT_NONE)**

When the target argument is omitted for `add16`, the pseudo command receives an argument of type AT_NONE for the target parameter. In that case, the pseudo command should treat the first argument as the target (i.e., the first argument becomes the destination operand). This allows forms where the destination is implied by the first argument rather than explicitly supplied.

**Extending with pseudo commands**

Using the pseudo command directive, you can define your own extended instruction libraries (custom pseudo commands) to encapsulate common 16-bit operations, reducing boilerplate for trivial or repetitive tasks.

## Source Code

```asm
; Example usages (literal lines from source)
inc16 counter
mov16 #irq1 : $0314
mov16 #startAddress : $30
add16 $30 : #128
add16 $30 : #$1000 : $32
```

## References

- "mov16_and_add16_pseudocommands" — expands on definitions for the 16-bit commands used in these examples
- "defining_inc16_pseudocommand" — expands on `inc16` example usage