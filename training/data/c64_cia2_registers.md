# Commodore 64 — CIA 2 (6526) Register Usage ($DD00-$DD0F)

**Summary:** CIA 2 (6526) register map at $DD00-$DD0F detailing Port A/Port B bit usage for the serial bus, RS-232, and user port signals (DSR, CTS, DCD, RI, DTR, RTS). It includes Data Direction Register defaults (DDR A default $3F, DDR B default $06 for RS-232), Timer A/B configurations for RS-232/serial timing, and notes on unused TOD and shift registers in the C64. Control and interrupt registers ($DD0D-$DD0F) are detailed with bit-level layouts.

**Overview / Notes**

This document outlines the mapping of CIA 2 (6526) I/O and control functions to the Port A/B pins and CIA registers at $DD00-$DD0F:

- **Port A ($DD00):** Handles IEC serial bus signals (Serial In/Clock In/Serial Out/Clock Out), ATN, an RS-232 output, and the VIC video-bank select line.
- **Port B ($DD01):** Manages user-port and RS-232 modem signals (DSR, CTS, DCD, RI, DTR, RTS) and serves as the RS-232 input; it also functions as the parallel user port.
- **Data Direction Registers:**
  - **$DD02 — DDR A:** Controls data direction for Port A; default value is $3F.
  - **$DD03 — DDR B:** Controls data direction for Port B; default value is $06 for RS-232 usage.
- **Timers:**
  - **$DD04-$DD05 — Timer A:** Used for RS-232 timing; consists of low/high bytes across the two registers.
  - **$DD06-$DD07 — Timer B:** Used for RS-232 or serial-bus timing; consists of low/high bytes.
- **TOD and Shift Register:**
  - **$DD08-$DD0B — TOD (Time-of-Day) Registers:** Listed as unused on the C64.
  - **$DD0C — Shift Register:** Listed as unused on the C64.
- **Control/Interrupt/Status Registers:**
  - **$DD0D — Interrupt Control/Status Register:** Includes NMI control, TOD alarm flag, Timer A/B flags, and RS-232 input flag.
  - **$DD0E/$DD0F — Control Registers:** Contain bits for Timer one-shots, PB6/PB7 output-mode selection, PB6/PB7 outputs, timer starts, and serial clock-in selection.

**Note:** The asterisks (*) next to DCD and RI indicate that these signals are active-low.

## Source Code

```text
Commodore 64 6526 Usage (CIA 2)

      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD00 |Serial | Clock |Serial | Clock |  ATN  |RS-232 |  Video Bank   | 56320
      |  In   |  In   |  Out  |  Out  |  Out  |  Out  |    Select     |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD01 |  DSR  |  CTS  |       | DCD*  |  RI*  |  DTR  |  RTS  |RS-232 | 56321
      |  In   |  In   |       |  In   |  In   |  Out  |  Out  |  In   |
      |                      Parallel User Port                       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD02 |  In   |  In   |  Out  |  Out  |  Out  |  Out  |  Out  |  Out  | 56322
      |      Data Direction Register A (for $DC00), Default $3F       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD03 |  In   |  In   |  In   |  In   |  In   |  Out  |  Out  |  In   | 56323
      |     Data Direction Register B (for $DC01), $06 for RS-232     |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD04 |                                                               | 56324
      |                           Timer A:                            |
      +- - - - - - - - - - - - -              - - - - - - - - - - - - +
$DD05 |                         RS-232 Timing                         | 56325
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD06 |                                                               | 56326
      |                           Timer B:                            |
      +- - - - - - - - - - - - -                            - - - - - +
$DD07 |                  RS-232 or Serial Bus Timing                  | 56327
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD08 |                 TOD clock registers (unused)                  | 56328
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD09 |                 TOD clock registers (unused)                  | 56329
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD0A |                 TOD clock registers (unused)                  | 56330
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD0B |                 TOD clock registers (unused)                  | 56331
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD0C |                    Shift Register (unused)                    | 56332
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD0D |  NMI  |       |       |RS-232 |       |  TOD  |Timer B|Timer A| 56333
      |Control|       |       |  In   |       | Alarm |       |       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD0E |       |       |       |       |Timer A|PB6 Out|Timer A|Timer A| 56334
      |       |       |       |       |OneShot| Mode  |PB6 Out| Start |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DD0F |       |       |       |       |Timer B|PB7 Out|Timer B|Serial | 56335
      |       |       |       |       |OneShot| Mode  |PB7 Out|Clk In |
      +-------+-------+-------+-------+-------+-------+-------+-------+
```

**Bit-Level Layouts for Control/Interrupt Registers ($DD0D-$DD0F):**

The following diagrams detail the bit positions and names for the control and interrupt registers at $DD0D-$DD0F.

```text
$DD0D — Interrupt Control/Status Register
+---+---+---+---+---+---+---+---+
| 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
+---+---+---+---+---+---+---+---+
| N |   |   | R |   | T | T | T |
| M |   |   | S |   | O | B | A |
| I |   |   | - |   | D |   |   |
| C |   |   | 2 |   | A |   |   |
| t |   |   | 3 |   | l |   |   |
| r |   |   | 2 |   | a |   |   |
| l |   |   |   |   | r |   |   |
|   |   |   |   |   | m |   |   |
+---+---+---+---+---+---+---+---+
```

- **Bit 7 (NMI Control):** Controls the Non-Maskable Interrupt.
- **Bit 4 (RS-232 Input):** Indicates RS-232 input status.
- **Bit 2 (TOD Alarm):** Indicates Time-of-Day alarm status.
- **Bit 1 (Timer B):** Indicates Timer B status.
- **Bit 0 (Timer A):** Indicates Timer A status.
