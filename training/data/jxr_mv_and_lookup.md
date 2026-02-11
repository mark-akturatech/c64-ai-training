# KERNAL: Close/Cassette Finalize & Table-Removal (JXRMV / JX170)

**Summary:** KERNAL ROM routines for closing cassette files and removing logical-file table entries. Implements cassette EOF/EOT handling (CASOUT, TAPEH), checks WBLK error returns, and the JXRMV/JX170 table-removal that shifts the last LAT/FAT/SAT entry into a deleted slot using zero-page index $98 (LDTND). Mnemonics: LDA/STA/JSR/PLA/TAX/DEC/CPX/BEQ/BCC/RTS.

## Description
This chunk contains two related responsibilities from the C64 KERNAL:

1. Close cassette / serial file handling
   - Checks and deallocates output allocation flags (zero-page ROBUF+1 / $FA, RIBUF+1 / $F8).
   - For cassette files: it inspects SA (secondary address) at $B9, testing low nibble (AND #$0F). If zero (tape read), it branches; otherwise (write) it writes an end-of-file marker and finalizes the tape write.
   - For tape writes:
     - Calls subroutine at $F7D0 (labelled ZZZ in source).
     - Loads #$00 (end-of-file character) and sets the carry (SEC) before calling CASOUT ($F1DD). (Carry set is required by CASOUT to indicate cassette output, avoiding RS232 path.)
     - Calls WBLK ($F864) to write the block and checks for errors (BCC continues if no error). On error it cleans the stack (PLA), returns a break-key error (LDA #$00) and RTS.
     - If SA equals #$62 (write end-of-tape block), it calls TAPEH ($F76A) with LDA #$05 (EOT) to write an EOT block.
   - For serial files: branches to CLSEI ($F642) to close IEC/serial device.

2. Table removal routine (JXRMV / JX170)
   - Entry expects table-index pushed on stack; PLA retrieves it at $F2F1.
   - TAX transfers the index to X.
   - DEC $98 (LDTND) and CPX $98 tests whether the deleted file was the last entry in the table.
     - If DELETED_INDEX == LDTND (after DEC), branch to JX170 (no move required).
     - Otherwise copy the last entry into the deleted slot:
       - Y is loaded with LDTND ($98).
       - LAT (logical address table) begins at $0259; FAT at $0263; SAT at $026D.
       - For each table: LDA from table,Y and STA to table,X to overwrite the deleted slot with the last entry.
   - This effectively keeps LAT/FAT/SAT arrays compact by moving the tail entry into the removed slot.

Variables/arrays used in the code (addresses shown in source):
- LDTND: zero-page $98 (table count / last index)
- LAT: $0259 (logical address table)
- FAT: $0263 (file/device table)
- SAT: $026D (secondary/address table)
- SA: $B9 (secondary address byte)
- ROBUF+1 / RIBUF+1: $FA / $F8 (I/O allocation flags)
- Several KERNAL JSRs invoked: CASOUT ($F1DD), WBLK ($F864), TAPEH ($F76A), CLSEI ($F642), and a subroutine at $F7D0.

Behavioral/calling notes:
- The routine deallocates buffer flags before proceeding to close actions.
- When writing cassette, the code sets the carry (SEC) before CASOUT; clearing/setting processor flags matters for CASOUT behavior (cassette vs RS232).
- Error handling: WBLK sets carry for errors; BCC indicates success. On error the code PLAs to clean the stack and returns an error code via LDA #$00.
- JXRMV expects the logical-file table index on stack; it removes that entry by either decrementing the table end pointer if it was the last entry or moving the final entry into the deleted position.

## Source Code
```asm
.,F2BA A5 FA    LDA $FA         CLS010 LDA ROBUF+1     ;CHECK OUTPUT ALLOCATION
.,F2BC F0 01    BEQ $F2BF              BEQ CLS020
.,F2BE C8       INY                    INY
.,F2BF A9 00    LDA #$00        CLS020 LDA #00         ;DEALLOCATE
.,F2C1 85 F8    STA $F8                STA RIBUF+1
.,F2C3 85 FA    STA $FA                STA ROBUF+1
                                ; FLAG TOP OF MEMORY CHANGE
.,F2C5 4C 7D F4 JMP $F47D              JMP MEMTCF      ;GO SET NEW TOP
                                ;
                                ;CLOSE CASSETTE FILE
                                ;
.,F2C8 A5 B9    LDA $B9         JX115  LDA SA          ;WAS IT A TAPE READ?
.,F2CA 29 0F    AND #$0F        AND    #$F
.,F2CC F0 23    BEQ $F2F1       BEQ    JX150           ;YES
                                ;
.,F2CE 20 D0 F7 JSR $F7D0       JSR    ZZZ             ;NO. . .IT IS WRITE
.,F2D1 A9 00    LDA #$00        LDA    #0              ;END OF FILE CHARACTER
.,F2D3 38       SEC             SEC                    ;NEED TO SET CARRY FOR CASOUT (ELSE RS232 OUTPUT!)
.,F2D4 20 DD F1 JSR $F1DD       JSR    CASOUT          ;PUT IN END OF FILE
.,F2D7 20 64 F8 JSR $F864       JSR    WBLK
.,F2DA 90 04    BCC $F2E0       BCC    JX117           ;NO ERRORS...
.,F2DC 68       PLA             PLA                    ;CLEAN STACK FOR ERROR
.,F2DD A9 00    LDA #$00        LDA    #0              ;BREAK KEY ERROR
.,F2DF 60       RTS             RTS
                                ;
.,F2E0 A5 B9    LDA $B9         JX117  LDA SA
.,F2E2 C9 62    CMP #$62        CMP    #$62            ;WRITE END OF TAPE BLOCK?
.,F2E4 D0 0B    BNE $F2F1       BNE    JX150           ;NO...
                                ;
.,F2E6 A9 05    LDA #$05        LDA    #EOT
.,F2E8 20 6A F7 JSR $F76A       JSR    TAPEH           ;WRITE END OF TAPE BLOCK
.,F2EB 4C F1 F2 JMP $F2F1       JMP    JX150
                                ;
                                ;CLOSE AN SERIAL FILE
                                ;
.,F2EE 20 42 F6 JSR $F642       JX120  JSR CLSEI
                                ;
                                ;ENTRY TO REMOVE A GIVE LOGICAL FILE
                                ;FROM TABLE OF LOGICAL, PRIMARY,
                                ;AND SECONDARY ADDRESSES
                                ;
.,F2F1 68       PLA             JX150  PLA             ;GET TABLE INDEX OFF STACK
                                ;
                                ; JXRMV - ENTRY TO USE AS AN RS-232 SUBROUTINE
                                ;
.,F2F2 AA       TAX             JXRMV  TAX
.,F2F3 C6 98    DEC $98         DEC    LDTND
.,F2F5 E4 98    CPX $98         CPX    LDTND           ;IS DELETED FILE AT END?
.,F2F7 F0 14    BEQ $F30D       BEQ    JX170           ;YES...DONE
                                ;
                                ;DELETE ENTRY IN MIDDLE BY MOVING
                                ;LAST ENTRY TO THAT POSITION.
                                ;
.,F2F9 A4 98    LDY $98         LDY    LDTND
.,F2FB B9 59 02 LDA $0259,Y     LDA    LAT,Y
.,F2FE 9D 59 02 STA $0259,X     STA    LAT,X
.,F301 B9 63 02 LDA $0263,Y     LDA    FAT,Y
.,F304 9D 63 02 STA $0263,X     STA    FAT,X
.,F307 B9 6D 02 LDA $026D,Y     LDA    SAT,Y
.,F30A 9D 6D 02 STA $026D,X     STA    SAT,X
```

## References
- "close_and_cassette_finalize" — expands on used when closing and removing table entries

## Labels
- JXRMV
- JX170
- LDTND
- LAT
- FAT
- SAT
- SA
