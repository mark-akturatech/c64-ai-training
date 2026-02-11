# Example: Keyboard Matrix Scanning

**Project:** dustlayer_sprites - Animated multicolor sprite with keyboard control, custom charset, and border opening

## Summary
Scans keyboard matrix to detect U/D keys for sprite Y-movement and SPACE for exit. Configures CIA port A ($DC00) as output and port B ($DC01) as input, then scans specific matrix rows for column patterns. Moves sprite Y-coordinate ($D001) with boundary checks at $1E minimum and $FF maximum.

## Key Registers
- $DC00 - CIA port A - row scan patterns ($7F, $FB, $F7)
- $DC01 - CIA port B - column read for key detection
- $DC02/$DC03 - CIA data direction registers - port configuration
- $D001 - VIC-II sprite 0 Y position - incremented/decremented

## Techniques
- keyboard matrix scanning
- CIA port configuration
- boundary checking

## Hardware
CIA, VIC-II

## Source Code
```asm
;===============================
; check for a single key press
;===============================


check_keyboard              

                        lda #%11111111  ; CIA#1 Port A set to output 
                        sta ddra             
                        lda #%00000000  ; CIA#1 Port B set to inputt
                        sta ddrb             
            
check_space             lda #%01111111  ; select row 8
                        sta pra 
                        lda prb         ; load column information
                        and #%00010000  ; test 'space' key to exit 
                        beq exit_to_basic

check_d                 lda #%11111011  ; select row 3
                        sta pra 
                        lda prb         ; load column information
                        and #%00000100  ; test 'd' key  
                        beq go_down

check_u                 lda #%11110111  ; select row 4
                        sta pra 
                        lda prb         ; load column information
                        and #%01000000  ; test 'u' key 
                        beq go_up
                        rts             ; return     

go_up                   lda $d001
                        cmp #$1e        ; check Y-coord whether we are too high
                        beq skip        ; if top of screen reached, skip
                        dec $d001       ; decrease y-coord for sprite 1
                        rts

go_down                 lda $d001       ; increase y-coord for sprite 1
                        cmp #$ff        ; check Y-coord whether whether we are too low
                        beq skip        ; if bottom of border was reached, skip
                        inc $d001
                        rts

exit_to_basic           lda #$00
                        sta $d015        ; turn off all sprites
                        jmp $ea81        ; jmp to regular interrupt routine
                        rts

skip                    rts              ; don't change Y-Coordinate
```

## Labels
- DC00
- DC01
- DC02
- DC03
- D001
