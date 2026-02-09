# Kick Assembler: .segmentdef align/startAfter/virtual, importing .prg and .sid files

**Summary:** Describes Kick Assembler segment parameters: startAfter, align, virtual; how segments may be included in multiple other segments; and two ways to import .prg files (prgFiles parameter or manual .import). Mentions sidFiles parameter for SID imports.

## Segment alignment, startAfter and virtual blocks
- .segmentdef accepts parameters that control the default memory block placement for that segment:
  - startAfter="Name" — place the segment's default memory block after the named segment (used to order blocks).
  - align=$NNN — align the default memory block start to the given boundary (hex).
  - virtual — mark the segment's default memory block as virtual (kept for linking/ordering but not emitted in final output; effectively thrown away).
- A default memory block created by .segmentdef with align will be aligned to the given boundary (example: align=$100 aligns to a $100 boundary).

- Segments can be included in multiple other segments (for example, a "Code" and a "Data" segment can both include the same segment). This can be combined with other sources of code/data or with inline assembler instructions inside the segment.

## Including .prg files
- A .prg file contains a two-byte load address followed by data. Kick Assembler can import prg files as memory blocks when defining a segment using the prgFiles parameter, or you can import them manually into a segment by placing * (the program counter) where you want the block and calling .import.
- When importing manually you must set *= to the desired load address before calling .import (the .import will place the block at the current * unless the PRG header specifies otherwise).

## Including .sid files
- SID music files can be imported as memory blocks using the sidFiles parameter when defining a segment (analogous to prgFiles). This allows including SID tune data as blocks managed by the segment.

## Source Code
```asm
// Example: default memory block aligned to $100 and virtual
.segmentdef Virtual100 [startAfter="Code", align=$100, virtual]

// Using the segment and adding a table (aligned start)
.segment Virtual100 "Table" table
.fill $100,0

// Importing prg files when defining segment
.segmentdef Misc1 [prgFiles="data/Music.prg, data/Charset2x2.prg"]

// Another way of producing the same result (manual import)
.segment Misc2 []
*=$1000               // place the block manually
.import c64 "data/Music.prg"
*=$2000               // place the next block manually
.import c64 "data/Charset2x2.prg"

// Example pattern for SID files (parameter form, analogous to prgFiles)
.segmentdef Music [sidFiles="music/MyTune.sid"]
```

## References
- "default_memory_block_and_startAfter_usage" — expands on startAfter and alignment use cases
- "10.9. Including .prg files" — covers PRG import behavior
- "10.10. Including sid files" — covers SID import parameterization