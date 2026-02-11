# Sprite Multiplexing (Brief)

**Summary:** Sprite multiplexing on the Commodore 64 involves reusing the VIC-II's hardware sprite resources during different parts of the video frame, allowing the display of more than the standard eight sprites on the screen simultaneously. This technique enables more complex animations and a greater number of moving objects in games.

**Overview**

Sprite multiplexing is achieved by dynamically updating sprite registers during the screen refresh process. By changing sprite positions, pointers, and other attributes at precise moments—typically using raster interrupts—a program can reuse the same hardware sprites multiple times within a single frame. This method allows for the appearance of more than eight sprites on the screen, overcoming the VIC-II's hardware limitation.

**Implementation Steps**

1. **Sort Sprites by Y-Position:**
   - Organize the logical sprites based on their vertical positions on the screen. This sorting helps in determining the order and timing for updating sprite registers during the raster interrupts.

2. **Assign Sprites to Buckets:**
   - Divide the sorted sprites into groups or "buckets," each corresponding to a specific range of raster lines. Each bucket will be processed during a designated raster interrupt.

3. **Set Up Raster Interrupts:**
   - Configure the VIC-II to generate interrupts at specific raster lines. This setup allows the program to execute code at precise moments during the screen refresh, enabling the dynamic updating of sprite registers.

4. **Update Sprite Registers During Interrupts:**
   - Within each raster interrupt service routine, update the sprite registers (such as position, pointer, and color) to display the desired sprites for that portion of the screen.

**Example Code**

The following assembly code demonstrates a basic sprite multiplexing routine using raster interrupts:


In this example, two raster interrupt routines (`irq1` and `irq2`) are set up to trigger at specific raster lines. Each routine updates the sprite registers to display different sprites at different vertical positions, effectively multiplexing the hardware sprites.

**VIC-II Register Usage for Multiplexing**

- **Sprite Enable Register ($D015):**
  - Each bit controls the visibility of a sprite. Set the corresponding bit to `1` to enable a sprite or `0` to disable it.

- **Sprite Position Registers ($D000–$D00F):**
  - These registers control the X and Y positions of each sprite. For example, `$D000` and `$D001` control the X and Y positions of sprite 0, respectively.

- **Sprite Pointer Registers ($07F8–$07FF):**
  - These registers point to the memory location of the sprite data. Each pointer is an offset multiplied by 64, indicating the start of the sprite data in memory.

- **Raster Line Register ($D012):**
  - This register holds the current raster line number. Writing a value to this register sets the raster line at which the next interrupt will occur.

- **Interrupt Status Register ($D019):**
  - This register indicates the source of the interrupt. Writing the same value back acknowledges the interrupt.

- **Interrupt Enable Register ($D01A):**
  - This register enables or disables specific interrupts. Setting bit 0 enables raster interrupts.

## Source Code

```assembly
; Initialize raster interrupt
sei                     ; Disable interrupts
lda #<irq1              ; Load low byte of irq1 address
sta $0314               ; Store at IRQ vector low byte
lda #>irq1              ; Load high byte of irq1 address
sta $0315               ; Store at IRQ vector high byte
lda #$01                ; Raster line 1
sta $d012               ; Set raster line for interrupt
lda $d011               ; Read control register 1
ora #$80                ; Set bit 7 to enable raster interrupt
sta $d011               ; Write back to control register 1
lda #$01                ; Enable raster interrupt
sta $d01a               ; Write to interrupt enable register
cli                     ; Enable interrupts
rts                     ; Return from subroutine

; Raster interrupt service routine
irq1:
    ; Acknowledge interrupt
    lda $d019
    sta $d019

    ; Update sprite registers for current raster line
    ; (Insert code to update sprite positions, pointers, etc.)

    ; Set up next raster interrupt
    lda #<irq2
    sta $0314
    lda #>irq2
    sta $0315
    lda #$50                ; Next raster line
    sta $d012

    rti                     ; Return from interrupt

irq2:
    ; Acknowledge interrupt
    lda $d019
    sta $d019

    ; Update sprite registers for current raster line
    ; (Insert code to update sprite positions, pointers, etc.)

    ; Set up next raster interrupt
    lda #<irq1
    sta $0314
    lda #>irq1
    sta $0315
    lda #$a0                ; Next raster line
    sta $d012

    rti                     ; Return from interrupt
```


## References

- "Sprite Multiplexing: Breaking the 8-Sprite Barrier" — Discusses the concept and implementation of sprite multiplexing on the Commodore 64. ([commodorelove.com](https://commodorelove.com/2025/09/03/coding/sprite-multiplexing/?utm_source=openai))
- "Programming sprites on the Commodore 64, a simple tutorial using BASIC V2" — Provides a tutorial on programming sprites, including multiplexing techniques. ([retro64.altervista.org](https://retro64.altervista.org/blog/programming-sprites-the-commodore-64-simple-tutorial-using-basic-v2/?utm_source=openai))
- "C64 Programmer's Reference Guide: Programming Graphics - Sprites" — Offers detailed information on sprite programming and VIC-II registers. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_134.html?utm_source=openai))