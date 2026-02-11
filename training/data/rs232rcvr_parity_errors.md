# KERNAL RS232 Receiver: Buffer Storage, Parity Check, and Turnaround (disassembly excerpt)

**Summary:** KERNAL RS232 receiver logic: stores received bytes into RIBUF with RIDBE/RIDBS wrap, checks 6551 command (M51CDR at $0294) to determine parity handling and compares computed parity against RIPRTY; sets RSSTAT ($0297) on parity/frame/break/overrun errors. Contains turn‑around logic for sending over the USER port (checks DSR/RTS/CTS via CIA2 $DD01) and enables RTS/CTS sequencing before output. JMP to RSRABL used to re‑enable receiver after error handling.

**Overview**
This disassembly excerpt shows two related routines:

- **Receiver error handling / exit** (labels: BREAKE, FRAMEE, ERR232, RSRABL referenced). After a byte is collected by RSRCVR, the code checks for stop bit (RIDATA/$AA), sets appropriate error flags in RSSTAT ($0297) for BREAK, FRAME, overrun, parity, etc., and then jumps to RSRABL to re‑enable receiving.
- **Output turn‑around logic** to send a file over the USER (RS232) port. It inspects the 6551 command register (M51CDR at $0294) to decide whether to perform 3‑line turnaround; checks DSR/RTS via CIA2 port B ($DD01), waits for input to finish (ENABL/$02A1 and IER bits), toggles RTS, and waits for CTS before allowing output.

Key behaviors preserved in the code:
- **Parity check:** M51CDR ($0294) is read and shifted to determine whether parity is expected; the computed parity is compared to RIPRTY (KERNAL parity variable). On mismatch, RSSTAT ($0297) parity bit is set.
- **Break/frame detection:** RIDATA (zero page $AA) is inspected for stop bit; BNE/BEQ branches classify frame vs. break.
- **Receiver re‑enable:** routine uses RSRABL to re‑arm receiving after handling an error or condition.
- **Turnaround handshake:** checks DSR and RTS, enforces CTS polarity sequencing per spec, sets RTS (bit in CIA2 $DD01), and waits for CTS to permit transmission.

**[Note: Source may contain an error — inline comment "BAD EXIT SO HANG ##????????##" next to JMP RSRABL suggests a questionable comment or behavior on that jump; verify expected fall‑through vs. jump in full listing.]**

## Source Code
```asm
.,EFCD A9 80    LDA #$80        BREAKE LDA #$80        ;BREAK DETECTED
.:EFCF 2C       .BYTE $2C              .BYT $2C
.,EFD0 A9 02    LDA #$02        FRAMEE LDA #$02        ;FRAME ERROR
.,EFD2 0D 97 02 ORA $0297       ERR232 ORA RSSTAT
.,EFD5 8D 97 02 STA $0297              STA RSSTAT
.,EFD8 4C 7E EF JMP $EF7E              JMP RSRABL      ;BAD EXIT SO HANG ##????????##
                                ;
                                ; CHECK FOR ERRORS
                                ;
.,EFDB A5 AA    LDA $AA         RSR060 LDA RIDATA      ;EXPECTING STOP...
.,EFDD D0 F1    BNE $EFD0              BNE FRAMEE      ;FRAME ERROR
.,EFDF F0 EC    BEQ $EFCD              BEQ BREAKE      ;COULD BE A BREAK
                                .END
                                .LIB   RS232INOUT
                                ; OUTPUT A FILE OVER USR PORT
                                ;  USING RS232
                                ;
.,EFE1 85 9A    STA $9A         CKO232 STA DFLTO       ;SET DEFAULT OUT
.,EFE3 AD 94 02 LDA $0294              LDA M51CDR      ;CHECK FOR 3/X LINE
.,EFE6 4A       LSR                    LSR A
.,EFE7 90 29    BCC $F012              BCC CKO100      ;3LINE...NO TURN AROUND
                                ;
                                ;*TURN AROUND LOGIC
                                ;
                                ; CHECK FOR DSR AND RTS
                                ;
.,EFE9 A9 02    LDA #$02               LDA #$02        ;BIT RTS IS ON
.,EFEB 2C 01 DD BIT $DD01              BIT D2PRB
.,EFEE 10 1D    BPL $F00D              BPL CKDSRX      ;NO DSR...ERROR
.,EFF0 D0 20    BNE $F012              BNE CKO100      ;RTS...OUTPUTING OR FULL DUPLEX
                                ;
                                ; CHECK FOR ACTIVE INPUT
                                ;  RTS WILL BE LOW IF CURRENTLY INPUTING
                                ;
.,EFF2 AD A1 02 LDA $02A1       CKO020 LDA ENABL
.,EFF5 29 02    AND #$02               AND #$02        ;LOOK AT IER FOR T2
.,EFF7 D0 F9    BNE $EFF2              BNE CKO020      ;HANG UNTILL INPUT DONE
                                ;
                                ; WAIT FOR CTS TO BE OFF AS SPEC REQS
                                ;
.,EFF9 2C 01 DD BIT $DD01       CKO030 BIT D2PRB
.,EFFC 70 FB    BVS $EFF9              BVS CKO030
                                ;
                                ; TURN ON RTS
                                ;
.,EFFE AD 01 DD LDA $DD01              LDA D2PRB
.,F001 09 02    ORA #$02               ORA #$02
.,F003 8D 01 DD STA $DD01              STA D2PRB
                                ;
                                ; WAIT FOR CTS TO GO ON
                                ;
.,F006 2C 01 DD BIT $DD01       CKO040 BIT D2PRB
.,F009 70 07    BVS $F012              BVS CKO100      ;DONE...
.,F00B 30 F9    BMI $F006              BMI CKO040      ;WE STILL HAVE DSR
                                ;
.,F00D A9 40    LDA #$40        CKDSRX LDA #$40        ;A DATA SET READY ERROR
.,F00F 8D 97 02 STA $0297              STA RSSTAT      ;MAJOR ERROR....WILL REQUIRE REOPEN
                                ;
.,F012 18       CLC             CKO100 CLC             ;NO ERROR
.,F013 60       RTS                    RTS
```

## Key Registers
- **$0294** - KERNAL / 6551 command (M51CDR) - used to determine parity/3‑line mode
- **$0297** - KERNAL status (RSSTAT) - receiver status bits (parity/frame/break/overrun flags)
- **$02A1** - KERNAL control (ENABL) - used here to check IER bit for timer/interrupt (AND #$02)
- **$00AA** - Zero page - RIDATA (receiver data/stop-bit check)
- **$009A** - Zero page - DFLTO (default output pointer/flag stored to $9A)
- **$DD01** - CIA 2 - port B (D2PRB) used for DSR/RTS/CTS handshake
- **$029B** - RIDBE - Byte index to the end of the receiver FIFO buffer
- **$029C** - RIDBS - Byte index to the start of the receiver FIFO buffer
- **$00AB** - RIPRTY - RS232 receiver parity storage

## References
- "rs232rcvr_overview_and_variables" — expands on INBIT/BITCI/RIDATA/RIPRTY variables and buffer wrap logic
- Commodore 64 Programmer's Reference Guide: Input/Output Guide - User Port
- Commodore 64 Programmer's Reference Guide: BASIC to Machine Language - Commodore 64 Memory Map

## Labels
- M51CDR
- RSSTAT
- RIDATA
- RIPRTY
- D2PRB
