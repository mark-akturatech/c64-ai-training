# Load register (Y) based on CMP result without branches (CMP / ARR / TAY)

**Summary:** Technique for NMOS 6510 to load Y depending on a CMP result without branching using the undocumented ARR opcode: CMP, ARR #$00, TAY. Searchable terms: CMP, ARR (undocumented), TAY, Carry, 6510, branch elimination.

## Description
When a conditional branch exists solely to choose between two immediate loads of Y depending on the carry set by CMP, you can replace the branch sequence with a three-instruction sequence that captures the comparison result into the accumulator (via ARR) and then transfers it to Y.

Keep in mind ARR is an undocumented opcode; behavior specifics are hardware-dependent across 65xx variants. The sequence below assumes the NMOS 6510 behavior where executing ARR #$00 after CMP produces an accumulator value reflecting the comparison result, which TAY then copies into Y.

This replaces a branch plus two immediate loads with a shorter sequence that uses the previously set carry/flags and an undocumented AND/rotate-like operation (ARR) to produce the desired value in A before transfer.

## Source Code
```asm
; Original (branching) example
        CMP $1000
        BCS load_high
        LDY #$00
        BEQ cont

; jump always to cont

load_high
        LDY #$80
cont

; Branchless replacement (shorter)
        CMP $1000
        ARR #$00
        TAY
```

## References
- "arr_opcode_flags_and_table" — expands on ARR's flag behavior
- "arr_rotate_16bit_example" — ARR usage for multi-byte manipulation
- "arr_shift_zeros_ones_into_accumulator" — other ARR patterns to derive A values

## Mnemonics
- ARR
