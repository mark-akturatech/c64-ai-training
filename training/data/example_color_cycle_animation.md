# Example: Color Cycle Animation

## Summary
Cyclic color rotation through color RAM at $D800 using table lookup. Raster interrupt at a fixed scanline triggers the color update routine each frame. Color index advances with AND #07 masking to loop through an 8-color palette, creating smooth scrolling color animation on text rows.

## Key Registers
- $D800 - VIC-II color RAM - 40 bytes per row modified each frame
- $D012 - VIC-II raster line - interrupt trigger for update timing
- $D019 - VIC-II interrupt status - acknowledged in handler
- $0314/$0315 - IRQ vector - points to color update handler

## Techniques
- color cycling
- lookup tables
- raster interrupts
- index wrapping

## Hardware
VIC-II

## Source Code
```asm
; Program: Colour cycle
; Author: Andrew Burch
; Site: www.0xc64.com
; Assembler: win2c64
;

screen		.equ $0400		; screen location
colmap		.equ $d800		; colour map address

cmapoff		.equ $fb		; colour map offset
startcol	.equ $fd		; colour table multiplier

main		.org $c000		; begin 49152

			lda #$00		; set screen colour
			sta $d020
			sta $d021

			jsr $e544		; clear screen

strloop		ldx #00 		; output text
			lda text, x
			sta screen, x
			inx
			cpx #39			; text length
			bne strloop+2

			lda #00 		; init colour index
			sta startcol
			lda #01			; init delay
			sta delay

			sei				; setup interrupt 
			lda #<cycle		
			ldx #>cycle
			sta $0314
			stx $0315   
			cli
			rts

cycle		dec delay		; apply speed via delay
			bne return
			lda #03
			sta delay

			lda #39			; set colour map offset
			sta cmapoff
			
			ldx startcol	; get first colour index
nextchar	lda colours, x 	; load next colour
			ldy cmapoff		
			sta colmap, y	; store colour into map
			txa				; select next colour index
			adc #01
			and #07			; loop colour index
			tax
			dec cmapoff
			bpl nextchar	; repeat for entire row

			lda startcol	; cycle start colour for next update
			adc #01
			and #07			; loop colour
			sta startcol
return		jmp $ea31

text  	  	.byte 41, 41, 41, 32, 32, 45, 45, 45 	; display string
			.byte 61, 27, 62, 32, 32, 23, 23, 23
			.byte 46, 48, 24, 03, 54, 52, 46, 03
			.byte 15, 13, 32, 32, 60, 29, 61, 45
			.byte 45, 45, 32, 32, 40, 40, 40
colours		.byte 09, 08, 05, 13, 01, 13, 05, 08	; colour table
delay		.byte 00 								; cycle speed
```
