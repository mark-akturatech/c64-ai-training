# .ISIZE

**Summary:** .ISIZE returns the current Index register size in bits (8 or 16). For the 65816 it reflects the current immediate-index operand size; for all other supported CPU instruction sets it always returns 8. See also .ASIZE and .CPU.

## Description
Reading the pseudo-variable .ISIZE yields the current Index register size in bits.

- 65816 instruction set: .ISIZE returns 8 or 16 depending on the current index operand size used for immediate index addressing mode.
- Other CPU instruction sets: .ISIZE always returns 8.

See also: .ASIZE (Accumulator size) and .CPU (CPU/instruction-set considerations).

## References
- "asize_pseudo_variable" — expands on Accumulator size (.ASIZE)
- "cpu_pseudo_variable" — expands on .CPU — CPU and instruction-set considerations that affect instruction size
- "pseudo_variables_overview" — General pseudo variables introduction