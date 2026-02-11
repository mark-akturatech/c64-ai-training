# Step-by-step raster IRQ setup example (C64 / 6502)

**Summary:** This 6502 assembly example demonstrates setting up a VIC-II raster interrupt on the Commodore 64. The process involves disabling CPU interrupts, configuring the CIA and VIC-II registers, installing the IRQ vector, and implementing an interrupt handler that flashes the border color. The example also references ROM handlers at $EA31 and $EA81 and discusses a BASIC testing technique using RTS and JMP $EA31.

**Explanation**

This example provides a minimal working sequence to install a raster interrupt (IRQ) and a simple Interrupt Service Routine (ISR) that toggles the border color.

**Setup sequence:**

1. **Disable CPU interrupts:**
   - `SEI` — Disables CPU interrupts to prevent partial or invalid setup during handler installation.

2. **Disable CIA interrupts:**
   - Write $7F to $DC0D and $DD0D to disable CIA 1 and CIA 2 interrupts, respectively.

3. **Enable VIC-II raster interrupts:**
   - Set bit 0 of $D01A (Interrupt Enable Register) to enable raster interrupts.

4. **Initialize VIC-II control registers:**
   - $D011 — Control Register 1:
     - Bit 7: High bit of the raster line.
     - Bits 6-0: Select text/graphics mode.
   - $D016 — Control Register 2:
     - Controls character/bitmap mode and other flags (e.g., single-color mode).
   - $D018 — Memory Control Register:
     - Sets screen and character memory pointers.

5. **Install the IRQ vector:**
   - Store the address of the interrupt handler at $0314 (low byte) and $0315 (high byte).

6. **Set the target raster line:**
   - Write the desired raster line number to $D012 (low 8 bits).
   - If the line number is 256 or greater, set bit 7 of $D011 accordingly to account for the high bit.

7. **Acknowledge any pending interrupts:**
   - Read $DC0D and $DD0D to acknowledge any pending CIA interrupts.
   - Write a 1 to the relevant bit in $D019 to acknowledge any pending VIC-II interrupts (e.g., using `ASL $D019`).

8. **Re-enable CPU interrupts:**
   - `CLI` — Re-enables CPU interrupts, allowing the IRQ to fire.

**Interrupt handler:**

- `INC $D020` — Changes the border color to create a flashing effect.
- `ASL $D019` — Acknowledges the interrupt by writing a 1 to the relevant bit in $D019.
- Restores registers from the stack and executes `RTI` to return from the interrupt.

**Notes and alternatives:**

- Many demos use a ROM jump instead of duplicating the small `RTI` epilogue: `JMP $EA31` or `JMP $EA81`. This trades a few cycles for a few bytes. If the KERNAL/ROM is switched out, these ROM handlers won't be available.
- **Testing trick:** Have the main program execute `RTS` (returning to BASIC), then use `JMP $EA31`. The IRQ will run while you remain at the BASIC prompt.

**[Note: The example ISR pulls A/X/Y from the stack with `PLA` instructions, but the setup does not push these registers. The 6502 hardware only pushes the Program Counter (PC) and Processor Status (P) on an IRQ. The ISR must explicitly preserve and restore A/X/Y (using `PHA`, `PHX`, `PHY`, or equivalent) if it expects to pop these values.]**

## Source Code
```asm
* = $1000

        sei          ; Disable CPU interrupts
        lda #$7f
        ldx #$01
        sta $dc0d    ; Disable CIA 1 interrupts
        sta $dd0d    ; Disable CIA 2 interrupts
        stx $d01a    ; Enable raster interrupts

        lda #$1b
        ldx #$08
        ldy #$14
        sta $d011    ; Clear high bit of $d012, set text mode
        stx $d016    ; Set single-color mode
        sty $d018    ; Set screen at $0400, charset at $2000

        lda #<int    ; Low byte of interrupt handler address
        ldx #>int    ; High byte of interrupt handler address
        ldy #$80     ; Raster line to trigger interrupt
        sta $0314    ; Store in interrupt vector
        stx $0315
        sty $d012

        lda $dc0d    ; Acknowledge CIA 1 interrupts
        lda $dd0d    ; Acknowledge CIA 2 interrupts
        asl $d019    ; Acknowledge VIC-II interrupts
        cli          ; Re-enable CPU interrupts

loop:
        jmp loop     ; Infinite loop

int:
        inc $d020    ; Flash border

        asl $d019    ; Acknowledge interrupt (to re-enable it)
        pla
        tay
        pla
        tax
        pla
        rti          ; Return from interrupt
```

## Key Registers
- **$D000-$D02E**: VIC-II registers, including:
  - **$D011**: Control Register 1
  - **$D012**: Raster Register
  - **$D016**: Control Register 2
  - **$D018**: Memory Control Register
  - **$D019**: Interrupt Status Register
  - **$D01A**: Interrupt Enable Register
  - **$D020**: Border Color Register
- **$DC00-$DC0F**: CIA 1 registers, including:
  - **$DC0D**: Interrupt Control Register
- **$DD00-$DD0F**: CIA 2 registers, including:
  - **$DD0D**: Interrupt Control Register
- **$0314-$0315**: CPU IRQ/BRK vector (low/high address of IRQ handler)

## References
- "d012_raster_register" — Details on writing to $D012 to select the raster line.
- "stable_raster_interrupts" — Techniques to reduce jitter in raster interrupts.

## Labels
- D011
- D012
- D016
- D018
- D019
- D01A
- D020
- DC0D
