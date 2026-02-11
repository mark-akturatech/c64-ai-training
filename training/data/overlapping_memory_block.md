# Kick Assembler — segment overlap & intermediate segments (allowOverlap)

**Summary:** Explains Kick Assembler segment overlap detection and the allowOverlap parameter for .file/.segment/.segmentdef usage, intermediate segments (implicit segments created when passing memory blocks between directives), and the .segmentout directive for emitting intermediate-segment bytes into the current memory block.

**Overlap detection and allowOverlap**
Kick Assembler detects when two memory blocks (segments) overlap and, by default, raises an error to prevent accidental patching of existing code/data. The .file/.segment/.segmentdef machinery can be instructed to permit intentional overlaps by supplying the allowOverlap parameter (useful for patching existing PRG files).

- Example usage (directive-level): `.file [name="patched.prg", segments="Base,Patch", allowOverlap]`
  - This creates an output file named `patched.prg` and defines intermediate segments named "Base" and "Patch".
  - `allowOverlap` allows the assembler to accept overlapping memory blocks instead of erroring.

Overlap resolution when multiple blocks write to the same address:
- Overlapping bytes are resolved by priority: the segment/block added last (later in the processing order) wins — its bytes replace earlier ones at overlapping addresses.
- This deterministic "last-wins" rule lets you layer patches on top of a base binary by controlling segment order.

Notes on patch workflow:
- Use `.segmentdef` to declare a segment bound to an existing PRG or binary (e.g., `prgFiles="data/base.prg"`).
- Create a separate `.segment` (e.g., "Patch") that places replacement code/data into the same addresses (using `*=` to position output) — with `allowOverlap` enabled the assembler will accept this.
- Typical patch code inserts jumps/LDAs/etc. into the overlapping addresses to redirect execution or modify data.

**BasicUpstart**
The `BasicUpstart` macro creates a memory block containing a small BASIC program that points to a given start address, enabling PRGs to auto-run on the C64. This block is an ordinary memory block and participates in segment/overlap behavior like any other block.

- Example usage:
  This sets up a BASIC program that, when loaded, executes a machine code routine starting at address `$0810`. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch14s02.html?utm_source=openai))

**Intermediate segments**
When you pass segments to other directives (beyond `.segment` and `.segmentdef`), Kick Assembler often creates an implicit "intermediate segment" which forwards memory blocks. Many directives accept the same set of segment parameters; using an intermediate segment gives access to the same functionality without explicitly declaring a `.segment`.

- Example: `.file [name="myfile.prg", segments="Code,Data", sidFiles="music.sid"]`
  - 'name' is special for `.file`; other parameters follow the intermediate-segment parameter set.
- The complete list of intermediate parameters is documented in the "List of segment parameters" section (see References) and governs behavior such as output format, base addresses, alignment, and allowOverlap.

**The .segmentout directive**
`.segmentout` places the bytes from an intermediate segment into the current memory block at the current assembly position. Uses:
- Reallocate or emit code/data from one segment into another (similar purpose to `.pseudopc`).
- Output data in alternative formats or to different output streams by copying bytes from an intermediate segment.

Typical pattern:
- Build/collect bytes in an intermediate segment during earlier passes.
- Use `.segmentout` to insert those bytes into the current segment (or file) at the desired location.

Example demonstrating `.segmentout` copying an intermediate segment into zero page:
In this example, the `ZeroPage_Code` segment is defined to reside in the zero page memory area. The `.segmentout` directive copies the contents of `ZeroPage_Code` into the `Main_Code` segment, allowing execution of code in the zero page. ([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch10s02.html?utm_source=openai))

## Source Code

  ```asm
  *= $0801 "Basic Upstart"
  BasicUpstart(start)    // 10 SYS $0810

  *= $0810 "Program"
  start:
      inc $d020
      inc $d021
      jmp start
  ```

```asm
.segmentdef ZeroPage_Code [start=$0010, max=$0015, fill]
.segmentdef Main_Code [start=$0801]

.segment ZeroPage_Code
    lda #$00
    sta $d020
    rts

.segment Main_Code
    .segmentout [segments="ZeroPage_Code"]
    jmp $0010
```

```asm
; Example: allowOverlap with a base PRG and a patch segment
.file [name="patched.prg", segments="Base,Patch", allowOverlap]

.segmentdef Base [prgFiles="data/base.prg"]

.segment Patch []
    *= $8021 "Insert jump"
    jmp $8044
```
([theweb.dk](https://theweb.dk/KickAssembler/webhelp/content/ch10s02.html?utm_source=openai))

**List of segment parameters**
The following table lists the parameters that can be used with segments:

| Parameter   | Example                  | Description                                                                 |
|-------------|--------------------------|-----------------------------------------------------------------------------|
| align       | align=$100               | Aligns the default memory block to a given page size. Used with 'startAfter'|
| allowOverlap| allowOverlap             | Allows overlapping memory blocks                                            |
| dest        | dest="1541"              | Sets the destination of the segment (info for external programs like debuggers)|
| fill        | fill                     | Fills unused bytes between min and max with the fill byte                   |
| fillByte    | fillByte=$88             | Sets the value of the fill byte (default is zero)                           |
| hide        | hide                     | Hides the segments in memory dumps                                          |
| marg1–marg5 | marg1=$1000, marg2="hello"| Arguments for a modifier                                                    |
| max         | max=$cfff                | Sets the maximum address of the segment                                     |
| min         | min=$c000                | Sets the minimum address of the segment                                     |
([theweb.dk](https://www.theweb.dk/KickAssembler/KickAssembler.pdf?utm_source=openai))

## References
- "segment_patch_example" — expands on the patch mechanism using allowOverlap and includes fuller examples of patch segments and ordering.