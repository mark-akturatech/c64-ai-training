# KERNAL: BSOUT / CASOUT (channel output entry, cassette & RS232 handling)

**Summary:** KERNAL ROM output path for BSOUT (channel output): routes to CIOUT for serial, to printer for PRT, and to CASOUT for cassette devices; CASOUT buffers cassette bytes into TAPE1/T1, checks buffer pointers via JTP20/JTP10 ($F80D/$F864), calls WBLK to write full blocks, and BSO232 enqueues RS232 bytes into ROBUF and starts the transmitter (BSO100/BSPIN).

## BSOUT / CASOUT behavior (flow and side effects)
- Entry point handles channel output. Device selection is decided by a branch: for printer devices it jumps to the printer handler (PRT), for serial it jumps to CIOUT, otherwise it proceeds to cassette handling (CASOUT).
- For serial output (CIOUT) the code pulls return data from the stack and jumps to CIOUT.
- For cassette devices (CASOUT):
  - CASOUT expects to be entered with the carry flag set (source comment: "CASOUT MUST BE ENTERED WITH CARRY SET!!!").
  - The routine preserves registers by pushing TXA, TYA and additional stack activity (PLA/PLA seen around serial branch).
  - It stores the byte to output into zero-page T1 (STA $9E).
  - It tests the carry flag: if clear (carry clear means default device = RS232), it branches to the RS232 output path (BSO232).
  - CASOUT calls JTP20 ($F80D) to check the cassette buffer pointer; if buffer pointer has not reached the end it continues to JTP10 (BNE to $F1F8).
  - If the buffer pointer has reached the end (buffer full), CASOUT calls WBLK ($F864) to write out the full buffer to tape; if WBLK sets the stop key error (BCS), CASOUT aborts and restores registers.
  - When starting a new buffer, CASOUT writes a buffer type byte (LDA #$02; stored as the first byte of the buffer via STA (TAPE1),Y).
  - It sets the buffer pointer (BUFPT) to 1 (STY $A6 after INY).
  - It then writes the data byte into the buffer (STA (TAPE1),Y) at the current Y index.
  - After buffering the byte it restores registers (including clearing carry for good return) and returns; if the carry was set on entry to indicate an error, CASOUT clears A before returning (LDA #$00 if carry set).
- RS232 output path (BSO232):
  - If device selection indicates RS232 (carry clear), CASOUT branches to BSO232 which passes data through variable T1.
  - BSO232 enqueues the byte into ROBUF and starts the RS232 transmitter via the BSO100/BSPIN sequences (described in related cross-reference).
  - After calling BSO232 the code always restores registers and returns normally.

Important behavior notes preserved from the code:
- CASOUT uses (TAPE1),Y addressing to place both the buffer type byte and the data byte into the cassette buffer.
- BUFPT ($A6) is used to track buffer position and is initialized to 1 when starting a new buffer (since buffer type occupies index 0).
- WBLK ($F864) is the routine called to flush a full cassette buffer; CASOUT checks WBLK's carry to detect abort (stop key) and restore state.
- The routine restores .X and .Y and returns the original A value (unless an error/stop occurred).

## Source Code
```asm
.,F1D5 90 04    BCC $F1DB       BCC    BO20            ;DEVICE 1 OR 2
                                ;
                                ;PRINT TO SERIAL BUS
                                ;
.,F1D7 68       PLA             PLA
.,F1D8 4C DD ED JMP $EDDD       JMP    CIOUT
                                ;
                                ;PRINT TO CASSETTE DEVICES
                                ;
.,F1DB 4A       LSR             BO20   LSR A           ;RS232?
.,F1DC 68       PLA             PLA                    ;GET DATA OFF STACK...
                                ;
.,F1DD 85 9E    STA $9E         CASOUT STA T1          ;PASS DATA IN T1
                                ; CASOUT MUST BE ENTERED WITH CARRY SET!!!
                                ;PRESERVE REGISTERS
                                ;
.,F1DF 8A       TXA             TXA
.,F1E0 48       PHA             PHA
.,F1E1 98       TYA             TYA
.,F1E2 48       PHA             PHA
.,F1E3 90 23    BCC $F208       BCC    BO50            ;C-CLR MEANS DFLTO=2 (RS232)
                                ;
.,F1E5 20 0D F8 JSR $F80D       JSR    JTP20           ;CHECK BUFFER POINTER
.,F1E8 D0 0E    BNE $F1F8       BNE    JTP10           ;HAS NOT REACHED END
.,F1EA 20 64 F8 JSR $F864       JSR    WBLK            ;WRITE FULL BUFFER
.,F1ED B0 0E    BCS $F1FD       BCS    RSTOR           ;ABORT ON STOP KEY
                                ;
                                ;PUT BUFFER TYPE BYTE
                                ;
.,F1EF A9 02    LDA #$02        LDA    #BDF
.,F1F1 A0 00    LDY #$00        LDY    #0
.,F1F3 91 B2    STA ($B2),Y     STA    (TAPE1)Y
                                ;
                                ;RESET BUFFER POINTER
                                ;
.,F1F5 C8       INY             INY                    ;MAKE .Y=1
.,F1F6 84 A6    STY $A6         STY    BUFPT           ;BUFPT=1
                                ;
.,F1F8 A5 9E    LDA $9E         JTP10  LDA T1
.,F1FA 91 B2    STA ($B2),Y     STA    (TAPE1)Y        ;DATA TO BUFFER
                                ;
                                ;RESTORE .X AND .Y
                                ;
.,F1FC 18       CLC             RSTOA  CLC             ;GOOD RETURN
.,F1FD 68       PLA             RSTOR  PLA
.,F1FE A8       TAY             TAY
.,F1FF 68       PLA             PLA
.,F200 AA       TAX             TAX
.,F201 A5 9E    LDA $9E         LDA    T1              ;GET .A FOR RETURN
.,F203 90 02    BCC $F207       BCC    RSTOR1          ;NO ERROR
.,F205 A9 00    LDA #$00        LDA    #00             ;STOP ERROR IF C-SET
.,F207 60       RTS             RSTOR1 RTS
                                ;
                                ;OUTPUT TO RS232
                                ;
.,F208 20 17 F0 JSR $F017       BO50   JSR BSO232      ;PASS DATA THROUGH VARIABLE T1
.,F20B 4C FC F1 JMP $F1FC       JMP    RSTOA           ;GO RESTORE ALL..ALWAYS GOOD
                                .END
                                .LIB   OPENCHANNEL
                                ;***************************************
```

## References
- "rs232inout_buffer_and_protection" — expands on BSO232; shows how ROBUF and T1 are used to queue RS232 bytes and how the transmitter is started (BSO100/BSPIN)

## Labels
- BSOUT
- CASOUT
- T1
- TAPE1
- BUFPT
