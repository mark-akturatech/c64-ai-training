# RS-232 Transmitter: RSTRAB / RSTBGN (KERNAL)

**Summary:** Disassembly of the KERNAL RS-232 transmitter routines RSTRAB (bit handling, parity calculation, stop-bit sending) and RSTBGN (start a byte transfer). Matches variables/flags: BITTS, RODATA, ROPRTY, NXTBIT, BITNUM and checks M51CDR and CIA2 ($DD00-$DD0F) DSR/CTS status; sets RSSTAT ($0297) and toggles NMI enable ($02A1 / $DD0D).

**Description**

This chunk contains two closely related transmitter routines from the Commodore 64 KERNAL:

- **RSTRAB (bit handling / parity / stop bits)**
  - Shifts RODATA and updates parity in ROPRTY.
  - Decrements BITTS (bit/timing counter) and counts stop bits by incrementing BITTS.
  - Parity logic: uses M51CDR (loaded and LSR'd) to determine whether parity is enabled and which parity type to apply (no parity vs. odd/even vs. mark/space). Branches flip parity or skip based on ROPRTY and M51CDR flags.
  - When sending stop bits, BITTS is incremented and a stop bit is sent by loading X with #$FF (LDX #$FF) then branching to exit (BNE to exit sequence).

- **RSTBGN (start byte transfer)**
  - Entry routine to begin sending next byte.
  - Checks M51CDR (byte/line configuration) to decide whether to consult hardware handshake lines.
  - If M51CDR indicates 3/X line mode is enabled (LSR A then BCC to skip), the DSR/CTS checks are bypassed.
  - Otherwise, tests CIA2 Port B ($DD01) with BIT to detect DSR errors (BPL -> DSRERR) and CTS errors using V flag (BVC -> CTSERR).
  - On no error:
    - Clears parity (ROPRTY = 0).
    - Loads NXTBIT with start bit indicator (STA $B5).
    - Loads BITNUM ($0298) into BITTS ($B4) to set the number of bits (BITTS = #bits + 1).
    - Compares RODBS ($029D) to RODBE ($029E). If equal, the transmit buffer is empty and routine exits (RSODNE); otherwise reads a byte from (ROBUF), Y and stores it to RODATA ($B6), and increments RODBS ($029D).
  - On error (DSR/CTS), sets RSSTAT ($0297) with $40 or $10 respectively, then proceeds to RSODNE.

- **RSODNE (done/cleanup)**
  - Clears/turns off T1 NMI: writes $01 to $DD0D (CIA2 ICR) to drop a pending/old NMI, toggles the ENABL byte ($02A1) via EOR, ORA #$80 to set proper NMI-enable bits, stores back to ENABL ($02A1) and again to $DD0D to finalize.
  - Returns to caller.

Behavioral details preserved from the disassembly:

- Error codes placed into RSSTAT: $40 = DSR gone, $10 = CTS gone (ORA/STA $0297).
- The check of M51CDR uses a logical shift (LSR A) then BCC to treat the shifted bit as a mode selector (3-line vs. 2-line/handshake).
- The code uses indirect indexed addressing LDA (ROBUF),Y to fetch the next byte and increments the buffer pointer RODBS.
- Stop bits are implemented by INC BITTS and loading X with #$FF as the stop-bit value; routine branches to the exit path once stop-bit sending is arranged.

Note: variable names shown in comments are KERNAL labels (ROPRTY, BITTS, NXTBIT, RODATA, BITNUM, RODBS, RODBE, RSSTAT, ENABL, D2ICR). The CIA2 registers ($DD00-$DD0F) are used for DSR/CTS checks and NMI handling.

## Source Code

```asm
                                RSPNO                  ;LINE TO SEND CANNOT BE PB0
.,EEF2 E6 B4    INC $B4                INC BITTS       ;COUNTS AS ONE STOP BIT
.,EEF4 D0 F0    BNE $EEE6              BNE RSWEXT      ;JUMP TO FLIP TO ONE
                                ;
.,EEF6 A5 BD    LDA $BD         RST030 LDA ROPRTY      ;EVEN PARITY
.,EEF8 F0 ED    BEQ $EEE7              BEQ RSPEXT      ;CORRECT GUESS...EXIT
.,EEFA D0 EA    BNE $EEE6              BNE RSWEXT      ;WRONG...FLIP AND EXIT
                                ;
.,EEFC 70 E9    BVS $EEE7       RST040 BVS RSPEXT      ;WANTED SPACE
.,EEFE 50 E6    BVC $EEE6              BVC RSWEXT      ; WANTED MARK
                                ; STOP BITS
                                ;
.,EF00 E6 B4    INC $B4         RST050 INC BITTS       ;STOP BIT COUNT TOWARDS ZERO
.,EF02 A2 FF    LDX #$FF               LDX #$FF        ;SEND STOP BIT
.,EF04 D0 CB    BNE $EED1              BNE RSTEXT      ;JUMP TO EXIT
                                ;
                                ; RSTBGN - ENTRY TO START BYTE TRANS
                                ;
.,EF06 AD 94 02 LDA $0294       RSTBGN LDA M51CDR      ;CHECK FOR 3/X LINE
.,EF09 4A       LSR                    LSR A
.,EF0A 90 07    BCC $EF13              BCC RST060      ;3 LINE...NO CHECK
.,EF0C 2C 01 DD BIT $DD01              BIT D2PRB       ;CHECK FOR...
.,EF0F 10 1D    BPL $EF2E              BPL DSRERR      ;...DSR ERROR
.,EF11 50 1E    BVC $EF31              BVC CTSERR      ;...CTS ERROR
                                ;
                                ; SET UP TO SEND NEXT BYTE
                                ;
.,EF13 A9 00    LDA #$00        RST060 LDA #0
.,EF15 85 BD    STA $BD                STA ROPRTY      ;ZERO PARITY
.,EF17 85 B5    STA $B5                STA NXTBIT      ;SEND START BIT
.,EF19 AE 98 02 LDX $0298              LDX BITNUM      ;GET # OF BITS
.,EF1C 86 B4    STX $B4         RST070 STX BITTS       ;BITTS=#OF BITTS+1
                                ;
.,EF1E AC 9D 02 LDY $029D       RST080 LDY RODBS       ;CHECK BUFFER POINTERS
.,EF21 CC 9E 02 CPY $029E              CPY RODBE
.,EF24 F0 13    BEQ $EF39              BEQ RSODNE      ;ALL DONE...
                                ;
.,EF26 B1 F9    LDA ($F9),Y            LDA (ROBUF),Y   ;GET DATA...
.,EF28 85 B6    STA $B6                STA RODATA      ;...INTO BYTE BUFFER
.,EF2A EE 9D 02 INC $029D              INC RODBS       ;MOVE POINTER TO NEXT
.,EF2D 60       RTS                    RTS
                                ; SET ERRORS
                                ;
.,EF2E A9 40    LDA #$40        DSRERR LDA #$40        ;DSR GONE ERROR
.,EF30 0D 97 02 ORA $0297              ORA RSSTAT
.,EF33 8D 97 02 STA $0297              STA RSSTAT
                                ;
.,EF36 4C 39 EF JMP $EF39              JMP RSODNE      ;TURN OFF T1
                                ;
.,EF39 A9 01    LDA #$01        RSODNE LDA #$01        ;KILL T1 NMI
                                ;ENTRY TO TURN OFF AN ENABLED NMI...
.,EF3B 8D 0D DD STA $DD0D       OENABL STA D2ICR       ;TOSS BAD/OLD NMI
.,EF3E 4D A1 02 EOR $02A1              EOR ENABL       ;FLIP ENABLE
.,EF41 09 80    ORA #$80               ORA #$80        ;ENABLE GOOD NMI'S
.,EF43 8D A1 02 STA $02A1              STA ENABL
.,EF46 8D 0D DD STA $DD0D              STA D2ICR
.,EF49 60       RTS                    RTS
                                ; BITCNT - CAL # OF BITS TO BE SENT
```

## Key Registers

- **$DD00-$DD0F**: CIA 2 - Port B (PRB at $DD01 used for DSR check), ICR ($DD0D used to clear/toss NMI)
- **$0294**: KERNAL variable M51CDR (mode/line configuration)
- **$0297**: KERNAL variable RSSTAT (RS-232 status / error flags)
- **$0298**: KERNAL variable BITNUM (# of data bits)
- **$029D**: KERNAL variable RODBS (read buffer start/index pointer)
- **$029E**: KERNAL variable RODBE (read buffer end pointer)
- **$02A1**: KERNAL variable ENABL (NMI enable/flags)
- **$00B4**: Zero page BITTS (bit/timing counter)
- **$00BD**: Zero page ROPRTY (running parity)
- **$00B5**: Zero page NXTBIT (next bit / start bit)
- **$00B6**: Zero page RODATA (byte buffer for transmit)
- **(ROBUF)**: Pointer stored at $F9 (indirect page) used as transmit buffer base

## References

- "rs232trans_overview_and_variables" — expands on uses and layouts of BITTS, RODATA, NXTBIT and related KERNAL RS

## Labels
- RSTRAB
- RSTBGN
- RSODNE
- ROPRTY
- BITTS
- NXTBIT
- RODATA
- RSSTAT
