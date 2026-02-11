# KERNAL: LOAD FROM SERIAL BUS (tape / RS232 path)

**Summary:** KERNAL load routine for serial devices (tape/RS232) that prints "SEARCHING", sends TALK/SA and the filename, calls ACPTR ($EE13) to receive the two-byte load address into $AE/$AF, supports relocated-load via MEMUSS ($C3/$C4), enters the receive loop that polls <STOP> (JSR $FFE1), receives bytes (ACPTR), checks STATUS ($90) for EOI/file-not-found, and either writes bytes to memory (STA ($AE),Y) or compares them (CMP ($AE),Y) when VERIFY ($93) is set.

## Flow and behavior
- Initial device check: branch out if device number indicates device >= 3 is illegal for this path (early BCC).
- Filename presence: FNLEN ($B7) is checked; missing filename jumps to the "MISSING FILENAME" handler.
- Setup and send:
  - SA ($B9) is saved and then set to $60 for the transfer; the filename and SA are sent to the serial bus (JSR $F3D5 and JSR $EDC7).
  - TALK is sent for the device in FA ($BA) via JSR $ED09.
- Receive two-byte load address:
  - JSR $EE13 (ACPTR) is called to read the low byte and store in $AE.
  - STATUS ($90) is examined (two LSRs then BCS) to detect EOI immediately after the low byte; if EOI then jump to "FILE NOT FOUND" I/O error handler.
  - JSR $EE13 is called again to read the high byte into $AF.
- Relocated-load support:
  - If SA was zero (TXA / BNE test), MEMUSS ($C3/$C4) is copied into $AE/$AF to support devices that require a relocated load address.
- Prepare loop and flags:
  - JSR $F5D2 (setup routine called after address receive).
  - STATUS ($90) is masked with #$FD (A9 $FD / AND $90) and stored back in $90.
