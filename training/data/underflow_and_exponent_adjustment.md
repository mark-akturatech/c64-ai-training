# Exponent adjustment and two's-complement storage (ROM disasm $B92B-$B934)

**Summary:** 6502 instruction sequence that sets carry, subtracts the saved exponent at $61 from the accumulator (SBC $61), branches to $B8F7 in one case, and otherwise forms the two's complement of the accumulator and stores it back to $61 (FAC1 exponent). Search terms: SBC, SEC, BCS, two's complement, EOR #$FF, ADC #$01, $61, $B8F7, FAC1.

## Description
This code follows normalization and performs the exponent adjustment for FAC1:

- SEC — set carry before SBC (standard SBC calling convention on 6502).
- SBC $61 — subtract the saved exponent (memory $61) from the accumulator.
- BCS $B8F7 — branch on carry set to $B8F7 (the source comment says "branch if underflow (set result = $0)"; see note below).
- If the branch is not taken, the accumulator is complemented with EOR #$FF then incremented with ADC #$01, producing the two's complement of A; STA $61 stores this value back to $61 as FAC1 exponent.
- A following step (not included here) will test and normalise FAC1 depending on the carry (C=0/1).

Behavioral note (important):
- **[Note: Source may contain an error — the comment "branch if underflow" contradicts 6502 SBC/BCS semantics.]** On 6502, after SBC the carry flag is set when no borrow occurred (result >= 0) and clear when a borrow occurred (result < 0). BCS branches when carry = 1 (i.e., when the subtraction produced no borrow / non-negative result). The source's textual description appears inverted; treat the code logic (opcodes) as authoritative. In this sequence:
  - If BCS is taken (carry set), execution jumps to $B8F7 (source claims that path clears the result).
  - If BCS is not taken (carry clear), the code negates A (two's complement) and stores it into $61.

## Source Code
```asm
.,B92B 38       SEC             set carry for subtract
.,B92C E5 61    SBC $61         subtract FAC1 exponent
.,B92E B0 C7    BCS $B8F7       branch if underflow (set result = $0)
.,B930 49 FF    EOR #$FF        complement exponent
.,B932 69 01    ADC #$01        +1 (twos complement)
.,B934 85 61    STA $61         save FAC1 exponent
                                test and normalise FAC1 for C=0/1
```

## References
- "post_add_normalisation_shift_loop" — expands on normalization preceding this exponent adjustment
- "overflow_handling_and_final_rols" — expands on overflow carry handling, increment/rotate and possible error pathways

## Labels
- FAC1_EXPONENT
