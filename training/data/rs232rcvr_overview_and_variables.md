# KERNAL RS232RCVR NMI Receiver: overview and variables (INBIT, BITCI, RINONE, RIDATA, RIPRTY, RIBUF, RIDBE, RIDBS)

**Summary:** KERNAL RS232 receiver NMI code: checks start bit (INBIT), shifts serial bits into RIDATA, accumulates parity in RIPRTY, manages BITNUM/INBIT and RINONE flags, and stores completed bytes into the page-buffered RIBUF; detects receiver overrun and parity/framing errors. Searchable terms: $A7, $A9, $AA, $0298, $029B, $029C, $02A1, $0294, $DD0D, RIBUF.

**Overview**
This code fragment is the RS232 receive-path entry in the KERNAL ROM: it contains the NMI-driven receiver enable/check and the routine that completes a received byte at the parity time.

Behavior summary:
- RSRABL (enable receiver for next byte): sets a software enable flag (ENABL at $02A1), writes $90 to $DD0D to clear old NMI, and sets RINONE ($A9) to indicate waiting for a start bit.
- RSRSXT / RSRTRT: checks INBIT ($A7) to detect a low start bit; if start bit is seen, clears RINONE and returns to let the NMI-driven bit sampler proceed.
- At parity time (RSR030..RSR032): LDY from RIDBE ($029B), INY and compare to RIDBS ($029C) to detect a framing-overrun condition (have we passed the buffer end?). If passed, branch to RECERR (set overrun).
- If OK, advance RIDBE, fetch RIDATA ($AA) and BITNUM ($0298), shift RIDATA right (LSR) until 8 bits assembled (loop until BITNUM == 9), then store completed byte into the page-buffered input ring using STA (RIBUF),Y where RIBUF pointer is at $F7.
- Parity handling: check 6551 command register (M51CDR at $0294) to see if parity bit is present; if parity is enabled, combine the sampled INBIT ($A7) with the running parity accumulator RIPRTY ($AB) via EOR, then test result for parity errors. On parity or framing/overrun errors the routine sets error flags (values loaded into the accumulator later stored by caller).

This fragment references several KERNAL variables and hardware registers used by the RS232 receiver logic and uses indirect page-buffering ([($F7),Y]) to place received bytes.

