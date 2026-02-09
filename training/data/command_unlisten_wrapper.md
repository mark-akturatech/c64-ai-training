# ROM Wrapper at $FFAE — JMP $EDFE (UNLISTEN on serial bus)

**Summary:** Wrapper entry at $FFAE that executes the JMP $EDFE mnemonic to call the UNLISTEN serial-bus routine; transmits an UNLISTEN command to cause listening devices to stop receiving data on the serial bus.

**Purpose**
This ROM wrapper at $FFAE simply jumps to the routine located at $EDFE, which transmits an UNLISTEN command on the serial bus. Calling this wrapper results in an UNLISTEN being sent; only devices that were previously commanded to LISTEN will be affected. The wrapper is intended to be used after the computer finishes sending data to external devices, to free the serial bus for other use.

## Source Code
```asm
.,FFAE 4C FE ED JMP $EDFE       ; command serial bus to UNLISTEN
```

**UNLISTEN Routine at $EDFE**
The routine at $EDFE is responsible for sending the UNLISTEN command on the serial bus. Below is the disassembly of this routine:


### Detailed Timing and Serial Protocol Actions
The UNLISTEN command ($3F) is transmitted over the serial bus using the following sequence:

1. **Attention (ATN) Line Activation:** The computer pulls the ATN line low to signal the start of a command sequence. All devices on the bus start listening for the address byte.

2. **Command Byte Transmission:** The UNLISTEN command byte ($3F) is sent over the DATA line, bit by bit, starting with the least significant bit (LSB). Each bit is synchronized with the CLOCK line:
   - **Data Bit Setup:** The DATA line is set according to the bit value (low for 1, high for 0).
   - **Clock Pulse:** The CLOCK line is toggled to signal the presence of a valid data bit. The timing for each bit is as follows:
     - **Bit Setup Time (T<sub>S</sub>):** Minimum 20µs, typical 70µs.
     - **Data Valid Time (T<sub>V</sub>):** Minimum 20µs.
     - **Frame Handshake Time (T<sub>F</sub>):** 0 to 1000µs.

3. **Listener Acknowledgment:** After the byte is transmitted, the listener(s) acknowledge receipt by pulling the DATA line low within 1000µs.

4. **ATN Line Release:** The computer releases the ATN line, completing the command sequence.

### Subroutines Used by $EDFE
The subroutine at $EDF0, called by the UNLISTEN routine, handles the actual transmission of the command byte over the serial bus. Its responsibilities include:
- Setting up the DATA and CLOCK lines for each bit.
- Managing the timing of each bit transmission.
- Handling acknowledgments from the listener devices.

## Source Code

```asm
EDFE   A9 3F      LDA #$3F      ; Load UNLISTEN command ($3F) into accumulator
EE00   20 F0 ED   JSR $EDF0     ; Jump to subroutine to send command
EE03   60         RTS           ; Return from subroutine
```


## References
- Commodore 64 Programmer's Reference Guide, Chapter 6: Input/Output Guide
- "How The VIC/64 Serial Bus Works" by Jim Butterfield, COMPUTE! Magazine, July 1983
- "The Complete Commodore 64 ROM Disassembly" by Peter Gerrard and Kevin Bergin