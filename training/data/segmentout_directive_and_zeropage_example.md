# Kick Assembler: .segmentout (intermediate segment placement)

**Summary:** Explains Kick Assembler's .segmentout directive and intermediate segment parameters (segments="...", .segment, align, allowOverlap, dest). Shows how to place bytes from an intermediate segment into the current memory block (example: copying code into Zero Page) and how to compute the copied block size with a label.

**Explanation**
.segmentout copies the assembled bytes of one or more intermediate segments into the current memory block (the block being assembled/output at that point). This lets you assemble code/data into an alternate segment (for placement constraints or alternate output) and then embed that segment's bytes into a different memory block (for example, copying an assembled zeropage routine into a program block).

Typical usage pattern:
- Define a label at the point you want the copied bytes to appear (zpCode:).
- Use .segmentout with the segments parameter to select the intermediate segment(s) whose bytes will be emitted into the current block.
- Use a .label expression (zpCodeSize = *-zpCode) to compute the size of the emitted bytes.
- Separately define the intermediate segment with .segment and its parameters (e.g. start=$10 for zeropage placement), containing the actual code/data to be copied.

This pattern is useful for reallocating code/data (reassembling into small segments like ZeroPage) while still producing a single linear output or alternate device images.

**Example usage notes**
- .segmentout accepts a segments parameter listing one or more intermediate segment names (e.g. segments="ZeroPage_Code").
- The intermediate segment must be defined elsewhere with .segment and its parameters (start, align, etc.).
- Use the current location counter (*) and labels to compute sizes of copied blocks (zpCodeSize = *-zpCode).
- The .segment parameters table documents relevant options such as align, allowOverlap, dest, fill, fillByte, hide, marg1 to marg5, max, min, modify, outBin, outPrg, prgFiles, segments, sidFiles, start, startAfter, and virtual. For example:
  - align: Aligns the default memory block to a given page size. Used together with 'startAfter'.
  - allowOverlap: Allows overlapping memory blocks.
  - dest: Sets the destination of the segment. This is information for external programs like C64debugger.
  - fill: Fills unused bytes between min and max with the fill byte.
  - fillByte: Sets the value of the fill byte. If not specified, it will be zero.
  - hide: Hides the segments in memory dumps.
  - marg1 to marg5: Arguments for a modifier.
  - max: Sets the maximum address of the segment.
  - min: Sets the minimum address of the segment.
  - modify: Assigns a modifier to the segment.
  - outBin: Outputs a bin-file with the content of the segment. (%o in the filename will be replaced with the root filename. See the .file directive for an example)
  - outPrg: Outputs a prg-file with the content of the segment. (%o in the filename will be replaced with the root filename. See the .file directive for an example)
  - prgFiles: Includes program files as memory blocks.
  - segments: Includes memory blocks from other segments.
  - sidFiles: Includes the data of a sid file as a memory block.
  - start: Sets the start of the default memory block to the given expression.
  - startAfter: Makes the default memory block start after the given segment.
  - virtual: Makes all the memory blocks in the segment virtual.

## Source Code
```asm
; Main block: emit the bytes of the intermediate ZeroPage_Code segment here
zpCode:
.segmentout [segments="ZeroPage_Code"]
.label zpCodeSize = *-zpCode

; Definition of the intermediate segment that was emitted above
.segment ZeroPage_Code [start=$10]
zpStart:
    inc $d020
    jmp *-3
```

**Additional Examples and Edge-Case Behaviors**

### Multiple Segments and Ordering
When using .segmentout with multiple segments, the order in which segments are listed in the segments parameter determines the order in which their bytes are emitted into the current memory block. For example:


In this case, the bytes from Segment1 will be emitted first, followed by the bytes from Segment2.

### Error Cases
- **Undefined Segment**: If a segment specified in the segments parameter does not exist, Kick Assembler will generate an error indicating that the segment is undefined.
- **Overlapping Memory Blocks**: If the segments being emitted have overlapping memory blocks and the allowOverlap parameter is not set, an error will occur. To allow overlapping, include the allowOverlap parameter:


- **Virtual Segments**: If a segment is marked as virtual, its bytes are not included in the output. Attempting to use .segmentout with a virtual segment will result in no bytes being emitted.

## Source Code

```asm
.segmentout [segments="Segment1, Segment2"]
```

```asm
.segmentout [segments="Segment1, Segment2", allowOverlap]
```


## References
- [Kick Assembler Manual: List of Segment Parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html)
- [Kick Assembler Manual: Including Other Segments](https://theweb.dk/KickAssembler/webhelp/content/ch10s08.html)
- [Kick Assembler Manual: The File Directive](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html)
- [Kick Assembler Manual: Segments](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s03.html)
- [Kick Assembler Manual: Segment Modifiers](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s13.html)
- [Kick Assembler Manual: Some Quick Examples](https://theweb.dk/KickAssembler/webhelp/content/ch10s02.html)