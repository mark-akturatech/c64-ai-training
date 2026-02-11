# Kick Assembler — Segment Parameter Reference (Part 2)

**Summary:** Reference for Kick Assembler segment parameters: max/min (segment address limits), modify (assigns a segment modifier), outBin/outPrg (emit segment as .bin/.prg; %o root-filename replacement), prgFiles (import PRG files as memory blocks), segments (include other segments), sidFiles (include .sid file data), start (set default memory block start address). Contains examples and literal directive syntax.

**Parameters (Concise)**

**max / min**
- Set the segment address bounds.
- Examples:
  - `max=$cfff` (set max address)
  - `min=$c000` (set min address)
- These limit where the segment's output data will be placed in the output address space.
- If a block exceeds these boundaries, an error occurs. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s11.html?utm_source=openai))

**modify**
- Syntax example: `modify="BasicUpstart"`
- Assigns a modifier name (string) to the segment so it will be processed/modified by that modifier.
- Modifiers can alter the segment's memory blocks before they are passed to consumers.
- Example:
  Here, the `BasicUpstart` modifier adds a memory block at $0801 with a BASIC upstart program that jumps to the specified start address. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s13.html?utm_source=openai))

**outBin**
- Syntax example: `outBin="myfile.bin"`
- Outputs the content of the segment to a raw binary (.bin) file.
- Filename substitution: `%o` in the filename is replaced with the root filename.
- Example:
  If the assembler is run with a source file named `Source27.asm`, this will output to `Source27.bin`. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html?utm_source=openai))

**outPrg**
- Syntax example: `outPrg="myfile.prg"`
- Outputs the content of the segment to a PRG (.prg) file (Commodore PRG format).
- Filename substitution: `%o` is replaced with the root filename.
- Example:
  If the assembler is run with a source file named `Source27.asm`, this will output to `Source27.prg`. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch11s03.html?utm_source=openai))

**prgFiles**
- Lists PRG files to be imported and included as memory blocks in the segment.
- Syntax example: `prgFiles="data/music.prg, data/charset2x2.prg"`
- PRG files contain a start address (first two bytes) and data.
- Example:
  This imports the specified PRG files as memory blocks within the segment. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch10s09.html?utm_source=openai))

**segments**
- Syntax example: `segments="Code, Data"`
- Includes memory blocks from other named segments into this segment's output.
- Example:
  This combines the memory blocks from the `Code` and `Data` segments into `Combi1`. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch10s08.html?utm_source=openai))

**sidFiles**
- Syntax example: `sidFiles="music.sid"`
- Includes the data of a SID file as a memory block inside the segment.
- Example:
  This includes the SID file `music.sid` as a memory block in the `Main` segment and outputs it as `out.prg`. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Segments.html?utm_source=openai))

**start**
- Syntax example: `start=$1000`
- Sets the start address of the default memory block to the given expression.
- Example:
  This sets the default memory block's start address to $1000 for `MySegment`. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch10s03.html?utm_source=openai))

## Source Code

  ```assembly
  .segment Code [start=$8000, modify="BasicUpstart", _start=$8000]
  inc $d020
  jmp *-3
  ```

  ```assembly
  .file [name="%o.bin", segments="Code"]
  ```

  ```assembly
  .file [name="%o.prg", segments="Code"]
  ```

  ```assembly
  .segmentdef Misc1 [prgFiles="data/music.prg, data/charset2x2.prg"]
  ```

  ```assembly
  .segmentdef Combi1 [segments="Code, Data"]
  ```

  ```assembly
  .segment Main [sidFiles="data/music.sid", outPrg="out.prg"]
  ```

  ```assembly
  .segmentdef MySegment [start=$1000]
  ```


```assembly
.segmentdef Data [start=$c000, min=$c000, max=$cfff]
.fill $1800, 0  // Error since range is $c000-$d7ff
```

```assembly
.segment Code [start=$8000, modify="BasicUpstart", _start=$8000]
inc $d020
jmp *-3
```

```assembly
.file [name="%o.prg", segments="Code"]
```

```assembly
.segmentdef Misc1 [prgFiles="data/music.prg, data/charset2x2.prg"]
```

```assembly
.segmentdef Combi1 [segments="Code, Data"]
```

```assembly
.segment Main [sidFiles="data/music.sid", outPrg="out.prg"]
```

```assembly
.segmentdef MySegment [start=$1000]
```

## References

- [Kick Assembler Manual: List of Segment Parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html)
- [Kick Assembler Manual: Segment Modifiers](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s13.html)
- [Kick Assembler Manual: The File Directive](https://www.theweb.dk/KickAssembler/webhelp/content/ch11s03.html)
- [Kick Assembler Manual: Including .prg Files](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s09.html)
- [Kick Assembler Manual: Including Other Segments](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s08.html)
- [Kick Assembler Manual: Including SID Files](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s10.html)
- [Kick Assembler Manual: Segments](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s03.html)