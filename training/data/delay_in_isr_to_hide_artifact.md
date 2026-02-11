# Hide raster color-change smear by delaying background write into the border

**Summary:** Use a raster interrupt plus a deliberate delay in the interrupt service routine so the write to the VIC-II background color register ($D021) occurs while the beam is in the screen border (border $D020), avoiding visible color-change smear. Keywords: raster timing, VIC-II, $D021, $D020, $D012, raster interrupt.

**Technique**

Set a raster interrupt to trigger on or slightly before the raster line where you want a color change. In the interrupt service routine (ISR), delay for a short, controlled number of CPU cycles (for example with NOPs or a tight decrement/branch loop) and only then write the new background color to $D021. By postponing the actual write until the VIC-II is rendering the border area, the VIC-II will apply the color change outside the visible text/bitmap area and the smear (visible when the color change happens while fetching/rendering screen data) will not be seen.

**Why it works**

The VIC-II samples color registers at specific times relative to the raster beam. If a color register is changed while the chip is in the middle of fetching or drawing visible screen data, partial update of the displayed character/bitmap line produces a horizontal smear. Delaying the write so it occurs when the beam is over the border guarantees the change is applied outside the visible area (border pixels), preventing smeared pixels on the main screen.

**Implementation notes**

- Trigger the raster IRQ early enough so the ISR has room to run and perform the intended cycle delay before the beam reaches the visible screen area you care about.
- Use a fixed-cycle delay (NOPs) or a tight loop whose cycle count you know exactly to position the write precisely.
- Keep the ISR short and deterministic—other long operations inside the ISR can shift timing and defeat the technique.
- If you need multiple color changes per frame, repeat the same pattern with different raster lines and delays.
- Exact delay (number of cycles) depends on the raster line, PAL/NTSC timing, and what part of the border you want to hit; measure on target hardware or consult raster timing references.

**Example Timing for PAL vs NTSC**

The Commodore 64's VIC-II chip operates differently between PAL and NTSC systems, affecting raster timing:

- **PAL Systems:**
  - 312 total raster lines per frame.
  - Each line consists of 63 CPU cycles.
  - CPU clock speed: approximately 0.985 MHz.

- **NTSC Systems:**
  - 262 total raster lines per frame.
  - Each line consists of 65 CPU cycles.
  - CPU clock speed: approximately 1.023 MHz.

These differences mean that the exact number of cycles required to delay the background color write into the border will vary between PAL and NTSC systems. Precise timing adjustments should be made based on the system's specifications.

**ISR Example Assembly Listing**

Below is an example of an Interrupt Service Routine (ISR) that delays the background color change to occur during the border area:


In this example, the ISR is triggered by a raster interrupt. It first sets the background color to blue, then enters a delay loop to wait until the raster beam is in the border area before setting the background color to black. The exact number of cycles in the delay loop should be adjusted based on whether the system is PAL or NTSC to ensure the color change occurs during the border.

## Source Code

```assembly
sei                 ; Disable interrupts
lda #$7f
sta $dc0d           ; Disable CIA interrupts
sta $dd0d
lda $dc0d           ; Acknowledge any pending CIA interrupts
lda $dd0d
lda #$01
sta $d01a           ; Enable raster interrupt
lda #<irq1
sta $fffe           ; Set IRQ vector to irq1
lda #>irq1
sta $ffff
cli                 ; Enable interrupts

; Main loop
spin:
    jmp spin

irq1:
    pha             ; Save registers
    txa
    pha
    tya
    pha

    lda #$06        ; Set background color to blue
    sta $d021

    lda #$ff        ; Delay loop
delay:
    dex
    bne delay

    lda #$00        ; Set background color to black
    sta $d021

    lda #$01
    sta $d019       ; Acknowledge VIC-II interrupt

    pla             ; Restore registers
    tay
    pla
    tax
    pla
    rti             ; Return from interrupt
```


## Key Registers

- $D012 - VIC-II - Raster counter / raster compare for triggering raster interrupts
- $D020 - VIC-II - Border color register
- $D021 - VIC-II - Background color register (this is the register you delay-writing to)

## References

- "Raster interrupt - C64-Wiki"
- "Commodore 64 Programming | 8Bit Computers"
- "Commodore 64 'Hello World' with raster interrupt colour band · GitHub"
- "Commodore 64 Color Bars - Programmermind"
- "Commodore 64 - Wikipedia"
- "MOS Technology VIC-II - Wikipedia"
- "Raster interrupt - Wikipedia"
- "Commodore 64 'Hello World' with raster interrupt colour band · GitHub"
- "Commodore 64 Color Bars - Programmermind"
- "Commodore 64 - Wikipedia"
- "MOS Technology VIC-II - Wikipedia"
- "Raster interrupt - Wikipedia"