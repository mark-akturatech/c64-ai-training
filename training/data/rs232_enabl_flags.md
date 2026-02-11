# $02A1 ENABL: RS-232 Interrupts Enabled

**Summary:** RAM location $02A1 stores the active NMI interrupt flag byte copied from CIA #2 Interrupt Control Register ($DD0D); relevant to RS-232 status handling and serial transfer state (bits 4, 1, 0).

## Description
$02A1 (labelled ENABL) holds the active NMI flag byte as taken from CIA#2 Interrupt Control Register ($DD0D). The byte encodes RS-232/serial transfer state flags used by system code to track receiver/transmitter activity and waiting-for-edge state.

Only three bits are used by this flag byte:
- Bit 4 (value $10 / 16) — 1 = system is waiting for receiver edge
- Bit 1 (value $02 / 2)  — 1 = system is receiving data
- Bit 0 (value $01 / 1)  — 1 = system is transmitting data

System code may test these bits to decide whether to GET#2 (read serial input) or to manage transmit/receive handling.

## Source Code
```text
$02A1        ENABL   RS-232 Interrupts Enabled

                     This location holds the active NMI interrupt flag byte from CIA #2
                     Interrupt Control Register (56589, $DD0D).  The bit values for this
                     flag are as follows:

                     |Bit|Value| |
                     |---|-----|-|
                     | 4 | 16  | 1 = System is Waiting for Receiver Edge |
                     | 1 | 2   | 1 = System is Receiving Data            |
                     | 0 | 1   | 1 = System is Transmitting Data         |
```

## Key Registers
- $02A1 - RAM - ENABL: RS-232 Interrupts Enabled (active NMI flag byte from CIA#2 $DD0D)
- $DD0D - CIA-II - Interrupt Control Register (source of active NMI flag copied into $02A1)

## References
- "rs232_status_error_bits" — expands on status handling and when to GET#2

## Labels
- ENABL
