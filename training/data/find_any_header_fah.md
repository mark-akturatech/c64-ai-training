# FAH — Find Any Header (KERNAL ROM $F72C-$F769)

**Summary:** KERNAL routine FAH reads cassette blocks via JSR $F841 (RBLK), scans the tape buffer (indirect at $B2) for header block types (EOT $05, BLF $01, PLF $03, BDFH $04), returns file-type in X (TAX) on success with carry clear, sets carry on failure, and optionally prints "FOUND" and the full tape filename via BSOUT ($FFD2). Preserves/restores the verify flag ($93) across RBLK and calls FPATCH ($E4E0) if STKEY ($A1) indicates a key-down on the last row.

## Operation / Behavior
- Saves the current verify flag (VERCK, $93) on the stack before calling RBLK ($F841) and restores it immediately after RBLK returns — protecting caller's verify state.
- RBLK is called to read the next cassette block; if RBLK returns with carry set the read terminated and FAH returns immediately with carry set (failure).
- FAH reads the header-type byte from the cassette buffer via the zero-page indirect pointer at $B2 (LDA ($B2),Y) with Y = 0.
- Recognized header types:
  - $05 — EOT (end-of-tape) → treated as failure (branches to return with carry set).
  - $01 — BLF (Basic load file) → success.
  - $03 — PLF (fixed/PRG load file) → success.
  - $04 — BDFH (Basic data-file header) → ignored and search continues (loop back to call RBLK).
- On success (BLF or PLF):
  - TAX stores the found file-type in X for the caller.
  - Tests MSGFLG ($9D). If MSGFLG (bit7) is set, FAH:
    - Calls MSG ($F12F) to print the literal "FOUND".
    - Outputs the complete filename from the tape buffer by calling BSOUT ($FFD2) for each character starting at index Y = 5 and continuing until Y == $15 (21 decimal), i.e. outputs bytes 5..20 inclusive (16 bytes).
  - Loads STKEY ($A1) and JSRs FPATCH ($E4E0) if STKEY indicates a key-down on the last keyboard row (patch routine invocation).
  - Clears carry (CLC) to signal success and DEY is executed to make Y nonzero (DEY from 0 yields $FF) — the call convention uses a nonzero Y on success.
- Caller-visible returns:
  - Success: carry clear, X = file-type (BLF $01 or PLF $03), Y nonzero (DEY used), A unchanged from the header-type load (but TAX copied it to X).
  - Failure: carry set and RTS. If the STOP key was pressed during RBLK, the accumulator may be zero on return (per original comments).

## Source Code
```asm
                                .LIB   TAPEFILE
                                ;FAH -- FIND ANY HEADER
                                ;
                                ;READS TAPE DEVICE UNTIL ONE OF FOLLOWING
                                ;BLOCK TYPES FOUND: BDFH--BASIC DATA
                                ;FILE HEADER, BLF--BASIC LOAD FILE
                                ;FOR SUCCESS CARRY IS CLEAR ON RETURN.
                                ;FOR FAILURE CARRY IS SET ON RETURN.
                                ;IN ADDITION ACCUMULATOR IS 0 IF STOP
                                ;KEY WAS PRESSED.
                                ;
.,F72C A5 93    LDA $93         FAH    LDA VERCK       ;SAVE OLD VERIFY
.,F72E 48       PHA             PHA
.,F72F 20 41 F8 JSR $F841       JSR    RBLK            ;READ TAPE BLOCK
.,F732 68       PLA             PLA
.,F733 85 93    STA $93         STA    VERCK           ;RESTORE VERIFY FLAG
.,F735 B0 32    BCS $F769       BCS    FAH40           ;READ TERMINATED
                                ;
.,F737 A0 00    LDY #$00        LDY    #0
.,F739 B1 B2    LDA ($B2),Y     LDA    (TAPE1)Y        ;GET HEADER TYPE
                                ;
.,F73B C9 05    CMP #$05        CMP    #EOT            ;CHECK END OF TAPE?
.,F73D F0 2A    BEQ $F769       BEQ    FAH40           ;YES...FAILURE
                                ;
.,F73F C9 01    CMP #$01        CMP    #BLF            ;BASIC LOAD FILE?
.,F741 F0 08    BEQ $F74B       BEQ    FAH50           ;YES...SUCCESS
                                ;
.,F743 C9 03    CMP #$03        CMP    #PLF            ;FIXED LOAD FILE?
.,F745 F0 04    BEQ $F74B       BEQ    FAH50           ;YES...SUCCESS
                                ;
.,F747 C9 04    CMP #$04        CMP    #BDFH           ;BASIC DATA FILE?
.,F749 D0 E1    BNE $F72C       BNE    FAH             ;NO...KEEP TRYING
                                ;
.,F74B AA       TAX             FAH50  TAX             ;RETURN FILE TYPE IN .X
.,F74C 24 9D    BIT $9D         BIT    MSGFLG          ;PRINTING MESSAGES?
.,F74E 10 17    BPL $F767       BPL    FAH45           ;NO...
                                ;
.,F750 A0 63    LDY #$63        LDY    #MS17-MS1       ;PRINT "FOUND"
.,F752 20 2F F1 JSR $F12F       JSR    MSG
                                ;
                                ;OUTPUT COMPLETE FILE NAME
                                ;
.,F755 A0 05    LDY #$05        LDY    #5
.,F757 B1 B2    LDA ($B2),Y     FAH55  LDA (TAPE1)Y
.,F759 20 D2 FF JSR $FFD2       JSR    BSOUT
.,F75C C8       INY             INY
.,F75D C0 15    CPY #$15        CPY    #21
.,F75F D0 F6    BNE $F757       BNE    FAH55
                                ;
.,F761 A5 A1    LDA $A1         FAH56  LDA STKEY       ;KEY  DOWN ON LAST ROW...
.,F763 20 E0 E4 JSR $E4E0              JSR FPATCH      ;GOTO PATCH...
.,F766 EA       NOP                    NOP
                                ;
.,F767 18       CLC             FAH45  CLC             ;SUCCESS FLAG
.,F768 88       DEY             DEY                    ;MAKE NONZERO FOR OKAY RETURN
                                ;
.,F769 60       RTS             FAH40  RTS
```

## Key Registers
- $0093 - VERCK - saved/restored verify flag around RBLK
- $00B2 - TAPE1 - zero-page pointer to cassette buffer (used with indirect indexed LDA ($B2),Y)
- $009D - MSGFLG - message flag (BIT tested; bit7 governs printing "FOUND")
- $00A1 - STKEY - keyboard state for last row (checked before calling FPATCH)

## References
- "find_any_header_and_compare_faf" — wrapper that calls FAH and compares the filename
- "tape_header_write_tapeh" — routines that write headers to tape (uses similar tape-buffer structures)

## Labels
- FAH
- VERCK
- TAPE1
- MSGFLG
- STKEY
