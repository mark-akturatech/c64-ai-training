# Playing music inside an IRQ handler (C64)

**Summary:** To play music synchronized with the frame interrupts on the Commodore 64, initialize the music player before installing the IRQ handler. Then, within the IRQ handler, call the music player's play routine to ensure the music advances in sync with the display frame timing.

**Method**

1. **Initialize the Music Player:**
   - Before setting up the interrupt vectors, call the music player's initialization routine. This prepares the player to start processing music data.

2. **Install the IRQ Handler:**
   - After initializing the player, set up your IRQ handler. This involves:
     - Disabling interrupts during setup to prevent unintended behavior.
     - Configuring the IRQ vector to point to your custom handler.
     - Enabling raster interrupts to trigger the handler at a specific screen line.

3. **Call the Music Play Routine within the IRQ Handler:**
   - Inside your IRQ handler, include a `JSR` (Jump to SubRoutine) instruction to the music player's play routine. This ensures the music updates with each interrupt, maintaining synchronization with the display frames.

## Source Code

Below is an example assembly listing demonstrating the initialization of the music player and the integration of the play routine within the IRQ handler:

```assembly
; Set the program's starting address
*=$0810

; Initialize the music player
    LDA #$00
    TAX
    TAY
    JSR $1000  ; Call the music player's init routine at $1000

; Clear the screen
    JSR $E544

; Disable interrupts during setup
    SEI

; Disable CIA interrupts
    LDA #$7F
    STA $DC0D
    STA $DD0D

; Enable raster interrupts
    LDA #$01
    STA $D01A

; Set text mode and character set
    LDA #$1B
    LDX #$08
    LDY #$14
    STA $D011
    STX $D016
    STY $D018

; Set up the IRQ vector to point to our handler
    LDA #<irq
    LDX #>irq
    STA $0314
    STX $0315

; Set the raster line where the interrupt will trigger
    LDY #$00
    STY $D012

; Clear pending interrupts and acknowledge any existing IRQs
    LDA $DC0D
    LDA $DD0D
    ASL $D019

; Re-enable interrupts
    CLI

; Main program loop
loop:
    JMP loop

; IRQ handler
irq:
    ; Call the music player's play routine
    JSR $1006  ; Assuming the play routine is at $1006

    ; Acknowledge the interrupt
    ASL $D019

    ; Return from interrupt
    JMP $EA81  ; Jump to the system's IRQ return routine
```

In this example:

- The music player's initialization routine is called at address `$1000`.
- The IRQ handler is set up to trigger at raster line `$00` (top of the screen).
- Within the IRQ handler, the music player's play routine at `$1006` is called each frame to update the music.
- The interrupt is acknowledged by writing to `$D019`, and control is returned using a jump to `$EA81`, which is the system's IRQ return routine.

This setup ensures that the music player is synchronized with the screen's refresh rate, providing smooth and consistent audio playback during program execution.

## Key Registers

- **$D012**: Raster line register. Setting this determines at which screen line the raster interrupt will trigger.
- **$D019**: VIC-II Interrupt Register. Writing to this register acknowledges the interrupt.
- **$0314/$0315**: IRQ vector. These addresses point to the low and high bytes of the custom IRQ handler's address.

## References

- [Commodore 64 Programming #9: Interrupts and music](https://digitalerr0r.net/2011/05/01/commodore-64-programming-9-interrupts-and-music/)
- [Commodore 64 Programming #10: Multiple interrupts](https://digitalerr0r.net/2011/05/02/commodore-64-programming-10-multiple-interrupts/)
- [Kick Assembler Manual: An Example Interrupt](https://theweb.dk/KickAssembler/webhelp/content/ch02s02.html)