# Kick Assembler: constructing CmdArgument and _16bitnextArgument

**Summary:** How to construct new arguments with CmdArgument(type, value) (uses argument type constants like AT_IMMEDIATE) and a helper function _16bitnextArgument(arg) that returns the paired high/next byte argument for 16-bit operations (uses > for high byte, otherwise value+1).

**Explanation**
- CmdArgument(type, value) constructs a new command argument node usable directly in operand positions (e.g. `.var a = CmdArgument(AT_IMMEDIATE,100); lda a` → `lda #100`).
- Argument types are the Kick Assembler argument_type_constants (AT_IMMEDIATE, AT_REL, AT_ABSOLUTE, etc.). The constructed argument preserves its specified type.
- _16bitnextArgument(arg) is a helper to obtain the second byte argument for 16-bit pseudocommands. Behavior:
  - If `arg.getType() == AT_IMMEDIATE`: return a new CmdArgument of the same type whose value is the high byte of the original (using the `>` operator).
  - Otherwise: return a new CmdArgument of the same type whose value is original value + 1 (address of the next byte).
- This preserves addressing-mode semantics for ABSOLUTE, ABSOLUTEX, ABSOLUTEY, and IMMEDIATE when implementing paired-byte (low/high) 16-bit operations.

## Source Code
```asm
; Constructing an immediate CmdArgument with value 100
.var myArgument = CmdArgument(AT_IMMEDIATE, 100)
lda myArgument
; Gives: lda #100

; Helper to get the "next" argument for 16-bit operations
.function _16bitnextArgument(arg) {
    .if (arg.getType() == AT_IMMEDIATE)
        .return CmdArgument(arg.getType(), >arg.getValue())
    .return CmdArgument(arg.getType(), arg.getValue() + 1)
}

; Pseudocommand to increment a 16-bit value
.pseudocommand inc16 arg {
    inc arg
    bne over
    inc _16bitnextArgument(arg)
over:
}

; Pseudocommand to move a 16-bit value
.pseudocommand mov16 src : tar {
    lda src
    sta tar
    lda _16bitnextArgument(src)
    sta _16bitnextArgument(tar)
}

; Pseudocommand to add two 16-bit values
.pseudocommand add16 arg1 : arg2 : tar {
    .if (tar.getType() == AT_NONE) .eval tar = arg1
    clc
    lda arg1
    adc arg2
    sta tar
    lda _16bitnextArgument(arg1)
    adc _16bitnextArgument(arg2)
    sta _16bitnextArgument(tar)
}
```

## References
- "argument_type_constants" — expands on uses of AT_IMMEDIATE and other argument types when constructing CmdArgument
- "defining_inc16_pseudocommand" — expands on use by inc16 to access the high/next byte
- "mov16_and_add16_pseudocommands" — expands on use by mov16 and add16 to operate on high/low byte pairs