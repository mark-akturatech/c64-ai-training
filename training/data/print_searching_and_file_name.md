# Print "Searching..." and filename (KERNAL $F5AF–$F5D1)

**Summary:** KERNAL routine at $F5AF–$F5D1 prints the "SEARCHING..." message and, if a filename exists, the "FOR " token followed by the filename bytes to the current output channel. Uses message-mode flag $009D, filename length $00B7, filename pointer ($00BB), KERNAL message printer $F12F and CHROUT $FFD2.

## What this routine does
This ROM routine is the user-facing sequence used when the system is searching for a file (tape/serial, etc.). Behavior and sequence:

- Check message-mode flag in zero page $009D; exit immediately if control messages are disabled.
- Index into the KERNAL message table (LDY #$0C) and JSR $F12F to print the "SEARCHING " message.
- If filename length ($00B7) is zero, return. Otherwise, index to the "FOR " message (LDY #$17) and JSR $F12F to print it.
- Print the filename: obtain length from $00B7, return if zero; otherwise set Y=0 and loop:
  - LDA ($00BB),Y to fetch the next filename byte (indirect zero-page pointer).
  - JSR $FFD2 to output the character to the current output channel (CHROUT).
  - INY; compare Y to length ($00B7); loop until all filename bytes are output.
- RTS returns to caller.

Notes:
- $F12F is the KERNAL message-printing routine which uses Y as an index into an internal message table.
- $FFD2 is the standard CHROUT vector for device-character output (current output channel).
- Zero-page operands: $009D = message-mode flag; $00B7 = file name length; $00BB = low-byte of indirect filename pointer (paired with $00BC high-byte elsewhere).

## Source Code
```asm
                                *** print "Searching..."
.,F5AF A5 9D    LDA $9D         get message mode flag
.,F5B1 10 1E    BPL $F5D1       exit if control messages off
.,F5B3 A0 0C    LDY #$0C        
                                index to "SEARCHING "
.,F5B5 20 2F F1 JSR $F12F       display kernel I/O message
.,F5B8 A5 B7    LDA $B7         get file name length
.,F5BA F0 15    BEQ $F5D1       exit if null name
.,F5BC A0 17    LDY #$17        
                                else index to "FOR "
.,F5BE 20 2F F1 JSR $F12F       display kernel I/O message

                                *** print file name
.,F5C1 A4 B7    LDY $B7         get file name length
.,F5C3 F0 0C    BEQ $F5D1       exit if null file name
.,F5C5 A0 00    LDY #$00        clear index
.,F5C7 B1 BB    LDA ($BB),Y     get file name byte
.,F5C9 20 D2 FF JSR $FFD2       output character to channel
.,F5CC C8       INY             increment index
.,F5CD C4 B7    CPY $B7         compare with file name length
.,F5CF D0 F6    BNE $F5C7       loop if more to do
.,F5D1 60       RTS             
```

## Key Registers
- $009D - Zero Page - message mode flag (control messages on/off)
- $00B7 - Zero Page - file name length (bytes)
- $00BB - Zero Page - low byte of filename pointer (LDA ($BB),Y reads bytes)

## References
- "serial_bus_load_and_receive" — expands invoked status during serial-bus loads
- "tape_load_sequence" — expands invoked status during tape searches
- "display_loading_or_verifying" — expands follow-up status message after 'Searching...'