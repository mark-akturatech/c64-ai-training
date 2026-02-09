# BasicUpstart2 (start) — Kick Assembler example

**Summary:** Kick Assembler snippet showing a standard start-up sequence (SEI, LDA #$00, TAX, TAY, JSR $1000), a main loop polling the VIC-II raster ($D012) and manipulating screen/border via $D020; demonstrates embedding code in segments, simple loop/IRQ-style polling and JSR/JSR-return patterns.

## Description
This example is a compact start-up + main loop used with Kick Assembler. It performs the usual early startup steps (SEI, clear A, transfer to X/Y), calls an initialization routine at $1000, then enters a polling loop that samples the VIC-II raster register ($D012). The fragment shows a short character/position update sequence (incrementing a "pix+1" pointer by 8), a setup of the processor port ($0001) with value $32, and preparing Y with 8. Labels "ch" and "npi" are present as segment anchors.

Behavioral highlights:
- SEI is used at start to disable interrupts during initialization.
- JSR $1000 is the init routine entry; another JSR/JSR-return pattern around $1003 is mentioned in the source text (external subroutine for inc/dec of $D020 is referenced).
- Raster polling uses $D012 (VIC-II raster register) to synchronize updates.
- The code manipulates a pointer named pix (pix+1) by adding 8 (typical for character width/stride adjustments).
- The snippet includes Kick Assembler style segmented labels (ch:, npi:).

**[Note: Source contained a lone "49" on a separate line — likely a page number or stray text; it was removed from the assembly listing below.]**

## Source Code
```asm
; BasicUpstart2 (start) - Kick Assembler example (cleaned from source fragments)

BasicUpstart2_start:
    SEI
    LDA #$00
    TAX
    TAY
    JSR $1000        ; call initialization routine

; Main/poll loop (raster-synchronized updates)
poll_raster:
    LDA $D012        ; VIC-II raster register
    BNE poll_raster  ; wait until raster condition (as in source fragment)

; Wait for 8 char lines (fragment comment from source)
ch:
    BNE ch           ; fragment: original had "bne ch"
    LDA pix+1        ; load pointer/index (pix+1 as in source)
    ; Next char
    CLC
    ADC #$08         ; add 8 (advance by 8)
    STA pix+1        ; store back

    SEI              ; source had SEI here again
    ; Start char
    LDA #$32
    STA $0001        ; write $32 to processor port ($0001) as in source
    LDY #$08

; Segments (labels preserved from source)
; -- these are anchors / segment entry points mentioned in source
ch:
npi:
```

## Key Registers
- $D000-$D02E - VIC-II - raster register ($D012), border/background color and other VIC-II registers (sprite positions, control, IRQ)
- $0001 - CPU - processor port / memory configuration (used here with STA $0001)

## References
- "sid_files_import" — expands on embedding SID playback or external subroutines