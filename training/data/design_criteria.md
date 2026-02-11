# ca65 — Design goals (ca65 Users Guide)

**Summary:** Design criteria for the ca65 assembler: support for macros, 65C02/65816 CPUs, relocatable code, conditional assembly, multi-segment output (more than three segments), linker expression resolution, lexical nesting and cheap local symbols, .o65 options, one-pass assembly, and permissive (non-GPL) licensing.

## Design criteria
- Macros: the assembler must support macros to simplify complex tasks and to serve as a backend for compilers.
- CPU support: must support the newer 65C02 and 65816 instruction sets (for compiler backends and compatibility with existing tools).
- Relocatable code: produce relocatable object code suitable for linker use and compiler support.
- Conditional assembly: required for larger assembly projects and modular builds.
- Segments: support segments and more than three segments (useful for systems with divided ROM areas, e.g., C64).
- Linker expression resolution: the linker must resolve arbitrary expressions, e.g. expressions combining imported symbols.
- Lexical nesting: true lexical nesting for symbols (convenient for large projects).
- Cheap local symbols: "cheap" local symbols without full lexical nesting for quick hacks.
- Object-file options: include the concept of options in the object file format (inspired by Anre Fachats' .o65 format) for flexible toolchain behavior.
- One-pass assembler: implemented as a one-pass assembler (chosen for design preference and challenge).
- Licensing: non-GPL license so the assembler code may be used without GPL-related restrictions.

## Source Code
```asm
.import S1, S2
.export Special
Special = 2*S1 + S2/7
```

## References
- "overview_introduction" — expands on context for these design decisions and overall project goals.