# 1541: Compatibility and drive-speed switching (VIC-20 vs Commodore 64)

**Summary:** The 1541 disk drive defaults to Commodore 64 timing and can be switched to VIC-20 timing with the UI- command or back to C64 timing with UI+; send these USER (U) commands to the drive (example BASIC OPEN/CLOSE sequence).

## Compatibility and drive-speed switching
The 1541 supports both the VIC-20 and the Commodore 64 by providing two software-selectable data-rate modes. The drive powers up in the Commodore 64 (C64) mode. If the connected host is a VIC-20, the drive must be switched to the VIC-20 speed after the drive is started (either at power-on or via software) by sending the appropriate USER command string to the drive.

- Switch to VIC-20 speed: send the "UI-" USER command to the drive.
- Return to Commodore 64 speed: send the "UI+" USER command to the drive.
- These are USER (U) commands; see chapter 8 for detailed USER command format and chapter 4 for examples of using this type of command.

Keep the exact command syntax as shown below when issuing from BASIC.

## Source Code
```basic
OPEN 15,8,15,"UI-": CLOSE 15     ' Switch 1541 to VIC-20 speed
OPEN 15,8,15,"UI+": CLOSE 15     ' Return 1541 to Commodore 64 speed
```

## References
- "chapter_4_ui_commands_usage" — usage examples for sending UI/USER commands to the drive
- "chapter_8_user_commands" — detailed explanation of U (USER) commands and formats
- "programming_the_disk_controller_block_execute" — expands on USER and UI commands (see Chapter 8)
