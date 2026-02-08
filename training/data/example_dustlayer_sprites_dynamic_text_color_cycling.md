# Example: Dynamic Text Color Cycling

**Project:** dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening

## Summary
Cycles text colors using sprite pointer value (0-15) as color source with ADC/SBC to constrain range. Writes animated colors to three Color RAM row addresses ($D828, $D878, $DB70). Separately implements slower border color flipping using a delay counter and EOR #$08 toggle between blue and light blue on $D020.

## Key Registers
- $D828/$D878/$DB70 - VIC-II Color RAM text rows - animated colors
- $D020 - VIC-II border color - toggled via EOR between blue/light-blue
- Sprite pointer RAM - used as color source

## Techniques
- register-driven color cycling
- delay-based timing
- XOR toggling

## Hardware
VIC-II

## Source Code
```asm
;============================================================
; 1. color cycle over text using the sprite pointer of the
; ship to get the next color
; 2. Slower Color cycle over side boarders using delay_counter
;============================================================

color_cycle     ldx #$00 		; init counter for column

color_init      lda sprite_ship_current_frame  ; load ship sprite pointer value...
    										   ; ...which is always between $00-$0f
		        cmp #$0f 		; when its #$0f we skip addition of 1 
		        beq color_inc   
			    adc #$01   		; otherwise we add 1 eliminating the possibility...
								; ... to get the color black.

color_inc 	    sta $d828,x      ; increase colors line 1
                sta $d878,x      ; increase colors line 2
                sta $db70,x      ; increase colors line 3
                sbc #$01 		 ; substract 1 from color value in accumulator

    			cmp #$00 		 ; if color value becomes 0 (black)...
	       		beq color_exit	 ; ...then skip this frame 

                inx    			 ; increase column-position counter 
                cpx #$28         ; finished when all 40 cols of a line are processed
                bne color_inc    ; if not finished write new color into register
		        lda delay_counter ; load delay counter
	            cmp #$34           ; compare to #$34
		        beq border_color   ; switch border color
			    inc delay_counter  ; increase delay counter
color_exit      rts 			 ; return
border_color    lda $d020        ; load border color
			    eor #$08         ; flip between blue and light blue
                sta $d020        ; store new bordercolor
                lda #$00         ; reset delay counter
                sta delay_counter
                rts
```
