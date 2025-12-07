//----------------------------------------------------------
// Hello World with Cycling Colors
// KickAssembler syntax for C64
//----------------------------------------------------------

// BASIC startup - creates "10 SYS 2064" to auto-run
.pc = $0801 "Basic Upstart"
    .byte $0c, $08, $0a, $00, $9e, $20, $32, $30, $36, $34, $00, $00, $00

.pc = $0810 "Main Program"

    // Set border green ($05) and background black ($00)
    lda #$05
    sta $d020           // border = green
    lda #$00
    sta $d021           // background = black

    // Clear screen
    jsr clear_screen

    // Print "HELLO WORLD" directly to screen RAM at row 12, col 14
    // Screen offset = 12*40 + 14 = 494 = $01EE
    ldx #$00
print_loop:
    lda message,x
    beq setup_irq       // null terminator = done
    sta $0400 + 494,x   // screen RAM
    lda #$01            // white color
    sta $d800 + 494,x   // color RAM
    inx
    cpx #11
    bne print_loop

setup_irq:
    sei                 // disable interrupts

    lda #<irq_handler
    sta $0314           // IRQ vector low byte
    lda #>irq_handler
    sta $0315           // IRQ vector high byte

    lda #$7f
    sta $dc0d           // disable CIA1 interrupts
    lda $dc0d           // ack any pending

    lda #$01
    sta $d01a           // enable VIC raster interrupt

    lda #$1b
    sta $d011           // screen control (clear bit 7 for raster line < 256)
    lda #$00
    sta $d012           // raster line 0

    asl $d019           // ack any pending VIC interrupt

    cli                 // enable interrupts

main_loop:
    jsr color_me
    jmp main_loop       // infinite loop


//----------------------------------------------------------
// IRQ Handler - cycles colors every frame
//----------------------------------------------------------
irq_handler:
    asl $d019           // acknowledge VIC interrupt

    // DEBUG: increment character at top-left to show IRQ is running
    inc $0400

    // Cycle color - use a counter since color RAM upper bits are garbage on read
    inc color_counter
    lda color_counter
    and #$0f            // keep only lower 4 bits (0-15)

    // Set color for all 11 characters of "HELLO WORLD"
    ldx #$00
!color_loop:
    sta $d800 + 494,x  // color RAM (494 = 12*40 + 14)
    inx
    cpx #11
    bne !color_loop-

    // Jump to normal IRQ handler to handle keyboard etc.
    jmp $ea31


color_me:
    // Cycle color - use a counter since color RAM upper bits are garbage on read
    inc color_counter
    lda color_counter
    and #$0f            // keep only lower 4 bits (0-15)

    // Set color for all 11 characters of "HELLO WORLD"
    //ldx #$00
//!color_loopx:
    sta $d800  // color RAM (494 = 12*40 + 14)
  //  inx
    //cpx #11
    //bne !color_loopx-
    rts


//----------------------------------------------------------
// Clear screen using Kernal CHROUT
// $93 = clear screen character, $FFD2 = CHROUT
//----------------------------------------------------------
clear_screen:
    lda #$93            // clear screen PETSCII code
    jsr $ffd2           // Kernal CHROUT
    rts


//----------------------------------------------------------
// Data
//----------------------------------------------------------
message:
    .text "HELLO WORLD"
    .byte $00           // null terminator

color_counter:
    .byte $00           // color cycle counter
