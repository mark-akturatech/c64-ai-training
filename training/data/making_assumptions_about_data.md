# Making Assumptions About Data (C-64 demos)

**Summary:** Advice for C‑64 demo programmers on tailoring 6502 routines to expected input data to reduce checks, branches, and overhead; favor data-driven simplification and format changes to enable faster, smaller code.

## Making Assumptions About Data
- Write routines for the data you actually control, not for every possible input — avoid general-purpose handlers that add branches and special-case logic.
- Eliminate checks and branches that cannot occur with your data set; fewer conditionals yields faster, smaller 6502 code (important in timing‑critical demo routines).
- If your data would force a complex routine, change the data format instead (preprocess or constrain assets) so the routine can be simpler and faster.
- Keep code paths minimal: implement only the cases that can actually happen, not hypothetical edge cases that waste cycles and bytes.
- This approach trades generality for deterministic performance and simplicity — appropriate for demo production where inputs are known and controlled.

## References
(none)
