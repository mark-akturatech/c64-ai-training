# 6502 Multiplication and Division Algorithms — Strength reduction (multiply elimination)

**Summary:** Strength reduction (eliminating multiplications in loops) and preferring multiply-by-constant code paths are effective on the 6502. Rewrite loop-invariant multiplication into incremental updates; use specialized code for constant factors rather than a general multiply routine.

## Strength reduction
If a multiplication depends only on a loop index that changes by a fixed increment, compute the product once and update it incrementally instead of re‑multiplying each iteration. This removes repeated multiplication work (loop-invariant computation) and is far cheaper on the 6502 (which lacks a fast hardware multiply).

Example pattern:
- Original: compute J = I * K every loop iteration.
- Strength-reduced: initialize J = (first I) * K once, then add K each iteration (or add K*step if I steps by >1).

Optimizing compilers perform this rewrite automatically when they detect the opportunity.

## Multiply-by-constant vs general multiply
When multiplication cannot be eliminated entirely, prefer specialized code for multiply-by-constant cases (strength reduction, shift/add sequences, lookup tables) rather than a general-purpose multiply routine. A small, constant-specific implementation is typically significantly more efficient in code size and cycles than a full arbitrary multiply.

## Source Code
```basic
10 REM Original (BASIC-like pseudocode)
20 FOR I = 5 TO 100 STEP 5
30   J = I*23
40   REM Do something with J
50 NEXT I

100 REM Strength-reduced version
110 J = 115  : REM 115 = 5*23
120 FOR I = 5 TO 100 STEP 5
130   REM Do something with J
140   J = J + 115
150 NEXT I
```

## References
- "multiplying_by_constant" — detailed multiply-by-constant techniques and examples