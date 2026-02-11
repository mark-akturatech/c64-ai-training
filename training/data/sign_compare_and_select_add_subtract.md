# Float sign test and choose mantissa add/subtract path ($B8A3-$B8AF)

**Summary:** Disassembly of C64 ROM code at $B8A3-$B8AF: uses BIT $6F to test FAC1/FAC2 sign relationship, branches to the mantissa-add path (BPL $B8FE) if signs require addition, otherwise selects which operand is "larger" by setting Y to an exponent address ($61 or $69) and sets the carry (SEC) to prepare for mantissa subtraction.

## Description
This snippet runs after exponent alignment is complete (exponents equal). It determines whether the aligned mantissas should be added or subtracted based on the sign relationship of the two floating-point operands (FAC1 and FAC2):

- BIT $6F — test sign relationship (source comment: "FAC1 EOR FAC2"). The BIT instruction updates flags based on memory; here it is being used to decide whether signs indicate addition or subtraction.
- BPL $B8FE — branch to the mantissa add path if the BIT result yields a non-negative condition (sign-test indicates addition). $B8FE is the mantissa_add_path.
- If branch is not taken, code prepares for subtraction:
  - LDY #$61 — load Y with FAC1 exponent address (per source comment).
  - CPX #$69 — compare X with FAC2 exponent address; decision selects which operand is considered larger.
  - BEQ $B8AF — if equal, keep current Y (FAC1); otherwise:
  - LDY #$69 — set Y to FAC2 exponent address (the larger operand's exponent/mantissa pointer).
- SEC — set carry to 1 to prepare for two's-complement-style subtract sequence (mantissa-subtract sequence will use carry set for subtraction).

The comments indicate selecting Y/X mapping so the subsequent mantissa-subtract routine subtracts the smaller mantissa from the larger and retains the sign of the larger operand.

(Short clarifications: BIT sets processor flags based on the memory byte; FAC1/FAC2 are the ROM's floating accumulator structures.)

## Source Code
```asm
.,B8A3 24 6F    BIT $6F         test sign compare (FAC1 EOR FAC2)
.,B8A5 10 57    BPL $B8FE       if = add FAC2 mantissa to FAC1 mantissa and return
.,B8A7 A0 61    LDY #$61        set the Y index to FAC1 exponent address
.,B8A9 E0 69    CPX #$69        compare X to FAC2 exponent address
.,B8AB F0 02    BEQ $B8AF       if = continue, Y = FAC1, X = FAC2
.,B8AD A0 69    LDY #$69        else set the Y index to FAC2 exponent address
.,B8AF 38       SEC             set carry for subtract
```

## References
- "exponent_diff_and_shift_smaller_mantissa" — expands on alignment completed before this decision
- "mantissa_add_path" — expands on branch target if signs indicate addition
- "mantissa_subtract_sequence" — expands on path taken when subtraction is required

## Labels
- FAC1
- FAC2
