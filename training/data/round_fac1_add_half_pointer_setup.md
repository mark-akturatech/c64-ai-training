# add 0.5 to FAC1 (round FAC1)

**Summary:** Assembly at $B849–$B84D (LDA/LDY/JMP) sets a memory-pointer to the 0.5 constant (low/high bytes #$11/#$BF) and jumps to the routine at $B867 that adds the memory (AY) operand to FAC1. Search terms: $B849, $B84D, $B867, LDA, LDY, JMP, (AY), FAC1, round.

## Description
Loads the low and high bytes of a memory pointer that references the 0.5 constant into the A and Y registers respectively, then transfers control to the add routine at $B867. The target routine performs an add of the memory operand (referred to as (AY) in the source) to FAC1, implementing rounding by adding 0.5. See referenced chunks for the operand-unpacking and the full FAC1 addition implementation.

## Source Code
```asm
                                *** add 0.5 to FAC1 (round FAC1)
.,B849 A9 11    LDA #$11        set 0.5 pointer low byte

.,B84B A0 BF    LDY #$BF        set 0.5 pointer high byte
.,B84D 4C 67 B8 JMP $B867       add (AY) to FAC1
```

## References
- "unpack_memory_operand_for_add" — expands on calls unpack (AY) into FAC2 before add
- "add_fac2_to_fac1_alignment_and_mantissa_operations" — expands on destination routine that performs the actual add of the memory operand to FAC1