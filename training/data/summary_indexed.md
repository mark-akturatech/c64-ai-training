# 6502 Addressing Modes — Indexed Addressing (Absolute,X)

**Summary:** Indexed addressing (absolute,X) adds the operand to the X index register to form the effective memory address; e.g. LDA $4F10,X with X = $34 accesses $4F44. Terms: LDA, $4F10,X, index register X, address calculation.

## Indexed addressing
The operand (absolute address) is added to the contents of the X index register; the result is the memory location accessed by the instruction. Example shown uses accumulator load (LDA) with the X register supplying the offset.

- Operation: EffectiveAddress = Operand + X
- Example values: Operand $4F10 plus X = $34 yields EffectiveAddress $4F44.
- Only the X index register is shown in this chunk (absolute,X). (See references for zero-page indexed variant.)

## Source Code
```asm
    ; Example: absolute indexed addressing with X
    ; X = $34
    LDA $4F10,X    ; accesses memory at $4F10 + $34 = $4F44
```

## References
- "absolute_indexed_addressing" — expands on detailed absolute indexed mode
- "zero_page_indexed_addressing" — expands on zero page indexed variant