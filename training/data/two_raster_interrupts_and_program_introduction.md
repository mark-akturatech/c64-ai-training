# Raster-scan split-screen (need for two raster interrupts)

**Summary:** Explains why at least two VIC-II raster interrupts are required to change only part of the screen and describes a sample program that splits the C64 display into three sections (top high-res bitmap, middle text, bottom multicolor bitmap). Searchable terms: raster interrupt, VIC-II, $D012, $D019, $D01A, $D018, bitmap/text/multicolor.

**Raster interrupts and partial-screen changes**
When you change VIC-II display registers partway down the screen, you must use raster interrupts and at least two interrupt events for a single split: one raster interrupt to apply the mid-screen change, and a second raster interrupt later in the frame to restore the original display state. The first interrupt routine performs the register writes that alter mode/addresses (for example, switching from bitmap to text or changing memory pointers) and must also program the VIC to trigger another raster interrupt at a later scan line that will write the registers back to their prior values. Without re-arming a second IRQ, the display will remain altered for the rest of the frame or until another IRQ is triggered.

(Brief parenthetical: $D012 is the raster compare register used to time the interrupt; $D019/$D01A are the VIC-II IRQ flag/enable registers.)

**Sample split-screen arrangement (behavioral description)**
- The provided example divides one C64 frame into three vertical sections:
  - Top: 80 scan lines — high-resolution bitmap mode.
  - Middle: 40 scan lines — regular text mode.
  - Bottom: 80 scan lines — multicolor bitmap mode.
- The split takes effect immediately when a SYS call jumps to the machine code routine that enables and programs the raster interrupts.
- After the routine runs once, the display stays split across frames even after the CPU program has ended; the VIC-II state persists. Only pressing STOP+RESTORE (which resets the machine) will return the display to the default, non-split state.
- The raster interrupt handler must:
  1. Change the necessary VIC-II registers to create the new section (mode bits, memory pointers).
  2. Acknowledge/clear the VIC interrupt flag.
  3. Program the next raster compare (in $D012) for the line that will restore the previous state, and enable that IRQ in $D01A.
  4. On the restore interrupt, reverse the register changes and re-program the next mid-screen interrupt to recreate the split on the following frame if continuous splitting is desired.

## Source Code
```assembly
; This assembly code sets up raster interrupts to create a three-way split screen
; on the Commodore 64. The screen is divided into:
; - Top 80 scan lines: High-resolution bitmap mode
; - Middle 40 scan lines: Regular text mode
; - Bottom 80 scan lines: Multicolor bitmap mode

; Define VIC-II registers
VIC_CTRL1       = $D011
VIC_CTRL2       = $D016
VIC_MEM_CTRL    = $D018
VIC_RASTER      = $D012
VIC_IRQ_STATUS  = $D019
VIC_IRQ_ENABLE  = $D01A
VIC_BORDER_COL  = $D020
VIC_BG_COL0     = $D021

; Define raster line positions for mode changes
RASTER_LINE1    = 80   ; Line where first mode change occurs
RASTER_LINE2    = 120  ; Line where second mode change occurs

; Interrupt vector locations
IRQ_VECTOR      = $0314

; Start of program
*=$C000

; Disable interrupts
SEI

; Set up initial screen mode (high-resolution bitmap)
LDA #$3B        ; %00111011: Bitmap mode, 25 rows
STA VIC_CTRL1
LDA #$18        ; %00011000: No horizontal scroll, multicolor off
STA VIC_CTRL2
LDA #$14        ; %00010100: Screen at $0400, charset at $2000
STA VIC_MEM_CTRL

; Set up raster interrupt
LDA #<IRQ1      ; Low byte of IRQ1 address
STA IRQ_VECTOR
LDA #>IRQ1      ; High byte of IRQ1 address
STA IRQ_VECTOR+1

; Set raster line for first interrupt
LDA #RASTER_LINE1
STA VIC_RASTER

; Enable raster interrupt
LDA #$01        ; Enable raster interrupt
STA VIC_IRQ_ENABLE

; Acknowledge any pending interrupts
LDA VIC_IRQ_STATUS
STA VIC_IRQ_STATUS

; Re-enable interrupts
CLI

; Main loop
MainLoop:
    JMP MainLoop

; First interrupt routine: Switch to text mode
IRQ1:
    ; Acknowledge interrupt
    LDA VIC_IRQ_STATUS
    STA VIC_IRQ_STATUS

    ; Set text mode
    LDA #$1B        ; %00011011: Text mode, 25 rows
    STA VIC_CTRL1
    LDA #$08        ; %00001000: No horizontal scroll, multicolor off
    STA VIC_CTRL2
    LDA #$14        ; %00010100: Screen at $0400, charset at $2000
    STA VIC_MEM_CTRL

    ; Set raster line for next interrupt
    LDA #RASTER_LINE2
    STA VIC_RASTER

    ; Set next interrupt routine
    LDA #<IRQ2
    STA IRQ_VECTOR
    LDA #>IRQ2
    STA IRQ_VECTOR+1

    RTI

; Second interrupt routine: Switch to multicolor bitmap mode
IRQ2:
    ; Acknowledge interrupt
    LDA VIC_IRQ_STATUS
    STA VIC_IRQ_STATUS

    ; Set multicolor bitmap mode
    LDA #$3B        ; %00111011: Bitmap mode, 25 rows
    STA VIC_CTRL1
    LDA #$18        ; %00011000: No horizontal scroll, multicolor on
    STA VIC_CTRL2
    LDA #$14        ; %00010100: Screen at $0400, charset at $2000
    STA VIC_MEM_CTRL

    ; Set raster line for next interrupt (start of next frame)
    LDA #0
    STA VIC_RASTER

    ; Set next interrupt routine
    LDA #<IRQ1
    STA IRQ_VECTOR
    LDA #>IRQ1
    STA IRQ_VECTOR+1

    RTI
```

## Key Registers
- $D012 - VIC-II - Raster compare register (raster line used to trigger IRQ)
- $D019 - VIC-II - Interrupt status/flags (IRQ acknowledge via write)
- $D01A - VIC-II - Interrupt enable register (enable/disable raster IRQ)
- $D011 - VIC-II - Control (vertical fine scroll / high bits related to bitmap/screen mode)
- $D016 - VIC-II - Control (horizontal fine scroll / multicolor/bitmap-related bits)
- $D018 - VIC-II - Memory pointers (screen/charset/bitmap base addresses)

## References
- "raster_compare_irq_and_raster_scan_basics" — how raster interrupts allow mid-screen register changes  
- "sample_program_registers_and_data_locations" — registers and data tables used by the sample program  
- "raster_interrupt_example_basic_and_data_listing" — full BASIC + machine-code sample that implements the split-screen

## Labels
- VIC_CTRL1
- VIC_CTRL2
- VIC_MEM_CTRL
- VIC_RASTER
- VIC_IRQ_STATUS
- VIC_IRQ_ENABLE
- VIC_BORDER_COL
- VIC_BG_COL0
