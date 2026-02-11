# C64 Cassette: data formatting, INPUT#/PRINT# pitfalls; paddle read ML routine; light pen & RS‑232 notes

**Summary:** Cassette tape data layout (PRINT#/INPUT# behavior, comma spacing, use of explicit separators such as CHR$(13)), a four‑paddle machine code read routine (uses CIA1 $DC00/$DC02 and SID pot registers $D419/$D41A), BASIC loader example (POKE/DATA/SYS), light‑pen latch registers ($D013/$D014), and RS‑232 interface details including wiring, register usage, handshaking, and sample code.

**Cassette Tape Data Layout and Programming Considerations**

- **PRINT# and INPUT# Behavior:**
  - When writing structured data to cassette from BASIC, `PRINT#` inserts variable spacing when commas are used between printed items; this affects raw tape text and can disrupt `INPUT#` parsing if a fixed field layout is expected.
  - **Recommendation:** Use explicit separators between data items when writing to tape to ensure `INPUT#` can reliably read the items back. Options include:
    - A single comma character between items (`CHR$(44)`), or
    - A fixed end‑of‑item marker such as `CHR$(13)` (carriage return).
  - **Examples:**
    - *Incorrect* (variable spacing introduced by `PRINT#`):
      This may produce variable spaces between values on tape.
    - *Correct* (explicit separators):
      Or:
- **Editing Considerations:**
  - If possible, read an entire cassette file into RAM (or use disk) for editing; on large files, use disk to avoid repeated tape I/O and parsing fragility.
- **KERNAL Cassette Routines:**
  - For KERNAL cassette routines and block saves, refer to the KERNAL SAVE documentation for canonical routines to write memory blocks to tape.

**Paddle Read Machine Routine (Overview)**

- **Functionality:**
  - The provided machine code reads up to four analog paddles (or two analog joysticks) using:
    - CIA1 Port A (address $DC00) for port addressing and button reads.
    - CIA1 Data Direction Register A (address $DC02) to set port direction.
    - SID potentiometer registers (POT X/Y) at offsets $D419/$D41A for analog values (SID base $D400).
- **Routine Steps:**
  - Saves current CIA DDR A.
  - Sets DDR A for input and selects paddle pairs via Port A.
  - Delays, then reads SID POT X/Y (two SID registers) for each paddle.
  - Reads paddle fire buttons via CIA Port A/B and stores values in reserved zero-page/RAM buffer.
  - Restores DDR A and returns.
- **Usage from BASIC:**
  - POKE the machine code into RAM, SYS to its entry, then PEEK the buffer locations to retrieve paddle X/Y and button states.

**Light Pen**

- **VIC‑II Light Pen Latch:**
  - The VIC‑II provides a light‑pen latch:
    - **LPX:** VIC register 19 ($13) — contains 8 MSB of X position at the time of low‑going transition (X is a 9‑bit counter; resolution = 2 horizontal dots).
    - **LPY:** VIC register 20 ($14) — contains 8 bits of Y position with single raster resolution.
  - **Trigger Behavior:**
    - The light pen latch triggers once per frame; subsequent triggers in the same frame are ignored.
    - To obtain stable readings, take multiple samples (3 or more) and average them, depending on the pen's characteristics.

**RS‑232 Interface**

- **Overview:**
  - The Commodore 64 includes a built‑in RS‑232 interface suitable for connecting to modems, printers, and other serial devices.
  - The RS‑232 interface operates at TTL voltage levels (0 to 5V) rather than the standard RS‑232 levels (-12 to +12V).
  - A suitable cable or adapter is required to interface with standard RS‑232 devices.
- **Wiring Diagram:**
  - The C64's user port provides the necessary lines for RS‑232 communication. Below is the pinout relevant to RS‑232:
    *Note: Proper voltage level conversion is necessary when interfacing with standard RS‑232 devices.*
- **Register Usage:**
  - The RS‑232 interface is managed through specific memory locations:
    - **Control Register ($0293):** Configures baud rate, data bits, and stop bits.
    - **Command Register ($0294):** Sets parity, duplex mode, and handshaking protocol.
    - **Status Register ($0297):** Indicates error status of RS‑232 data transmission.
- **Handshaking:**
  - The C64 supports both hardware and software handshaking:
    - **Hardware Handshaking:** Utilizes RTS/CTS lines to manage data flow control.
    - **Software Handshaking:** Employs control characters (e.g., X‑ON/X‑OFF) to control data transmission.
- **Sample BASIC Program:**
  - The following BASIC program demonstrates opening an RS‑232 channel, sending and receiving data, and handling errors:
    *Note: Ensure proper configuration of the RS‑232 device to match the settings in the program.*

## Source Code

      ```basic
      PRINT#1, A,B,C
      ```

      ```basic
      PRINT#1, A;:PRINT#1, ",";:PRINT#1, B;:PRINT#1, ",";:PRINT#1, C
      ```

      ```basic
      PRINT#1, A;:PRINT#1, CHR$(13);:PRINT#1, B;:PRINT#1, CHR$(13)
      ```

    ```text
    User Port Pinout for RS‑232:

    Pin  | Signal | Description
    ---- | ------ | -----------
    C    | PB0    | Data Terminal Ready (DTR)
    D    | PB1    | Carrier Detect (DCD)
    E    | PB2    | Clear to Send (CTS)
    F    | PB3    | Request to Send (RTS)
    H    | PB4    | Transmitted Data (TXD)
    J    | PB5    | Received Data (RXD)
    K    | PB6    | Data Set Ready (DSR)
    L    | PB7    | Ring Indicator (RI)
    M    | PA2    | General Purpose I/O
    N    | GND    | Ground
    ```

    ```basic
    10 REM RS‑232 Communication Example
    20 OPEN 2,2,3,CHR$(6+32)+CHR$(32+128):REM Open channel with 300 baud, 7 data bits, mark parity, full duplex
    30 GET#2,A$:REM Initialize receiver
    40 REM Main Loop
    50 GET B$:REM Get input from keyboard
    60 IF B$<>"" THEN PRINT#2,B$;:REM Send to RS‑232 device
    70 GET#2,C$:REM Receive from RS‑232 device
    80 PRINT B$;C$;:REM Display communication
    90 SR=ST: IF SR=0 OR SR=8 THEN 50:REM Check status, continue if no error
    100 REM Error Handling
    110 PRINT "ERROR: ";
    120 IF SR AND 1 THEN PRINT "PARITY"
    130 IF SR AND 2 THEN PRINT "FRAME"
    140 IF SR AND 4 THEN PRINT "RECEIVER BUFFER FULL"
    150 IF SR AND 128 THEN PRINT "BREAK"
    160 IF (PEEK(673) AND 1) THEN 160:REM Wait until all characters transmitted
    170 CLOSE 2: END
    ```

## Labels
- LPX
- LPY
- POTX
- POTY
