# DFLTO ($009A) — Default Output (CMD) Device

**Summary:** Zero-page location $009A holds the default output (CMD) device number (default = $03, screen). KERNAL routine CHKOUT ($F250) stores the device number here when opening an output channel; BASIC calls CHKOUT for PRINT# and CMD and clears the channel after PRINT# completes.

## Description
DFLTO at $009A (decimal 154) is the KERNAL zero-page byte that defines the current default output (CMD) device. Its power-on/reset value is 3, which selects the screen as the default output device.

When the KERNAL routine CHKOUT ($F250) is used to establish an output channel, it writes the device number for that channel into $009A. Commodore BASIC invokes CHKOUT whenever a PRINT# or CMD statement is executed; after a PRINT# operation completes, BASIC clears the channel (removing that temporary output association).

This location is consulted by serial-output and device-selection code paths in the KERNAL when an implicit or default output device is required.

## Source Code
```text
154    $009A    DFLTO    ; Default Output (CMD) Device (default = 3 for screen)

KERNAL: CHKOUT = $F250    ; CHKOUT stores device number for output channels into $009A
```

## Key Registers
- $009A - KERNAL - Default output (CMD) device number (default $03 = screen)
- $F250 - KERNAL - CHKOUT routine (stores device number into $009A; called by BASIC for PRINT#/CMD)

## References
- "dfltn_default_input_device_0x99" — covers default input device and CHKIN behavior
- "bsour_serial_buffered_character_0x95" — covers serial output buffering when printing to devices

## Labels
- DFLTO
- CHKOUT
