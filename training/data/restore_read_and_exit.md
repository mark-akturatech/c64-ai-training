# DOS: Write-sequence cleanup — re-enable read and jump to error handler

**Summary:** This Commodore 1541 DOS routine re-enables the drive's read mode, sets the FDC/status byte to indicate an error, and transfers control to the DOS error handler.

**Description**

This routine performs the following steps:

- Calls the drive routine at $FE00 to re-enable read mode on the floppy controller.
- Loads the accumulator with #$01 to set the FDC/status byte.
- Jumps to the DOS error handler at $F969.

This sequence is part of the write operation cleanup process in the 1541's DOS.

## Source Code

```asm
; Re-enable read mode on the floppy controller, set FDC/status byte, jump to error handler
        JSR $FE00       ; enable read
        LDA #$01        ; set FDC/status byte in A
        JMP $F969       ; jump to DOS error/exit handler
```

## References

- "write_sync_and_write_sequence" — preceding code that performs the actual write and synchronization before this cleanup.
