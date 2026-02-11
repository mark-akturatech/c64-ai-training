# Commodore IEC Burst API (U0 subcommands) — 1571 / 1581 (C128)

**Summary:** The Burst API provides low-level disk access via U0 subcommands on 1571 and 1581 drives when used with a C128, enabling physical-sector operations and file transfers using alternate serial protocols (IEC bus). Searchable terms: Burst API, U0, 1571, 1581, C128, IEC serial, physical sector.

**Description**

The Burst API is a drive-side feature implemented in the DOS/firmware of 1571 and 1581 floppy drives when paired with a Commodore 128 host. It provides a set of U0 subcommands that permit:

- Low-level (physical) sector operations on the disk (read/write raw sectors).
- File transfer modes that use alternate serial protocols (so-called "burst" or fast serial modes) instead of the standard IEC byte-at-a-time protocol.

These capabilities are intended for host-side code that needs direct control over disk sectors or higher-throughput transfers than standard IEC allows. The API is drive/firmware specific (1571/1581) and is exposed via the drive command channel using U0 subcommands. (U0 = drive subcommand channel.)

**U0 Subcommand Opcodes and Parameter Formats**

The U0 subcommands are used to control various aspects of the drive's operation. Below is a list of known U0 subcommands and their parameter formats:

- **"U0>M1"**: Switches the 1571 drive to 1571 mode.
- **"U0>M0"**: Switches the 1571 drive to 1541 emulation mode.
- **"U0>H0"**: Selects side zero (upper side) of the disk in 1571 mode.
- **"U0>H1"**: Selects side one (lower side) of the disk in 1571 mode.
- **"U0>"+CHR$(#DEV)**: Changes the device number of the drive to #DEV, where #DEV is a value between 4 and 30.

These commands are issued by opening the command channel to the drive and sending the appropriate string. For example, to switch the 1571 to 1571 mode:

([retro-bobbel.de](https://retro-bobbel.de/zimmers/cbm/manuals/drives/1570-1571_Disk_Drive_Users_Guide.pdf?utm_source=openai))

**Packet/Frame Layouts and Checksums for Burst Mode**

The Burst Mode utilizes a synchronous serial protocol for faster data transfer between the C128 and the 1571/1581 drives. The protocol involves the following:

- **Data Transmission**: Data is transmitted in packets, each consisting of a header, data block, and checksum.
- **Header**: Contains information about the command and data length.
- **Data Block**: The actual data being transferred.
- **Checksum**: A value calculated over the header and data block to ensure data integrity.

The exact byte-level structure of these packets is not detailed in the available sources. However, the synchronous serial interface used in Burst Mode is managed by the 6526 CIA chips, which handle serial data and clock lines for communication. ([a1bert.kapsi.fi](https://a1bert.kapsi.fi/Dev/burst/?utm_source=openai))

**Example Host-Side Invocation Sequence**

To perform a data transfer using the Burst API, the host (C128) would typically follow these steps:

1. **Open the Command Channel**: Establish communication with the drive.

2. **Send U0 Subcommand**: Issue the desired U0 command to the drive.

3. **Perform Data Transfer**: Depending on the operation, read from or write to the drive.

4. **Close the Command Channel**: Terminate communication with the drive.

([retro-bobbel.de](https://retro-bobbel.de/zimmers/cbm/manuals/drives/1570-1571_Disk_Drive_Users_Guide.pdf?utm_source=openai))

**Timing Constraints, Baud Rate, and Specifications for Burst Mode**

The Burst Mode significantly increases data transfer rates compared to the standard IEC protocol. While exact baud rates and timing constraints are not specified in the available sources, it is known that:

- The 1571 and 1581 drives, when used with the C128, support Burst Mode for faster data access.
- The synchronous serial interface used in Burst Mode is managed by the 6526 CIA chips, which handle serial data and clock lines for communication. ([a1bert.kapsi.fi](https://a1bert.kapsi.fi/Dev/burst/?utm_source=openai))

**Drive Firmware Version Requirements and DOS Command Names**

The U0 subcommands are part of the DOS/firmware of the 1571 and 1581 drives. Specific firmware versions that support these commands are not detailed in the available sources. However, these commands are standard in the DOS of these drives and are used to control various operational modes and settings.

**Error Codes and Failure Modes Returned by U0 Subcommands**

When a U0 subcommand is issued, the drive may return error codes indicating the success or failure of the operation. Common error messages include:

- **"SYNTAX ERROR"**: Indicates an unrecognized or improperly formatted command.
- **"DEVICE NOT PRESENT"**: Indicates that the specified device number is not available.

For example, attempting to switch the 1581 drive to 1541 mode using "U0>M0" will result in a "SYNTAX ERROR" because this command is not supported on the 1581. ([c64-wiki.de](https://www.c64-wiki.de/wiki/Commodore_1581?utm_source=openai))

## Source Code

```basic
OPEN 15,8,15,"U0>M1"
CLOSE 15
```

   ```basic
   OPEN 15,8,15
   ```

   ```basic
   PRINT#15,"U0>M1"  ' Example: Switch to 1571 mode
   ```

   ```basic
   OPEN 2,8,2,"FILENAME,S,R"  ' Open a file for reading
   FOR I = 1 TO 100
       INPUT#2,A$
       PRINT A$
   NEXT I
   CLOSE 2
   ```

   ```basic
   CLOSE 15
   ```

## References

- "fast_loaders_and_variants" — expands on burst modes and drive/cpu-assisted fast serial protocols
