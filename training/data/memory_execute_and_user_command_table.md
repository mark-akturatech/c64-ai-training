# MEMORY-EXECUTE and USER commands (Disk DOS jump table $0500–$050F)

**Summary:** Details the MEMORY-EXECUTE command syntax (`PRINT#file#,"M-E" CHR$(low) CHR$(high)`) for executing code in the disk drive's memory. It also outlines USER command mappings to the drive RAM jump table at $0500–$050F, including U9/UI → $FFFA and U; / UJ → $FFFC. Additionally, it explains the UI+ and UI- commands for switching between Commodore 64 and VIC-20 speed modes.

**MEMORY-EXECUTE**

The MEMORY-EXECUTE command allows the host computer to instruct the disk drive to execute a routine located at a specified address in the drive's memory.

**FORMAT:**

- `PRINT#file#,"M-E" CHR$(low address byte) CHR$(high address byte)`
  - `low` and `high` are the low and high bytes of the target address, respectively.
  - Bytes are sent in little-endian order (low byte first, then high byte).
  - `file#` is the open channel to the drive (commonly 15 for the drive command channel).

This command enables the execution of code residing in the disk drive's memory without transferring it to the host computer.

**USER COMMANDS**

USER commands (U1 through U9, U;, UJ, UI+, and UI-) are interpreted by the disk drive's DOS as jumps to specific addresses in the drive's memory. By placing appropriate instructions at these addresses, custom routines can be executed from the host computer.

**USER Command to Drive Memory Address Mapping:**

- U1 or UA: BLOCK-READ without changing buffer-pointer
- U2 or UB: BLOCK-WRITE without changing buffer-pointer
- U3 or UC: Jump to $0500
- U4 or UD: Jump to $0503
- U5 or UE: Jump to $0506
- U6 or UF: Jump to $0509
- U7 or UG: Jump to $050C
- U8 or UH: Jump to $050F
- U9 or UI: Jump to $FFFA
- U; or UJ: Jump to $FFFC (power-up vector)
- UI+: Set Commodore 64 speed
- UI-: Set VIC-20 speed

By loading a JMP (or other entry code) into these addresses, you create an easy-to-use jump table accessible from BASIC via the USER commands. Example usage from BASIC sends the single-character USER string (or a constructed string) to the drive command channel.

**Note:** The "power-up vector" for U; or UJ is located at $FFFC.

**UI+ and UI- Commands**

The UI+ and UI- commands are used to switch the communication speed between the host computer and the disk drive:

- **UI+:** Sets the communication speed to match the Commodore 64.
- **UI-:** Sets the communication speed to match the VIC-20.

These commands adjust the timing to ensure proper data transfer rates between the devices.

## Source Code

```text
USER COMMAND                    FUNCTION

 U1 or UA      BLOCK-READ without changing buffer-pointer
 U2 or UB      BLOCK-WRITE without changing buffer-pointer
 U3 or UC      Jump to $0500
 U4 or UD      Jump to $0503
 U5 or UE      Jump to $0506
 U6 or UF      Jump to $0509
 U7 or UG      Jump to $050C
 U8 or UH      Jump to $050F
 U9 or UI      Jump to $FFFA
 U; or UJ      Jump to $FFFC (power-up vector)
 UI+           Set Commodore 64 speed
 UI-           Set VIC-20 speed
```

```basic
EXAMPLES OF USER COMMANDS:

    PRINT#15,"U3"
    PRINT#15,"U"+CHR$(50+Q)
    PRINT#15,"UI"
```

```text
MEMORY-EXECUTE FORMAT:

    PRINT#file#,"M-E" + CHR$(low byte) + CHR$(high byte)
```

## Key Registers

- **$0500–$050F:** Disk drive RAM - USER command jump-table entries (U3 through U8 mapped to three-byte spaced entries).
- **$FFFA:** Drive ROM/Vector area - target for U9/UI.
- **$FFFC:** Drive ROM/Vector area - power-up vector, target for U; / UJ.

## References

- "Inside Commodore DOS" by Richard Immers and Gerald G. Neufeld.
- Commodore 1541 Disk Drive User's Guide.

## Labels
- MEMORY-EXECUTE
- U3
- U9
- UJ
