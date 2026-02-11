# Kick Assembler — Segment parameters (part 1)

**Summary:** Reference for Kick Assembler segment parameters: align ($100), allowOverlap, dest ("1541"), fill / fillByte ($88), hide, marg1..marg5 (modifier arguments), min ($C000) and max ($CFFF), modify ("BasicUpstart"), outBin ("myfile.bin"). Includes example parameter usage.

**Parameters**

This chunk documents segment-level parameters available in Kick Assembler segment declarations and their short semantics and examples found in the source.

- align
  - Description: Aligns the default memory block for the segment.
  - Example: align=$100

- allowOverlap
  - Description: Allows the segment's memory block to overlap other segments (permits overlapping blocks).
  - Example: allowOverlap (boolean flag; usage shown without value in source)

- dest
  - Description: Sets the destination identifier used for debugging or output labeling.
  - Example: dest="1541"

- fill
  - Description: Fills unused bytes between min and max addresses of the segment.
  - Example: fill (boolean flag; usage shown without value in source)

- fillByte
  - Description: Byte value used by fill to populate unused space.
  - Example: fillByte=$88

- hide
  - Description: Hides the segment from memory dumps.
  - Example: hide (flag)

- marg1, marg2, ..., marg5
  - Description: Generic argument slots passed to a modifier assigned to the segment.
  - Example: marg1=$1000, marg2="hello"

- min
  - Description: Sets the minimum address (start) of the segment.
  - Example: min=$c000

- max
  - Description: Sets the maximum address (end) of the segment.
  - Example: max=$cfff

- modify
  - Description: Assigns a modifier to the segment (modifier receives marg1..marg5).
  - Example: modify="BasicUpstart"

- outBin
  - Description: Outputs a binary file with the content of the segment. The filename can include `%o`, which will be replaced with the root filename.
  - Example: outBin="myfile.bin"

## Source Code
```text
; Example segment declaration fragments from source (illustrative grouping)
.segment MySegment {
  align = $100
  allowOverlap
  dest = "1541"
  fill
  fillByte = $88
  hide
  marg1 = $1000
  marg2 = "hello"
  min = $C000
  max = $CFFF
  modify = "BasicUpstart"
  outBin = "myfile.bin"
}
```

## References
- "segment_parameters_part2" — continuation and expansion of the segment parameter list.
- Kick Assembler Manual: [List of segment parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html)
- Kick Assembler Manual: [Boundaries](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s11.html)
- Kick Assembler Manual: [Where did the output go?](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s04.html)