# NMOS 6510 — ARR undocumented immediate example (ARR #$7F)

**Summary:** Example of the undocumented ARR immediate opcode ($6B $7F), showing the equivalent instruction sequence (AND #$7F; ROR A) and noting that processor flags differ between the single ARR opcode and the equivalent two-instruction sequence; test files exercise ARR behavior (CPU/asap/cpu_decimal.prg, Lorenz-2.15/arrb.prg).

## Description
ARR (opcode $6B with immediate operand) is shown here as an example using immediate value $7F. Semantically it corresponds to performing an AND with the immediate followed by a rotate-right on A (AND #$7F then ROR A), but the undocumented single-opcode ARR sets processor flags differently than the explicit two-instruction sequence. See the referenced mapping table for exact flag differences and the carry/overflow background for why they differ.

## Source Code
```asm
; Example: ARR with immediate operand $7F
; machine bytes: 6B 7F

        ; ARR #$7F        ; undocumented opcode
        .byte $6B, $7F

; Equivalent instruction sequence (NOT identical in flags):
        AND #$7F
        ROR A

; Note: flags differ between ARR and the equivalent AND/ROR sequence.
; See "arr_flag_mapping_table" for the exact mapping of flags for this example.

; Test files that exercise ARR behavior:
; - CPU/asap/cpu_decimal.prg
; - Lorenz-2.15/arrb.prg
```

## References
- "arr_flag_mapping_table" — expands on how to use the mapping table to see exactly how the flags differ for this example
- "arr_carry_and_overflow_intro" — background on why the Carry and Overflow differ