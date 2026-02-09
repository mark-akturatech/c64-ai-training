# Minimal C64 Datasette Loader — Wait for PLAY

**Summary:** Entry-point code for a datasette loader that polls the processor port at address $0001, specifically bit 4, to detect when the PLAY button is pressed. The code waits for the PLAY button to be pressed before proceeding to disable interrupts, prepare the screen, and enable the datasette motor.

**Description**

This is the initial stage of a datasette loader, performing the following steps:

- **LDA #$10**: Load the accumulator with the mask $10 (bit 4).
- **Loop labeled m1**:
  - **BIT $01**: Test memory at zero-page address $0001 against the accumulator. The BIT instruction sets the processor flags based on the result of the AND operation between the accumulator and the memory content.
  - **BNE m1**: Branch back to m1 if the zero flag is not set (i.e., if the result of the AND operation is non-zero).

**Behavior Summary**: The code loops while bit 4 of $0001 is set (indicating no datasette button is pressed) and exits when bit 4 is cleared (indicating a button is pressed). This waiting occurs before the subsequent steps of disabling interrupts, preparing the screen, and turning on the datasette motor.

**Notes on Operation**:

- **BIT Instruction**: This instruction does not change the accumulator; it updates the processor flags based on the result of the AND operation between the accumulator and the memory content.
- **Mask Used**: The mask $10 (bit 4) is used to isolate the status of the datasette button. This is set via **LDA #$10** immediately before the loop.
- **Processor Port ($0001)**: This port is used to control and monitor various hardware functions, including the datasette. Specifically:
  - **Bit 4**: Datasette button status; 0 = One or more of PLAY, RECORD, F.FWD, or REW pressed; 1 = No button pressed.
  - **Bit 5**: Datasette motor control; 0 = On; 1 = Off.

**Continuation After the Wait Loop**:

After detecting that the PLAY button has been pressed, the following routines are typically executed:

1. **Disable Interrupts and Prepare Screen**:
   - **SEI**: Disable interrupts to prevent any interrupt from occurring during the setup.
   - **LDA #$7F**: Load the accumulator with $7F to disable CIA interrupts.
   - **STA $DC0D**: Store $7F into CIA#1 Interrupt Control Register to disable its interrupts.
   - **STA $DD0D**: Store $7F into CIA#2 Interrupt Control Register to disable its interrupts.
   - **LDA #$01**: Load the accumulator with $01 to enable raster interrupts.
   - **STA $D01A**: Store $01 into the VIC-II Interrupt Enable Register to enable raster interrupts.
   - **LDA #$1B**: Load the accumulator with $1B to set the screen mode.
   - **LDX #$08**: Load the X register with $08 to set the horizontal scroll.
   - **LDY #$14**: Load the Y register with $14 to set the video matrix base address.
   - **STA $D011**: Store $1B into the VIC-II Control Register 1 to set the screen mode.
   - **STX $D016**: Store $08 into the VIC-II Control Register 2 to set the horizontal scroll.
   - **STY $D018**: Store $14 into the VIC-II Memory Control Register to set the video matrix base address.

2. **Enable Datasette Motor**:
   - **LDA $0001**: Load the current value of the processor port.
   - **AND #%11011111**: Clear bit 5 to turn on the datasette motor.
   - **STA $0001**: Store the modified value back to the processor port.

## Source Code

```asm
    lda #$10
m1: bit $01
    bne m1
    sei
    lda #$7f
    sta $dc0d
    sta $dd0d
    lda #$01
    sta $d01a
    lda #$1b
    ldx #$08
    ldy #$14
    sta $d011
    stx $d016
    sty $d018
    lda $01
    and #%11011111
    sta $01
```

## Key Registers

- **$0001**: Processor port; bit 4 is used to detect datasette button presses, and bit 5 controls the datasette motor.
- **$DC0D**: CIA#1 Interrupt Control Register; used to disable CIA#1 interrupts.
- **$DD0D**: CIA#2 Interrupt Control Register; used to disable CIA#2 interrupts.
- **$D01A**: VIC-II Interrupt Enable Register; used to enable raster interrupts.
- **$D011**: VIC-II Control Register 1; used to set the screen mode.
- **$D016**: VIC-II Control Register 2; used to set the horizontal scroll.
- **$D018**: VIC-II Memory Control Register; used to set the video matrix base address.

## References

- "disable_interrupts_and_screen" — routines that follow this wait and prepare CPU/VID settings
- "enable_datasette_motor" — routine that turns the tape motor on after preparations