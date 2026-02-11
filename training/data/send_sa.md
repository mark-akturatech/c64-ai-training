# SEND SA (KERNAL routine at $F3D5)

**Summary:** KERNAL routine that sends a secondary address ($B9) and filename (pointer at $BB, length $B7) to a serial device (device number in $BA). Uses I/O status word $90 and calls KERNAL CIO routines $ED0C (LISTEN), $EDB9 (send LISTEN SA) and $EDDD (CIOUT). Ends by UNLISTEN via $F654.

## Description
This routine performs the SEND SA step used when opening files on serial devices. Operation sequence:

- Check for a secondary address (SA) and a filename length: LDA $B9; if negative (no SA) branch to exit; LDY $B7; if zero (no filename) branch to exit.
- Clear the I/O status word: STA $90 = 0.
- Send a LISTEN to the serial bus for the selected device: load device number from $BA and JSR $ED0C.
- Compose and send the LISTEN secondary-address byte: load SA ($B9), ORA #$F0, and JSR $EDB9.
- Check STATUS ($90). If STATUS indicates error (negative), recover stack (PLA twice) and JMP to the I/O error handler at $F707 (DEVICE NOT PRESENT, error #5).
- If STATUS is OK, send the filename bytes: if FNLEN ($B7) is zero, skip sending and go to UNLISTEN; otherwise set Y = 0 and loop: LDA ($BB),Y and JSR $EDDD to send each byte, INY and compare with $B7.
- After sending all bytes, JMP $F654 to perform UNLISTEN and exit.

Stack adjustment (PLA; PLA) removes two entries that would otherwise interfere with the RTS-return sequence used by the error handler. The ORA #$F0 operation forms the final secondary-address byte expected by the serial protocol before calling the CIO routine that transmits it.

## Source Code
```asm
.,F3D5 A5 B9    LDA $B9         SA, current secondary address
.,F3D7 30 FA    BMI $F3D3       exit
.,F3D9 A4 B7    LDY $B7         FNLEN, length of filename
.,F3DB F0 F6    BEQ $F3D3       exit
.,F3DD A9 00    LDA #$00
.,F3DF 85 90    STA $90         clear STATUS, I/O status word
.,F3E1 A5 BA    LDA $BA         FA, current device number
.,F3E3 20 0C ED JSR $ED0C       send LISTEN to serial bus
.,F3E6 A5 B9    LDA $B9         SA
.,F3E8 09 F0    ORA #$F0
.,F3EA 20 B9 ED JSR $EDB9       send LISTEN SA
.,F3ED A5 90    LDA $90         STATUS
.,F3EF 10 05    BPL $F3F6       ok
.,F3F1 68       PLA             remove two stack entries for RTS command
.,F3F2 68       PLA
.,F3F3 4C 07 F7 JMP $F707       I/O error #5, device not present
.,F3F6 A5 B7    LDA $B7         FNLEN
.,F3F8 F0 0C    BEQ $F406       unlisten and exit
.,F3FA A0 00    LDY #$00        clear offset
.,F3FC B1 BB    LDA ($BB),Y     FNADR, pointer to filename
.,F3FE 20 DD ED JSR $EDDD       send byte on serial bus
.,F401 C8       INY             next character
.,F402 C4 B7    CPY $B7         until entire filename is sent
.,F404 D0 F6    BNE $F3FC       again
.,F406 4C 54 F6 JMP $F654       unlisten and exit
```

## Key Registers
- $B9 - Zero page - current secondary address (SA)
- $B7 - Zero page - FNLEN, filename length
- $BB - Zero page - FNADR, pointer to filename (indirect Y addressing)
- $90 - Zero page - STATUS / I/O status word (ST)
- $BA - Zero page - FA, current device number
- $ED0C - KERNAL - CIO: send LISTEN to serial bus
- $EDB9 - KERNAL - CIO: send LISTEN secondary address (SA)
- $EDDD - KERNAL - CIO: CIOUT / send byte on serial bus
- $F654 - KERNAL - UNLISTEN / end of serial transaction
- $F707 - KERNAL - I/O error handler (JMP target used for device-not-present)

## References
- "open_file_part1" — expands on called-by OPEN path to send SA & filename for serial devices
- "open_rs232" — covers RS232 open path which differs and uses different initialization

## Labels
- SEND_SA
