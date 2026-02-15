# Example: Kefrens Bars
#
# A 256-byte Kefrens bar implementation using self-replicating code that
# is copied 193 times into memory, each instance pre-loaded with a unique
# $D011 vertical scroll value. During rendering, sine table values index
# into the replicated code to position bars at varying heights. Character
# bitmap data at $2007 (kefScr) is modified using AND/ORA mask tables
# (kefAND1/kefORA1, kefAND2/kefORA2) to paint bar graphics at sub-character
# 2-pixel precision. VIC-II multicolor character mode is configured with
# charset at $2000 via $D018.
#
# Key Registers:
#   $D011 - VIC-II control register - vertical scroll bits pre-calculated per bar copy
#   $D012 - VIC-II raster counter - polled at line $30 for synchronization
#   $D018 - VIC-II memory pointer - set to $18 for charset at $2000
#   $D016 - VIC-II control register 2 - multicolor and scroll settings
#   $D020 - VIC-II border color - cleared to black
#   $D021 - VIC-II background color - cleared to black
#   $D022 - VIC-II multicolor register 1 - palette color
#   $D023 - VIC-II multicolor register 2 - palette color
#   $D800 - VIC-II color RAM - initialized for character colors
#
# Techniques: self-replicating code generation, per-scanline $D011 manipulation, sine table lookup, AND/ORA bitmask rendering, sub-character pixel precision, real-time charset modification
# Hardware: VIC-II
#

