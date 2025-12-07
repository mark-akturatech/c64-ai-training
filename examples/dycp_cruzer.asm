;256 bytes dycper fun
;cryptic code by cruzer/cml 2003-04
;compiled with mxass

;memory...
.la pnt =      $0c
.la ad2 =      $14
.la x =        $33
.la cs =       $b1
.la sine =     $1000
.la text =     $a2ed
.la rndsrc1 =  $b2dd

.ba $0801

basic	.by $0b,$08,$01,$00,$9e,$32,$30,$36,$31,0,0,0



;fill $0a00-$7fff with "random" data from the rom...

-	lda rndsrc1,x
	sei
rs	sta $0a00,x
	sta $d018
	lda ($ff,x)  ;slows it down
	inx
	bne -
	inc rs+2
	bpl -

	
	
;setup charset on screen...
	
	;ldx #$00
	;ldy #$00
	;sty cs
	;lda #$3c
	;sta cs+1
-loop	
	txa
	sta ($b1),y
	lda cs+0
	clc
	adc #$28
	sta cs+0
	bcc +
	inc cs+1
+	cmp #$40
	bne +
	lda #$00
	sta cs+0
	dec cs+1
	iny
+	inx
	bne -loop
	

;generate sine...	

	ldy #$7f
-	
sval1	lda #$00
	clc
sa1	adc #$00
	sta sval1+1
sval2	lda #$00
sa2	adc #$00
	sta sval2+1
	
	sta sine+$80,x
	sta sine+$00,y
	eor #$7f
	sta sine+$00,x
	sta sine+$80,y
	
	lda sa1+1
	;clc
	adc #$08
	sta sa1+1
	bcc +
	inc sa2+1
+
	inx
	dey
	cpx #$40
	bne -


main

	lda #$27
	sta ds+2

	lda pnt
	sta $fe
	eor #$ff
	asl
	sta $ff
	
	lda #$1f
	sta x
-loop
	ldx x
	lda text,x
	sec
	sbc #$40
	asl
	sta cl+1
	lda #$1b ;d8>>3
	rol
	asl cl+1
	rol
	asl cl+1
	rol
	sta cl+2

	lda #$33
	sta $01

	ldx $ff
	lda sine,x
	ldx $fe
	;clc
	adc sine,x
	lsr
	lsr
	lsr
	tay
	
	ldx #$00
	txa
-	
ds	sta $27c0,y
cl	lda $d800,x
	iny
	inx
	cpx #$09
	bne -

	txa ;lda #$09
	clc
	adc $ff
	sta $ff
	lda ad2 ;#$0e
	clc
	adc $fe
	sta $fe

	lda ds+1
	sec
	sbc #$40
	sta ds+1
	bcs +
	dec ds+2
+
	dec x
	bpl -loop

	lda #$b7
	sta $01

-	cmp $d012
rb	bne -


	inc pnt
	bne +
	inc pnt+1
	lda pnt+1
	and #$03
	bne +
	lda ad2
	eor #$80
	sta ad2
	lda rb+1
	eor #$fb
	sta rb+1
+
	jmp main
	
	
	
