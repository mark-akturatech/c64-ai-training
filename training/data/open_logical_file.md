# KERNAL: Open Logical File (ROM $F34A)

**Summary:** ROM routine at $F34A that opens a logical file: validates the logical file, ensures it is not already open, enforces the maximum open-file count ($98), updates the logical-file/device/secondary-address tables ($0259,X / $0263,X / $026D,X), handles keyboard/screen special cases, dispatches to serial-bus, RS232 or tape handlers, and sets up tape header/buffer when needed.

## Operation
This routine implements the KERNAL "open" sequence for a logical file (entry $F34A):

- Entry: LDX $B8 obtains the logical-file number from zero page.
  - If zero (no logical file), it jumps to the "not input file" error handler and returns.
- Calls the file lookup routine (JSR $F30F). If the file is already open the code jumps to the "file already open" error and returns.
- Checks the current open-file count in zero-page $0098 against the maximum (compare with #$0A). If the maximum is reached, it jumps to the "too many files" error and returns.
- Increments the open-file count ($0098).
- Writes per-channel tables using X as the channel index:
  - Stores logical-file number to $0259,X (logical-file table).
  - ORs the secondary address with the OPEN CHANNEL bitmask #$60 and stores it to $026D,X (secondary-address table).
  - Stores device number to $0263,X (device-number table).
- Device special-cases:
  - If device number ($00BA) is zero (keyboard), the routine flags success (CLC) and returns.
  - If device number equals #$03 (screen), similarly flag success and return.
- Device routing:
  - If device number < #$03 (i.e. 1 or 2), execution falls through to the tape/RS232 handling path.
  - Otherwise (serial-bus style device), it calls the serial-bus send routine (JSR $F3D5) to transmit the secondary address and filename; on success it returns OK.
- RS232 device:
  - If device equals #$02 the code jumps to the RS232 open/initialisation routine and returns.
- Tape device handling (device numbers below #$03 and not RS232):
  - Calls JSR $F7D0 to get the tape buffer start pointer in X/Y. If pointer indicates an invalid value (branch when carry clear), it reports "illegal device number" and returns.
  - Masks the secondary address low nibble (AND #$0F); if zero, the routine searches for a tape header. It waits for PLAY (JSR $F817) and exits if STOP was pressed.
  - Prints "Searching..." (JSR $F5AF) and then:
    - If a file name length ($00B7) is non-zero, calls the header search for a specific name (JSR $F7EA). If the header isn't found, returns an error.
    - If the file name length is zero, calls a general tape header search (JSR $F72C) which returns with the header in the tape buffer; it handles end-of-tape and not-found cases.
  - If a data header must be written (no header found and user pressed PLAY/RECORD), waits for PLAY/RECORD (JSR $F838) and then writes a data file header (LDA #$04; JSR $F76A).
  - Sets up the tape buffer index:
    - Loads #$BF into A and Y <- secondary address ($00B9). If Y == #$60 the code branches past buffer initialisation.
    - Else it clears Y, stores #$02 into (pointer) ($00B2),Y to initialize the first byte in the tape buffer.
    - Clears A via TYA and stores it into $00A6 (tape buffer index).
- On success: clears carry (CLC) to signal OK and RTS.

Notes:
- The routine updates three per-channel tables at $0259,X (logical file), $026D,X (secondary), and $0263,X (device). These are KERNAL-resident tables indexed by channel.
- The OPEN CHANNEL command bitmask #$60 is ORed into the secondary address before storing.
- Tape handling involves several KERNAL subroutines (buffer pointer fetch, header search, write) and user-button checks (PLAY/STOP/RECORD).

## Source Code
```asm
.,F34A A6 B8    LDX $B8         get the logical file
.,F34C D0 03    BNE $F351       if there is a file continue
.,F34E 4C 0A F7 JMP $F70A       else do 'not input file error' and return
.,F351 20 0F F3 JSR $F30F       find a file
.,F354 D0 03    BNE $F359       if file not found continue
.,F356 4C FE F6 JMP $F6FE       else do 'file already open' error and return
.,F359 A6 98    LDX $98         get the open file count
.,F35B E0 0A    CPX #$0A        compare it with the maximum + 1
.,F35D 90 03    BCC $F362       if less than maximum + 1 go open the file
.,F35F 4C FB F6 JMP $F6FB       else do 'too many files error' and return
.,F362 E6 98    INC $98         increment the open file count
.,F364 A5 B8    LDA $B8         get the logical file
.,F366 9D 59 02 STA $0259,X     save it to the logical file table
.,F369 A5 B9    LDA $B9         get the secondary address
.,F36B 09 60    ORA #$60        OR with the OPEN CHANNEL command
.,F36D 85 B9    STA $B9         save the secondary address
.,F36F 9D 6D 02 STA $026D,X     save it to the secondary address table
.,F372 A5 BA    LDA $BA         get the device number
.,F374 9D 63 02 STA $0263,X     save it to the device number table
.,F377 F0 5A    BEQ $F3D3       if it is the keyboard go do the ok exit
.,F379 C9 03    CMP #$03        compare the device number with the screen
.,F37B F0 56    BEQ $F3D3       if it is the screen go do the ok exit
.,F37D 90 05    BCC $F384       if tape or RS232 device go ??
                                else it is a serial bus device
.,F37F 20 D5 F3 JSR $F3D5       send the secondary address and filename
.,F382 90 4F    BCC $F3D3       go do ok exit, branch always
.,F384 C9 02    CMP #$02        
.,F386 D0 03    BNE $F38B       
.,F388 4C 09 F4 JMP $F409       go open RS232 device and return
.,F38B 20 D0 F7 JSR $F7D0       get tape buffer start pointer in XY
.,F38E B0 03    BCS $F393       if >= $0200 go ??
.,F390 4C 13 F7 JMP $F713       else do 'illegal device number' and return
.,F393 A5 B9    LDA $B9         get the secondary address
.,F395 29 0F    AND #$0F        
.,F397 D0 1F    BNE $F3B8       
.,F399 20 17 F8 JSR $F817       wait for PLAY
.,F39C B0 36    BCS $F3D4       exit if STOP was pressed
.,F39E 20 AF F5 JSR $F5AF       print "Searching..."
.,F3A1 A5 B7    LDA $B7         get file name length
.,F3A3 F0 0A    BEQ $F3AF       if null file name just go find header
.,F3A5 20 EA F7 JSR $F7EA       find specific tape header
.,F3A8 90 18    BCC $F3C2       branch if no error
.,F3AA F0 28    BEQ $F3D4       exit if ??
.,F3AC 4C 04 F7 JMP $F704       do file not found error and return
.,F3AF 20 2C F7 JSR $F72C       find tape header, exit with header in buffer
.,F3B2 F0 20    BEQ $F3D4       exit if end of tape found
.,F3B4 90 0C    BCC $F3C2       
.,F3B6 B0 F4    BCS $F3AC       
.,F3B8 20 38 F8 JSR $F838       wait for PLAY/RECORD
.,F3BB B0 17    BCS $F3D4       exit if STOP was pressed
.,F3BD A9 04    LDA #$04        set data file header
.,F3BF 20 6A F7 JSR $F76A       write tape header
.,F3C2 A9 BF    LDA #$BF        
.,F3C4 A4 B9    LDY $B9         get the secondary address
.,F3C6 C0 60    CPY #$60        
.,F3C8 F0 07    BEQ $F3D1       
.,F3CA A0 00    LDY #$00        clear index
.,F3CC A9 02    LDA #$02        
.,F3CE 91 B2    STA ($B2),Y     save to tape buffer
.,F3D0 98       TYA             clear A
.,F3D1 85 A6    STA $A6         save tape buffer index
.,F3D3 18       CLC             flag ok
.,F3D4 60       RTS             
```

## Key Registers
- $0098 - Zero Page - open file count (incremented on successful open)
- $00A6 - Zero Page - tape buffer index (initialized for tape files)
- $00B2 - Zero Page - pointer (indirect) to tape buffer start (used with STA ($B2),Y)
- $00B7 - Zero Page - file name length for tape operations
- $00B8 - Zero Page - logical file number (input)
- $00B9 - Zero Page - secondary address (modified with ORA #$60 before storage)
- $00BA - Zero Page - device number (used for routing keyboard/screen/RS232/tape/serial)
- $0259-$0259+X - KERNAL RAM - logical-file table (stores logical file per channel, written STA $0259,X)
- $0263-$0263+X - KERNAL RAM - device-number table (stores device number per channel, written STA $0263,X)
- $026D-$026D+X - KERNAL RAM - secondary-address table (stores secondary address per channel, written STA $026D,X)

## References
- "send_secondary_address_and_filename" — Called when opening serial-bus style devices to send the secondary address and filename
- "open_rs232_device_and_buffer_setup" — Called when opening an RS232 device (device #2) to set up the 6551 registers, baud, and buffers

## Labels
- OPEN
