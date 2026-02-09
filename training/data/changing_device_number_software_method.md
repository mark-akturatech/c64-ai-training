# Changing the disk drive device number (software method)

**Summary:** Software change of a Commodore 1541-style disk drive device number by issuing a MEMORY-WRITE sequence from BASIC (PRINT# channel, "M-W" ... CHR$ values). Shows the exact byte sequence used (CHR$(119) CHR$(0) CHR$(2) CHR$(address+32) CHR$(address+64)) and a BASIC example changing device 8 to 9.

**Software method**

The drive normally selects its device number from a hardware jumper and stores that value in controller RAM. The drive will accept a MEMORY-WRITE command sequence that overwrites the device-number byte in RAM, allowing the device number to be changed at runtime.

Format for changing device number (send as a command to the drive channel):

PRINT#file#,"M-W" CHR$(119) CHR$(0) CHR$(2) CHR$(address+32) CHR$(address+64)

- file# is the opened logical channel to the drive (typically 15).
- address is the new device number value to be written (e.g., 9 to set device number 9).
- The sequence uses CHR$ offsets (+32 and +64) as required by the drive's memory-write command protocol.

Note: The "M-W" command should not include a colon; including a colon will cause the command to fail. ([atarimagazines.com](https://www.atarimagazines.com/compute/issue50/221_2_READERS_FEEDBACK_Commodore_Disk_Drive_Device_Number_Update.php?utm_source=openai))

If multiple drives are attached, the recommended permanent solution is to change the hardware jumpers (see hardware method/jumper table). If you must change device numbers in software, attach drives one at a time, change each drive's number, then attach the next to avoid address conflicts.

**Hardware method**

To permanently change the device number of a Commodore 1541 disk drive, you can modify the hardware jumpers on the drive's circuit board.

**Steps to change the device number:**

1. Disconnect all cables from the drive, including power.
2. Turn the drive upside down on a flat, steady surface.
3. Remove the four screws holding the drive box together.
4. Carefully turn the drive right side up and remove the case top.
5. Remove the two screws on the side of the metal housing.
6. Remove the housing.
7. Locate the device number jumpers. If facing the front of the drive, they are on the left edge in the middle of the board.
8. Cut either or both of jumpers 1 and 2 for Model 1541.
9. Replace the housing and screws, and reassemble the drive.
10. Reconnect cables and power up.

**Jumper settings for device numbers:**

| Device Number | Jumper 1 | Jumper 2 |
|---------------|----------|----------|
| 8             | Uncut    | Uncut    |
| 9             | Cut      | Uncut    |
| 10            | Uncut    | Cut      |
| 11            | Cut      | Cut      |

([scribd.com](https://www.scribd.com/document/40438/The-Commodore-1541-Disk-Drive-User-s-Guide?utm_source=openai))

Note: Cutting the jumpers is a permanent modification. To revert the change, you would need to solder the jumpers back together.

## Source Code

```basic
' Format for changing device number:
PRINT#file#,"M-W" CHR$(119) CHR$(0) CHR$(2) CHR$(address+32) CHR$(address+64)

' Example: change device number from 8 to 9
10 OPEN 15,8,15
20 PRINT#15,"M-W"CHR$(119)CHR$(0)CHR$(2)CHR$(9+32)CHR$(9+64)
30 CLOSE 15
```

## Key Registers

- (none) — This chunk documents a drive controller RAM write protocol, not C64 memory-mapped registers.

## References

- "changing_device_number_hardware_method_and_jumper_table" — hardware method and jumper table for permanent multi-drive setups