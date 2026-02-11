# REL (Relative) files — Commodore IEC Serial Bus Protocol Reference

**Summary:** REL (relative) files provide random access to fixed-size records (1–254 bytes). The POSITION command sets the device's current record pointer using binary-encoded arguments (not ASCII).

**Behavior**

REL files (relative access) use a fixed record size chosen when the file is opened; every record is exactly N bytes where N is between 1 and 254. Random-access operations read or write full records by record number rather than by logical stream position. The POSITION command (sent to the device) updates the device's internal record pointer so subsequent READ/WRITE operations act on the specified record.

- **Record size:** 1–254 bytes (each record is fixed length).
- **Access model:** Record-number addressing for random access (read/write by record).
- **POSITION semantics:** Sets record pointer to a specific record using binary-encoded arguments (arguments are raw bytes, not printable text).

**POSITION Command Encoding**

The POSITION command is issued to the disk drive to set the current record pointer for a REL file. The command format is as follows:

- **Command:** `P` followed by three bytes:
  - **Record Number Low Byte:** The low byte of the desired record number.
  - **Record Number High Byte:** The high byte of the desired record number.
  - **Offset:** The byte offset within the record (0 to record length minus 1).

For example, to position to record number 3 with an offset of 0, the command sequence would be:

This sets the record pointer to the beginning of record 3.

**Specifying Record Size**

The record size for a REL file is specified when the file is first created. This is done by including the record size in the OPEN command as follows:

Here, `record_size` is a value between 1 and 254, representing the fixed length of each record in bytes. Once set, the record size cannot be changed for that file.

**Error Codes**

When working with REL files, the following error codes may be encountered:

- **50, RECORD NOT PRESENT:** Attempted to access a record number that does not exist. This can occur if the specified record number is beyond the current end of the file. ([commodore.blog](https://www.commodore.blog/CBM/1541AppendixB?utm_source=openai))

- **51, OVERFLOW IN RECORD:** Attempted to write more data to a record than its fixed size allows. The excess data is truncated, and this error is reported. ([commodore.blog](https://www.commodore.blog/CBM/1541AppendixB?utm_source=openai))

- **52, FILE TOO LARGE:** Attempted to access a record position that would exceed the disk's capacity. ([commodore.blog](https://www.commodore.blog/CBM/1541AppendixB?utm_source=openai))

**Example Command Sequences**

**Creating and Writing to a REL File:**

1. **Open the REL file for writing:**

   This opens a new REL file named "RELFILE" with the specified record size.

2. **Position to the desired record:**

   This sets the record pointer to the specified record number and offset.

3. **Write data to the record:**

   Writes the data string `data$` to the current record.

4. **Close the file:**

**Reading from a REL File:**

1. **Open the REL file for reading:**

2. **Position to the desired record:**

3. **Read data from the record:**

   Reads the data from the current record into the variable `data$`.

4. **Close the file:**

## Source Code

```
PRINT#15, "P" + CHR$(3) + CHR$(0) + CHR$(0)
```

```
OPEN 2,8,2,"RELFILE,L," + CHR$(record_size)
```

   ```
   OPEN 2,8,2,"RELFILE,L," + CHR$(record_size)
   ```

   ```
   PRINT#15, "P" + CHR$(record_number AND 255) + CHR$(record_number / 256) + CHR$(offset)
   ```

   ```
   PRINT#2, data$
   ```

   ```
   CLOSE 2
   ```

   ```
   OPEN 2,8,2,"RELFILE,L," + CHR$(record_size)
   ```

   ```
   PRINT#15, "P" + CHR$(record_number AND 255) + CHR$(record_number / 256) + CHR$(offset)
   ```

   ```
   INPUT#2, data$
   ```

   ```
   CLOSE 2
   ```

## References

- "file_types_and_access_modes" — expands on sequential vs relative file types and how record sizes and modes are selected in the IEC protocol.
