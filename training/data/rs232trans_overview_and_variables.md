# KERNAL RS232 Transmitter: RSTRAB Start, Variables and Parity/Stop Handling

**Summary:** Disassembly and annotated description of the KERNAL RS232 transmitter start (RSTRAB), showing variables BITTS, NXTBIT, ROPRTY, RODATA, RODBS, RODBE, ROBUF, RSSTAT and logic for shifting bits, parity calculation and stop/start bit handling; references 6551 ACIA registers $0293/$0294 used to select parity/stop behavior.

## Overview
This chunk documents the start of the RS232 transmitter routines (RSTRAB entry) from the Commodore KERNAL ROM. It lists and explains the key KERNAL variables used by the transmitter, and describes the control flow in RSTRAB:

- BITTS: bit counter for the currently-transmitted byte (nonzero while byte transmission in progress).
- NXTBIT: byte containing the next bit to be sent (0 or $FF used to produce output 0/1).
- ROPRTY: parity accumulator/byte used to calculate parity.
- RODATA: holds the data byte currently being transmitted; shifted right into carry to extract bits.
- RODBS / RODBE: start/end indices for the output buffer (buffer empty when equal).
- ROBUF: indirect pointer to the output buffer.
- RSSTAT: RS-232 status byte (KERNAL status flags).
- BITNUM, BAUDOF: (mentioned in header notes — timing bookkeeping; exact addresses not present in this snippet).
- Timing placeholders in header: "XXX US" lines document expected microsecond timings for normal bit, parity, stop, and start bit execution paths (placeholders in source).

