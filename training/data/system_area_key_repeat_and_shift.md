# System Area $028B-$0297 — Key Repeat, Shift, Scroll, RS232

**Summary:** Zero-page/system-area registers $028B-$0297 control keyboard key-repeat timing, shift-key state and pointer to the shift handler ($028F-$0290), scroll direction and Commodore-Shift enable ($0291-$0292), and RS232 control/command, output-timer defaults and status ($0293-$0297).

**Description**
This block in the C64 system area holds small control values and state used by the keyboard/shift handling, screen-scrolling logic, and the system RS232 support.

- **Key repeat:** Addresses $028B (Repeat Speed Counter) and $028C (Repeat Delay Counter) manage the timing for key repeat functionality.
  - **$028B (Repeat Speed Counter):**
    - Values:
      - $00: Must repeat key.
      - $01-$04: Delay repetition.
  - **$028C (Repeat Delay Counter):**
    - Values:
      - $00: Must start repeat sequence.
      - $01-$10: Delay repeat sequence.
- **Shift state:** Registers $028D (Shift Key Status) and $028E (Previous Shift Status) store the current and previous states of modifier keys.
  - **$028D (Shift Key Status):**
    - Bit 0: 1 = One or more of left Shift, right Shift, or Shift Lock is currently being pressed or locked.
    - Bit 1: 1 = Commodore key is currently being pressed.
    - Bit 2: 1 = Control key is currently being pressed.
  - **$028E (Previous Shift Status):**
    - Bit 0: 1 = One or more of left Shift, right Shift, or Shift Lock was pressed or locked at the time of the previous check.
    - Bit 1: 1 = Commodore key was pressed at the time of the previous check.
    - Bit 2: 1 = Control key was pressed at the time of the previous check.
- **Shift routine pointer:** Addresses $028F-$0290 store a two-byte little-endian pointer to the shift handling routine, defaulting to $EB48.
- **Commodore-Shift and scroll:** Registers $0291 and $0292 control the Commodore-Shift combination and screen scroll direction.
  - **$0291 (Commodore-Shift Enable Flag):**
    - Bit 7:
      - 0 = Commodore-Shift is enabled; the key combination toggles between character sets.
      - 1 = Commodore-Shift is disabled.
  - **$0292 (Scroll Direction):**
    - Values:
      - $00: Insertion of line before the current line; current line and all lines below it must be scrolled one line downwards.
      - $01-$FF: Bottom of screen reached; complete screen must be scrolled one line upwards.
- **RS232:** Registers $0293-$0297 manage RS232 control, command, output timer defaults, and status.
  - **$0293 (RS232 Control Register):**
    - Bits 0-3: Baud rate selection.
      - %0000: User specified.
      - %0001: 50 bps.
      - %0010: 75 bps.
      - %0011: 110 bps.
      - %0100: 150 bps.
      - %0101: 300 bps.
      - %0110: 600 bps.
      - %0111: 1200 bps.
      - %1000: 1800 bps.
      - %1001: 2400 bps.
      - %1010: 3600 bps.
      - %1011: 4800 bps.
      - %1100: 7200 bps.
      - %1101: 9600 bps.
      - %1110: 19200 bps.
      - %1111: 38400 bps.
    - Bits 4-5: Word length.
      - %00: 5 bits.
      - %01: 6 bits.
      - %10: 7 bits.
      - %11: 8 bits.
    - Bit 6: Stop bits.
      - 0: 1 stop bit.
      - 1: 2 stop bits.
    - Bit 7: Parity.
      - 0: No parity.
      - 1: Parity enabled.
  - **$0294 (RS232 Command Register):**
    - Bit 0: Transmit control.
      - 0: Transmitter disabled.
      - 1: Transmitter enabled.
    - Bit 1: Data Terminal Ready (DTR).
      - 0: DTR inactive.
      - 1: DTR active.
    - Bit 2: Receive control.
      - 0: Receiver disabled.
      - 1: Receiver enabled.
    - Bit 3: Force break.
      - 0: Normal operation.
      - 1: Force break condition.
    - Bit 4: Reset error flags.
      - 0: Normal operation.
      - 1: Reset error flags.
    - Bit 5: Request To Send (RTS).
      - 0: RTS inactive.
      - 1: RTS active.
    - Bits 6-7: Unused; should be set to 0.
  - **$0295-$0296 (RS232 Output Timer Default):**
    - Two-byte value representing the default output timer setting.
  - **$0297 (RS232 Status Register):**
    - Bit 0: Parity error occurred.
    - Bit 1: Frame error occurred.
    - Bit 2: Input buffer underflow occurred.
    - Bit 3: Input buffer is empty.
    - Bit 4: Sender is not ready to send data.
    - Bit 6: Receiver is not ready to receive data.
    - Bit 7: Carrier loss detected.

**Note:** The source lists these addresses and brief roles but does not provide bit-field layouts, default numeric values (except the shift routine default address), or detailed timing values.

## Source Code
