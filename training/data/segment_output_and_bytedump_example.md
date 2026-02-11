# Kick Assembler: segments and -bytedump

**Summary:** Explains Kick Assembler segment declarations (.segment, .segmentdef, .memblock), the fact that declaring segments alone produces no output, how .file emits segments to a file, and the -bytedump command-line option that creates ByteDump.txt listing bytes per segment.

**Segment behavior**
Defining segments (.segment / .segmentdef / .memblock) only creates assembler-internal segments and does not by itself produce output files or a PRG. You must direct the assembler to write segments to disk (for example with a .file directive) or use a tool/option that emits segment contents (for example the command-line -bytedump which generates ByteDump.txt).

.quick equivalences (literal forms shown in source)
- .segment Code "My Code" is equivalent to:
  - .segment Code
  - .memblock "My Code"

**.segmentdef and .file usage**
.segmentdef declares a segment and may set attributes such as start address:
- Example: .segmentdef Code [start=$0900]

.file is used to specify output file parameters and which segments to write. The source shows a .file example with attributes:
- name (output filename)
- segments (comma-separated segment names)
- modify (modifier name, as used by Kick Assembler features)
- marg1 (an example numeric attribute $0900 in the example)

Example .file invocation from source:
.file [name="segments.prg", segments="Code,Data", modify="BasicUpstart", marg1=$0900]

**-bytedump (ByteDump.txt)**
The -bytedump command-line option produces a ByteDump.txt file listing the bytes emitted per segment, including segment name, addresses, and opcode bytes. Below is an example of the ByteDump.txt content for segments "Default", "MySegment1", and "MySegment2":


## Source Code

```
******************************* Segment: Default *******************************
***************************** Segment: MySegment1 ******************************
[Unnamed]
4000: a2 1e     - ldx #30
4002: ee 21 d0  - inc $d021
4005: ca        - dex
4006: d0 fa     - bne l1
4008: ee 20 d0  - inc $d020
400b: 4c 08 40  - jmp *-3
***************************** Segment: MySegment2 ******************************
[MySegment2]
1000: ee 21 d0  - inc $d021
1003: 4c 00 10  - jmp *-3
```

```asm
.segment Code "My Code"
// Is the same as this
.segment Code
.memblock "My Code"

To demonstrate this style is here given a larger example. Some of the features are first covered later. :
.segmentdef Code [start=$0900]
.segmentdef Data [start=$8000]
.file [name="segments.prg", segments="Code,Data", modify="BasicUpstart", marg1=$0900]
//-------------------------------------------------------// Main
//-------------------------------------------------------.segment Code "Main"
jsr colorSetup
jsr textSetup
rts
//-------------------------------------------------------// Color
//-------------------------------------------------------.segment Code "Color Setup"
colorSetup:
lda colors
sta $d020
lda colors+1
sta $d021
```

## References
- "writing_segments_to_files" — expands on how to write segments to files