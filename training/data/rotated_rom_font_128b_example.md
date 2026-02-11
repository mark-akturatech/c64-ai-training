# Kick Assembler: file/segment patching, allowOverlap, and BasicUpstart modifier

**Summary:** Describes Kick Assembler's .file/.segment/.segmentdef workflow, the allowOverlap option for patching binary PRG files, memory-block priority rules, and the built-in BasicUpstart segment modifier that inserts a BASIC stub at $0801. Includes example snippets and a small memory map; mentions VIC-II register use (e.g., $D020).

**Overview and behavior**

- **.file/.segment/.segmentdef:** Kick Assembler can place existing PRG files into a build using the .file directive and define segments with .segment/.segmentdef to inject or patch bytes at specific addresses.
- **allowOverlap:** When a .file directive is created with the allowOverlap flag, the intermediate segment created from the file may be overlapped by other segments. Overlapping blocks are resolved by priority: blocks from the segment added later (higher priority) override earlier blocks. Overlapping blocks are cut so only bytes from the highest-priority block(s) are returned.
- **Use case:** Patching an existing binary without rebuilding it from source — keep the original file as a base segment, add a small Patch segment with changed bytes, and write the combined output to a new PRG.
- **Segment modifiers:** A segment can be modified before being consumed by other build stages. Modifiers take a list of memory blocks and return a modified list. The built-in BasicUpstart modifier adds a BASIC upstart program (a small BASIC loader at $0801) that jumps to a configured address. By convention, modifier parameters are named with a leading underscore (e.g., _start).
- **Priority/order:** The order of segments in the .file or .segment list determines which overlapping block wins — the later segment wins.

**Examples and notes**

- **Example usage shows:**
  - Creating a combined patched PRG where the original base.prg occupies $3800-$39FF and two patches insert bytes at $3802 and $38C2.
  - Using .segment with modify="BasicUpstart" and providing _start to tell BasicUpstart where the BASIC stub should jump.

- **The example build shows direct use of a VIC-II register write (inc $D020) inside a segment payload (changing the border color).** This is normal machine code assembled into the target address.

- **Conventions:**
  - Modifier arguments use a leading underscore (e.g., _start).
  - .file [name="patched.prg", segments="Base,Patch", allowOverlap] creates an output file from segments Base and Patch, with overlapping allowed so Patch can overwrite Base bytes where addresses overlap.

## Source Code
```asm
// Patch example: base + patch, allow overlap
.file [name="patched.prg", segments="Base,Patch", allowOverlap]
.segmentdef Base [prgFiles="data/base.prg"]
.segmentdef Patch []

// Patch Code
.segment Patch
*=$3802 "Insert jmp"
jmp $3fe0
*=$38c2 "Insert lda #$ff"
lda #$ff
```

```text
Memory map (from example):

Base-segment:
$3800-$39FF base.prg

Patch-segment:
$3802-$3804 Insert jmp
$38C2-$38C3 Insert lda #$ff
```

```asm
// Example of BasicUpstart modifier usage:
// .file with a single Code segment modified to include a BASIC upstart at $0801
.file [name="test.prg", segments="Code"]
.segment Code [start=$8000, modify="BasicUpstart", _start=$8000]
inc $d020
jmp *-3
```

```text
Example directives and labels (mentioned):
.segment Main [min=$0801, max=$0880-2, outPrg="out.prg"]
.label SCREEN = $0400
.label CHARGEN = $D000
.label CHARSET = $3000
```

```text
Table 10.1. Built-in modifiers:

Name         | Parameters | Description
-------------|------------|------------
BasicUpstart | _start     | Adds a memory block with a BASIC upstart program that points to the given start address.
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II control registers (includes $D020 border color register used in examples)

## References
- [Kick Assembler Manual: Segment Modifiers](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s13.html)
- [Kick Assembler Manual: Boundaries](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s11.html)
- [Kick Assembler Manual: List of Segment Parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html)
- [Kick Assembler Manual: 3rd Party Java Plugins](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Plugins.html)
- [Kick Assembler Manual: Modifiers](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Modifiers.html)

## Labels
- SCREEN
- CHARGEN
- CHARSET
