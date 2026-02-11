# C64 Demo Optimization — Unroll loops, tables, zero page

**Summary:** Generic C-64 / 6502 optimization advice: unroll loops, remove unnecessary instructions, use lookup tables and the zero page ($0000-$00FF) to speed accesses, and reorganize data/layout to simplify computation (data/layout changes).

**Other Optimizations**
- Unroll loops — reduce branch overhead and loop-counter work.
- Remove unnecessary instructions — eliminate redundant loads/stores and dead code.
- Use tables (precomputed lookup tables) — trade ROM/RAM for CPU cycles.
- Use the zero page (fastest 6502 addressing) — place frequently accessed variables there.
- Reorganize data and memory layout — arrange data to simplify indexing and reduce runtime computation.
- Continually profile and read through code to find hotspots; apply the above techniques where they yield the greatest benefit.

(Parentheticals: "tables" = precomputed lookup tables; "zero page" = $0000-$00FF fast addressing.)

## References
- "An Introduction to Programming C-64 Demos" — generic optimization advice summary