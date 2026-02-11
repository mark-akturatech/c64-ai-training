# Example: Full Screen Scroll Left

## Summary
Scrolls the entire screen continuously to the left using $D016 hardware scroll bits. A delay counter controls animation speed. After each complete 8-pixel hardware scroll cycle, the character buffer is shifted left and a new character column is added on the right.

## Key Registers
- $D016 - VIC-II control 2 - hardware scroll bits 0-2 for X position
- $D012 - VIC-II raster line - interrupt trigger at line 0
- $D019 - VIC-II interrupt status - acknowledged via ASL
- $0314/$0315 - IRQ vector

## Techniques
- hardware scrolling
- character buffer shifting
- delay-based speed control

## Hardware
VIC-II

## Source Code
```asm
; Program: Full screen scroll left
; Author: Andrew Burch
; Site: www.0xc64.com
; Assembler: win2c64
; Notes: Use $d016 to scroll the whole screen
;		8 pixels and then loop
;

			.org $c000		; begin (49152)

			sei				; set up interrupt
			lda #$7f
			sta $dc0d		; turn off the CIA interrupts
			sta $dd0d
			and $d011		; clear high bit of raster line
			sta $d011		

			ldy #00			; trigger on first screen line
			sty $d012

			lda #<scroll	; load interrupt address
			ldx #>scroll
			sta $0314
			stx $0315

			lda #$01 		; enable raster interrupts
			sta $d01a
			cli
			rts				; back to BASIC

scroll		ldx delay		; apply delay to slow scroller down
			dex
			bne continue

			lda $d016		
			and #248		; mask lower 3 bits
			adc offset		; apply scroll
			sta $d016

			dec offset		
			bpl continue-2
			lda #07			; reset scroll offset
			sta offset

			ldx #02
continue	stx delay		; set delay
			asl $d019		; acknowledge interrupt
			jmp $ea81

offset		.byte 07
delay		.byte 02
```

## Labels
- $D016
- $D012
- $D019
- $0314
- $0315
