# Example: Koala Paint Bitmap Display

## Summary
Displays a Koala Paint format bitmap by copying screen RAM colors from $3F40 and color RAM data from $4328 into their respective VIC-II locations. Configures $D011 for bitmap mode (bit 5) with 25 rows, $D016 for multicolor mode (bit 4), and $D018 to point screen at $0400 and bitmap at $2000. The Koala format stores 8000 bytes bitmap, 1000 bytes screen color, 1000 bytes color RAM, and 1 byte background.

## Key Registers
- $D011 - VIC-II control 1 - set to $3B for bitmap mode, 25 rows, display on
- $D016 - VIC-II control 2 - set to $18 for multicolor mode, 40 columns
- $D018 - VIC-II memory pointer - set to $18 for screen $0400, bitmap $2000
- $D800-$DBFF - Color RAM - copied from Koala data at $4328
- $D020/$D021 - VIC-II border/background - set to black

## Techniques
- bitmap mode configuration
- multicolor mode
- Koala format parsing
- bulk memory copy

## Hardware
VIC-II

## Source Code
```asm
; ============================================================================
; Koala Paint Bitmap Display
; From: "An Introduction to Programming C-64 Demos" by Puterman (Linus Åkerlund)
; Source: https://www.antimon.org/code/Linus/
;
; Demonstrates: Bitmap mode, multicolor mode, Koala picture format
;
; Koala Paint format (loaded at $2000):
;   $2000-$3F3F: 8000 bytes bitmap data
;   $3F40-$4327: 1000 bytes screen RAM colors (2 colors per 8x8 cell)
;   $4328-$470F: 1000 bytes color RAM (1 additional color per cell)
;   $4710:       1 byte background color
;
; VIC-II register setup:
;   $D011 = $3B: bitmap mode (bit 5) + 25 rows (bit 3) + display on (bit 4)
;   $D016 = $18: multicolor mode (bit 4) + 40 columns (bit 3)
;   $D018 = $18: screen at $0400, bitmap at $2000
; ============================================================================

           * = $0801

           lda #$00
           sta $d020       ; border = black
           sta $d021       ; background = black
           tax

copyloop:
           ; Copy screen RAM colors from Koala data to $0400-$07FF
           lda $3f40,x
           sta $0400,x
           lda $4040,x
           sta $0500,x
           lda $4140,x
           sta $0600,x
           lda $4240,x
           sta $0700,x
           ; Copy color RAM from Koala data to $D800-$DBFF
           lda $4328,x
           sta $d800,x
           lda $4428,x
           sta $d900,x
           lda $4528,x
           sta $da00,x
           lda $4628,x
           sta $db00,x
           dex
           bne copyloop

           lda #$3b        ; bitmap mode on, 25 rows, display enabled
           ldx #$18        ; multicolor mode on, 40 columns
           ldy #$18        ; screen RAM $0400, bitmap data $2000
           sta $d011
           stx $d016
           sty $d018

mainloop:  jmp mainloop    ; display picture forever
```
