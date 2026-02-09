# Kick Assembler: Assembling Cartridge Banks into a Single Binary (.segment / .segmentdef / .segmentout)

**Summary:** This document provides an example of using Kick Assembler directives `.segment`, `.segmentdef`, and `.segmentout` to assemble multiple cartridge bank segments into a single binary file (`outBin="myfile.bin"`). It includes a small 6502 code snippet that writes to `$D021` (VIC-II border color).

**Overview**

This example demonstrates how to:

- Define multiple memory banks (`BANK1` to `BANK4`) with specific address ranges (`min=$1000, max=$1fff`) and optional fill.
- Use `.segment CARTRIDGE_FILE [outBin="myfile.bin"]` to select a named segment stack that will be written to the specified output file.
- Utilize `.segmentout [segments="BANKn"]` to list logical banks that become parts of the `CARTRIDGE_FILE` output.
- Apply `.segmentdef BANKn [min=$1000, max=$1fff, fill]` to define address ranges and fill behavior for each logical bank.
- Place code into a named bank, constraining it within the defined `min..max` range for that bank.
- Understand that if no `.segment` is selected, code and data are placed on the default segment ("Default").

The example includes a minimal 6502 routine demonstrating typical cartridge-bank code placement and an access to `$D021` (border color).

## Source Code

```asm
.segment CARTRIDGE_FILE [outBin="myfile.bin"]
.segmentout [segments="BANK1"]
.segmentout [segments="BANK2"]
.segmentout [segments="BANK3"]
.segmentout [segments="BANK4"]

.segmentdef BANK1 [min=$1000, max=$1fff, fill]
.segmentdef BANK2 [min=$1000, max=$1fff, fill]
.segmentdef BANK3 [min=$1000, max=$1fff, fill]
.segmentdef BANK4 [min=$1000, max=$1fff, fill]

.segment BANK1
    lda #2
    sta $d021
    rts

.segment BANK2
    lda #3
    sta $d021
    rts

.segment BANK3
    lda #4
    sta $d021
    rts

.segment BANK4
    lda #5
    sta $d021
    rts
```

## Key Registers

- `$D021` - VIC-II - Border color register (writes change the screen border color)

## References

- [Kick Assembler Manual: Segments](https://theweb.dk/KickAssembler/webhelp/content/cpt_Segments.html)
- [Kick Assembler Manual: Including Other Segments](https://theweb.dk/KickAssembler/webhelp/content/ch10s08.html)
- [Kick Assembler Manual: Boundaries](https://theweb.dk/KickAssembler/webhelp/content/ch10s11.html)
- [Kick Assembler Manual: List of Segment Parameters](https://theweb.dk/KickAssembler/webhelp/content/ch10s17.html)