# Printer, Diskette Storage, and Game Ports (C64)

**Summary:** Printer control characters (CHR$ codes) and OPEN behavior for printer character sets; diskette file types (sequential, relative, random) and 256‑byte block layout; game ports / joystick input via CIA #1 at $DC00-$DC0F (Port A $DC00, Port B $DC01), lower 5 bits = joystick directions + fire.

**Printer output and control codes**
- The OPEN statement selects the printer character set (upper/graphics or upper/lower); consult your printer manual for exact device parameters (see referenced OPEN parameters table).
- The SPACE (SPC) control works for printers, but TAB does not behave as expected on many devices.
- Printers accept control characters (sent via CHR$ from BASIC). Common C64 printer control codes are listed in the Source Code section. Consult the printer manual for timing, printer-specific sequences, and full code lists.

**Data storage on floppy diskettes**
- Disk files support three forms:
  - Sequential files — similar to tape; multiple sequential files may be open simultaneously.
  - Relative files — record-oriented; read/replace individual records; efficient for large data sets and fast access.
  - Random files — block-oriented (256‑byte blocks); allow read/write anywhere on disk.
- Disk I/O uses separate data and command channels: data is written to the drive's RAM buffer via the data channel, then a command sent on the command channel instructs the drive where to store the buffer.
- PRINT# limitations (formatting, need for separators) are the same as for cassette; RETURNs or commas are required to separate data fields in PRINT#. GET# reads CHR$(0) as an empty string.
- For applications with large amounts of structured data, relative files are recommended (see disk drive manual for full programming guide).

**Game ports and joysticks (overview)**
- The C64 has two 9‑pin game ports. Each accepts one digital joystick or one pair of paddles. A light pen can be used on Port A only.
- Digital joystick inputs are read via CIA #1 (MOS 6526) registers at $DC00–$DC0F (decimal 56320–56335). Port A data = $DC00; Port B data = $DC01.
- The joystick switches map to the lower 5 bits of the port byte; bits are normally 1 when not pressed (open), and read as 0 when the switch is closed (pressed). See the Source Code section for the exact bit mapping diagram and quick reference.

## Source Code
```text
Printer control character quick reference (CHR$ codes)
CHR$(10)  - LF (Line Feed)
CHR$(13)  - RETURN (Carriage Return)
CHR$(14)  - Begin double-width
CHR$(15)  - End double-width
CHR$(18)  - Begin reverse (reverse print)
CHR$(146) - End reverse
CHR$(17)  - Switch to set A (printer-dependent)
CHR$(145) - Switch to set B (printer-dependent)
CHR$(16)  - Set tab positions (printer-dependent)
CHR$(27)  - Move to dot position (printer-dependent)
CHR$(8)   - Begin dot graphics
CHR$(26)  - Repeat graphics (dot repeat)

(Printer behavior and exact codes vary by model — consult the printer manual.)

Joystick ASCII diagram (original layout)
                                    (Top)
                FIRE
             (Switch 4)
                                     UP
                                 (Switch 0)
                                      |
                                      |
                                      |
                         LEFT         |         RIGHT
                               -------+-------
                      (Switch 2)      |       (Switch 3)
                                      |
                                      |
                                      |
                                    DOWN
                                 (Switch 1)

Joystick bit mapping (CIA port data, lower 5 bits)
Bit 0 (LSB) = Switch 0 = UP
Bit 1       = Switch 1 = DOWN
Bit 2       = Switch 2 = LEFT
Bit 3       = Switch 3 = RIGHT
Bit 4       = Switch 4 = FIRE

Notes:
- Bits read as 1 when the corresponding direction/fire is NOT active; read as 0 when pressed (active low).
- Port A is $DC00, Port B is $DC01.
```

## Key Registers
- $DC00-$DC0F - CIA #1 (MOS 6526) - Port A/Port B, joystick/paddle inputs, keyboard scanning and other CIA registers (Port A data at $DC00, Port B data at $DC01).

## References
- "open_statement_parameters_table" — expands on OPEN parameters for printer device numbers and modes (external reference).