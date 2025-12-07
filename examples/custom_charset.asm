//----------------------------------------------------------
// Custom Character Set Demo
// Creates a custom charset at $3000, modifies a few characters,
// and returns to BASIC with the new charset active.
//----------------------------------------------------------

.pc = $0801 "Basic Upstart"
    .byte $0c, $08, $0a, $00, $9e, $20, $32, $30, $36, $34, $00, $00, $00

.pc = $0810 "Main Program"

    // Destination for custom charset: $3000 (12288)
    // This is safe for BASIC and accessible by VIC-II in bank 0

    sei                     // Disable interrupts (required for ROM access)

    // Disable CIA1 interrupts
    lda #$7f
    sta $dc0d
    lda $dc0d               // Ack any pending

    // Switch in character ROM at $D000 by clearing bit 2 of $01
    lda $01
    and #%11111011          // Clear bit 2 (CHAREN) - switch in char ROM
    sta $01

    // Copy 2KB of character ROM ($D000-$D7FF) to RAM at $3000
    // Using uppercase/graphics set (first 2KB)
    ldx #$00
    ldy #$00
copy_loop:
    lda $d000,y             // Source: character ROM
    sta $3000,y             // Dest: RAM at $3000
    lda $d100,y
    sta $3100,y
    lda $d200,y
    sta $3200,y
    lda $d300,y
    sta $3300,y
    lda $d400,y
    sta $3400,y
    lda $d500,y
    sta $3500,y
    lda $d600,y
    sta $3600,y
    lda $d700,y
    sta $3700,y
    iny
    bne copy_loop

    // Switch I/O back in by setting bit 2 of $01
    lda $01
    ora #%00000100          // Set bit 2 (CHAREN) - switch in I/O
    sta $01

    // Re-enable interrupts
    lda #$81
    sta $dc0d
    cli

    //----------------------------------------------------------
    // Now modify some characters in our custom set
    // Let's create custom characters for positions 0-3
    //----------------------------------------------------------

    // Character 0: Solid block
    ldx #$00
!:  lda #$ff
    sta $3000,x
    inx
    cpx #$08
    bne !-

    // Character 1: Smiley face
    ldx #$00
!:  lda smiley,x
    sta $3008,x             // Char 1 = offset 8 bytes
    inx
    cpx #$08
    bne !-

    // Character 2: Heart
    ldx #$00
!:  lda heart,x
    sta $3010,x             // Char 2 = offset 16 bytes
    inx
    cpx #$08
    bne !-

    // Character 3: Diamond
    ldx #$00
!:  lda diamond,x
    sta $3018,x             // Char 3 = offset 24 bytes
    inx
    cpx #$08
    bne !-

    //----------------------------------------------------------
    // Point VIC-II to our custom charset at $3000
    // $D018: bits 3-1 control character memory location
    // Value 12 = %00001100 = charset at $3000
    //----------------------------------------------------------
    lda $d018
    and #%11110001          // Clear bits 3-1
    ora #%00001100          // Set to $3000 (value 12 in bits 3-1)
    sta $d018

    // Return to BASIC - charset remains active!
    rts

//----------------------------------------------------------
// Custom character data (8 bytes each, top to bottom)
//----------------------------------------------------------

smiley:
    .byte %00111100         //   ****
    .byte %01000010         //  *    *
    .byte %10100101         // * *  * *
    .byte %10000001         // *      *
    .byte %10100101         // * *  * *
    .byte %10011001         // *  **  *
    .byte %01000010         //  *    *
    .byte %00111100         //   ****

heart:
    .byte %01100110         //  **  **
    .byte %11111111         // ********
    .byte %11111111         // ********
    .byte %11111111         // ********
    .byte %01111110         //  ******
    .byte %00111100         //   ****
    .byte %00011000         //    **
    .byte %00000000         //

diamond:
    .byte %00011000         //    **
    .byte %00111100         //   ****
    .byte %01111110         //  ******
    .byte %11111111         // ********
    .byte %01111110         //  ******
    .byte %00111100         //   ****
    .byte %00011000         //    **
    .byte %00000000         //
