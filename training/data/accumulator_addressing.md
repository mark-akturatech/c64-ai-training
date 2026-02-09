# 6502 Accumulator Addressing

**Summary:** Accumulator addressing on the 6502 uses the operand "A" to operate directly on the accumulator register (e.g. ASL A, ROR A). Commonly used by the shift/rotate instruction group; see implicit addressing for the difference with operand-less forms.

## Accumulator addressing
Accumulator addressing indicates that the instruction operates directly on the processor accumulator (the A register) rather than on a memory operand. This mode is written with the single operand "A". It is chiefly used by the shift and rotate instructions, which often have both a memory form and an accumulator form — the accumulator form is distinguished by "A".

Behavioral points preserved from source:
- Use "A" as the operand to apply the operation to the accumulator.
- Typical instructions using accumulator addressing are in the shift/rotate group.
- The same instructions can often be used with a memory operand; using "A" selects the accumulator variant.

## Source Code
```asm
        ; Accumulator addressing examples (operate on A)
        ASL A    ; Shift the contents of the accumulator one bit to the left
        ROR A    ; Rotate the contents of the accumulator one bit to the right
```

## References
- "implicit_addressing" — expands on implicit vs accumulator (implicit requires no operand)