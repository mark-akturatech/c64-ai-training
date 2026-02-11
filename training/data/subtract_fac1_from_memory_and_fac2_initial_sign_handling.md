# Floating-point subtraction entry: FAC1 from (AY) or FAC2 — ROM $B850-$B865

**Summary:** Entry/branching for subtraction where FAC1 is subtracted from a memory operand (indirect (AY)) or from FAC2; calls unpack routine ($BA8C), complements FAC1 sign, computes sign comparison (FAC1 EOR FAC2), loads FAC1 exponent ($61), and jumps into the add/subtract alignment and mantissa logic (jump to $B86A or calls to $B999 and branch to $B8A3).

## Description
This ROM fragment handles the subtraction entry path used when FAC1 is to be subtracted from a memory operand addressed by (AY) or from FAC2.

Steps performed:

- JSR $BA8C — unpack the memory operand at (AY) into FAC2 (see unpack routine).
- When subtracting FAC1 from FAC2 (or from the unpacked memory operand), FAC1's sign byte at zero page $66 is complemented (EOR #$FF). Complementing FAC1's sign turns the subtraction into an addition of oppositely-signed values.
- The FAC2 sign (zero page $6E) is EORed with the complemented FAC1 sign; the result (FAC1 EOR FAC2) is stored at $6F. This sign-compare byte is used later to decide add vs subtract mantissa flow.
- FAC1 exponent is loaded from $61 into A to prepare exponent-based alignment/branching.
- Control then transfers to the shared add/subtract alignment and mantissa logic at $B86A (jump), or for large right-shifts the code calls $B999 and then branches (BCC) into the subtract-mantissa path at $B8A3.

Short parentheticals: (FAC1/FAC2 = C64 ROM floating-point accumulators), (AY = memory operand via indirect-indexed addressing).

## Source Code
```asm
.,B850 20 8C BA    JSR $BA8C       ; unpack memory (AY) into FAC2

; perform subtraction, FAC1 from FAC2
.,B853 A5 66       LDA $66          ; get FAC1 sign (b7)
.,B855 49 FF       EOR #$FF         ; complement it (turn subtraction into addition)
.,B857 85 66       STA $66          ; save FAC1 sign (b7)
.,B859 45 6E       EOR $6E          ; EOR with FAC2 sign (b7)
.,B85B 85 6F       STA $6F          ; save sign compare (FAC1 EOR FAC2)
.,B85D A5 61       LDA $61          ; get FAC1 exponent
.,B85F 4C 6A B8    JMP $B86A        ; jump to add FAC2 to FAC1 alignment & return
.,B862 20 99 B9    JSR $B999        ; shift FACX A times right (>8 shifts)
.,B865 90 3C       BCC $B8A3        ; branch to subtract mantissas
```

## References
- "unpack_memory_operand_for_add" — expands on the $BA8C unpack routine that loads memory(AY) into FAC2
- "add_fac2_to_fac1_alignment_and_mantissa_operations" — expands on branches/jumps into the main exponent alignment and mantissa add/subtract logic