- Receive/verify/store loop:
  - <STOP> key is scanned via JSR $FFE1; if stopped, branch to handler.
  - JSR $EE13 (ACPTR) receives the next data byte, TAX to keep A saved in X.
  - STATUS ($90) is loaded and shifted twice; BCS branches back to fetch another byte (loop continues) if appropriate.
  - Determine mode: LDY $93 then BEQ uses $93 as VERCK flag; if $93 == 0, the received byte is stored to memory (STA ($AE),Y). Otherwise the byte is compared to memory (CMP ($AE),Y) and on mismatch it calls an error handler (JSR $FE1C with A = #$10).
  - After store/compare, $AE is incremented; if it wraps ($AE == 0), increment $AF.
  - STATUS ($90) is BIT-tested and BVC branches to fetch the next byte; otherwise, the loop ends.
- Cleanup:
  - JSR $EDEF sends UNTALK to the serial bus.
  - JSR $F642 (post-UNTALK cleanup) then BCC branches to normal end; otherwise JMP to I/O error handler (file not found).
- Related JSRs used in this path (as called directly by this code):
  - $F5AF — print "SEARCHING"
  - $F3D5 — send SA and filename (serial send routine)
  - $ED09 — send TALK (device-specific)
  - $EDC7 — send TALK SA
  - $EE13 — ACPTR (receive one byte from serial bus)
  - $F5D2 — post-address setup
  - $FFE1 — scan <STOP>
  - $FE1C — I/O error / reporting routine (called on verify mismatch)
  - $EDEF — send UNTALK
  - $F642 — post-UNTALK handling
  - I/O error/JMP targets: $F704 / $F710 / $F633 etc. (error/finish addresses invoked by branches/JMPs)

## Source Code
```asm
.,F4B6 90 7B    BCC $F533       device < 3, e.g. tape or RS232, illegal device
.,F4B8 A4 B7    LDY $B7         FNLEN, length of filename
.,F4BA D0 03    BNE $F4BF       if length not is zero
.,F4BC 4C 10 F7 JMP $F710       'MISSING FILENAME'
.,F4BF A6 B9    LDX $B9         SA, current secondary address
.,F4C1 20 AF F5 JSR $F5AF       print "SEARCHING"
.,F4C4 A9 60    LDA #$60
.,F4C6 85 B9    STA $B9         set SA to $60
.,F4C8 20 D5 F3 JSR $F3D5       send SA and filename
.,F4CB A5 BA    LDA $BA         FA, current devicenumber
.,F4CD 20 09 ED JSR $ED09       send TALK to serial bus
.,F4D0 A5 B9    LDA $B9         SA
.,F4D2 20 C7 ED JSR $EDC7       send TALK SA
.,F4D5 20 13 EE JSR $EE13       receive from serial bus
.,F4D8 85 AE    STA $AE         load address, <EAL
.,F4DA A5 90    LDA $90         check STATUS
.,F4DC 4A       LSR
.,F4DD 4A       LSR
.,F4DE B0 50    BCS $F530       EOI set, file not found
.,F4E0 20 13 EE JSR $EE13       receive from serial bus
.,F4E3 85 AF    STA $AF         load address, >EAL
.,F4E5 8A       TXA             retrieve SA and test relocated load
.,F4E6 D0 08    BNE $F4F0
.,F4E8 A5 C3    LDA $C3         use MEMUSS as load address
.,F4EA 85 AE    STA $AE         store in <EAL
.,F4EC A5 C4    LDA $C4
.,F4EE 85 AF    STA $AF         store in >EAL
.,F4F0 20 D2 F5 JSR $F5D2
.,F4F3 A9 FD    LDA #$FD        mask %11111101
.,F4F5 25 90    AND $90         read ST.
.,F4F7 85 90    STA $90
.,F4F9 20 E1 FF JSR $FFE1       scan <STOP>
.,F4FC D0 03    BNE $F501       not stopped
.,F4FE 4C 33 F6 JMP $F633
.,F501 20 13 EE JSR $EE13      ACPTR, receive from serial bus
.,F504 AA       TAX
.,F505 A5 90    LDA $90
.,F507 4A       LSR
.,F508 4A       LSR
.,F509 B0 E8    BCS $F4F3
.,F50B 8A       TXA
.,F50C A4 93    LDY $93
.,F50E F0 0C    BEQ $F51C       jump to LOAD
.,F510 A0 00    LDY #$00
.,F512 D1 AE    CMP ($AE),Y     compare with memory
.,F514 F0 08    BEQ $F51E       verified byte OK
.,F516 A9 10    LDA #$10
.,F518 20 1C FE JSR $FE1C
.:F51B 2C       .BYTE $2C       mask next write command
.,F51C 91 AE    STA ($AE),Y     store in memory
.,F51E E6 AE    INC $AE         increment <EAL, next address
.,F520 D0 02    BNE $F524       skip MSB
.,F522 E6 AF    INC $AF         increment >EAL
.,F524 24 90    BIT $90         test STATUS
.,F526 50 CB    BVC $F4F3       get next byte
.,F528 20 EF ED JSR $EDEF       send UNTALK to serial bus
.,F52B 20 42 F6 JSR $F642
.,F52E 90 79    BCC $F5A9       end routine
.,F530 4C 04 F7 JMP $F704       I/O error #4, file not found
```

## Key Registers
- $AE - Zero page - load address low byte (<EAL)
- $AF - Zero page - load address high byte (>EAL)
- $C3-$C4 - Zero page - MEMUSS (alternate/relocated load address source)
- $90 - Zero page - STATUS (tested for EOI / bus status)
- $93 - Zero page - VERCK (verify flag; LDY $93 then BEQ used to select store vs compare)
- $B7 - Zero page - FNLEN (filename length)
- $B9 - Zero page - SA (secondary address, saved/restored)
- $BA - Zero page - FA (device number / file address)

## References
- "disk_and_device_specific_load_address_handling" — expands on alternate device handling and relocated-load address computation (device >= 3)

## Labels
- AE
- AF
- MEMUSS
- STATUS
- VERCK
- FNLEN
- SA
- FA
