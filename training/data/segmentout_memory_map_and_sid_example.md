# Kick Assembler: .segmentout usage and memory-map notes

**Summary:** Describes Kick Assembler's `.segmentout` directive behavior and parameters, including `fill`, `fillByte`, `sidFiles`, and others. Explains how the directive influences the reported memory-map output, detailing default segment entries and specific segments like `ZeroPage_Code` at `$0010–$0015`. Demonstrates how intermediate parameters (e.g., `sidFiles`) can be passed to `.segmentout` to place data at alternate addresses.

**Description**

The `.segmentout` directive sets the destination information for a segment, enabling external tools (e.g., C64debugger) to determine where to place or export that segment in the target memory map. The produced memory-map output from Kick Assembler can list default segment entries and, in this example, a `ZeroPage_Code` segment occupying `$0010–$0015`.

Parameters available for `.segmentout` include:

- `fill` — When enabled, Kick Assembler fills unused bytes between the segment's minimum and maximum addresses with the specified fill byte.
- `fillByte` — The byte value to use for fill; if not specified, it defaults to zero.
- `sidFiles` — Includes the data of a SID file as a memory block.
- `prgFiles` — Includes program files as memory blocks.
- `segments` — Includes memory blocks from other segments.
- `min` — Sets the minimum address of the segment.
- `max` — Sets the maximum address of the segment.
- `allowOverlap` — Allows overlapping memory blocks.
- `hide` — Hides the segments in memory dumps.
- `modify` — Assigns a modifier to the segment.
- `marg1` to `marg5` — Arguments for a modifier.
- `outBin` — Outputs a bin-file with the content of the segment.
- `outPrg` — Outputs a prg-file with the content of the segment.
- `start` — Sets the start of the default memory block to the given expression.
- `startAfter` — Makes the default memory block start after the given segment.
- `align` — Aligns the default memory block to a given page size; used together with `startAfter`.
- `virtual` — Makes all the memory blocks in the segment virtual.
- `dest` — Sets the destination of the segment (e.g., `dest="1541"`); this is information for external programs like C64debugger.

Example behavior demonstrated: Setting the assembly origin (`*=$8000`) and invoking `.segmentout` with a `sidFiles` parameter results in the segment being placed/annotated to reference "data/music.sid" rather than the default location.

## Source Code

```asm
* = $8000
.segmentout [sidFiles="data/music.sid"]
; (example: sets destination and attaches sidFiles parameter)

; Parameters shown elsewhere:
; fill
; fillByte = $88
```

## References

- "segmentout_directive_and_zeropage_example" — expands on memory map result of `.segmentout`
