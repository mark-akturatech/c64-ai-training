# Why the C-64 being old and slow is an advantage

**Summary:** The C-64 / 6502 constraints (limited CPU cycles, memory and direct-hardware programming) force efficient algorithms and clever low-level techniques; this constraint-driven development is central to demo programming and 6502 optimization.

## It’s old and slow
The C-64’s limited performance is an advantage for demo programming because it prevents brute‑force solutions. You cannot "throw CPU cycles" at a problem on a 6502 — effects that are trivial on modern hardware require careful planning, algorithmic efficiency, and low‑level tricks on the C‑64.

That constraint shifts focus from raw compute to:
- choosing compact, efficient algorithms;
- making maximal use of hardware behavior (cycle‑exact timing and registers);
- inventing clever tricks that make apparently impossible effects feasible.

A skilled demo programmer exploits these constraints to produce effects that appear much more advanced than the hardware should allow. Historically this meant hand‑written 6502 assembler and direct hardware access; modern platforms and demos sometimes use high‑level languages and OSes and therefore emphasize design as much as code, but the demo ethos of doing more with less originates in platforms like the C‑64.

## References
- "a_few_words_about_optimization" — expands on optimization strategies for 6502