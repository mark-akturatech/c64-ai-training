# SAVE TO SERIAL BUS (KERNAL)

**Summary:** KERNAL routine (entry $F5FA) to save a memory block to a serial device using the serial bus CIO routines (LISTEN $ED0C, send byte $EDDD, UNLISTEN $EDFE). Requires filename length at $B7 (FNLEN); uses secondary address in $B9 and start address in $AC/$AD; monitors STOP via $FFE1 and advances the read/write pointer via $FCDB.

## Description
This routine implements the Commodore 64 KERNAL "save to serial device" operation. Key steps and behaviors:

- Sets the secondary address (SA) to #$61 in $B9 and checks for a valid filename length in $B7 (FNLEN). If FNLEN is zero it jumps to the I/O error handler (missing filename).
- Sends the SA and filename using send_sa (JSR $F3D5) and prints the "SAVING" message (JSR $F68F).
- Sends LISTEN to the current device number stored in $BA (FA) via the CIO LISTEN entry ($ED0C), then sends the LISTEN secondary address via $EDB9.
- Resets the internal pointer (JSR $FB8E) and sends the two-byte start address (low in $AC, high in $AD) to the device using CIOUT ($EDDD).
- Enters a loop:
  - Calls $FCD1 to check the read/write pointer; if carry set the block is complete.
  - Loads the next byte from memory via indirect indexed LDA ($AC),Y and transmits it with CIOUT ($EDDD).
  - Calls $FFE1 to test the <STOP> key; if pressed, branches to the unlisten/exit sequence which sets a break flag and returns.
  - If not stopped, bumps the read/write pointer (JSR $FCDB) and repeats.
- After completion, calls CIO UNLISTEN ($EDFE). If a condition on $B9 requires, performs an alternate UNLISTEN path: re-LISTEN the device in $BA, modify SA (AND/ORA) and send the UNLISTEN SA via $EDB9, then call UNLISTEN again.
- Returns with carry/flags preserved appropriately; on manual break the routine sets a break flag and returns.

Referenced KERNAL/CIO entry points used:
- $ED0C — CIO LISTEN (send LISTEN to device number in A)
- $EDB9 — CIO send LISTEN/UNLISTEN secondary address
- $EDDD — CIOOUT (send data byte to serial bus)
- $EDFE — CIO UNLISTEN
- $FFE1 — Test <STOP> key
- $FCDB — Increment read/write pointer
- $FCD1 — Check read/write pointer and set carry if block complete

## Source Code
```asm
.,F5FA A9 61    LDA #$61
.,F5FC 85 B9    STA $B9         set SA, secondary address, to #1
.,F5FE A4 B7    LDY $B7         FNLEN, length of current filename
.,F600 D0 03    BNE $F605       ok
.,F602 4C 10 F7 JMP $F710       I/O error #8, missing filename
.,F605 20 D5 F3 JSR $F3D5       send SA & filename
.,F608 20 8F F6 JSR $F68F       print 'SAVING' and filename
.,F60B A5 BA    LDA $BA         FA, current device number
.,F60D 20 0C ED JSR $ED0C       send LISTEN
.,F610 A5 B9    LDA $B9         SA
.,F612 20 B9 ED JSR $EDB9       send LISTEN SA
.,F615 A0 00    LDY #$00
.,F617 20 8E FB JSR $FB8E       reset pointer
.,F61A A5 AC    LDA $AC         SAL, holds start address
.,F61C 20 DD ED JSR $EDDD       send low byte of start address
.,F61F A5 AD    LDA $AD
.,F621 20 DD ED JSR $EDDD       send high byte of start address
.,F624 20 D1 FC JSR $FCD1       check read/write pointer
.,F627 B0 16    BCS $F63F
.,F629 B1 AC    LDA ($AC),Y     get character from memory
.,F62B 20 DD ED JSR $EDDD       send byte to serial device
.,F62E 20 E1 FF JSR $FFE1       test <STOP> key
.,F631 D0 07    BNE $F63A       not pressed
.,F633 20 42 F6 JSR $F642       exit and unlisten
.,F636 A9 00    LDA #$00        flag break
.,F638 38       SEC
.,F639 60       RTS
.,F63A 20 DB FC JSR $FCDB       bump r/w pointer
.,F63D D0 E5    BNE $F624       save next byte
.,F63F 20 FE ED JSR $EDFE       send UNLISTEN
.,F642 24 B9    BIT $B9         SA
.,F644 30 11    BMI $F657
.,F646 A5 BA    LDA $BA         FA
.,F648 20 0C ED JSR $ED0C       send LISTEN
.,F64B A5 B9    LDA $B9
.,F64D 29 EF    AND #$EF
.,F64F 09 E0    ORA #$E0
.,F651 20 B9 ED JSR $EDB9       send UNLISTEN SA
.,F654 20 FE ED JSR $EDFE       send UNLISTEN
.,F657 18       CLC
.,F658 60       RTS

.,F659 4A       LSR
.,F65A B0 03    BCS $F65F
.,F65C 4C 13 F7 JMP $F713
.,F65F 20 D0 F7 JSR $F7D0
.,F662 90 8D    BCC $F5F1
.,F664 20 38 F8 JSR $F838
.,F667 B0 25    BCS $F68E
.,F669 20 8F F6 JSR $F68F
.,F66C A2 03    LDX #$03
.,F66E A5 B9    LDA $B9
.,F670 29 01    AND #$01
.,F672 D0 02    BNE $F676
.,F674 A2 01    LDX #$01
.,F676 8A       TXA
.,F677 20 6A F7 JSR $F76A
.,F67A B0 12    BCS $F68E
.,F67C 20 67 F8 JSR $F867
.,F67F B0 0D    BCS $F68E
.,F681 A5 B9    LDA $B9
.,F683 29 02    AND #$02
.,F685 F0 06    BEQ $F68D
.,F687 A9 05    LDA #$05
.,F689 20 6A F7 JSR $F76A
.:F68C 24       .BYTE $24
.,F68D 18       CLC
.,F68E 60       RTS
```

## Key Registers
- $B7 - KERNAL/Zero Page - FNLEN: length of current filename (must be non-zero)
- $B9 - KERNAL/Zero Page - Secondary address (SA) used for LISTEN/UNLISTEN
- $BA - KERNAL/Zero Page - FA: current device number (device address)
- $AC - KERNAL/Zero Page - SAL low: pointer (start address low) used for indirect reads
- $AD - KERNAL/Zero Page - SAL high: pointer (start address high) used for indirect reads

## References
- "send_sa" — send SA & filename (used at $F605 / JSR $F3D5)
- "print_saving" — prints 'SAVING' message, then filename (JSR $F68F)