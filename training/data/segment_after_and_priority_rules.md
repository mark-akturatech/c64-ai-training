# Kick Assembler: startAfter behavior and segment example

**Summary:** Explains Kick Assembler's startAfter computation: it uses the last defined memory block (the default block or a user-defined block set with `*=`). Blocks brought in via `IMPORT` or file `INCLUDE` are not considered when computing `startAfter`. Includes a short segment example using `BasicUpstart2(start)`.

**startAfter behavior**
startAfter is computed from the last explicitly defined memory block in the assembler input. This means:
- If you have not redefined the current location with `*=`, the assembler uses the default memory block.
- If you set a block via `*=`, that user-defined block becomes the basis for startAfter.
- Blocks that are added by other mechanisms (imported or included files) are ignored when computing startAfter.

**Segments**
The example shows a segment declaration and a minimal startup sequence using `BasicUpstart2(start)` and label `start`. No further segment/linker details are provided in the source.

## Source Code
```asm
; Segment example: BasicUpstart2(start)
BasicUpstart2(start)
start:

    sei
    lda #$00
    tax
    tay
    jsr $1000

loop:
    jmp loop
```

## References
- "align_and_virtual_memory_blocks" — alignment and virtual usage details