# CLRCHN — Clear I/O Channels

**Summary:** CLRCHN is a KERNAL routine at $FFCC (65484) that clears all open I/O channels, restores default devices (input = device 0 keyboard, output = device 3 screen), and sends UNTALK/UNLISTEN on the serial bus as needed.

## Description
Purpose: clear all open channels and restore I/O defaults. Typical usage is after opening alternate I/O channels (tape, disk, printer) to ensure subsequent CHROUT/CHRIN go to the intended devices.

Behavior:
- Restores default input device to 0 (keyboard) and default output device to 3 (screen).
- Closes all open channels. For channels on the serial bus, the routine issues an UNTALK to clear an input (TALK) channel or an UNLISTEN to clear an output (LISTEN) channel as appropriate.
- Prevents leaving listeners/talkers active on the IEC serial bus (avoids multiple devices receiving the same data).

Automatic invocation:
- CLRCHN is automatically called by the KERNAL CLALL (close all files) routine when closing files.

Why call it:
- To avoid unintended multiple recipients on the serial bus. Example use-case from KERNAL documentation: command the printer to TALK and the disk to LISTEN to print a disk file directly — CLRCHN ensures channels are properly cleared afterward so devices are not left listening or talking.

Registers / stack / side effects:
- Call address: $FFCC (decimal 65484)
- Communication registers: none
- Preparatory routines: none
- Error returns: none specified
- Stack requirements: 9 bytes
- Registers affected: A, X (these registers may be altered; other registers are preserved unless otherwise noted)

How to call:
- Use JSR to invoke the routine.

## Source Code
```asm
CLRCHN = $FFCC

; Example usage:
    JSR CLRCHN    ; Clear all open channels, restore input=0 (keyboard), output=3 (screen)
```

## Key Registers
- $FFCC - KERNAL - CLRCHN call address (clear I/O channels)

## References
- "chro_ut_output_a_character" — expands on using CLRCHN so CHROUT only reaches intended device
- "clall_close_all_files" — CLALL automatically calls CLRCHN as part of closing all files