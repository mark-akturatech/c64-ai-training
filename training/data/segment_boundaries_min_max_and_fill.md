# Kick Assembler: .segment min/max, fill and fillByte (enforce PRG size)

**Summary:** Explains Kick Assembler .segment parameters min and max to enforce assembled address ranges (e.g., $0801..$0880), behavior when the assembled code exceeds those limits (error), and the fill / fillByte options to pad unused bytes inside the range. Shows example for producing a small 128‑byte competition .prg and notes overlap detection.

**.segment min / max / fill / fillByte**
- .segment min and max constrain the assembled segment to a specified address range; the assembler computes the final size against these bounds. Use hex addresses (e.g., $0801) and you may use simple arithmetic in expressions (e.g., $0880-2).
- If assembled output would exceed the max (or start before min), the assembler raises an error — the build fails rather than silently truncating.
- The fill flag instructs the assembler to pad any unused bytes between the actual assembled data and the declared min/max boundary. The padding byte can be set with fillByte.
- Typical syntax examples:
  - .segment Main [min=$0801, max=$0880-2, outPrg="out.prg"]  ; enforce size limit (example: 128‑byte competition)
  - .segment Main [min=$0801, max=$0880-2, fill, fillByte=$00, outPrg="out.prg"]  ; pad unused bytes with $00
- Use fill when you need a fixed-size output (competition limits, ROM image layout). If you omit fill, unused space remains unfilled (the output will be smaller than the declared range), but exceeding max still triggers an error.
- Kick Assembler also detects overlapping memory blocks when all blocks of a segment are assembled; overlaps normally produce an error (no silent merging).

## Source Code
```asm
; Example: restrict size (128 bytes entry)
.segment Main [min=$0801, max=$0880-2, outPrg="out.prg"]

; Pixel/character rendering fragment (example code placed inside constrained segment)
; (labels like CHARGEN, CHARSET, SCREEN assumed defined elsewhere)
pix:
    lda CHARGEN        ; Start char line
    ldx #7
    asl
    ; Start pixel
    rol CHARSET,x
    dex
    bpl npi
    inc ch+1           ; Next char line
    bne ch4
    inc pix+2          ; Inc both high bytes
    inc ch+2
    bne ch4
    ; Run until CHARGEN is $0000

ee:
    lda #$37
    sta $1
    cli
    lda #SCREEN/$40|CHARSET/$400
    sta $d018
    rts
```

```text
; Alternate .segment example with fill
.segment Main [min=$0801, max=$0880-2, fill, fillByte=$FF, outPrg="out.prg"]
```

```text
10.12. Overlapping memory block
When all blocks of a segment are assembled, any overlaps are detected. Normally overlaps will give an error
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II video registers (includes $D018 memory control register for screen/charset pointers)

## References
- "rotated_rom_font_128b_example" — expands on example of enforcing small .prg size and using fill/fillByte