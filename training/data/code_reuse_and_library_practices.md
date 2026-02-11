# Practical guidance on reuse: incorporate specialized routines into your macro or subroutine library

**Summary:** When you write a specialized routine that may be useful later, incorporate it into a macro or subroutine library so common routines (macros, subroutines) are readily available across projects; consider reuse vs. size trade-offs (macros inline, subroutines call). 

## Guidance
Write specialized routines when a project needs specific functionality. If you expect reuse, add the routine to your shared macro or subroutine library so future projects can access it quickly. Keep the library organized so major common routines (I/O helpers, sprite handling, math routines, data parsers, etc.) are at hand.

Be deliberate about placement:
- Use a macro when inline expansion is acceptable and you prefer speed or simplicity (but accept increased code size).
- Use a subroutine when you need to minimize repeated code and can tolerate call/return overhead (saves ROM/RAM at the cost of slightly slower execution).

## References
- "macros_vs_subroutines_memory_tradeoff" — discusses why to choose subroutines vs macros based on reuse and size
- "data_definition_text_storage_and_assembler_requirements" — covers assemblers' capabilities for defining and storing data and text
