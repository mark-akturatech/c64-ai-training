# JTGET — Cassette buffer retrieval (KERNAL $F199)

**Summary:** JTGET ($F199) reads a byte from the cassette TAPE buffer using the TAPE1 pointer (zero page $B2), handles buffer-wrap via JTP20 ($F80D), refills the buffer by calling RBLK ($F841) when empty, and returns with status via the carry flag. Also shows neighboring input/output entry points (serial/RS232 input paths and the start of BSOUT at $F1CA).

**Function overview**
JTGET is the KERNAL entry that returns the next byte from the cassette input buffer (TAPE1). High-level behavior from the disassembly:

- Save/restore of temporary error info using TAX/PLA/TXA and LDX $97 (XSAV) occurs at the start of the sequence shown.
- JTGET starts at $F199 and first calls JTP20 ($F80D) to perform buffer-pointer wrap/validation.
- If JTP20 indicates the buffer pointer is OK (BNE), JTGET loads a byte via indirect indexed addressing LDA ($B2),Y where $B2 is the zero-page pointer to the cassette buffer (TAPE1) and Y is the offset.
- If JTP20 indicates the buffer is empty (clear/zero result, falling through to $F19E), JTGET calls RBLK ($F841) to request the next cassette block from the device.
- RBLK may return with carry set if a stop key or other error condition is detected (BCS to BN33).
- When a refill occurs, BUFPT (zero page $A6) is set to 0 (LDA #$00; STA $A6) and execution loops back to JTGET to retry (BEQ back to JTGET — always taken).
- On successful byte fetch, JTGET clears carry and RTS (good return).

The routine makes use of zero-page pointers / temporaries (e.g. $B2 TAPE1 pointer, $A6 BUFPT, $97 XSAV) and communicates status via the CPU carry flag on return.

**Buffer wrap and block refill details**
- JSR $F80D (JTP20) — invoked to handle buffer pointer wrapping and validation. If this subroutine returns with BNE (non-zero), the buffer pointer points to valid data; control jumps to the LDA ($B2),Y fetch.
- If JTP20 indicates buffer is exhausted (zero), JTGET calls RBLK (JSR $F841) to read the next block from tape. After RBLK:
  - If carry is set (BCS BN33 / BCS $F1B4) the read was aborted (stop key); JTGET returns with error status.
  - Otherwise the code sets BUFPT ($A6) to 0 and retries the fetch loop.

Fetch: LDA ($B2),Y reads the next byte from the cassette buffer using the zero-page pointer at $B2 (TAPE1). After the load the code clears carry (CLC) and returns (RTS) — indicating success.

**Error and device-branching behavior**
- RBLK sets carry on stop-key or error conditions; JTGET propagates this via BCS to the caller return (BN33).
- After an unsuccessful RBLK (error), code saves/restores error info with TAX/PLA/TXA and LDX $97 (XSAV) before returning (RTS).
- The disassembly also contains adjacent KERNAL paths:
  - Serial-bus input path: starting at $F1AD (BN30) — checks $90 (STATUS) and branches to ACPTR ($EE13) for bus handshake.
  - RS232 input: GN232 at $F14E is called at $F1B8, with status checks and DSR/DCD checks via RSSTAT ($0297).
  - BSOUT (output to channel determined by DFLTO at $9A) begins at $F1CA; this chunk shows the start of BSOUT which dispatches to the CRT print routine when DFLTO == 3 (screen).

**Return conventions**
- On success: carry clear, A contains the returned data byte, RTS.
- On error/stop: carry set, return to caller (error code/state preserved in zero page XSAV/$97 in surrounding code).

## Source Code
```asm
.,F193 AA       TAX             JTG36  TAX             ;SAVE ERROR INFO
.,F194 68       PLA             PLA                    ;TOSS DATA
.,F195 8A       TXA             TXA                    ;RESTORE ERROR
.,F196 A6 97    LDX $97         JTG37  LDX XSAV        ;RETURN
.,F198 60       RTS             RTS                    ;ERROR RETURN C-SET FROM JTGET
                                ;GET A CHARACTER FROM APPROPRIATE
                                ;CASSETTE BUFFER
                                ;
.,F199 20 0D F8 JSR $F80D       JTGET  JSR JTP20       ;BUFFER POINTER WRAP?
.,F19C D0 0B    BNE $F1A9       BNE    JTG10           ;NO...
.,F19E 20 41 F8 JSR $F841       JSR    RBLK            ;YES...READ NEXT BLOCK
.,F1A1 B0 11    BCS $F1B4       BCS    BN33            ;STOP KEY PRESSED
.,F1A3 A9 00    LDA #$00        LDA    #0
.,F1A5 85 A6    STA $A6         STA    BUFPT           ;POINT TO BEGIN.
.,F1A7 F0 F0    BEQ $F199       BEQ    JTGET           ;BRANCH ALWAYS
                                ;
.,F1A9 B1 B2    LDA ($B2),Y     JTG10  LDA (TAPE1)Y    ;GET CHAR FROM BUF
.,F1AB 18       CLC             CLC                    ;GOOD RETURN
.,F1AC 60       RTS             RTS
                                ;INPUT FROM SERIAL BUS
                                ;
.,F1AD A5 90    LDA $90         BN30   LDA STATUS      ;STATUS FROM LAST
.,F1AF F0 04    BEQ $F1B5       BEQ    BN35            ;WAS GOOD
.,F1B1 A9 0D    LDA #$0D        BN31   LDA #$D         ;BAD...ALL DONE
.,F1B3 18       CLC             BN32   CLC             ;VALID DATA
.,F1B4 60       RTS             BN33   RTS
                                ;
.,F1B5 4C 13 EE JMP $EE13       BN35   JMP ACPTR       ;GOOD...HANDSHAKE
                                ;
                                ;INPUT FROM RS232
                                ;
.,F1B8 20 4E F1 JSR $F14E       BN50   JSR GN232       ;GET INFO
.,F1BB B0 F7    BCS $F1B4       BCS    BN33            ;ERROR RETURN
.,F1BD C9 00    CMP #$00        CMP    #00
.,F1BF D0 F2    BNE $F1B3       BNE    BN32            ;GOOD DATA...EXIT
.,F1C1 AD 97 02 LDA $0297       LDA    RSSTAT          ;CHECK FOR DSR OR DCD ERROR
.,F1C4 29 60    AND #$60        AND    #$60
.,F1C6 D0 E9    BNE $F1B1       BNE    BN31            ;AN ERROR...EXIT WITH C/R
.,F1C8 F0 EE    BEQ $F1B8       BEQ    BN50            ;NO ERROR...STAY IN LOOP
                                ;***************************************
                                ;* BSOUT -- OUT CHARACTER TO CHANNEL   *
                                ;*     DETERMINED BY VARIABLE DFLTO:   *
                                ;*     0 -- INVALID                    *
                                ;*     1 -- CASSETTE #1                *
                                ;*     2 -- RS232                      *
                                ;*     3 -- SCREEN                     *
                                ;*  4-31 -- SERIAL BUS                 *
                                ;***************************************
                                ;
.,F1CA 48       PHA             NBSOUT PHA             ;PRESERVE .A
.,F1CB A5 9A    LDA $9A         LDA    DFLTO           ;CHECK DEVICE
.,F1CD C9 03    CMP #$03        CMP    #3              ;IS IT THE SCREEN?
.,F1CF D0 04    BNE $F1D5       BNE    BO10            ;NO...
                                ;
                                ;PRINT TO CRT
                                ;
.,F1D1 68       PLA             PLA                    ;RESTORE DATA
.,F1D2 4C 16 E7 JMP $E716       JMP    PRT             ;PRINT ON CRT
                                ;
                                BO10
```

## References
- "getin_and_basin" — expands on called routines when default input is cassette and related I/O handling

## Labels
- JTGET
- JTP20
- RBLK
- BSOUT
