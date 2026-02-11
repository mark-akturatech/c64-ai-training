# A Minimal C64 Datasette Program Loader

**Summary:** This document details a minimal cassette (Datasette) program loader for the Commodore 64, implemented in compact 6502 assembly code under 200 bytes. The loader decodes the Datasette's pulse-encoded format without error correction, making it suitable for inclusion in space-constrained custom KERNALs. It covers pulse-encoding techniques, KERNAL integration, and associated trade-offs.

**Purpose and Context**

The objective is to provide a compact (sub-200-byte) 6502 assembly loader that decodes the Commodore Datasette's pulse-encoded tape format without performing error correction. This allows cassette compatibility to be retained in custom KERNAL builds where space is limited.

**Motivation:**

Many custom KERNALs remove the original tape routines to reclaim ROM space. This minimal loader aims to restore basic cassette loading capability with a tiny footprint.

**Scope:**

The loader is designed to decode the Datasette format sufficiently to load typical program blocks. It is not intended to be a full replacement of the KERNAL loader, as it lacks CRC checks, retries, and robust error handling.

**Design Constraints and Trade-offs**

- **Size Constraint:** The implementation must fit under approximately 200 bytes of assembled 6502 code, necessitating simplicity and the omission of robust error handling.

- **Protocol Handling:** The loader decodes the pulse-encoded bitstream from the Datasette using a minimal state machine to distinguish between short and long pulses.

- **No Error Correction:** The loader deliberately omits checks, retries, and complex recovery mechanisms. This is acceptable for controlled or relatively clean tapes but may be fragile on noisy recordings.

- **Integration Target:** Designed for embedding in space-constrained KERNALs, the caller is expected to perform higher-level control, such as user interface management, file header parsing, and final placement of loaded data.

- **Performance and Timing:** The loader must sample tape input timing accurately enough to discriminate encoded pulses. Exact timing and tolerance windows depend on the hardware sampling method employed.

**Datasette Pulse Timing Parameters**

The Commodore Datasette encodes data using pulses of varying lengths. Accurate pulse discrimination is essential for reliable data decoding.

**Pulse Durations:**

| Pulse Type | NTSC Duration | NTSC Frequency | PAL Duration | PAL Frequency |
|------------|---------------|----------------|--------------|---------------|
| Short      | 176 µs        | 2840 Hz        | 182.7 µs     | 2737 Hz       |
| Medium     | 256 µs        | 1953 Hz        | 265.7 µs     | 1882 Hz       |
| Long       | 336 µs        | 1488 Hz        | 348.8 µs     | 1434 Hz       |

*Note: The durations differ between NTSC and PAL systems due to clock frequency variations.*

**Bit Encoding:**

- Bit "0": Short pulse followed by Medium pulse
- Bit "1": Medium pulse followed by Short pulse

**Markers:**

- Byte Marker: Long pulse followed by Medium pulse
- End-of-Data Marker: Long pulse followed by Short pulse

*Source: [Datassette Encoding - C64-Wiki](https://www.c64-wiki.com/wiki/Datassette_Encoding)*

**Block/Record Format Details**

Each data block on a Datasette tape is structured as follows:

1. **Leader:** A sequence of short pulses (approximately 10 seconds for the first block, 2 seconds for subsequent blocks) to allow the tape motor to reach the correct speed and to synchronize the read routine timing.

2. **Sync:** A new data marker followed by a sync chain of 9 bytes: $89, $88, $87, $86, $85, $84, $83, $82, $81.

3. **Header:**

   - 1 Byte: File type
     - $01: BASIC program
     - $02: Data block for SEQ file
     - $03: PRG file
     - $04: SEQ file header
     - $05: End-of-tape marker
   - 2 Bytes: Start Address (LSB first)
   - 2 Bytes: End Address + 1 (LSB first)
   - 16 Bytes: File Name
   - 171 Bytes: Body (often used for additional data or code)
   - 1 Byte: Checksum (XOR of all header bytes from "File type" to end of "body")

4. **Data Block:**

   - 192 Bytes: Data (stored twice for redundancy)
   - 1 Byte: Checksum (XOR of all data bytes)

5. **Trailer:** A sequence of short pulses (approximately 60 pulses) following the data block.

*Source: [Tape Format – SID Preservation](https://sidpreservation.6581.org/tape-format/)*

**Hardware Interface Details**

The Datasette connects to the Commodore 64 via the cassette port, interfacing with the Complex Interface Adapter (CIA) chip.

**CIA Registers:**

- **Data Port A ($DC00):** Controls the cassette motor and senses the read signal.
  - Bit 3: Cassette Read Signal (1 = High, 0 = Low)
  - Bit 4: Cassette Motor Control (1 = Motor On, 0 = Motor Off)

- **Interrupt Control Register ($DC0D):** Monitors the FLAG line for cassette read operations.
  - Bit 4: FLAG Interrupt (1 = Interrupt Occurred)

**Sampling Method:**

To accurately sample the tape input:

1. **Timer Method:** Configure Timer A to count system clock cycles. On each falling edge of the read signal (detected via the FLAG interrupt), read the timer value to determine the pulse width.

2. **Polling Method:** Continuously poll the read signal and measure the time between state changes using a software loop.

*Note: The timer method is generally more accurate and less CPU-intensive.*

*Source: [Commodore 64 Memory Maps](https://www.scribd.com/document/40443/Commodore-64-Memory-Maps-various-authors)*

**Example Integration Code**

To integrate the minimal loader, a routine to wait for the user to press PLAY and start the loader is required. Below is an example in 6502 assembly:


*Note: This routine waits for the Cassette Sense line to go low, indicating that the PLAY button has been pressed.*

**Test Vectors**

To validate the decoder, test vectors or example tape waveform data are essential. Below is an example of a bit sequence and its corresponding pulse pattern:

**Bit Sequence:** 0, 1, 0, 1

**Pulse Pattern:**

- Bit 0: Short pulse (176 µs) + Medium pulse (256 µs)
- Bit 1: Medium pulse (256 µs) + Short pulse (176 µs)
- Bit 0: Short pulse (176 µs) + Medium pulse (256 µs)
- Bit 1: Medium pulse (256 µs) + Short pulse (176 µs)

*Note: Timing values are for NTSC systems.*

*Source: [Datassette Encoding - C64-Wiki](https://www.c64-wiki.com/wiki/Datassette_Encoding)*

## Source Code

```assembly
; Wait for PLAY to be pressed and start the loader
wait_for_play:
    lda #$10            ; Bit 4: Cassette Sense
    sta $dc02           ; Set Data Direction Register for Port A
    lda $dc00           ; Read Data Port A
    and #$10            ; Mask Cassette Sense bit
    beq wait_for_play   ; Loop until PLAY is pressed
    ; Initialize and start the loader here
    rts
```


## References

- "pulse_encoding_intro" — expands on format complexity and trade-offs
- "complete_loader_wait_for_play" — expands on how loader integrates in a complete implementation