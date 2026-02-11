# Kick Assembler: patching a PRG by stacking Base and Patch segments (allowOverlap)

**Summary:** Example Kick Assembler fragment demonstrating .file with segments="Base,Patch", .segment with prgFiles to load a base PRG, using a Patch segment placed on top to insert a JMP at $8021, and the allowOverlap option to permit overlapping memory blocks.

## Example and behavior
This chunk shows how to create an output PRG that is built from a loaded base PRG and a small patch segment placed on top of it:

- .file name and segments: .file [name="Out.prg", segments="Base,Patch", allowOverlap] creates an output file Out.prg and declares the order of segments. Segments are processed in the order listed; later segments (Patch) can overwrite data from earlier segments (Base).
- Loading a PRG into a segment: .segment Base [prgFiles="basefile.prg"] loads the contents of basefile.prg into the Base segment at the addresses encoded in that PRG.
- Empty patch segment: .segment Patch [] defines a segment intended for modifications; because Patch follows Base in the .file segments list, data emitted into Patch will overlay the Base data in the final Out.prg.
- allowOverlap: The allowOverlap flag on .file permits the Patch segment to overlap/overwrite addresses already provided by Base (see referenced overlapping_memory_block for details).
- Origin and data emission: Using *= sets the current origin. A quoted string emits its ASCII bytes at the current origin. Assembly instructions like jmp $8044 emit their machine code at the current origin.
- Multiple memory blocks: The example shows additional blocks (origin changes to $1000 and $4000), illustrating that a PRG can contain multiple non-contiguous memory blocks; the final file will contain the merged data respecting segment order and overlap rules.

This example inserts a JMP to $8044 at file address $8021 by placing a quoted string and then emitting the jmp instruction in the Patch segment, while other code/data is defined in different origins/blocks.

## Source Code
```asm
.file [name="Out.prg", segments="Base,Patch", allowOverlap]

.segment Base [prgFiles="basefile.prg"]

.segment Patch []
*=$8021
"Insert jump"
jmp $8044

*=$1000
lda #1
sta $d020
rts

// Start of memoryblock 2 (unnamed)

*=$4000
"block3"
```

## References
- "overlapping_memory_block" — expands on allowOverlap for patches
