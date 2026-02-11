# Commodore 64 — Modem output: OPEN parameters, PETSCII↔ASCII translation, and command/control handling

**Summary:** This document details how C64 BASIC communicates with modems via the `OPEN` and `PRINT#` statements, emphasizing the importance of translating PETSCII to ASCII and handling control commands such as carriage return/linefeed sequences and Hayes AT commands. It also addresses the lack of hardware flow control in many interfaces.

**OPEN Parameters and Baud/Format Overview**

The Commodore 64's RS-232 interface allows for the configuration of communication parameters through the `OPEN` statement. This configuration is achieved by specifying a control string that sets baud rate, parity, and other settings. The control string consists of up to four characters:

- **Control Register Character**: Sets baud rate and parity.
- **Command Register Character**: Configures stop bits and word length.
- **Optional Baud Rate Low and High Bytes**: Reserved for future use.

**BASIC Syntax:**


Where:

- `lfn`: Logical file number (1–255).
- `2`: Device number for RS-232.
- `0`: Secondary address.
- `"<control><command><baud low><baud high>"`: Control string.

**Control Register Character:**

The control register character determines the baud rate and parity. Each character corresponds to a specific configuration:

| Character | Baud Rate | Parity |
|-----------|-----------|--------|
| `@`       | 50        | None   |
| `A`       | 75        | None   |
| `B`       | 110       | None   |
| `C`       | 134.5     | None   |
| `D`       | 150       | None   |
| `E`       | 300       | None   |
| `F`       | 600       | None   |
| `G`       | 1200      | None   |
| `H`       | 1800      | None   |
| `I`       | 2400      | None   |
| `J`       | 3600      | None   |
| `K`       | 4800      | None   |
| `L`       | 7200      | None   |
| `M`       | 9600      | None   |
| `N`       | 19200     | None   |
| `O`       | 50        | Odd    |
| `P`       | 75        | Odd    |
| `Q`       | 110       | Odd    |
| `R`       | 134.5     | Odd    |
| `S`       | 150       | Odd    |
| `T`       | 300       | Odd    |
| `U`       | 600       | Odd    |
| `V`       | 1200      | Odd    |
| `W`       | 1800      | Odd    |
| `X`       | 2400      | Odd    |
| `Y`       | 3600      | Odd    |
| `Z`       | 4800      | Odd    |
| `[`       | 7200      | Odd    |
| `\`       | 9600      | Odd    |
| `]`       | 19200     | Odd    |
| `^`       | 50        | Even   |
| `_`       | 75        | Even   |
| `a`       | 110       | Even   |
| `b`       | 134.5     | Even   |
| `c`       | 150       | Even   |
| `d`       | 300       | Even   |
| `e`       | 600       | Even   |
| `f`       | 1200      | Even   |
| `g`       | 1800      | Even   |
| `h`       | 2400      | Even   |
| `i`       | 3600      | Even   |
| `j`       | 4800      | Even   |
| `k`       | 7200      | Even   |
| `l`       | 9600      | Even   |
| `m`       | 19200     | Even   |

**Command Register Character:**

The command register character sets the number of stop bits and word length:

| Character | Stop Bits | Word Length |
|-----------|-----------|-------------|
| `@`       | 1         | 7           |
| `A`       | 1         | 8           |
| `B`       | 2         | 7           |
| `C`       | 2         | 8           |

**Example:**

To open an RS-232 channel at 1200 baud, no parity, 1 stop bit, and 8-bit word length:


This sets the control register to `G` (1200 baud, no parity) and the command register to `A` (1 stop bit, 8-bit word length).

**Note:** Ensure that the control string matches the requirements of your specific hardware and modem. Incorrect settings may result in communication errors or unintended behavior.

**Control/Command Register Usage and Hardware Flow**

The Commodore 64's RS-232 interface is implemented through the user port, utilizing the CIA (Complex Interface Adapter) chip to manage serial communication. The user port's pins are mapped to specific CIA registers, allowing for control over RS-232 signals such as RTS (Request to Send), DTR (Data Terminal Ready), and CTS (Clear to Send).

**User Port Pin Assignments:**

| Pin | Signal | CIA Register | Bit |
|-----|--------|--------------|-----|
| C   | RTS    | Data Port A  | 2   |
| D   | DTR    | Data Port A  | 3   |
| E   | CTS    | Data Port B  | 1   |

**CIA Register Details:**

- **Data Port A (Register $DC00):** Controls RTS and DTR signals.
  - Bit 2: RTS (0 = Asserted, 1 = Deasserted)
  - Bit 3: DTR (0 = Asserted, 1 = Deasserted)

- **Data Port B (Register $DC01):** Reads CTS signal.
  - Bit 1: CTS (0 = Asserted, 1 = Deasserted)

**Example:**

To assert RTS and DTR:


To read CTS status:


**Note:** Direct manipulation of these registers requires a thorough understanding of the hardware. Improper handling can lead to communication issues. Many RS-232 interfaces for the C64 lack full hardware flow control; therefore, software flow control (XON/XOFF) is often used to manage data flow.

**PETSCII ↔ ASCII Translation When Communicating with Other Systems**

The Commodore 64 uses the PETSCII character set, which differs from the standard ASCII used by most other systems. When communicating with external devices or systems, translating between PETSCII and ASCII is essential.

**Translation Table:**

| PETSCII (Decimal) | ASCII (Decimal) | Character |
|-------------------|-----------------|-----------|
| 32–63             | 32–63           | Symbols   |
| 64–90             | 97–122          | a–z       |
| 91–96             | 91–96           | Symbols   |
| 97–122            | 65–90           | A–Z       |
| 123–126           | 123–126         | Symbols   |

**Key Points:**

- **Case Mapping:** PETSCII's uppercase letters (65–90) map to ASCII's lowercase letters (97–122), and vice versa.
- **Symbol Differences:** Certain symbols differ between PETSCII and ASCII. For example, PETSCII uses an up-arrow (↑) at position 94 instead of the caret (^) found in ASCII.
- **Control Characters:** PETSCII includes control characters for cursor movement and screen control, which have no direct ASCII equivalents. These should be handled appropriately to avoid misinterpretation.

**Example Translation:**

To translate a PETSCII string to ASCII:


## Source Code

```basic
OPEN lfn,2,0,"<control><command><baud low><baud high>"
```

```basic
OPEN 1,2,0,"GA"
```

```assembly
LDA $DC00
AND #%11110011  ; Clear bits 2 and 3
STA $DC00       ; Assert RTS and DTR
```

```assembly
LDA $DC01
AND #%00000010  ; Mask bit 1
BEQ CTS_Asserted
```

## Labels
- DATA_PORT_A
- DATA_PORT_B
