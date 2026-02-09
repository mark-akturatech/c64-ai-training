# Optimization overview for C‑64 demos

**Summary:** Keep the screen updated every frame; if effect computations exceed available raster/frame time, reduce per-iteration cycle counts via algorithmic improvements first, then instruction‑level and table‑based optimizations. Searchable terms: raster, frame, cycle counts, instruction-level optimizations, table-based optimizations.

## A Few Words About Optimization
Update the screen each frame whenever possible. If an effect's computations require more raster time than a single frame allows, either optimize the code to fit the available cycles or accept reduced visual quality. The practical constraint for demo coding is fitting computations into the per-frame raster time budget.

## What to Optimize
General computer-science advice is: first improve algorithms (reduce asymptotic cost), then optimize the constant-time per-iteration costs. For many demo effects, however, the algorithmic iteration count is fixed or already minimal; the typical bottleneck is the time each iteration takes. In that common case focus on reducing cycles per iteration (instruction-level improvements, using tables/lookup where appropriate, minimizing memory access, etc.). Exceptions exist, but prioritize per-iteration cycle reduction when total iterations cannot be reduced.

## References
- "how_to_optimize_computations" — expands on instruction-level and table-based optimizations