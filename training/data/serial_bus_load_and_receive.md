# ROM: LOAD from serial-bus devices ($F4B4-$F52E)

**Summary:** Disassembly and annotated flow for the C64 ROM LOAD path over the serial (IEC) bus: sending TALK/secondary address and filename, receiving program start address and data bytes, handling load vs verify, writing bytes to memory via indirect pointer ($AE/$AF), serial-status masking at $90, timeout detection, STOP-key scan, UNTALK and close device sequences.

## Flow and behavior
- Entry point examines prior status and a branch/conditions to ensure a filename is present ($B7 = filename length). If zero, it jumps to the "missing file name" error handler.
- Secondary address is read from $B9 and echoed back to $B9 after printing "Searching..." (JSR $F5AF). The filename and secondary address are sent to the device (JSR $F3D5).
- Device TALK command is issued using the device number in $BA (JSR $ED09) and the secondary address is sent after TALK (JSR $EDC7).
- The loader reads the first two bytes from the serial bus (JSR $EE13) into $AE (low) and $AF (high) — this becomes the program start address returned by the device.
- After reading the low byte the serial-status byte at $90 is tested for timeout by shifting it right twice (LSR; carry becomes set if timeout). If timeout is detected the code branches out to a "file not found" error path.
- If the caller supplied an explicit load location (X register nonzero), the code uses that; otherwise the returned start address ($AE/$AF) from the device is used (the code copies $C3/$C4 into $AE/$AF when appropriate).
- Before each data byte transfer the code masks the serial-status byte: it loads #$FD, ANDs with $90 and stores back to $90 (this clears a particular bit used for timeout/read-state). It scans the STOP key via JSR $FFE1; if STOP is detected it closes the device and signals stop.
- Each data byte is read via JSR $EE13, then the status byte $90 is checked for timeout by shifting it twice and testing carry; if timed out it retries the read loop.
- For verify mode ($93 non-zero): the received byte is compared against memory at ($AE),Y (indirect indexed) with Y starting at 0. On mismatch it sets a read-error flag (LDA #$10; JSR $FE1C to OR it into the serial-status byte).
- For load mode (or after verify success) the received byte is stored to memory with STA ($AE),Y; the pointer ($AE/$AF) is incremented (low byte INC $AE; on rollover INC $AF).
- After storing/testing each byte the code tests the serial-status byte (BIT $90). If not end-of-file it loops back to read the next byte. On end-of-file it UNTALKs (JSR $EDEF) and closes the device (JSR $F642), then branches depending on carry to the final return path.
- A stray raw .BYTE $2C occurs at $F51B (present in the ROM) and alters the usual instruction stream; it effectively places a literal $2C in the code between JSR $FE1C and STA ($AE),Y.

Behavioral notes preserved from the disassembly: timeout detection uses two LSRs on $90 and branches on carry; the STOP key is polled by JSR $FFE1 and causes an immediate close/stop path; verify mode compares bytes before storing and sets a read-error flag if mismatch.

## Source Code
```asm
.,F4B4 F0 F9    BEQ $F4AF       
.,F4B6 90 7B    BCC $F533       
.,F4B8 A4 B7    LDY $B7         get file name length
.,F4BA D0 03    BNE $F4BF       if not null name go ??
.,F4BC 4C 10 F7 JMP $F710       else do 'missing file name' error and return
.,F4BF A6 B9    LDX $B9         get the secondary address
.,F4C1 20 AF F5 JSR $F5AF       print "Searching..."
.,F4C4 A9 60    LDA #$60        
.,F4C6 85 B9    STA $B9         save the secondary address
.,F4C8 20 D5 F3 JSR $F3D5       send secondary address and filename
.,F4CB A5 BA    LDA $BA         get the device number
.,F4CD 20 09 ED JSR $ED09       command serial bus device to TALK
.,F4D0 A5 B9    LDA $B9         get the secondary address
.,F4D2 20 C7 ED JSR $EDC7       send secondary address after TALK
.,F4D5 20 13 EE JSR $EE13       input byte from serial bus
.,F4D8 85 AE    STA $AE         save program start address low byte
.,F4DA A5 90    LDA $90         get the serial status byte
.,F4DC 4A       LSR             shift time out read ..
.,F4DD 4A       LSR             .. into carry bit
.,F4DE B0 50    BCS $F530       if timed out go do file not found error and return
.,F4E0 20 13 EE JSR $EE13       input byte from serial bus
.,F4E3 85 AF    STA $AF         save program start address high byte
.,F4E5 8A       TXA             copy secondary address
.,F4E6 D0 08    BNE $F4F0       load location not set in LOAD call, so continue with the
                                load
.,F4E8 A5 C3    LDA $C3         get the load address low byte
.,F4EA 85 AE    STA $AE         save the program start address low byte
.,F4EC A5 C4    LDA $C4         get the load address high byte
.,F4EE 85 AF    STA $AF         save the program start address high byte
.,F4F0 20 D2 F5 JSR $F5D2       
.,F4F3 A9 FD    LDA #$FD        mask xxxx xx0x, clear time out read bit
.,F4F5 25 90    AND $90         mask the serial status byte
.,F4F7 85 90    STA $90         set the serial status byte
.,F4F9 20 E1 FF JSR $FFE1       scan stop key, return Zb = 1 = [STOP]
.,F4FC D0 03    BNE $F501       if not [STOP] go ??
.,F4FE 4C 33 F6 JMP $F633       else close the serial bus device and flag stop
.,F501 20 13 EE JSR $EE13       input byte from serial bus
.,F504 AA       TAX             copy byte
.,F505 A5 90    LDA $90         get the serial status byte
.,F507 4A       LSR             shift time out read ..
.,F508 4A       LSR             .. into carry bit
.,F509 B0 E8    BCS $F4F3       if timed out go try again
.,F50B 8A       TXA             copy received byte back
.,F50C A4 93    LDY $93         get load/verify flag
.,F50E F0 0C    BEQ $F51C       if load go load
                                else is verify
.,F510 A0 00    LDY #$00        clear index
.,F512 D1 AE    CMP ($AE),Y     compare byte with previously loaded byte
.,F514 F0 08    BEQ $F51E       if match go ??
.,F516 A9 10    LDA #$10        flag read error
.,F518 20 1C FE JSR $FE1C       OR into the serial status byte
.:F51B 2C       .BYTE $2C       makes next line BIT $AE91
.,F51C 91 AE    STA ($AE),Y     save byte to memory
.,F51E E6 AE    INC $AE         increment save pointer low byte
.,F520 D0 02    BNE $F524       if no rollover go ??
.,F522 E6 AF    INC $AF         else increment save pointer high byte
.,F524 24 90    BIT $90         test the serial status byte
.,F526 50 CB    BVC $F4F3       loop if not end of file
                                close file and exit
.,F528 20 EF ED JSR $EDEF       command serial bus to UNTALK
.,F52B 20 42 F6 JSR $F642       close serial bus device
.,F52E 90 79    BCC $F5A9       if ?? go flag ok and exit
.,F530 4C 04 F7 JMP $F704       do file not found error and return
```

## Key Registers
- $00AE-$00AF - Zero Page - Program load/save pointer (start address low/high), used as indirect store pointer (STA ($AE),Y) and incremented during load
- $0090 - Zero Page - Serial status byte (checked and masked; timeout/read bits tested via LSR/BIT)
- $00B7 - Zero Page - Filename length (zero => missing filename error)
- $00B9 - Zero Page - Secondary address (sent to device)
- $00BA - Zero Page - Device number (used to issue TALK)
- $0093 - Zero Page - Load/verify flag (zero = load, non-zero = verify)
- $00C3-$00C4 - Zero Page - Caller-specified load address low/high (copied into $AE/$AF if set)

## References
- "tape_load_sequence" — alternate path for tape device loads
- "print_searching_and_file_name" — prints "Searching..." and the filename used during load
- "display_loading_or_verifying" — displays "LOADING" or "VERIFYING" during data transfer