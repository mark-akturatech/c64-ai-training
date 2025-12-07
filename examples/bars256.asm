; 256 byte rasterbar fun
; coded by cruzer/cml
; compiled with mxass

;variables...
.la ystart=$3c

;memory...
.la sineval=$02
.la timer=$04
.la pointers=$20
.la add=$40
.la ys=$60
.la tmp=$fe
.la rasters=$1000
.la sine=$1200
.la rndsrc=$a000

.ba $0801

basic	.by $0b,$08,$01,$00,$9e,$32,$30,$36,$31,0,0,0

	sei
pntinit	
	ldx #$02
-	lda rndsrc,x
	sta $00,x
	inx
	bne -

sinegen
	;ldx #$00
	stx $d011
	stx sineval
	stx sineval+1
	ldy #$7f
-	
	lda sineval
	clc
sa1	adc #$00
	sta sineval
	lda sineval+1
sa2	adc #$00
	sta sineval+1
	lda sa1+1
	;clc
	adc #$10
	sta sa1+1
	bcc +
	inc sa2+1
+
	lda sineval+1
	sta sine,x
	sta sine+$80,y
	eor #$ff
	sta sine+$80,x
	sta sine,y
	inx
	dey
	cpx #$40
	bne -

main

clear
	lda #$00
	tax
-	sta rasters,x
	dex
	bne -

update_pnts

	ldx #$1f
-	lda add,x
	and #$03
	sec
	sbc #$02
	bne +
	lda #$02
+	clc
	adc pointers,x
	sta pointers,x
	dex
	bpl -

addsines

	ldx #$0f
-
	ldy pointers,x
	lda sine,y
	lsr
	ldy pointers+$10,x
	clc
	adc sine,y
	ror
	sta ys,x
	dex
	bpl -
		
plot
	lda #<bars
	sta bl+1

	lda #$0f
	sta tmp
-loop	
	ldx tmp
	txa
	and #$03
	bne +
	lda bl+1
	clc
	adc #11
	sta bl+1
+
	ldy ys,x
	ldx #10
-
bl	lda bars,x
	sta rasters+ystart,y
	iny
	dex
	bpl -
	
	dec tmp
	bne -loop

show	

	ldx #ystart
	ldy #ystart
-loop	lda rasters,y
-	cpx $d012
	bne -
	sta $d020
	iny
ix	nop
	inx
	bne -loop

	inc timer
	bne +
	lda ix
	eor #%00000010
	sta ix	
+	
	jmp main


bars

.by $09,$04,$0a,$0f,$07,$01,$07,$0f,$0a,$04,$09
.by $02,$08,$0a,$0f,$07,$01,$07,$0f,$0a,$08,$02
.by $00,$0b,$05,$03,$0d,$01,$0d,$03,$05,$0b,$00
.by $06,$0b,$0e,$0f,$07,$01,$07,$0f,$0e,$0b,$06
	
fillup	.te "CML!"