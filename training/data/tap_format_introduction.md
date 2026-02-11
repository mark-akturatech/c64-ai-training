# Tap file format (C64 tape images)

**Summary:** Describes the TAP file format purpose (pulse-by-pulse cassette data capture for the C64) and points to CCS64/Computerbrains documentation; references CIA chips ($DC00-$DC0F, $DD00-$DD0F) and CPU vectors ($FFFA-$FFFF) as relevant to tape/loader behavior.

**Tap Format**

The TAP format stores cassette data as a sequence of recorded pulse lengths, providing a precise reproduction of the original C64 cassette signal. This enables emulators and tools to replicate the exact timing used by C64 cassette loaders and copy-protection schemes.

### TAP File Structure

A TAP file consists of a header followed by the data block:

- **Header (20 bytes):**
  - **Signature (12 bytes):** Identifies the file type. For C64, this is "C64-TAPE-RAW".
  - **Version (1 byte):** Indicates the TAP format version. Common values are 0, 1, or 2.
  - **Machine Type (1 byte):** Specifies the target machine:
    - 0x00: C64/C128
    - 0x01: VIC-20
    - 0x02: C16/Plus4
  - **Video System (1 byte):** Denotes the video standard:
    - 0x00: PAL
    - 0x01: NTSC
  - **Reserved (1 byte):** Reserved for future use; typically set to 0x00.
  - **Data Size (4 bytes):** Length of the data block in bytes, stored in little-endian format.

- **Data Block:** Contains the pulse width data representing the cassette signal.

### Pulse Length Encoding

Pulse lengths are encoded differently based on the TAP version:

- **Version 0:**
  - Each byte represents the number of machine cycles multiplied by 8 that each pulse lasts.
  - Pulse length calculation:
    where `CPU_frequency` depends on the machine and video system. For example, a PAL C64 has a CPU frequency of 985248 Hz.

- **Version 1:**
  - Similar to version 0, but with a different method for encoding long pulses.
  - A byte value of 0x00 indicates a long pulse, followed by three bytes representing the exact number of clock cycles for the pulse length.

- **Version 2:**
  - Introduces half-wave recording, primarily used for C16 tapes.

### Example Calculation

For a byte value of 0x30 (48 in decimal) in a TAP file created for a PAL C64:


This means the pulse lasts approximately 389.74 microseconds.

**CIA Registers and Cassette Interface**

The Commodore 64 uses two Complex Interface Adapter (CIA) chips to manage various I/O operations, including cassette data handling.

### CIA 1 ($DC00-$DC0F)

- **Data Port A ($DC00):** Controls the keyboard and joystick inputs.
- **Data Port B ($DC01):** Manages the datasette control lines.
  - **Bit 3 (Motor Control):** Controls the cassette motor. Set to 0 to turn the motor on, 1 to turn it off.
  - **Bit 4 (Read Data):** Reads data from the cassette. A transition from high to low indicates a pulse.
- **Timer A ($DC04/$DC05):** Used for timing operations during cassette read/write processes.
- **Interrupt Control Register ($DC0D):** Manages interrupts. The FLAG line (bit 4) is used to detect cassette read data pulses.

### Cassette Read Operation

When reading data from a cassette:

1. **Motor Control:** Set bit 3 of Data Port B to 0 to turn on the cassette motor.
2. **Data Reading:** Monitor bit 4 of Data Port B for transitions indicating data pulses.
3. **Timing:** Use Timer A to measure the duration between pulses to reconstruct the data.

### Example Code

## Source Code

    ```
    Pulse_length = Data_byte * (8 / CPU_frequency)
    ```

```
Pulse_length = 48 * (8 / 985248) ≈ 389.74 µs
```

```assembly
; Turn on cassette motor
LDA #$EF        ; 11101111
AND $DC01       ; Clear bit 3
STA $DC01       ; Write back to Data Port B

; Wait for data pulse
WaitForPulse:
LDA $DC01       ; Read Data Port B
AND #$10        ; Mask bit 4
BEQ WaitForPulse ; Loop until bit 4 is low

; Pulse detected, process data...
```



## Key Registers

- **$DC00-$DC0F - CIA 1:** Controls keyboard, joystick, and datasette operations.
- **$DD00-$DD0F - CIA 2:** Manages user port and serial communications.
- **$FFFA-$FFFF - 6502 CPU Vectors:** Handles NMI, RESET, and IRQ/BRK vectors.

## References

- "tapformat.html" — CCS64 / Computerbrains TAP format documentation (detailed spec)
- "tap_format_conversion" — Numeric conversion from pulse length to TAP byte values
- "Terminator 2 loader analysis" — Referenced loader analysis (contains CIA and vector notes)