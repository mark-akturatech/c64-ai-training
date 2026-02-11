# Square-table multiplication using x^2/4 tables (6502)

**Summary:** Technique for fast 8×8 (or small) multiplication on 6502 using precomputed square tables storing x^2/4 (two-byte entries), duplicated for (a+b)^2/4 and (a−b)^2/4, page-aligned for (indirect),Y indexing; uses EOR #$FF to negate without ADC to save instructions and memory (~2048 bytes total).

## Technique
This method implements multiplication via the algebraic identity based on squares, storing precomputed square values in compact tables and using simple additions/subtractions and table lookups instead of shift-and-add loops.

Key points and constraints:
- Store x^2/4 instead of x^2 so each table entry fits in 2 bytes, not 3. Storing x^2/4 discards the two low-order bits of x^2; this is acceptable because both (a+b)^2 and (a−b)^2 lose the same low bits and the later subtraction cancels them.
- Maintain two tables:
  - one table for (a+b)^2/4
  - one table for (a−b)^2/4
  Total memory for both tables ≈ 2048 bytes (2 KiB).
- Offset the (a−b)^2/4 table by one byte. This allows negation of a byte in the accumulator using EOR #$FF (bitwise invert) without adding 1 (no ADC #$01). The indexing into the offset table therefore compensates for the missing +1 (i.e., uses -A-1 indexing).
- Page-align both tables. Page alignment simplifies and speeds (indirect),Y pointer indexing on the 6502 because table base pointers remain in one page and pointer setup is streamlined.
- Cost in runtime operations: one addition, two subtractions, two right shifts (divide-by-4), and two table lookups (plus pointer indexing overhead). Most work is trivial if tables and pointers are set up cleverly (zero-page pointers, page-aligned tables, offset table for negation).

Algorithm outline (conceptual):
1. Compute sums/differences: a+b and a−b (using standard 8-bit arithmetic).
2. Shift results right twice (divide by 4) to form indices into x^2/4 tables (or compute index mapping as required).
3. Lookup (a+b)^2/4 and (a−b)^2/4 from their respective page-aligned tables using (indirect),Y or equivalent indexing.
4. Subtract the two table values to obtain 4·a·b (the low lost bits cancel).
5. Adjust scaling (if needed) to get final product (account for the /4 factor in the tables).

Caveats:
- The technique depends on precise handling of the discarded low bits; the identity guarantees they cancel in the subtraction if both operands are processed identically.
- The offset-by-one trick requires the lookup table and pointer arithmetic to be arranged so that using EOR #$FF (bitwise NOT) on the index yields the intended table entry without an explicit +1.
- Page alignment and pointer placement (typically in zero page) are important for both speed and to make (indirect),Y indexing straightforward.

## References
- "algebraic_square_trick" — expands on the algebraic identity used
- "pointer_setup_for_square_tables" — expands on how to supply pointers in zero page and page-align tables for (indirect),Y indexing