## Source Code
```asm
.,EF7C D0 EF    BNE $EF6D              BNE RSREXT      ;NO..EXIT
                                ;
                                ; RSRABL - ENABLE TO RECEIVE A BYTE
                                ;
.,EF7E A9 90    LDA #$90        RSRABL LDA #$90        ;ENABLE FLAG FOR NEXT BYTE
.,EF80 8D 0D DD STA $DD0D              STA D2ICR       ;TOSS BAD/OLD NMI
.,EF83  0D A1 02 ORA $02A1              ORA ENABL       ;MARK IN ENABLE REGISTER
.,EF86 8D A1 02 STA $02A1              STA ENABL       ;RE-ENABLED BY JMP OENABL
.,EF89 85 A9    STA $A9                STA RINONE      ;FLAG FOR START BIT
                                ;
.,EF8B A9 02    LDA #$02        RSRSXT LDA #$02        ;DISABLE T2
.,EF8D 4C 3B EF JMP $EF3B              JMP OENABL      ;FLIP-OFF ENABL
                                ; RECEIVER START BIT CHECK
                                ;
.,EF90 A5 A7    LDA $A7         RSRTRT LDA INBIT       ;CHECK IF SPACE
.,EF92 D0 EA    BNE $EF7E              BNE RSRABL      ;BAD...TRY AGAIN
.,EF94 85 A9    STA $A9                STA RINONE      ;GOOD...DISABLE FLAG
.,EF96 60       RTS                    RTS             ;AND EXIT
                                ;
                                ; PUT DATA IN BUFFER (AT PARITY TIME)
                                ;
.,EF97 AC 9B 02 LDY $029B       RSR030 LDY RIDBE       ;GET END
.,EF9A C8       INY                    INY
.,EF9B CC 9C 02 CPY $029C              CPY RIDBS       ;HAVE WE PASSED START?
.,EF9E F0 2A    BEQ $EFCA              BEQ RECERR      ;YES...ERROR
                                ;
.,EFA0 8C 9B 02 STY $029B              STY RIDBE       ;MOVE RIDBE FORWARD
.,EFA3 88       DEY                    DEY
                                ;
.,EFA4 A5 AA    LDA $AA                LDA RIDATA      ;GET BYTE BUFFER UP
.,EFA6 AE 98 02 LDX $0298              LDX BITNUM      ;SHIFT UNTIL FULL BYTE
.,EFA9 E0 09    CPX #$09        RSR031 CPX #9          ;ALWAYS 8 BITS
.,EFAB F0 04    BEQ $EFB1              BEQ RSR032
.,EFAD 4A       LSR                    LSR A           ;FILL WITH ZEROS
.,EFAE E8       INX                    INX
.,EFAF D0 F8    BNE $EFA9              BNE RSR031
                                ;
.,EFB1 91 F7    STA ($F7),Y     RSR032 STA (RIBUF),Y   ;DATA TO PAGE BUFFER
                                ;
                                ; PARITY CHECKING
                                ;
.,EFB3 A9 20    LDA #$20               LDA #$20        ;CHECK 6551 COMMAND REGISTER
.,EFB5 2C 94 02 BIT $0294              BIT M51CDR
.,EFB8 F0 B4    BEQ $EF6E              BEQ RSR018      ;NO PARITY BIT SO STOP BIT
.,EFBA 30 B1    BMI $EF6D              BMI RSREXT      ;NO PARITY CHECK
                                ;
                                ; CHECK CALCULATED PARITY
                                ;
.,EFBC A5 A7    LDA $A7                LDA INBIT
.,EFBE 45 AB    EOR $AB                EOR RIPRTY      ;PUT IN WITH PARITY
.,EFC0 F0 03    BEQ $EFC5              BEQ RSR050      ;EVEN PARITY
.,EFC2 70 A9    BVS $EF6D              BVS RSREXT      ;ODD...OKAY SO EXIT
.,EFC4 2C       .BYTE $2C              .BYT $2C        ;SKIP TWO
.,EFC5 50 A6    BVC $EF6D       RSR050 BVC RSREXT      ;EVEN...OKAY SO EXIT
                                ;
                                ; ERRORS REPORTED
.,EFC7 A9 01    LDA #$01               LDA #1          ;PARITY ERROR
.,EFC9 2C       .BYTE $2C              .BYT $2C
.,EFCA A9 04    LDA #$04        RECERR LDA #$4         ;RECEIVER OVERRUN
.,EFCC 2C       .BYTE $2C              .BYT $2C
```

## Key Registers
- $A7 - KERNAL RAM - INBIT (sampled serial input bit)
- $A9 - KERNAL RAM - RINONE (start-bit waiting flag)
- $AA - KERNAL RAM - RIDATA (shift register / assembled byte)
- $AB - KERNAL RAM - RIPRTY (running parity accumulator)
- $F7 - KERNAL RAM - pointer to input buffer page used by STA ($F7),Y (RIBUF page pointer)
- $0298 - KERNAL RAM - BITNUM (bit counter used while shifting)
- $0294 - I/O/Device - M51CDR (6551 command register / parity configuration)
- $029B - KERNAL RAM - RIDBE (input buffer end pointer index)
- $029C - KERNAL RAM - RIDBS (input buffer start pointer index)
- $02A1 - KERNAL RAM - ENABL (software enable flag used to permit next byte)
- $DD0D - CIA 2 - ICR (write here clears/tosses NMI; code writes $90)

## References
- "rs232rcvr_parity_errors" — expands on parity checking and error reporting routines invoked after receiving a byte

## Labels
- INBIT
- BITNUM
- RINONE
- RIDATA
- RIPRTY
- RIBUF
- RIDBE
- RIDBS
