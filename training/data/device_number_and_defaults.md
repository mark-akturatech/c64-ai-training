# Device Numbers, Logical File Numbers, and Secondary Addresses (OPEN / GET# / INPUT# / PRINT#)

**Summary:** Describes how the OPEN <device> number selects a peripheral (printer, disk drive, Datassette) and how devices use secondary addresses for operations; explains the role of the device logical file number with GET#, INPUT#, and PRINT# and the default behaviors when <device>, filename, or secondary address are omitted.

## Device numbers and OPEN
Each peripheral (printer, disk drive, cassette/Datassette) has a device number that it responds to. Use the OPEN statement with a <device> number to specify on which peripheral a data file resides. The device logical file number assigned by OPEN is then used with GET#, INPUT#, and PRINT# to read from or write to that file.

## Secondary addresses
Peripherals may accept multiple secondary addresses — numeric codes that tell the device what operation to perform (for example, read, write, append, or command channels). The secondary address is specified as part of the OPEN statement. The meaning of specific secondary address values varies by device type (see cassette and disk secondary address references).

## Defaults and filename behavior
- If the <device> number is omitted from OPEN, the system defaults to the Datassette (device number 1).
- The filename argument to OPEN can be omitted; however, if you omit the filename you cannot later refer to the file by name in the program.
- When storing or accessing files on the cassette, if the secondary address is omitted the system assumes secondary address 0, which denotes a READ operation.

## References
- "logical_file_number" — expands on relation between logical file numbers and devices  
- "cassette_and_disk_secondary_addresses" — expands on specific secondary address meanings for cassette and disk
