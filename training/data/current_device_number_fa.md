# $BA (186) — Current Device Number (FA)

**Summary:** $BA holds the current device number (single byte) used by system I/O; contains values like 0 = keyboard, 1 = datasette, 2 = RS-232, 3 = screen, 8–11 = disk. See related entries for how secondary addresses and logical file numbers are interpreted.

## Description
This memory location (decimal 186, hex $BA) contains the number of the device that the system is currently using. The byte is read by I/O routines to determine the selected device for subsequent operations.

Device-number assignments:
- 0 = Keyboard
- 1 = Datasette recorder
- 2 = RS-232 / User Port
- 3 = Screen
- 4–5 = Printer
- 8–11 = Disk

(Secondary addresses and logical file numbers are interpreted differently depending on the device; see referenced chunks.)

## Key Registers
- $00BA - Current Device Number — Holds the selected device number (values listed above)

## References
- "current_secondary_address_sa" — how secondary addresses are interpreted per device
- "current_logical_file_number_la" — logical file numbers identifying open files for the selected device