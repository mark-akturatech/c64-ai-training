# COMMODORE 64 - PRINTING

**Summary:** The COMMODORE 64 interfaces with dot-matrix printers, letter-quality printers, and plotters for document and graphics output. This entry details supported device types, physical interfaces, control codes, programming examples, and compatibility considerations.

**Overview**

The COMMODORE 64 supports output to a variety of printers and plotters, including dot-matrix and letter-quality devices. This entry provides information on physical connection methods, printer control codes, programming examples, plotter command protocols, flow-control details, and compatibility notes for specific printer models.

**Physical Interfaces and Connection Methods**

The COMMODORE 64 connects to printers and plotters through several interfaces:

- **IEC Serial Bus:** A 6-pin DIN connector used for connecting Commodore-compatible serial printers.

  | Pin | Name  | Description                      |
  |-----|-------|----------------------------------|
  | 1   | SRQ   | Service Request                  |
  | 2   | GND   | Ground                           |
  | 3   | ATN   | Attention                        |
  | 4   | CLK   | Clock                            |
  | 5   | DATA  | Data                             |
  | 6   | RESET | Reset                            |

  ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_bus?utm_source=openai))

- **User Port (RS-232):** A 24-pin edge connector that can be configured for RS-232 communication to connect serial printers.

  | Pin | Name  | RS-232 Equivalent | Description             |
  |-----|-------|-------------------|-------------------------|
  | A   | GND   | GND               | Protective Ground       |
  | B+C | FLAG2+PB0 | RxD           | Receive Data            |
  | D   | PB1   | RTS               | Ready To Send           |
  | E   | PB2   | DTR               | Data Terminal Ready     |
  | F   | PB3   | RI                | Ring Indicator          |
  | H   | PB4   | DCD               | Data Carrier Detect     |
  | K   | PB6   | CTS               | Clear To Send           |
  | L   | PB7   | DSR               | Data Set Ready          |
  | M   | PA2   | TxD               | Transmit Data           |
  | N   | GND   | GND               | Signal Ground           |

  ([old.pinouts.ru](https://old.pinouts.ru/SerialPorts/C64Rs232UserPort_pinout.shtml?utm_source=openai))

- **Centronics Parallel Interface:** Requires an adapter connected to the User Port to interface with parallel printers.

  | C64 User Port Pin | Direction | Centronics Pin | Signal Name |
  |-------------------|-----------|----------------|-------------|
  | C (PB0)           | OUT       | 2              | Data 0      |
  | D (PB1)           | OUT       | 3              | Data 1      |
  | E (PB2)           | OUT       | 4              | Data 2      |
  | F (PB3)           | OUT       | 5              | Data 3      |
  | H (PB4)           | OUT       | 6              | Data 4      |
  | J (PB5)           | OUT       | 7              | Data 5      |
  | K (PB6)           | OUT       | 8              | Data 6      |
  | L (PB7)           | OUT       | 9              | Data 7      |
  | M (PA2)           | OUT       | 1              | Strobe      |
  | B (FLAG2)         | IN        | 10             | Acknowledge |
  | 1, 12, A, N (GND) | -         | 19-30, 33      | Ground      |

  ([allpinouts.org](https://allpinouts.org/pinouts/cables/printer/commodore-c64-centronics/?utm_source=openai))

**Printer Control Codes and Escape Sequences**

Printers connected to the COMMODORE 64 often use control codes and escape sequences to manage formatting and special functions. For example, Epson-compatible printers utilize ESC/P sequences:

- **Bold Text:** `ESC E` (CHR$(27); "E")
- **Double-Width Text:** `ESC W 1` (CHR$(27); "W"; CHR$(1))
- **Cancel Double-Width:** `ESC W 0` (CHR$(27); "W"; CHR$(0))

These sequences are sent from the C64 using the `PRINT#` command in BASIC.

([atarimagazines.com](https://www.atarimagazines.com/compute/gazette/198705-speedscript.html?utm_source=openai))

**Sample BASIC and Assembly Listings**

**BASIC Example: Printing Text**


**Assembly Example: Printing Text**


These examples demonstrate opening a channel to the printer, sending data, and closing the channel.

**Plotter Command Protocols and Examples**

Plotters connected to the COMMODORE 64 use vector commands to control pen movements. Common commands include:

- **Pen Up:** `PU x,y;`
- **Pen Down:** `PD x,y;`
- **Move to Position:** `PA x,y;`

These commands are sent as strings to the plotter using the `PRINT#` command in BASIC.

**Timing, Handshaking, and Flow-Control Details**

For continuous or large output, proper handshaking and flow control are essential:

- **Serial Printers (RS-232):** Utilize hardware flow control signals such as RTS/CTS and DTR/DSR to manage data flow.
- **Parallel Printers (Centronics):** Use the ACK signal to indicate readiness to receive data.

Implementing these controls ensures data integrity during transmission.

**Compatibility Notes for Specific Printer Models**

The COMMODORE 64 is compatible with various printer models, especially those supporting standard protocols:

- **Epson FX Series:** Supports ESC/P control codes, widely compatible with C64 software.
- **Commodore 1525:** Designed specifically for the C64, ensuring full compatibility.
- **Third-Party Printers:** Interfaces like the CARDCO Card Print A allow connection to non-Commodore printers by converting the C64's serial interface to Centronics parallel.

When connecting third-party printers, ensure the appropriate interface and driver software are used to maintain compatibility.

## Source Code

```basic
OPEN 4,4
PRINT#4, "Hello, World!"
CLOSE 4
```

```assembly
; Open channel 4 to device 4 (printer)
LDA #4
LDX #4
LDY #0
JSR $FFC0 ; SETLFS

; Set filename (empty in this case)
LDA #<FILENAME
LDX #>FILENAME
LDY #0
JSR $FFBD ; SETNAM

; Open the file
JSR $FFC9 ; OPEN

; Check for error
JSR $FFB7 ; CHKIN
BNE ERROR

; Print the string
LDX #0
PRINT_LOOP:
  LDA MESSAGE,X
  BEQ DONE
  JSR $FFD2 ; CHROUT
  INX
  JMP PRINT_LOOP

DONE:
; Close the file
JSR $FFC3 ; CLOSE
RTS

ERROR:
; Handle error
RTS

FILENAME:
  .BYTE 0
MESSAGE:
  .BYTE "Hello, World!",0
```


## References

- "journals_creative_writing_and_storage" — expands on printing word-processed documents  
- "payroll_and_forms_printout" — expands on printing business forms and payroll reports

## Labels
- SETLFS
- SETNAM
- OPEN
- CHKIN
- CHROUT
- CLOSE
