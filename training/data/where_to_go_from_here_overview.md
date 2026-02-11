# Where To Go From Here

**Summary:** Machine language (6502) opens application areas including math routines, BASIC augmentation, graphics (VIC-II / raster timing — e.g. $D012), music (SID), and hardware I/O (CIA). For larger projects use symbolic assemblers and source management techniques.

**Next steps and application areas**
Machine language unlocks much higher speed and lower-level hardware access than BASIC, enabling:
- Mathematical routines and algorithms where speed and precision matter.
- Tools that analyze or extend BASIC programs (searching, renumbering, patching).
- Graphics, animation, and raster-timed effects that rely on VIC-II behavior and raster interrupts.
- Music and sound programming tied to the SID chip.
- Hardware interfaces and device control through I/O (CIA) chips.

If you plan to build larger projects, adopt a symbolic assembler and source-management workflow (organize modules, labels, and build scripts) to keep code maintainable and debuggable.

## References
- "symbolic_assemblers_and_source_management" — expands on using assemblers and managing source for larger projects