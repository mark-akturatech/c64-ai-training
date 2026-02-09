# Buffer-Pointer Program (B-P) — Line mappings and alternate formats

**Summary:** BASIC program fragment describing a buffer-pointer (B-P) command that sets channel 2's pointer to buffer position 144 and a loop (lines 200–280) that builds a disk name byte-by-byte while forcing bytes into the printable ASCII range; includes alternate PRINT#15 formats for issuing B-P.

## Line mappings
- Line 190: Sets channel 2 pointer to position 144 in the buffer area (B-P sets pointer to buffer offset 144).
- Lines 200–280: Concatenate/build the disk name one byte at a time, enforcing that each byte falls within the printable ASCII range (the loop "jams" characters into printable range).
- Line 76: Mentioned in the source but no descriptive text provided.

**[Note: Source may contain an error — alternate PRINT#15 example shows malformed quotation/semicolon placement.]**

## Source Code
```basic
190  Sets  channel  2  pointer  to  position  144  in  the  buffer  area.

200-280  Concatenate  (build)  the  disk  name  one  byte  at  a  time  by  jamming  it 
within  printable  ASCII  range. 

76

The  alternate  formats  of  the  buffer-pointer  command  in  line  190  are: 
PRINT#15, "B-P: "2; 144 

PRINT#15, "B-P: 2, 144"
```

## References
- "buffer_pointer_example_program" — expanded line-by-line mapping and full program listing (external reference suggested by source)