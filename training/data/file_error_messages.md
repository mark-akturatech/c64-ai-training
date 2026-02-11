# File I/O Error Messages (KERNAL routine)

**Summary:** KERNAL ROM routine that reports standard file I/O error codes (1-9), closes channels (JSR $FFCC), optionally displays the kernel "I/O ERROR #" message (JSR $F12F) depending on the message-mode flag ($9D), converts the error number to ASCII (ORA #$30) and outputs it via CHROUT (JSR $FFD2), then returns with the carry set to signal an error.

## Description
This routine implements the KERNAL's file I/O error reporting sequence for common file/device errors: "too many files", "file already open", "file not open", "file not found", "device not present", "not input file", "not output file", "missing file name", and "illegal device number" (error codes 1..9). Behavior in order:

- Load the appropriate error number (1..9) into A and push it on the stack (PHA) to preserve it across calls.
- Close input and output channels by JSR $FFCC (ensures devices are closed after an error).
- Use Y = 0 as an index to the "I/O ERROR #" message (message printing uses Y).
- Test the message-mode flag by BIT $9D. If messages are disabled (branch on V clear), skip the kernel message display.
- If messages enabled, JSR $F12F to display the kernel "I/O ERROR #" string (this routine prints the fixed message and uses Y as an index for the numeric digit).
- Restore the error number from the stack, duplicate it on the stack so the value remains available for other uses.
- Convert the binary error number to its ASCII digit by ORA #$30.
- Output the ASCII character with JSR $FFD2 (CHROUT) which writes to the current output channel.
- Pull the original error number off the stack, set the carry flag with SEC to indicate an error on return, and RTS.

Important details preserved from the ROM:
- The message-mode flag tested is at $9D (BIT $9D).
- Message display uses JSR $F12F and expects Y as index into the message.
- Output of the error digit uses the standard CHROUT vector at $FFD2.
- Channels are closed through JSR $FFCC before printing.

## Source Code
```asm
.,F6FB A9 01    LDA #$01        ; 'too many files' error
.:F6FD 2C       .BYTE $2C       ; makes next line BIT $02A9
.,F6FE A9 02    LDA #$02        ; 'file already open' error
.:F700 2C       .BYTE $2C       ; makes next line BIT $03A9
.,F701 A9 03    LDA #$03        ; 'file not open' error
.:F703 2C       .BYTE $2C       ; makes next line BIT $04A9
.,F704 A9 04    LDA #$04        ; 'file not found' error
.:F706 2C       .BYTE $2C       ; makes next line BIT $05A9
.,F707 A9 05    LDA #$05        ; 'device not present' error
.:F709 2C       .BYTE $2C       ; makes next line BIT $06A9
.,F70A A9 06    LDA #$06        ; 'not input file' error
.:F70C 2C       .BYTE $2C       ; makes next line BIT $07A9
.,F70D A9 07    LDA #$07        ; 'not output file' error
.:F70F 2C       .BYTE $2C       ; makes next line BIT $08A9
.,F710 A9 08    LDA #$08        ; 'missing file name' error
.:F712 2C       .BYTE $2C       ; makes next line BIT $09A9
.,F713 A9 09    LDA #$09        ; do 'illegal device number'
.,F715 48       PHA             ; save the error #
.,F716 20 CC FF JSR $FFCC       ; close input and output channels
.,F719 A0 00    LDY #$00        ; index to "I/O ERROR #"
.,F71B 24 9D    BIT $9D         ; test message mode flag
.,F71D 50 0A    BVC $F729       ; exit if kernal messages off
.,F71F 20 2F F1 JSR $F12F       ; display kernel I/O message
.,F722 68       PLA             ; restore error #
.,F723 48       PHA             ; copy error #
.,F724 09 30    ORA #$30        ; convert to ASCII
.,F726 20 D2 FF JSR $FFD2       ; output character to channel (CHROUT)
.,F729 68       PLA             ; pull error number
.,F72A 38       SEC             ; flag error (set carry)
.,F72B 60       RTS
```

## References
- "scan_stop_key_and_handle_stop" — expands on uses of JSR $FFCC to close channels
- "tape_save_entry_and_device_checks" — expands on usage for illegal device and tape errors