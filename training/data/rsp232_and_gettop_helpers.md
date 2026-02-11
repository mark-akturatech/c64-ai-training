# RSP232 / BSI232 / RS232 Buffer & ENABL Handling (KERNAL ROM, CBM English)

**Summary:** Disassembly of KERNAL RS-232 helper routines: RSP232 (protect serial/cassette from RS-232 NMIs), BSI232 (get RS-232 input character), buffer allocation helpers, and ENABL/RSSTAT/RIDBS handling. References include KERNAL workspace addresses $02A1 (ENABL), $0297 (RSSTAT), $029C/$029B (RIDBS/RIDBE), and CIA2 port register $DD01.

**Overview**

This chunk documents KERNAL routines that manage RS-232 input and the ENABL flag used to gate serial/cassette operations. Key routines:

- A wait loop that stalls until active RS-232 output lines are idle.
- Clearing RTS via CIA2 port B ($DD01) and waiting for DCD to assert.
- Setting an enable flag (via a jump to OENABL) to allow RS-232 input.
- BSI232: Reads a character from the RS-232 receive buffer if available; otherwise, returns zero and sets the buffer-empty status in RSSTAT.
- RSP232: Preserves the accumulator (PHA) and checks ENABL; the routine is truncated in the source.

Behavioral notes (from code):

- ENABL at $02A1 is tested for active bits; one test uses LSR to inspect bit 0 (comment: T1).
- Another test masks with #$12 to check two bits (comment: "FLAG OR T2 ACTIVE").
- RSSTAT ($0297) uses bit 3 as the buffer-empty flag: setting bit 3 when the buffer is empty (ORA #$08 / AND #$F7 to clear).
- RIDBS ($029C) and RIDBE ($029B) store reader buffer pointers/limits; equality means the buffer is empty.

Do not duplicate the assembly listing — see Source Code for exact bytes and labels.

## Source Code

```asm
; WAIT FOR ACTIVE OUTPUT TO BE DONE
;
.,F062 AD A1 02 LDA $02A1       CKI010 LDA ENABL
.,F065 4A       LSR                    LSR A           ;CHECK T1 (BIT 0)
.,F066 B0 FA    BCS $F062              BCS CKI010
;
; TURN OFF RTS
;
.,F068 AD 01 DD LDA $DD01              LDA D2PRB
.,F06B 29 FD    AND #$FD               AND #$FF-02
.,F06D 8D 01 DD STA $DD01              STA D2PRB
;
; WAIT FOR DCD TO GO HIGH (IN SPEC)
;
.,F070 AD 01 DD LDA $DD01       CKI020 LDA D2PRB
.,F073 29 04    AND #$04               AND #$04
.,F075 F0 F9    BEQ $F070              BEQ CKI020
;
; ENABLE FLAG FOR RS232 INPUT
;
.,F077 A9 90    LDA #$90        CKI080 LDA #$90
.,F079 18       CLC                    CLC             ;NO ERROR
.,F07A 4C 3B EF JMP $EF3B              JMP OENABL      ;FLAG IN ENABL**********
;
; IF NOT 3 LINE HALF THEN...
;  SEE IF WE NEED TO TURN ON FLAG
;
.,F07D AD A1 02 LDA $02A1       CKI100 LDA ENABL       ;CHECK FOR FLAG OR T2 ACTIVE
.,F080 29 12    AND #$12               AND #$12
.,F082 F0 F3    BEQ $F077              BEQ CKI080      ;NO NEED TO TURN ON
.,F084 18       CLC             CKI110 CLC             ;NO ERROR
.,F085 60       RTS                    RTS
; BSI232 - INPUT A CHAR RS232
;
; BUFFER HANDLER
;
.,F086 AD 97 02 LDA $0297       BSI232 LDA RSSTAT      ;GET STATUS UP TO CHANGE...
.,F089 AC 9C 02 LDY $029C              LDY RIDBS       ;GET LAST BYTE ADDRESS
.,F08C CC 9B 02 CPY $029B              CPY RIDBE       ;SEE IF BUFFER EMPTY
.,F08F F0 0B    BEQ $F09C              BEQ BSI010      ;RETURN A NULL IF NO CHAR
;
.,F091 29 F7    AND #$F7               AND #$FF-$08    ;CLEAR BUFFER EMPTY STATUS
.,F093 8D 97 02 STA $0297              STA RSSTAT
.,F096 B1 F7    LDA ($F7),Y            LDA (RIBUF),Y   ;GET LAST CHAR
.,F098 EE 9C 02 INC $029C              INC RIDBS       ;INC TO NEXT POS
;
; RECEIVER ALWAYS RUNS
;
.,F09B 60       RTS                    RTS
;
.,F09C 09 08    ORA #$08        BSI010 ORA #$08        ;SET BUFFER EMPTY STATUS
.,F09E 8D 97 02 STA $0297              STA RSSTAT
.,F0A1 A9 00    LDA #$00               LDA #$0         ;RETURN A NULL
.,F0A3 60       RTS                    RTS
; RSP232 - PROTECT SERIAL/CASS FROM RS232 NMI'S
;
.,F0A4 48       PHA             RSP232 PHA             ;SAVE .A
.,F0A5 AD A1 02 LDA $02A1              LDA ENABL       ;DOES RS232 HAVE ANY ENABLES?
.,F0A8 F0 11    BEQ $F0BB              BEQ RSPOK       ;NO...
.,F0AA AD A1 02 LDA $02A1       RSPOFF LDA ENABL       ;WAIT UNTIL DONE
.,F0AD 29 12    AND #$12               AND #$12        ;CHECK FOR FLAG OR T2 ACTIVE
.,F0AF F0 0A    BEQ $F0BB              BEQ RSPOK       ;NO...
.,F0B1 AD 01 DD LDA $DD01              LDA D2PRB       ;CHECK DCD
.,F0B4 29 04    AND #$04               AND #$04
.,F0B6 F0 F2    BEQ $F0AA              BEQ RSPOFF      ;WAIT UNTIL DCD HIGH
.,F0B8 4C 3B EF JMP $EF3B              JMP OENABL      ;FLAG IN ENABL
.,F0BB 68       PLA             RSPOK  PLA             ;RESTORE .A
.,F0BC 60       RTS                    RTS
```

## Key Registers

- **$02A1**: KERNAL workspace - ENABL flags (tested with LSR and AND #$12)
- **$0297**: KERNAL workspace - RSSTAT (buffer status; bit 3 = buffer-empty)
- **$029C**: KERNAL workspace - RIDBS (reader buffer index / next-read address)
- **$029B**: KERNAL workspace - RIDBE (reader buffer end / last valid address)
- **$00F7**: Zero page pointer (used as indirect pointer to RIBUF; LDA ($F7),Y)
- **$DD01**: CIA 2 ($DD00-$DD0F region) - Port B (D2PRB) used to clear RTS and test DCD

## References

- "messages_and_channelio_intro" — expands on message strings (MS1..MS18) and SPMSG usage (prints messages only if MSGFLG set, uses BSOUT)

## Labels
- BSI232
- RSP232
- ENABL
- RSSTAT
- RIDBS
- RIDBE
- D2PRB
