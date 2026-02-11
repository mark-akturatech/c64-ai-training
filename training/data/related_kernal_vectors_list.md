# KERNAL IEC Serial Bus Vectors ($FFBA–$FFD8)

**Summary:** KERNAL ROM vectors for Commodore 64 IEC serial bus and logical I/O: $FFBA SETLFS, $FFBD SETNAM, $FFC0 OPEN, $FFC3 CLOSE, $FFC6 CHKIN, $FFC9 CHKOUT, $FFCC CLRCHN, $FFCF CHRIN, $FFD2 CHROUT, $FFD5 LOAD, $FFD8 SAVE.

**KERNAL Vectors (IEC / Logical I/O)**

This section details the primary KERNAL vector entry points related to opening, closing, selecting channels, and basic file/device I/O used with the C64 IEC serial bus.

- **$FFBA SETLFS** — Set logical file parameters
  - **Purpose:** Sets the logical file number, device address, and secondary address for subsequent file operations.
  - **Input:**
    - A: Logical file number (0–127)
    - X: Device number (0–31)
    - Y: Secondary address (0–31) or 255 if not used
  - **Usage:**
  - **Example:**
  - **Notes:** The logical file number is used to reference the file in subsequent operations. Device numbers correspond to specific hardware devices (e.g., 8 for disk drive).

- **$FFBD SETNAM** — Set filename
  - **Purpose:** Sets the filename and its length for subsequent file operations.
  - **Input:**
    - A: Length of the filename (0–16)
    - X/Y: Pointer to the filename string
  - **Usage:**
  - **Example:**
  - **Notes:** The filename should be stored in memory, and its address passed via X and Y registers.

- **$FFC0 OPEN** — Open logical file
  - **Purpose:** Opens a file or device for input/output operations.
  - **Input:** None (uses parameters set by SETLFS and SETNAM)
  - **Usage:**
  - **Example:**
  - **Notes:** Before calling OPEN, ensure SETLFS and SETNAM have been called to set the necessary parameters.

- **$FFC3 CLOSE** — Close logical file
  - **Purpose:** Closes a previously opened file or device.
  - **Input:**
    - A: Logical file number to close
  - **Usage:**
  - **Example:**
  - **Notes:** Closing a file releases the logical file number for reuse.

- **$FFC6 CHKIN** — Set input channel
  - **Purpose:** Sets the input channel to a specific logical file number.
  - **Input:**
    - A: Logical file number to set as input
  - **Usage:**
  - **Example:**
  - **Notes:** After setting the input channel, CHRIN can be used to read data from it.

- **$FFC9 CHKOUT** — Set output channel
  - **Purpose:** Sets the output channel to a specific logical file number.
  - **Input:**
    - A: Logical file number to set as output
  - **Usage:**
  - **Example:**
  - **Notes:** After setting the output channel, CHROUT can be used to write data to it.

- **$FFCC CLRCHN** — Restore default I/O channels
  - **Purpose:** Restores the default input and output channels (keyboard and screen).
  - **Input:** None
  - **Usage:**
  - **Example:**
  - **Notes:** This routine should be called after custom I/O operations to reset the channels.

- **$FFCF CHRIN** — Read character from input channel
  - **Purpose:** Reads a single character from the current input channel.
  - **Output:**
    - A: Character read
  - **Usage:**
  - **Example:**
  - **Notes:** Ensure an input channel is set using CHKIN before calling CHRIN.

- **$FFD2 CHROUT** — Write character to output channel
  - **Purpose:** Writes a single character to the current output channel.
  - **Input:**
    - A: Character to write
  - **Usage:**
  - **Example:**
  - **Notes:** Ensure an output channel is set using CHKOUT before calling CHROUT.

- **$FFD5 LOAD** — Load file from device
  - **Purpose:** Loads a file from a device into memory.
  - **Input:**
    - A: 0 for load, 1 for verify
    - X/Y: Address to load to
  - **Output:**
    - A: 0 if successful, error code otherwise
  - **Usage:**
  - **Example:**
  - **Notes:** Ensure SETLFS and SETNAM have been called to set the file parameters before calling LOAD.

- **$FFD8 SAVE** — Save file to device
  - **Purpose:** Saves a block of memory to a device.
  - **Input:**
    - A: 0 for normal save, 1 for replace
    - X/Y: Start address of data
    - $AE/$AF: End address of data
  - **Output:**
    - A: 0 if successful, error code otherwise
  - **Usage:**
  - **Example:**
  - **Notes:** Ensure SETLFS and SETNAM have been called to set the file parameters before calling SAVE.

## Source Code

    ```assembly
    LDA #<logical_file_number>
    LDX #<device_number>
    LDY #<secondary_address>
    JSR $FFBA
    ```

    ```assembly
    ; Set logical file 1 to device 8 with no secondary address
    LDA #1
    LDX #8
    LDY #255
    JSR $FFBA
    ```

    ```assembly
    LDA #<filename_length>
    LDX #<filename_pointer_low_byte>
    LDY #<filename_pointer_high_byte>
    JSR $FFBD
    ```

    ```assembly
    ; Set filename to "DATA"
    LDA #4
    LDX #<low_byte_of_filename_pointer>
    LDY #<high_byte_of_filename_pointer>
    JSR $FFBD
    ```

    ```assembly
    JSR $FFC0
    ```

    ```assembly
    ; Open the file/device with parameters set by SETLFS and SETNAM
    JSR $FFC0
    ```

    ```assembly
    LDA #<logical_file_number>
    JSR $FFC3
    ```

    ```assembly
    ; Close logical file 1
    LDA #1
    JSR $FFC3
    ```

    ```assembly
    LDA #<logical_file_number>
    JSR $FFC6
    ```

    ```assembly
    ; Set logical file 1 as input channel
    LDA #1
    JSR $FFC6
    ```

    ```assembly
    LDA #<logical_file_number>
    JSR $FFC9
    ```

    ```assembly
    ; Set logical file 1 as output channel
    LDA #1
    JSR $FFC9
    ```

    ```assembly
    JSR $FFCC
    ```

    ```assembly
    ; Restore default I/O channels
    JSR $FFCC
    ```

    ```assembly
    JSR $FFCF
    ; Character is now in A
    ```

    ```assembly
    ; Read a character and store it in memory
    JSR $FFCF
    STA $0200
    ```

    ```assembly
    LDA #<character>
    JSR $FFD2
    ```

    ```assembly
    ; Write character 'A' to the output channel
    LDA #'A'
    JSR $FFD2
    ```

    ```assembly
    LDA #0
    LDX #<load_address_low_byte>
    LDY #<load_address_high_byte>
    JSR $FFD5
    ```

    ```assembly
    ; Load file to address $0800
    LDA #0
    LDX #$00
    LDY #$08
    JSR $FFD5
    ```

    ```assembly
    LDA #0
    LDX #<start_address_low_byte>
    LDY #<start_address_high_byte>
    STA $AE
    STY $AF
    JSR $FFD8
    ```

    ```assembly
    ; Save memory from $0800 to $0FFF
    LDA #0
    LDX #$00
    LDY #$08
    STA $AE
    STY $AF
    LDX #$FF
    LDY #$0F
    JSR $FFD8
    ```

## Labels
- SETLFS
- SETNAM
- OPEN
- CLOSE
- CHKIN
- CHKOUT
- CLRCHN
- CHRIN
- CHROUT
- LOAD
- SAVE
