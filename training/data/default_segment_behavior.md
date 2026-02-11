# Kick Assembler: "Default" segment

**Summary:** Kick Assembler places code and data into the 'Default' segment when no `.segment` directive is active; this segment is connected to the assembler's standard output file. Use `.segment Default` to return assembly output to that segment.

**Behavior and usage**

- If you do not explicitly select a segment with `.segment`, all subsequent assembly is placed into the 'Default' segment.
- The 'Default' segment is connected to the assembler's standard output file (bytes assembled into Default are written to the configured output).
- To resume emitting to the Default segment after switching segments, use:
- The example below demonstrates typical code emitted into Default. Labels and data referenced by the snippet must be defined elsewhere in the program or in other segments.

## Source Code

  ```asm
  .segment Default
  ```

```asm
loop:
  lda text,x
  cmp #$ff
  beq out
  sta $0400,x
  inx
  jmp loop
out:
```

## Source Code

  ```asm
  .segmentdef Default [start=$1000]
  ```

## References

- "segments_introduction_and_overview" — expands on default behavior without segments

**Notes**

- The label `loop` is defined at the beginning of the code snippet.
- The symbol/label `text` referenced by `lda text,x` must be defined elsewhere in the program or in other segments.
- The `Default` segment is connected to the assembler's standard output file. To specify the starting address of the default memory block, use the `start` parameter when defining the segment. For example:
  This sets the start address of the default memory block to `$1000`. ([theweb.dk](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Segments.html?utm_source=openai))
