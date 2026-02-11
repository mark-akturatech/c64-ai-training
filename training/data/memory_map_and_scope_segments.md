# Kick Assembler: segment / .segmentdef example and memory map notes

**Summary:** Example showing Kick Assembler segment usage (.segment, .segmentdef), .fill data allocation, and memory-layout options (start, startAfter, align, virtual). Notes about overlapping code rules (within-segment overlap errors) and which segments are emitted to output (saved vs thrown away).

## Details
- .segment creates a named segment (here: Buffer) used for a block of code/data; .fill reserves repeated bytes (e.g. table: .fill $100,0).
- Overlapping code/data ranges produce an error only when the overlap occurs inside the same segment — different segments may occupy the same addresses without an assembler overlap error.
- The example notes that some segments are saved to the output file while others are discarded: "Code" and "InitCode" are saved in the file, while "Buffer" is thrown away.
- .segmentdef defines reuseable segment templates with parameters. In the example:
  - .segmentdef Code [start=$8000] sets a Code segment template with an explicit start address $8000.
  - .segmentdef Virtual100 [startAfter="Code", align=$100, virtual] defines a segment positioned after the "Code" segment, aligned to $100, and marked virtual (see source example).
- Using the align parameter together with startAfter lets you align the following default memory block (e.g. align to page boundaries).
- Labels can be local inside different segments; scoping and segments don't affect each other (you can have the same local label name in different segments without collision).
- .fill usage: .fill <count>, <value> — used here to create tables of $100 bytes filled with 0.

## Source Code
```asm
.segment Buffer
table1: .fill $100, 0
table2: .fill $100, 0

; Notice that overlapping code only gives an error if it's inside the same segment.
; So you can place code in both 'InitCode' and 'Buffer' without getting errors.
; The Code and InitCode segments are saved in the file while the
; Buffer is thrown away.
; By using the 'align' parameter together with 'startAfter' you align the default memory block.

.segmentdef Code
[start=$8000]
.segmentdef Virtual100 [startAfter= "Code", align=$100, virtual]
.segment Code "Some code"
    ldx #$ff
    lda table,x
.segment Virtual100 "Table"
table: .fill $100,0
```

## References
- "segment_naming_and_example_project" — expands on how source separation maps to memory and segment naming conventions