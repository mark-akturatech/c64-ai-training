# Example: Complete Raster Interrupt Setup
#
# Demonstrates the full interrupt initialization sequence for demo coding.
# Disables CIA timer interrupts ($DC0D/$DD0D), enables VIC-II raster
# interrupt ($D01A), configures display mode via $D011/$D016/$D018, sets
# interrupt vector at $0314/$0315, triggers at raster line $80, and
# acknowledges pending interrupts. The handler increments border color as
# a timing indicator and manually restores CPU registers before RTI.
#
# Key Registers:
#   $DC0D/$DD0D - CIA interrupt control - disabled with $7F
#   $D01A - VIC-II interrupt mask - raster interrupt enabled (bit 0)
#   $D011 - VIC-II control 1 - display mode, clears raster high bit
#   $D012 - VIC-II raster line - trigger set to $80 (line 128)
#   $0314/$0315 - IRQ vector - points to custom handler
#   $D019 - VIC-II interrupt status - acknowledged via ASL
#   $D020 - VIC-II border color - incremented in handler
#
# Techniques: full interrupt initialization, CIA disabling, VIC-II interrupt setup, interrupt acknowledgment, manual register preservation
# Hardware: VIC-II, CIA1, CIA2
#

; ============================================================================
; Raster Interrupt Setup - Complete Example
; From: "An Introduction to Programming C-64 Demos" by Puterman (Linus Åkerlund)
; Source: https://www.antimon.org/code/Linus/
;
; Demonstrates: Full interrupt setup sequence for demo coding
;
; Setup sequence:
;   1. SEI - disable interrupts during setup
;   2. Disable CIA timer interrupts ($DC0D, $DD0D)
;   3. Enable VIC-II raster interrupt ($D01A)
;   4. Set video mode via $D011, $D016, $D018
;   5. Set interrupt vector at $0314/$0315
;   6. Set trigger raster line in $D012
;   7. Acknowledge any pending interrupts
;   8. CLI - re-enable interrupts
;
; The interrupt handler fires when the raster beam hits line $80.
; It increments the border color to show it's running, then
; acknowledges the interrupt and returns.
; ============================================================================

           * = $1000

           sei             ; disable interrupts during setup

           lda #$7f
           sta $dc0d       ; turn off CIA 1 interrupts (timer, etc.)
           sta $dd0d       ; turn off CIA 2 interrupts

           ldx #$01
           stx $d01a       ; enable raster interrupt (bit 0 of $D01A)

           lda #$1b        ; %00011011: text mode, 25 rows, display on
           sta $d011       ; also clears bit 7 (raster line high bit)
           lda #$08
           sta $d016       ; single-color mode, 40 columns
           lda #$14
           sta $d018       ; screen $0400, charset $1000

           lda #<int       ; low byte of interrupt handler address
           ldx #>int       ; high byte of interrupt handler address
           sta $0314       ; set IRQ vector low byte
           stx $0315       ; set IRQ vector high byte

           ldy #$80
           sty $d012       ; trigger interrupt at raster line 128

           lda $dc0d       ; acknowledge CIA 1 (reading clears flags)
           lda $dd0d       ; acknowledge CIA 2
           asl $d019       ; acknowledge VIC interrupt (writing bit 0)

           cli             ; re-enable interrupts - handler is now live

loop:      jmp loop        ; main program does nothing - all in interrupt

; ----------------------------------------------------------------------------
; Raster interrupt handler
; Called by hardware when raster beam reaches line $80
; ----------------------------------------------------------------------------
int:
           inc $d020       ; flash border color (visible timing indicator)

           asl $d019       ; acknowledge VIC interrupt to re-enable it
           pla             ; restore Y from stack
           tay
           pla             ; restore X from stack
           tax
           pla             ; restore A from stack
           rti             ; return from interrupt
