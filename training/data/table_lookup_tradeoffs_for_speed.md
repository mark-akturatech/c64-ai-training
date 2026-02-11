# 6502 Multiplication & Division: Table Lookup vs Algorithmic Routines

**Summary:** On the 6502, even heavily optimized multiply/divide routines can be relatively slow (example: 151 cycles best-case under ideal conditions — page-zero, no crossings, NUM2=0). Table lookup is the fastest technique (precompute results and read from a table), but it trades speed for memory and is only practical when operand ranges are limited; algebraic reductions (e.g., the "algebraic_square_trick") can reduce table size.

## Overview
Small, hand-optimized 6502 multiplication/division routines still cost substantial cycles — the cited best-case example requires 151 cycles when all variables are in page zero, no page crossings occur, and NUM2 = 0. To go significantly faster than that, programs use precomputed table lookup: compute all required products/quotients ahead of time and fetch the result with one or a few memory reads at runtime.

## Performance vs. Memory tradeoffs
- Table lookup gives the lowest runtime cost per operation because it replaces iterative/shift-add algorithms with memory accesses.
- The downside is memory: a naive full table for multiplying arbitrary 1‑byte operands grows very large and becomes impractical for a 6502 program that must address results directly.
- Table lookup is therefore most useful when the operand domain is constrained (e.g., limited ranges, quantized values) so table size is small enough to fit in available memory.

## Algebraic reduction (square trick)
- Algebraic identities can reduce stored entries. For example, using x*y = ( (x+y)^2 - x^2 - y^2 ) / 2 (and similar identities) lets you store fewer values (squares and combinations) and reconstruct products, trading some runtime work for much smaller tables.
- These reductions are a common way to make table lookup feasible when full tables would be too large.

## Notes
- The quoted "151 cycles" figure is an example from the source for an optimized routine under ideal conditions (page-zero addressing, no page crossing). Actual costs vary with addressing, page crossings, and calling conventions.
- Full 256×256 multiplication tables are large: 65,536 entries. If 16-bit products are stored (two bytes each), that requires 131,072 bytes — larger than a single 6502 64KB address space.

## References
- "llx.com" — original discussion/source
- "algebraic_square_trick" — techniques for reducing table size using algebraic identities
