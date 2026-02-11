# System Area $0263-$028B — device/secondary address tables, keyboard buffer, BASIC test, cursor/colors

**Summary:** System-area RAM $0263-$028B (C64 KERNAL/system variables) contains device/secondary address tables ($0263-$0276), the keyboard buffer ($0277-$0280), BASIC memory-test start/end ($0281-$0284), serial timeout ($0285), cursor color and screen-memory high byte ($0286-$0288), and keyboard buffer size/repeat controls ($0289-$028B). Contains KERNAL runtime variables used by keyboard, serial I/O, and BASIC memory test.

**Description**
This block lists the known system variables stored in the C64 system area (addresses shown in hex). These bytes are used by the ROM KERNAL and BASIC routines to store runtime settings and small tables:

- **$0263-$026C — Device Numbers Assigned to Files:** A table of 10 bytes, each corresponding to a logical file number (0–9). Each byte stores the device number assigned to the respective logical file. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$026D-$0276 — Secondary Addresses Assigned to Files:** A table of 10 bytes, each corresponding to a logical file number (0–9). Each byte stores the secondary address assigned to the respective logical file. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$0277-$0280 — Keyboard Buffer (Queue Area):** A 10-byte FIFO buffer that holds recent key data used by KERNAL keyboard routines. Each byte represents a key code of a pressed key, with the buffer operating in a circular manner. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$0281-$0282 — Pointer to Beginning of BASIC Area After Memory Test:** A 2-byte pointer indicating the start of the BASIC program area after the memory test. Default value: $0800 (2048). ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$0283-$0284 — Pointer to End of BASIC Area After Memory Test:** A 2-byte pointer indicating the end of the BASIC program area after the memory test. Default value: $A000 (40960). ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$0285 — Serial Bus Timeout Flag:** A flag used by KERNAL serial routines to handle timeouts on the serial bus. A value less than 128 indicates the flag is set; a value greater than or equal to 128 indicates the flag is cleared. ([pagetable.com](https://www.pagetable.com/c64ref/c64mem/?utm_source=openai))

- **$0286 — Current Color:** The current cursor color value (0–15). ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$0287 — Cursor Character Color:** The color value of the character under the text cursor (0–15). ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$0288 — Screen Memory High Byte:** The high byte of the screen memory pointer. Default value: $04, indicating screen memory starts at $0400. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$0289 — Maximum Keyboard Buffer Size:** Specifies the maximum size of the keyboard buffer. Values:
  - $00: No buffer.
  - $01-$0F: Buffer size (1–15). ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$028A — Keyboard Repeat Switch:** Controls key repeat behavior. Bits 6 and 7 define the repeat mode:
  - %00: Only cursor up/down, cursor left/right, Insert/Delete, and Space repeat.
  - %01: No key repeats.
  - %1x: All keys repeat. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$028B — Repeat Speed Counter:** Delay counter during repeat sequence, for delaying between successive repeats. Values:
  - $00: Must repeat key.
  - $01-$04: Delay repetition. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$028C — Repeat Delay Counter:** Counter for timing the delay until the first key repeat begins. Values:
  - $00: Must start repeat sequence.
  - $01-$10: Delay repeat sequence. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$028D — Shift Key Indicator:** Indicates the status of modifier keys. Bits:
  - Bit 0: 1 = One or more of left Shift, right Shift, or Shift Lock is currently being pressed or locked.
  - Bit 1: 1 = Commodore key is currently being pressed.
  - Bit 2: 1 = Control key is currently being pressed. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

- **$028E — Previous Value of Shift Key Indicator:** Stores the previous state of the shift key indicator for debounce handling. ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))

These variables are part of the KERNAL/system variable table used at runtime by ROM routines.

## Source Code
```text
System Area $0263-$028B: device/secondary address tables ($0263-$0276), keyboard buffer ($0277-$0280), BASIC memory test start/end ($0281-$0284), serial timeout ($0285), cursor color bits and screen memory high byte ($0286-$0288), keyboard buffer max/repeat config ($0289-$028B).

$0283-$0284  BASIC End Test     BASIC end after memory test (default: $A000)
$0285   Serial Timeout          Serial bus timeout flag
$0286   Current Color           Cursor color (0-15)
$0287   Cursor Char Color       Color under cursor (0-15)
$0288   Screen Mem High         High byte of screen memory pointer (default: $04)
$0289   Keyboard Buf Max        Maximum keyboard buffer size (1-15 or 0)
$028A   Keyboard Repeat         Key repeat mode control
$028B   Repeat Delay            Delay between repeated key presses
$028C   Repeat Delay Counter    Counter for timing the delay until the first key repeat begins
$028D   Shift Key Indicator     Indicates the status of modifier keys
$028E   Previous Shift Key Indicator  Stores the previous state of the shift key indicator
```

## Key Registers
- $0263-$026C - System RAM (KERNAL) - Device numbers assigned to files
- $026D-$0276 - System RAM (KERNAL) - Secondary addresses assigned to files
- $0277-$0280 - System RAM (KERNAL) - Keyboard buffer area
- $0281-$0282 - System RAM (KERNAL) - Pointer to beginning of BASIC area after memory test
- $0283-$0284 - System RAM (KERNAL) - Pointer to end of BASIC area after memory test
- $0285 - System RAM (KERNAL) - Serial bus timeout flag
- $0286 - System RAM (KERNAL) - Current cursor color
- $0287 - System RAM (KERNAL) - Color under cursor
- $0288 - System RAM (KERNAL) - High byte of screen memory pointer
- $0289 - System RAM (KERNAL) - Maximum keyboard buffer size
- $028A - System RAM (KERNAL) - Keyboard repeat switch
- $028B - System RAM (KERNAL) - Repeat speed counter
- $028C - System RAM (KERNAL) - Repeat delay counter
- $028D - System RAM (KERNAL) - Shift key indicator
- $028E - System RAM (KERNAL) - Previous shift key indicator

## References
- "keyboard_control_and_cursor_state" — expands on keyboard buffer and cursor flags in zero page
- C64 Memory Map ([c64online.com](https://c64online.com/c64-memory-map/?utm_source=openai))
- C64 Programmer's Reference Guide ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_5/page_311.html?utm_source=openai))