RSTRAB behavior (as reflected by comments and code):
- Entry checks BITTS; if zero, the current byte is done and RSTBGN (start next byte) is taken.
- If BITTS is negative (signed test), the routine is in the stop-bit path and branches to stop-bit handling.
- Otherwise, the routine shifts RODATA (right) into carry; sets NXTBIT to produce a 0 or 1 on output (LDX #0 then BCC/DEX to convert carry into $00/$FF).
- NXTBIT is EORed with ROPRTY to update parity.
- BITTS is decremented; if it reaches zero, parity must be handled (branch to parity routine).
- If more data bits remain, NXTBIT is ANDed with #$04 (mask for VIC/port bit that drives D2PA2 per comment) and stored to $B5 (NXTBIT), then return.
- Parity calculation: fetches BIT #$20 against $0294 (M51CDR) to test 6551 register bits to determine whether parity is enabled, odd/even or "not real" parity; depending on the 6551 status/config bits, parity bit may be synthesized from ROPRTY and BITTS adjusted to account for one or two stop bits based on $0293 (M51CTR) stop-bit control.
- The code enforces that one stop bit is always counted (DEC BITTS), then checks M51CTR to see if two stop bits are required (DEC BITTS again if so), and loops back when necessary.

This chunk contains the commented assembly listing for the section that implements the described flow.

## Source Code
```asm
                                ;
                                ;   RSR - 8/18/80
                                ;
                                ; VARIABLES USED
                                ;   BITTS - # OF BITS TO BE SENT (<>0 NOT DONE)
                                ;   NXTBIT - BYTE CONTAINS NEXT BIT TO BE SENT
                                ;   ROPRTY - BYTE CONTAINS PARITY BIT CALCULATED
                                ;   RODATA - STORES DATA BYTE CURRENTLY BEING TRANSMITTED
                                ;   RODBS - OUTPUT BUFFER INDEX START
                                ;   RODBE - OUTPUT BUFFER INDEX END
                                ;   IF RODBS=RODBE THEN BUFFER EMPTY
                                ;   ROBUF - INDIRECT POINTER TO DATA BUFFER
                                ;   RSSTAT - RS-232 STATUS BYTE
                                ;
                                ;   XXX US - NORMAL BIT PATH
                                ;   XXX US - WORST CASE PARITY BIT PATH
                                ;   XXX US - STOP BIT PATH
                                ;   XXX US - START BIT PATH
                                ;
.,EEBB A5 B4    LDA $B4         RSTRAB LDA BITTS       ;CHECK FOR PLACE IN BYTE...
.,EEBD F0 47    BEQ $EF06              BEQ RSTBGN      ;...DONE, =0 START NEXT
                                ;
.,EEBF 30 3F    BMI $EF00              BMI RST050      ;...DOING STOP BITS
                                ;
.,EEC1 46 B6    LSR $B6                LSR RODATA      ;SHIFT DATA INTO CARRY
.,EEC3 A2 00    LDX #$00               LDX #00         ;PREPARE FOR A ZERO
.,EEC5 90 01    BCC $EEC8              BCC RST005      ;YES...A ZERO
.,EEC7 CA       DEX                    DEX             ;NO...MAKE AN $FF
.,EEC8 8A       TXA             RST005 TXA             ;READY TO SEND
                                ;
.,EEC9 45 BD    EOR $BD                EOR ROPRTY      ;CALC INTO PARITY
.,EECB 85 BD    STA $BD                STA ROPRTY
                                ;
.,EECD C6 B4    DEC $B4                DEC BITTS       ;BIT COUNT DOWN
.,EECF F0 06    BEQ $EED7              BEQ RST010      ;WANT A PARITY INSTEAD
                                ;
.,EED1 8A       TXA             RSTEXT TXA             ;CALC BIT WHOLE TO SEND
.,EED2 29 04    AND #$04               AND #$04        ;GOES OUT D2PA2
.,EED4 85 B5    STA $B5                STA NXTBIT
.,EED6 60       RTS                    RTS
                                ; CALCULATE PARITY
                                ;  NXTBIT =0 UPON ENTRY
                                ;
.,EED7 A9 20    LDA #$20        RST010 LDA #$20        ;CHECK 6551 REG BITS
.,EED9 2C 94 02 BIT $0294              BIT M51CDR
.,EEDC F0 14    BEQ $EEF2              BEQ RSPNO       ;...NO PARITY, SEND A STOP
.,EEDE 30 1C    BMI $EEFC              BMI RST040      ;...NOT REAL PARITY
.,EEE0 70 14    BVS $EEF6              BVS RST030      ;...EVEN PARITY
                                ;
.,EEE2 A5 BD    LDA $BD                LDA ROPRTY      ;CALC ODD PARITY
.,EEE4 D0 01    BNE $EEE7              BNE RSPEXT      ;CORRECT GUESS
                                ;
.,EEE6 CA       DEX             RSWEXT DEX             ;WRONG GUESS...ITS A ONE
                                ;
.,EEE7 C6 B4    DEC $B4         RSPEXT DEC BITTS       ;ONE STOP BIT ALWAYS
.,EEE9 AD 93 02 LDA $0293              LDA M51CTR      ;CHECK # OF STOP BITS
.,EEEC 10 E3    BPL $EED1              BPL RSTEXT      ;...ONE
.,EEEE C6 B4    DEC $B4                DEC BITTS       ;...TWO
.,EEF0 D0 DF    BNE $EED1              BNE RSTEXT      ;JUMP
```

## Key Registers
- $00B4 - KERNAL variable - BITTS (# of bits remaining to be sent)
- $00B5 - KERNAL variable - NXTBIT (next bit output byte; masked to output port)
- $00B6 - KERNAL variable - RODATA (data byte being shifted out)
- $00BD - KERNAL variable - ROPRTY (parity accumulator/flag)
- $0293 - 6551 ACIA - M51CTR (ACIA control register used to determine # stop bits)
- $0294 - 6551 ACIA - M51CDR (ACIA data/control flags used to select parity mode)

## References
- "rs232trans_parity_and_bgn" — expands on parity calculation and start-of-byte setup

## Labels
- RSTRAB
- BITTS
- NXTBIT
- ROPRTY
- RODATA
- M51CTR
- M51CDR
