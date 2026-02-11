# CHROUT/OUTPUT dispatch start — save char and select device

**Summary:** Kernel CHROUT/OUTPUT entry (ROM $F1CA-$F1CF) saves the output character (PHA), reads the output device number from zero page $009A, and compares it to the screen device code #$03 to route output (screen vs other device).

## Device selection and dispatch (CHROUT start)
This ROM fragment is the very start of the kernel CHROUT/OUTPUT dispatch. It:
- pushes the character to be output onto the stack (PHA) so the character is preserved while the kernel inspects and prepares device-specific state;
- loads the current output device number from zero page $009A (kernel variable for "current output device");
- compares that device number with #$03 (the screen device code); and
- branches if not equal to the screen device, continuing to a different path for device-specific handling.

In short: this sequence preserves the character and decides whether to follow the screen-output path (fall-through) or jump to non-screen device handling (BNE to $F1D5). The PHA ensures the same character byte is available for any subsequent device handler (screen, serial, IEC, printer, etc.).

## Source Code
```asm
.,F1CA 48       PHA             save the character to output
.,F1CB A5 9A    LDA $9A         get the output device number
.,F1CD C9 03    CMP #$03        compare the output device with the screen
.,F1CF D0 04    BNE $F1D5       if not the screen go ??
```

## Key Registers
- $009A - Kernel zero page variable - current output device number (device code; #$03 = screen)
- $F1CA-$F1CF - KERNAL ROM - CHROUT/OUTPUT entry (save char and device dispatch start)

## References
- "display_control_io_message_if_direct_mode" — expands on using the same CHROUT vector to output kernel messages
- "rs232_tx_timer_setup_and_start" — expands on transmit timer setup used for serial device output

## Labels
- CHROUT
- OUTPUT
