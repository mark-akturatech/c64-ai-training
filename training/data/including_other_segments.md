# Kick Assembler: .segmentdef 'segments' Parameter and Segment Boundaries

**Summary:** This document describes Kick Assembler's `.segmentdef` directive, focusing on the `segments` parameter (e.g., `.segmentdef Combi1 [segments="Code, Data"]`), the behavior when including a segment into multiple segments, combining included segments with inline code or commands, and controlling segment address boundaries using `start`, `min`, `max`, and the `fill` parameter. Examples include usage with VIC-II registers (`$D012`, `$D020`) and a segment range example (`$C000-$CFFF`).

**Using the 'segments' Parameter in .segmentdef**

The `.segmentdef` directive supports an optional `segments` parameter that allows a segment to include the contents of other segments. Syntax example:

- `.segmentdef Combi1 [segments="Code, Data"]`

Effects and notes:

- A single segment (e.g., "Data") may be included in multiple other segments (e.g., both "Combi1" and another segment).
- The including segment can contain additional code or assembler directives alongside the included segments; inclusion does not prohibit adding more content directly inside the `.segmentdef`.
- This mechanism is appropriate for combining predefined memory blocks (or imported PRG segments) at assembly time into a composed segment.

**Boundaries: start, min, max, and fill**

- You may specify segment placement using `start` (start address) and enforce allowed ranges using `min` and `max` parameters. If any assembled block placed into the segment falls outside the `[min, max]` range, the assembler emits an error.
- Example enforcing a range:

  - `.segment Data [start=$c000, min=$c000, max=$cfff]`
  - `.fill $1800, 0`
  - The example above will error because `.fill $1800` places data beyond `$CFFF` (range `$C000-$D7FF` in total), violating the `max` bound.

- The `fill` parameter can be used to ensure a segment occupies a specific size or site. By setting the `fill` parameter to true, all unused bytes between `min` and `max` are set to the fill byte.

  - Example:

    - `.segment Data [min=$1000, max=$1008, fill]`
    - `*=$1002`
    - `.byte 1,2,3`

    This will generate the following memory content starting at `$1000`:

    - `$1000: 0`
    - `$1001: 0`
    - `$1002: 1`
    - `$1003: 2`
    - `$1004: 3`
    - `$1005: 0`
    - `$1006: 0`
    - `$1007: 0`

    In the above example, the fill byte is zero, but it can be specified with the `fillByte` parameter.

**Integration with PRG Inclusion**

The `segments` parameter is complementary to PRG import features. You can include PRG files into segments and then include those segments into other segments via `.segmentdef segments="..."`.

## Source Code

```asm
cmp $d012
bne loop
inc $d020
jsr $1003
dec $d020
jmp loop
```

```text
.segmentdef Combi1 [segments="Code, Data"]
```

```text
.segment Data [start=$c000, min=$c000, max=$cfff]
.fill $1800, 0

// Error since range is $c000-$d7ff
```

## Key Registers

- $D000-$D02E - VIC-II - main VIC-II registers (includes $D012 raster, $D020 border color)

## References

- Kick Assembler Manual: [10.11. Boundaries](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s11.html)
- Kick Assembler Manual: [10.8. Including other segments](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s08.html)
- Kick Assembler Manual: [10.9. Including .prg files](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s09.html)