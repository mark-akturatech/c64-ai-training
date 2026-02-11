# Macros vs Subroutines (Assembler)

**Summary:** Explains assembler macros (expanded inline) versus subroutines (called with JSR), and the trade-off between code-size and reuse; recommends using subroutines for frequently used or large routines and building subroutine libraries analogous to macro libraries.

## Trade-off and recommendation
Each time an assembler macro name appears in source the assembler expands it into its constituent instructions at that call site. That expansion means every use of the macro consumes the same amount of code space as if those instructions had been typed inline.

A subroutine, invoked with JSR, is stored once in the program and reused by multiple callers. For functions that are called repeatedly and contain a significant amount of code (for example, a text-display routine used from many places), prefer implementing them as subroutines rather than macros.

You may maintain a library of subroutines in the same way you maintain a macro library: collect commonly used routines once and call them from multiple modules to save overall program memory.

## References
- "macros_definition_example_and_benefits" — macro definition, example, and advantages
- "code_reuse_and_library_practices" — practical advice about incorporating routines into reusable libraries