# NMOS 6510 ARR ($6B) — Carry & Overflow behavior

**Summary:** Describes how the undocumented ARR ($6B) opcode on the NMOS 6510 sets the Carry and Overflow flags: Carry equals bit 7 before the rotate (equivalently bit 6 after), Carry is not influenced by the LSB as in a normal rotate, and Overflow is set when the rotate changes bit 6.

## Behavior
- The ARR opcode produces a rotate that results in a Carry value equal to the state of bit 7 prior to the rotate (equivalently, the state of bit 6 after the rotate).
- The resulting Carry is not influenced by the least-significant bit (LSB / bit 0) as would be expected from a normal right-rotate through carry.
- The Overflow (V) flag is set based on whether the rotate changes bit 6: V = 1 if bit 6 changes state as a result of the rotate, otherwise V = 0. (i.e., V = old_bit6 XOR new_bit6)
- In short:
  - C = old_bit7 (== new_bit6)
  - V = (old_bit6 != new_bit6)

(Note: "rotate" here refers to the single-bit rotate operation performed by ARR.)

## References
- "arr_flag_mapping_table" — expands on complete mapping table showing how inputs map to output bits, Carry and Overflow
- "arr_example_equivalent_instructions" — expands on example usage and equivalent instruction sequence

## Mnemonics
- ARR
