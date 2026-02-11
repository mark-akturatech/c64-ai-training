# ********* - Section 2.3: Powering-on sequence and important order (computer last), removing all diskettes before power-up, LED startup behavior. Includes an ASCII diagram illustrating diskette write-protect notch and the correct orientation for insertion.

**Summary:** Describes the recommended power-on order for peripherals and the C64 (computer last), the requirement to remove diskettes before power-up, 1541 drive LED startup behavior (green then blinking red), and includes an ASCII diagram showing diskette write-protect notch orientation for insertion.

## Powering On
Turn on peripheral devices before the computer; the computer (C64) must always be the last device switched on. Verify all diskettes have been removed from drives before powering any equipment.

Typical startup behavior described:
- Printer: motor runs and print head moves partially across the line and back during its start sequence.
- 1541 disk drive: green drive light will come on initially; the red drive/error light will blink during the drive's startup sequence.
- TV/monitor: will form the starting picture while devices initialize.

Do not begin using the disk drive until the 1541's red drive/error light has finished blinking — only then is it safe to operate the drive.

## Diskette orientation and write-protect notch
- Remove all diskettes before power-up.
- The ASCII diagram (see Source Code) shows the correct orientation for inserting a diskette into the drive and the write-protect notch position.
- When the write-protect notch is covered (notch closed), diskette contents cannot be altered.

## Source Code
```text
                    +-------U-===-U-------+       /\
                    |         | |         |     /    \
                    |         |_|         |   /_      _\ INSERT
                    |         ___         |     |    |    INTO
                    |     O  /   \        |     |    |    DRIVE
        WRITE       |       |     |       |     |    |
        PROTECT     |        \___/        |     |    |
        NOTCH ------]                     |     |____|
                    |                     |
                    +---------------------+
 WHEN COVERED, DISKETTE
 CONTENTS CANNOT BE ALTERED

 Fig.4. Postition for Diskette Insertion
```

## References
- "insertion_and_drive_door_procedures" — expands on step-by-step disk insertion and drive door operation (Section 2.4)