;***NOTE: $0085 must be $E9 and $0086 must be $30 when running this fine megademo (which they are b'coz of basic)***
;***set tabs to 9 spaces***
;
;
;
; +------------------------------------------------------------+
; |  "Kefrens Without Gosub" by CyberBrain/NoName 28/02/2004.  !
; !                                                            :
; : the source 4 da first n' best 256b kefrensbars on the C64! |
;       -  -- --- ---------------------------------------------+
;
;              assemble with ca65. (www.cc65.org)
;
;                      lame code rulez!
;
;
; 


	.debuginfo +
	.feature labels_without_colons 	;<- man beh�ver ikke bruge kolon i efter labels (labels skal starte p� 1st char)
	.feature pc_assignment	    	;<- man kan skrive *=xxxx istedetfor .org xxxx 
	*=$0801
	.word *
	*=$0801

xx	= $ff
xxxx	= $ffff

sincnt	= $02
sincntTmp= $03
tmp1	= $85		;=$E9 (set by basic)
tmp2	= $86		;=$30 (set by basic)
dummy	= $07

igenigenAdr = $30e9	; = hvor igenigen-coden skal smides hen

sinus 	= $1000
sinLo	= $1100		; = bit 0-1 af sinus -> bit 0-1 af sinLo
sinHi	= $1200		; = bit 2-6 af sinus -> bit 3-7 af sinHi 	(skal v�re ganget med 8 fordi det kun er hver 8. byte i charet der skal plottes i)

charset	= $2000
kefScr	= charset+7	; = "screen to plot" = "the first byte in the char to be plotted to (kun hver 8. byte efter denne byte bli'r plottet i)"

kefLines = 193		; = hvor mange pixels h�j kefren-baren skal v�re. (hvor mange gange igenigen coden g�r igen) (SKAL ende med en $D011=%00011011 sta!)


D011init = %00011011

col1	= 3
col2	= 14
col3	= 6

basic	; inform user how many basic bytes that are free, when entering the secret park
;	.byte $2f ,$08 ,$00 ,$00  ,$81 ,$54 ,$b2 ,$30  ,$a4 ,$32 ,$35 ,$36  ,$3a ,$97 ,$34 ,$30
;	.byte $39 ,$36 ,$aa ,$54  ,$2c ,$bf ,$28 ,$54  ,$ad ,$28 ,$34 ,$ac  ,$ff ,$29 ,$29 ,$ac
;	.byte $34 ,$30 ,$aa ,$38  ,$30 ,$3a ,$82 ,$3a  ,$9e ,$32 ,$30 ,$39  ,$34		;<- da der mangler 00 00 00 kan bytesne lige efter fucke up afh�ngig af deres v�rdi (ldx#0, lda sinus,x ser ud til at virke ok)
	
	.byte $2d ,$08 ,$00 ,$00  ,$81 ,$54 ,$b2 ,$30  ,$a4 ,$32 ,$35 ,$36  ,$3a ,$97 ,$34 ,$30
	.byte $39 ,$36 ,$aa ,$54  ,$2c ,$bf ,$28 ,$54  ,$ad ,$32 ,$32 ,$29  ,$ac ,$34 ,$30 ,$ac
	.byte $bf ,$28 ,$54 ,$ad  ,$39 ,$29 ,$aa ,$38  ,$30 ,$3a ,$82 ,$3a  ,$9e ,$32 ,$30 ,$39
	.byte $38

;	.byte $34 ,$08 ,$00 ,$00  ,$81 ,$54 ,$b2 ,$30  ,$a4 ,$32 ,$35 ,$36  ,$3a ,$97 ,$34 ,$30
;	.byte $39 ,$36 ,$aa, $54  ,$2c ,$bf ,$28 ,$54  ,$ad ,$32 ,$33 ,$29  ,$ac ,$36 ,$30 ,$ac
;	.byte $bf ,$28 ,$54 ,$ad  ,$31 ,$32 ,$29, $aa  ,$36 ,$34 ,$3a ,$82  ,$3a ,$9e ,$32 ,$30
;	.byte $39 ,$39




;---------------------------------------
;****************MACROS*****************
;---------------------------------------

.macro initTables

.proc	;
	ldx #0
loop	;Convert sinus -> sinlo, sinhi
	lda sinus,x
	pha
	and #%00000011
	sta sinLo,x
	pla
	and #%01111100
	asl
	sta sinHi,x
	;setup $0400+$D800
	txa
	sta $0400,x
	lda #col1+8
	sta $d800,x
	dex
	bne loop
.endproc

.proc	;Generate igenigen-code

;	lda #<igenigenAdr
;	sta <tmp1
;	lda #>igenigenAdr
;	sta <tmp2
	
	ldx #kefLines
loop1	ldy #igenigenLen+1		;"+1" da RTS osse skal med
loop2	lda igenigenCode,y
	sta (tmp1),y
	dey
	bpl loop2
	
	
	ldy #igenSto - igenigenCode	; skriv $D011 v�rdi
sto	lda #D011init
	sta (tmp1),y
	
	ldy sto+1			; �ndr $D011 v�rdi
	iny
	tya
	and #%00000111
	ora #%00011000
	sta sto+1
	
		
	lda <tmp1
	clc
	adc #igenigenLen
	sta <tmp1
	bcc *+4
	inc <tmp2
	
	dex
	bne loop1
	
	stx $d020
	stx $d021
.endproc
.endmacro


.macro	kefrens
.proc	;kalder rutinen
	lda <sincnt
	sta <sincntTmp
	jsr igenigenAdr
	

	;clear charset
	ldx #0
	txa
loop	sta charset,x
	sta charset+$100,x
	inx
	bne loop
				
	inc <sincnt
	
.endproc
.endmacro

.macro setupVic
	lda #%00011000
	sta $d018
	sta $d016
	lda #col3
	sta $d022
	lda #col2
	sta $d023
.endmacro


;---------------------------------------
;*****************CODE******************
;---------------------------------------
	

	initTables
	sei		
	setupVic


loop	lda $d011
	bmi *-3

	lda #$30+%011-1
	cmp $d012
	bne *-3

	dec $d011

	
	ldx #87
	dex
	bne *-1	;delay=2+(5*x)-1 <=> x=(delay-1)/5

	kefrens
	
	jmp loop

;---------------------------------------
;****************TABLES*****************
;---------------------------------------

kefORA1	;grafikken for de 4 positioner i et char som den venstre del af kefren-baren kan v�re i
	.byte %01101110
	.byte %00011011
	.byte %00000110
	.byte %00000001
	
kefAND1	;det der skal and'es v�k af baggrunden for de 4 positioner i et char som den venstre del af kefren-baren kan v�re i
	.byte %00000000
	.byte %11000000
	.byte %11110000
	.byte %11111100

kefORA2	;grafikken for de 4 positioner i et char som den h�jre del af kefren-baren kan v�re i
	.byte %01000000
	.byte %10010000
	.byte %11100100
	.byte %10111001

kefAND2	;det der skal and'es v�k af baggrunden for de 4 positioner i et char som den h�jre del af kefren-baren kan v�re i
	.byte %00111111
	.byte %00001111
	.byte %00000011
	.byte %00000000
	
;---------------------------------------

; igenigencoden der tegner kefrens-barene, og inc'er $d011 s�dan at charline 7 gentages
igenigenCode
igenSto = *+1	
	lda #xx
	sta $d011
	
	ldy <sincntTmp		;ZP
	lda sinHi,y
	ldx sinLo,y
 	tay
	
	lda kefScr,y
	and kefAND1,x
	ora kefORA1,x
	sta kefScr,y
	
	lda kefScr+8,y
	and kefAND2,x
	ora kefORA2,x
	sta kefScr+8,y
	
	inc <sincntTmp		;ZP
	inc <dummy		;ZP
	
igenigenLen = * - igenigenCode
	rts			;<- kun brugt for sidste igenigen-del
;---------------------------------------
