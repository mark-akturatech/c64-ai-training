# Kick Assembler — Function Mode vs Asm Mode (optimization for loops and .define)

**Summary:** Describes Kick Assembler's two directive execution modes (Function Mode and Asm Mode), how .define/.function placement affects assembly time and memory when using heavy .for loops or calculations, and the restriction that Function Mode only runs script directives (.var, .const, .for, etc.).

## Function Mode vs Asm Mode
Kick Assembler executes directives in one of two modes:

- Function Mode
  - Used when a directive is placed inside a function or a .define directive.
  - Executes fast and does not record intermediate results for the assembler's multi-pass process.
  - Restricted to script directives only (examples: .var, .const, .for). Non-script assembly emission is not executed here.

- Asm Mode
  - Used for directives outside functions/defines.
  - Records intermediate results so the assembler does not have to redo the same calculations in succeeding passes (reduces repeated work across passes but uses memory to store intermediates).

## When to place loops/calculations inside .define or functions
- If heavy calculations or many iterations cause slow assembly or excessive memory usage, place the .for loops (or other heavy script work) inside a .define directive or inside a function to run in Function Mode.
- Because Function Mode does not record intermediate steps, the assembler avoids time/memory overhead caused by storing per-pass intermediate results.
- The .define directive (or the directive that invoked the function) will preserve the final result across succeeding passes, so you get fast execution during assembly without losing multi-pass correctness.
- Read the .define / "working_with_mutable_values" documentation for details on how .define locks values and causes inner code to run in Function Mode.

## References
- "working_with_mutable_values" — explains how .define locks values and runs inner code in Function Mode
