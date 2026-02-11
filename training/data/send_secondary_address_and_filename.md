# Send secondary address and filename for OPEN (serial bus)

**Summary:** C64 KERNAL routine to send the secondary address and filename bytes over the serial bus during OPEN ($F3D5–$F406). Uses zero page variables $B9 (secondary), $BA (device), $BB (filename pointer), $B7 (filename length) and $90 (serial status); calls serial routines at $ED0C, $EDB9, $EDDD and returns via $F654 (UNLISTEN).

## Operation
This routine transmits the secondary address and filename when opening a logical file on a serial-bus device.

- Load secondary address from $B9; if negative (high bit set) the routine exits immediately (secondary not used).
- Load filename length from $B7; if zero, exit.
- Clear accumulator and store 0 into $90 (serial status byte).
- Load device number from $BA and JSR $ED0C to command the device to LISTEN.
- Load secondary address, OR with #$F0 to form the OPEN/secondary command, and JSR $EDB9 to send it after LISTEN.
- Read back $90 (serial status). If positive (sign flag clear — BPL), device present; otherwise run the device-not-present error path (pull return address and JMP error handler).
- If filename length is non-zero, loop Y from 0 to length-1, fetch filename bytes via ( $BB ),Y and JSR $EDDD to output each byte to the serial bus.
- Finally JMP $F654 to UNLISTEN and return.

(Parenthetical: BPL tests the sign flag.)

## Source Code
```asm
.,F3D5 A5 B9    LDA $B9         get the secondary address
.,F3D7 30 FA    BMI $F3D3       ok exit if -ve
.,F3D9 A4 B7    LDY $B7         get file name length
.,F3DB F0 F6    BEQ $F3D3       ok exit if null
.,F3DD A9 00    LDA #$00        clear A
.,F3DF 85 90    STA $90         clear the serial status byte
.,F3E1 A5 BA    LDA $BA         get the device number
.,F3E3 20 0C ED JSR $ED0C       command devices on the serial bus to LISTEN
.,F3E6 A5 B9    LDA $B9         get the secondary address
.,F3E8 09 F0    ORA #$F0        OR with the OPEN command
.,F3EA 20 B9 ED JSR $EDB9       send secondary address after LISTEN
.,F3ED A5 90    LDA $90         get the serial status byte
.,F3EF 10 05    BPL $F3F6       if device present skip the 'device not present' error
.,F3F1 68       PLA             else dump calling address low byte
.,F3F2 68       PLA             dump calling address high byte
.,F3F3 4C 07 F7 JMP $F707       do 'device not present' error and return
.,F3F6 A5 B7    LDA $B7         get file name length
.,F3F8 F0 0C    BEQ $F406       branch if null name
.,F3FA A0 00    LDY #$00        clear index
.,F3FC B1 BB    LDA ($BB),Y     get file name byte
.,F3FE 20 DD ED JSR $EDDD       output byte to serial bus
.,F401 C8       INY             increment index
.,F402 C4 B7    CPY $B7         compare with file name length
.,F404 D0 F6    BNE $F3FC       loop if not all done
.,F406 4C 54 F6 JMP $F654       command serial bus to UNLISTEN and return
```

## Key Registers
- $B9 - Zero page - Secondary address (if negative, skip secondary)
- $B7 - Zero page - Filename length (number of bytes to send)
- $BB - Zero page - Pointer (indirect) to filename buffer
- $BA - Zero page - Device number used for LISTEN
- $90 - Zero page - Serial status byte (cleared before LISTEN, checked after sending secondary)

## References
- "open_logical_file" — expands on invoking this routine to send secondary address and filename for serial-bus devices during OPEN

## Labels
- $B9
- $B7
- $BB
- $BA
- $90
