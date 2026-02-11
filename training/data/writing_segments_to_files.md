# Kick Assembler: .segment with outPrg / outBin

**Summary:** Explains using Kick Assembler's .segment parameters outPrg (writes a .prg file) and outBin (writes a raw binary); shows origin setting (*=$1000), label/data (.byte), and minimal code placement examples.

**Overview**
.segment accepts parameters to cause a segment to be emitted as a file during assembly. Two common parameters are:
- outPrg — emits a Commodore .prg file (Commodore .prg with 2-byte load address).
- outBin — emits a raw binary file (no load address).

Within a segment you can set the assembly origin with *= $HHHH (sets the program counter) and place code or data (e.g. .byte). Labels defined inside a segment become offsets within the produced file.

**Behavior notes**
- Use .segment Name [outPrg="filename.prg"] to assign an output filename for that segment.
- .byte emits literal bytes into the segment file.
- The same segment name may be used with different display titles (e.g. .segment Data "Colors") — the bracketed parameter form is for assembler meta-parameters (output filename).
- outBin behaves like outPrg but writes raw bytes (no two-byte load address).
- Code can set origin with *= $1000 so emitted bytes begin at that address within the assembled address space; the emitted file contains the bytes starting from that origin (the .prg will additionally include the two-byte load address as its first bytes).

## Source Code
```asm
.segment Code [outPrg="colors.prg"]
* = $1000
inc $d020
jmp *-3

rts

.segment Data "Colors"
colors:
    .byte LIGHT_GRAY, DARK_GRAY

;-------------------------------------------------------
; Text setup segment
.segment Code "Text Setup"
textSetup:
    ldx #0
loop:
    lda message,x
    beq done
    sta $0400,x
    inx
    jmp loop
done:
    rts

.segment Data "Message"
message:
    .text "HELLO, WORLD!"
    .byte 0

;-------------------------------------------------------
; Example of outBin usage
.segment Code [outBin="rawcode.bin"]
* = $2000
    lda #$01
    sta $d020
    rts
```
In this example:
- The "colors.prg" file is generated with a load address of $1000, containing code that increments the border color.
- The "rawcode.bin" file is generated without a load address, containing code that sets the border color to a specific value and returns.

## References
- "segment_output_and_bytedump_example" — expands on byte dump vs file output
- Kick Assembler Manual: [Color Constants](https://theweb.dk/KickAssembler/webhelp/content/ch14s04.html)
- Kick Assembler Manual: [List of segment parameters](https://www.theweb.dk/KickAssembler/webhelp/content/ch10s17.html)
