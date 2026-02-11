# Re-using computation results between frames (C‑64 demos)

**Summary:** Re-use expensive computation results across frames or code paths in C‑64 demos by caching values in tables or variables (lookup tables, precomputed arrays) to avoid redundant work and save CPU time.

## Re-using Stuff
Detect values your code computes repeatedly (within a frame or across frames). If a calculation is expensive and produces the same result for multiple uses, compute it once, store the result in a table or variable, and read that stored value wherever needed instead of recomputing.

Re-use can be applied to non-numeric work as well — for example, reuse plotted points or precomputed pixel patterns by drawing the same point/data in several places rather than recalculating it for each location.

Keep the approach minimal and focused: compute once, store, lookup. This reduces per-frame CPU load in tight demo loops where every cycle counts.

## References
(none)
