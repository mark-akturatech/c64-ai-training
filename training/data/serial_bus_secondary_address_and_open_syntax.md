# Serial bus SECONDARY ADDRESS (OPEN n,device,secondary)

**Summary:** Explains the Commodore serial bus SECONDARY ADDRESS used to send setup information to a device; shows the OPEN syntax (OPEN logical#,device,secondary) and the meaning of the three fields (logical file number, device address, secondary address). Contains the example OPEN 1,4,7 which selects the printer and sets its upper/lower-case mode.

## Concept
The serial bus supports three values when opening a connection from BASIC: a logical file number, a device (primary) address, and a secondary address. The secondary address is a small numeric code sent to a device to request or set a mode or function (for example, printer case selection). Devices have assigned primary addresses on the bus; some devices (notably the C64 printer) may respond at two different primary addresses for user convenience.

Syntax pattern:
OPEN <logical file number>,<device address>,<secondary address>

- Logical file number: the file handle you will use with PRINT# and INPUT# (e.g., 1).
- Device address (primary address): the bus address of the target device (e.g., 4 for the printer in the example). Each device defines its own address(es).
- Secondary address: a device-specific command or mode selector transmitted immediately after opening the channel (e.g., 7 to set printer upper/lower-case mode).

The secondary address is intended for setup/control information rather than bulk data transfer. Devices interpret secondary addresses according to their own command set.

## Source Code
```basic
10 REM Open printer and set upper/lower-case mode
20 OPEN 1,4,7   : REM 1=logical file#, 4=printer device address, 7=secondary address for case mode
30 PRINT#1,"HELLO WORLD"   : REM send data to device via logical file 1
40 CLOSE 1
```

## References
- "serial_bus_common_addresses" — list of common primary addresses for serial-bus devices
- "serial_bus_signal_lines_and_pinout" — serial command transport, signal lines, and connector pinout
