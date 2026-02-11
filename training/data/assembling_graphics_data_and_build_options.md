# Assembling Graphics Data: Inline vs Separate, Relocation, and Addressing

**Summary:** Trade-offs when assembling graphics inline versus assembling graphics data separately: impact on assembly time, requirement to supply runtime addresses when graphics are built independently, and the need for the graphics package to match the application's graphics mode ($Dxxx/VIC-II modes implied).

## Trade-offs: inline assembly vs separate assembly
- Inline assembly (graphics data included in the main source) keeps code and data colocated but increases full-assembly time proportionally to the amount of graphics data. Large graphics blocks can substantially lengthen assembly cycles.
- Assembling graphics separately decouples the data from the main program so the graphics data need only be assembled when edited (or until corrected), reducing repeated assembly time for the program itself.

## Relocation and addressing requirements
- If graphics are assembled separately from the main program, the main program must be given the absolute addresses where those graphics will be located at runtime so it can reference them correctly.
- Separate assembly implies either: arrange for the graphics to be linked/loaded at a fixed known address, or provide relocation information so the main program can compute final addresses at load time (see referenced relocation materials).
- Changes to graphics mode (VIC-II mode selection) must be coordinated: if the application requires a specific graphics mode, the graphics package must generate data in that mode or the main program must be modified to accommodate the package's output.

## References
- "koala_pad_overview_and_file_format" — expands on using externally created graphics from a tablet (Koala Pad)
- "display_pic_usage_and_relocation" — expands on displaying and relocating graphics data after loading
