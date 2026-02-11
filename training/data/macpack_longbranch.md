# ca65 .MACPACK longbranch

**Summary:** .MACPACK longbranch provides long conditional jump macros (jeq, jne, jmi, jpl, jcs, jcc, jvs, jvc) for ca65; macros emit a short branch when the target is a defined label within the 8-bit relative range, otherwise they emit the inverted short branch to skip an absolute JMP to the target.

## Macro behavior
The macros are named like the short conditional branches but with the leading 'b' replaced by 'j' (e.g. jeq for beq-style conditional long jump). Each macro tests two conditions:

- .def(Target): the label/Target is already defined (a backward/backwards label).
- ((*+2)-(Target) <= 127): the target is within the +127 byte forward range reachable by a 2-byte branch instruction (the calculation uses *+2 to represent the PC after the branch opcode and operand).

If both conditions are true the macro expands to the short conditional branch (e.g. beq Target). If not, the macro emits the inverted short branch that skips over an absolute JMP to the target, followed by an absolute jmp Target. This yields:

- Short, single-instruction conditional branch when the target is in range and defined.
- Inverted short branch to skip a 3-byte absolute jump when the target is out of range (or not yet defined).

This preserves conditional control flow semantics while allowing jumps to far targets.

The package defines these macros:
- jeq, jne, jmi, jpl, jcs, jcc, jvs, jvc

## Source Code
```asm
        .macro  jeq     Target
                .if     .def(Target) .and ((*+2)-(Target) <= 127)
                beq     Target
                .else
                bne     *+5
                jmp     Target
                .endif
        .endmacro
```

```text
The package defines the following macros:

        jeq, jne, jmi, jpl, jcs, jcc, jvs, jvc
```

## References
- "macpack_generic_macros" — expands on related convenience branch macros