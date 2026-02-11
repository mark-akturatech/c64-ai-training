# Kick Assembler: Memory Blocks and Segments ( *= )

**Summary:** Describes Kick Assembler memory blocks created with the "*=" directive, their properties (start address, optional name, virtual flag), interaction with .segment and .segmentdef, default memory block behavior when code is added without "*=", and segment selection rules.

**Memory blocks created by *= and default blocks**
- The "*=" directive creates a new memory block with properties: start address (required), optional name (string), and an optional "virtual" flag. A memory block is where subsequent assembled code/data is placed for the current segment.
- If you add code while no memory block has been explicitly created with "*=", the assembler creates a default block automatically (commonly starting at a segment-default start address). Using instructions that reference the current location (e.g. jmp *-3) relies on whichever block is currently active.
- Memory blocks belong to a segment. If no segment is selected when a block is created, it is assigned to the "Default" segment.
- You may switch back to a previously selected segment at any time; adding code continues into that segment's current (most recent) memory block rather than creating a new block automatically.
- A .segmentdef defines a segment (optionally with default parameters such as start address). .segment selects the segment for subsequent code. A shorthand allows defining-and-selecting in one step by appending a parameter block to .segment (see next section).
- A segment may only be defined once; attempting to .segmentdef the same name twice is an error.

**Shorthand for defining+selecting a segment**
- These two forms are equivalent:
  - .segment MySegment [start=$1000]  (define and select in one statement)
  - .segmentdef MySegment [start=$1000]
    .segment MySegment
- The shorthand is convenient but remember: .segmentdef may only be used once per segment name.

**Example behavior**
- When you create multiple segments, you can switch between them and add code into each. Each segment keeps track of its current memory block; returning to a segment resumes adding into that block.
- If you define a segment with default parameters (.segmentdef MySegment2 [start=$1000]), the segment's default memory block (used when code is added without an explicit "*=" in that segment) will start at the specified address ($1000 in the example).

**Parameters accepted by .segmentdef and .segment**
Both .segmentdef and .segment directives accept the following parameters:

- **start**: Sets the start address of the default memory block. Example: `[start=$1000]`
- **startAfter**: Makes the default memory block start after the given segment. Example: `[startAfter="Code"]`
- **align**: Aligns the default memory block to a given page size. Used together with 'startAfter'. Example: `[align=$100]`
- **virtual**: Marks all memory blocks in the segment as virtual. Example: `[virtual]`
- **allowOverlap**: Allows overlapping memory blocks. Example: `[allowOverlap]`
- **fill**: Fills unused bytes between min and max with the fill byte. Example: `[fill]`
- **fillByte**: Sets the value of the fill byte. If not specified, it will be zero. Example: `[fillByte=$88]`
- **hide**: Hides the segments in memory dumps. Example: `[hide]`
- **marg1, marg2, ..., marg5**: Arguments for a modifier. Example: `[marg1=$1000, marg2="hello"]`
- **max**: Sets the maximum address of the segment. Example: `[max=$cfff]`
- **min**: Sets the minimum address of the segment. Example: `[min=$c000]`
- **modify**: Assigns a modifier to the segment. Example: `[modify="BasicUpstart"]`
- **prgFiles**: Includes program files as memory blocks. Example: `[prgFiles="data/music.prg, data/charset2x2.prg"]`
- **segments**: Includes memory blocks from other segments. Example: `[segments="Code, Data"]`
- **sidFiles**: Includes the data of a SID file as a memory block. Example: `[sidFiles="music.sid"]`
- **dest**: Sets the destination of the segment (info for external programs like C64Debugger). Example: `[dest="1541"]`
- **outBin**: Outputs a binary file with the content of the segment. Example: `[outBin="myfile.bin"]`
- **outPrg**: Outputs a PRG file with the content of the segment. Example: `[outPrg="myfile.prg"]`

For a complete list and detailed descriptions, refer to the [Kick Assembler Manual, Chapter 10.17](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html).

**Output placement after assembling**
If you compile the previous segment examples, you will find that it produces no output. So where did the code go? The answer is nowhere - we defined segments but didn't direct their content anywhere. However, we can still see their content using the `-bytedump` option on the command line when running KickAssembler. That will generate the file 'ByteDump.txt' with the bytes of the segments. The example from the previous section looks like this:


The simplest way of getting the code to a program file is to specify an 'outPrg' parameter:


If you use the 'outBin' parameter instead, a binary file will be output. In the output chapter, you can see more options for outputting segments to files or disk images.

For more details, refer to the [Kick Assembler Manual, Chapter 10.4](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s04.html).

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

```
.segment Code [outPrg="colors.prg"]

*=$1000
inc $d020
jmp *-3
```

```asm
; Simple examples showing default block vs explicit blocks

; Using default block (no *=)
inc $d020       ; modifies VIC border color using Default segment/block
jmp *-3         ; branches relative to current location in Default block

; Explicit new block at $1000
*= $1000
lda #1
; ... code placed in new block starting at $1000

; Explicit new block with name
*= $4000 "block3"
lda #2
; ... code placed in named block "block3" starting at $4000

; Segment definitions and usage example
.segmentdef MySegment1
.segmentdef MySegment2 [start=$1000]

l1:

; Add code to segment1
.segment MySegment1
*=$4000
ldx #30
inc $d021
dex
bne l1

; Add code to segment2 (Using default block starting in $1000)
.segment MySegment2
inc $d021
jmp *-3

; Switch back to segment1 and add more code.
.segment MySegment1
inc $d020
jmp *-3

; Notes:
; - MySegment1 was defined with default parameters.
; - MySegment2 was defined with a start address that becomes the default for its block ($1000).
; - You can switch back to a segment and continue adding to its current block.
```

## Key Registers
- $D020-$D021 - VIC-II - border color ($D020) and background color ($D021)

## References
- "defining_segments_and_switching" — expands on how blocks are assigned to segments