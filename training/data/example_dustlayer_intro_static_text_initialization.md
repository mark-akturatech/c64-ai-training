# Example: Static Text Initialization

**Project:** dustlayer_intro - Color wash intro with SID music, raster interrupts, and animated text

## Summary
Copies 40 characters from two data tables into screen RAM at specific positions ($0590 and $05E0). Uses indexed addressing with X register to loop through all 40 columns per line.

## Key Registers
- $0590/$05E0 - VIC-II Screen RAM - text placement locations

## Techniques
- indexed memory copy
- table-driven text output

## Hardware
VIC-II

## Source Code
```asm
;============================================================
; write the two line of text to screen center
;============================================================


init_text  ldx #$00          ; init X-Register with $00
loop_text  lda line1,x      ; read characters from line1 table of text...
           sta $0590,x      ; ...and store in screen ram near the center
           lda line2,x      ; read characters from line1 table of text...
           sta $05e0,x      ; ...and put 2 rows below line1

           inx 
           cpx #$28         ; finished when all 40 cols of a line are processed
           bne loop_text    ; loop if we are not done yet
           rts
```
