         *= $1000

         ;dycp scroller in 256 bytes

         ;lousy coding & comments by:

         ;oswald of resource


         ;(cruzer: it wasnt hard at all
         ;but i ran out of mem when
         ;i wanted to add some cosmetics
         ;:)

freq     = $04

sinmove  = $f0

szoveg   = $a1a0     ;text at rom
sin      = $1f00
sinptrs  = $1e00

cset     = $3000

         sei         ;copy charset
         lda #$33    ;from rom
         sta $01
         ldx #$00
copy     lda $d800,x
         sta $3000,x
         dex
         bne copy
         lda #$37
         sta $01

         lda #$04    ;set up screen
         sta $ff
         stx $fe
         txa

lp2      ldy #0
lp
         sta ($fe),y

         adc #6
         iny
         cpy #40
         bne lp
         lda #$28
         jsr add
         inx
         txa
         cmp #$06
         bne lp2

         lda #24
         sta 53272

;---------------------------------------

again2   ldx #7
         stx $fb
         stx 53270
         lda #0        ;clear @
mkspc    sta cset,x    ;to make it a
         dex           ;space
         bpl mkspc

again    lda #$00      ;reset counters
         sta $fe
         sta $fc
         lda #$20
         sta $ff

         lda sinmove
         sta $fa

mainloop
         lda $fa
         clc
         adc #freq      ;get sine offset
         sta $fa
         tay
         lda sin,y
         pha
         tay

         lda #$00       ;clear char
         ldx #$0b
clr      sta ($fe),y
         iny
         dex
         bpl clr

         pla
         clc
         adc #$02
         tay
         ldx $fc
text     lda szoveg,x   ;get  text

         asl a
         asl a
         asl a
         tax

         lda #$06
         sta $fd

copychr  lda cset,x     ;draw char
         sta ($fe),y
         inx
         iny
         dec $fd
         bpl copychr

         lda #48        ;move 2 next
         jsr add        ;column
         inc $fc
         lda $fc
         cmp #40
         bne mainloop

         lda #$68
         cmp $d012
         bne *-3

         lda sinmove
         clc
         adc #$02
         sta sinmove

         ldx $fb
         stx 53270
         dec $fb
         bpl again

        ;clc            ;fix flicker
         adc #freq      ;when moving 8
         sta sinmove    ;pixel each char

         inc text+1
         bne *+5
         inc text+2

         jmp again2

add      clc            ;saves sum bytes
         adc $fe
         sta $fe
         bcc *+4
         inc $ff
         rts

