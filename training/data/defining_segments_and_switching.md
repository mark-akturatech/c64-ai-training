# Kick Assembler: .segmentdef and .segment usage

**Summary:** Shows Kick Assembler segment creation with .segmentdef and switching with .segment, controlling segment start addresses (start=$1000), writing output files with outPrg/outBin, and inspecting segment contents with the -bytedump option (ByteDump.txt).

## Defining and selecting segments
Use .segmentdef to declare named segments (no code is emitted yet). Use .segment to select a segment and begin assembling into its current memory block. You can switch back and forth between segments at any time; each segment retains its current location and content.

- Declare segments:
  - .segmentdef MySegment1
  - .segmentdef MySegment2 [start=$1000]  (optional start parameter sets the segment's origin)
- Select and place code into a segment:
  - .segment MySegment1
  - Use *=$nnnn or other origin directives while the segment is current to position code in that segment's address space
- You can later:
  - .segment MySegment2
  - continue assembling into MySegment2
  - .segment MySegment1
  - resume adding to MySegment1 at its current location

## Inspecting segment contents: -bytedump / ByteDump.txt
If you don't output the segments to files, you can inspect what assembled bytes reside in each segment by running Kick Assembler with the -bytedump option. That creates ByteDump.txt containing per-segment byte listings and disassembly. Example byte dump for the segment example below is shown in the Source Code section.

## Writing segments to files: outPrg and outBin
To produce program or binary files directly from a segment, specify output parameters on the .segment directive:

- .segment Name [outPrg="file.prg"] — writes a PRG with a 2-byte load address suitable for C64 programs.
- .segment Name [outBin="file.bin"] — writes a raw binary file (no load address).

Example:
.segment Code [outPrg="colors.prg"]
*=$1000
inc $d020
jmp *-3

This makes the Code segment connected to the colors.prg output.

## The Default segment
If you never switch segments (no .segment), code assembles into the Default segment, which is connected to the standard output file. The Default segment may be empty if you only used other named segments. To explicitly return to the default segment after assembling in other segments, use:
.segment Default

## Source Code
```asm
; Example sequence from the documentation: define two segments then emit code into them
.segmentdef MySegment1
.segmentdef MySegment2 [start=$1000]

.segment MySegment1
*=$4000
ldx #30
; ...more code...
; (example continues below)

; Later switch to MySegment2
.segment MySegment2
inc $d021
jmp *-3

; Example for producing a PRG
.segment Code [outPrg="colors.prg"]
*=$1000
inc $d020
jmp *-3

; Return to Default segment
.segment Default
```

```text
ByteDump.txt excerpt (produced with -bytedump):

******************************* Segment: Default *******************************
***************************** Segment: MySegment1 ******************************
[Unnamed]
4000: a2 1e
- ldx #30
4002: ee 21 d0 - inc $d021
4005: ca
- dex
4006: d0 fa
- bne l1
4008: ee 20 d0 - inc $d020
400b: 4c 08 40 - jmp *-3
***************************** Segment: MySegment2 ******************************
[MySegment2]
1000: ee 21 d0 - inc $d021
1003: 4c 00 10 - jmp *-3
```

## References
- "memory_blocks_and_default_block_examples" — expands on memory blocks formed from segments and default block behavior
