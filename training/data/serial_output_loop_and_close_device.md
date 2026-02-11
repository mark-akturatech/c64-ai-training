# Serial output and close logic (ROM $F627-$F658)

**Summary:** Commodore 64 ROM routine that reads bytes from an output buffer (LDA ($AC),Y), sends them to the serial bus (JSR $EDDD), scans the STOP key (JSR $FFE1), handles an early STOP by closing the serial device (JSR $F642), and otherwise finishes by issuing UNLISTEN/LISTEN, sending the secondary address (JSR $EDB9) with a CLOSE command, then UNLISTEN and return (CLC/RTS). Searchable terms: $EDDD, $F642, $EDFE, $EDB9, JSR, LDA ($AC),Y, STOP key, secondary address.

## Operation
This routine is the serial output loop and close sequence used when sending data to a serial device:

- Entry point near $F627 begins by testing a carry flag (BCS $F63F) to detect the "end" condition; if set it jumps to the UNLISTEN/close sequence.
- Normal loop:
  - Fetch next byte from the output buffer using indirect Y addressing (LDA ($AC),Y).
  - Send the byte to the serial bus with JSR $EDDD.
  - Poll the STOP key using JSR $FFE1; if STOP is not pressed (BNE), increment the buffer pointer (JSR $FCDB) and loop back.
  - If STOP is pressed, the code closes the serial device (JSR $F642), sets the carry (SEC) to flag a stop condition, and RTS to return early.
- End-of-buffer / final close path (when initial BCS taken):
  - Command serial bus to UNLISTEN (JSR $EDFE).
  - BIT $B9 tests the secondary address byte; BMI exits early if the test indicates the device is already closed.
  - Otherwise load the device number from $BA and issue LISTEN (JSR $ED0C).
  - Load the secondary address from $B9, mask out the channel bits with AND #$EF, OR with #$E0 to form a CLOSE secondary address, and send it with JSR $EDB9.
  - Issue UNLISTEN again (JSR $EDFE), clear carry (CLC) to flag OK, and RTS to return.

Flags:
- SEC at $F638 is used to indicate a STOP condition (carry set).
- CLC at $F657 clears the carry to indicate normal completion.

Notes on bit manipulation:
- AND #$EF clears bit 4 (0x10) of the secondary address (masking channel bits).
- ORA #$E0 sets the high command bits (0xE0) to turn the masked value into a CLOSE command secondary address.

## Source Code
```asm
.,F627 B0 16    BCS $F63F       go do UNLISTEN if at end
.,F629 B1 AC    LDA ($AC),Y     get byte from buffer
.,F62B 20 DD ED JSR $EDDD       output byte to serial bus
.,F62E 20 E1 FF JSR $FFE1       scan stop key
.,F631 D0 07    BNE $F63A       if stop not pressed go increment pointer and loop for next
                                else ..
                                close the serial bus device and flag stop
.,F633 20 42 F6 JSR $F642       close serial bus device
.,F636 A9 00    LDA #$00        
.,F638 38       SEC             flag stop
.,F639 60       RTS             
.,F63A 20 DB FC JSR $FCDB       increment read/write pointer
.,F63D D0 E5    BNE $F624       loop, branch always
.,F63F 20 FE ED JSR $EDFE       command serial bus to UNLISTEN
                                close serial bus device
.,F642 24 B9    BIT $B9         test the secondary address
.,F644 30 11    BMI $F657       if already closed just exit
.,F646 A5 BA    LDA $BA         get the device number
.,F648 20 0C ED JSR $ED0C       command devices on the serial bus to LISTEN
.,F64B A5 B9    LDA $B9         get the secondary address
.,F64D 29 EF    AND #$EF        mask the channel number
.,F64F 09 E0    ORA #$E0        OR with the CLOSE command
.,F651 20 B9 ED JSR $EDB9       send secondary address after LISTEN
.,F654 20 FE ED JSR $EDFE       command serial bus to UNLISTEN
.,F657 18       CLC             flag ok
.,F658 60       RTS             
```

## References
- "tape_save_entry_and_device_checks" — higher-level entry that checks device type and may invoke serial/tape operations
- "rs232_initialisation_and_checks" — related handling for RS232 device checks and illegal-device handling (tape/RS232 decision)
