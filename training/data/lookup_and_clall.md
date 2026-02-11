# KERNAL: LOOKUP / JLTLK helpers and CLALL (Close All logical files)

**Summary:** Describes the KERNAL LOOKUP/JLTLK table search and fetch helpers and the CLALL (close all) routine. Search terms: LOOKUP ($F30F), JLTLK/JZ100 fetch ($F31F), CLALL ($F32F), STATUS $90, LDTND $98, LAT $0259, FAT $0263, SAT $026D, LA/FA/SA -> $B8/$BA/$B9, DFLTO $9A, DFLTN $99, UNLSN $EDFE, UNTLK $EDEF.

## Description

LOOKUP (entry $F30F)
- Clears STATUS ($90) and searches the logical-attachment table (LAT) for a matching logical file entry.
- Uses LDTND ($98) as the table end/count. The search indexes backward (LDX LDTND then DEX loop).
- Compares A against LAT entries (CMP $0259,X). On match it returns (RTS) to the caller that will continue into the fetch helper.
- The helper at $F31F (labeled JZ100 in the commentary) performs the actual fetch of stored fields when a table entry is found:
  - Loads LA (logical address) from LAT base + X into $B8.
  - Loads FA (file address / FAT) from FAT base + X into $BA.
  - Loads SA (secondary address / SAT) from SAT base + X into $B9.

CLALL (Close All logical files) (entry $F32F)
- Clears the LDTND table count by storing 0 into $98 (LDTND) — this effectively "deletes" all table entries.
- Calls CLRCH-like logic to restore default I/O channels and to un-list/un-talk IEEE devices if the previously-set default channels refer to IEEE devices.
  - Loads X = 3 (value representing the screen output channel).
  - Compares X with DFLTO ($9A). If DFLTO < 3 (i.e., an IEEE device), JSR $EDFE (UNLSN) to unlisten the device; otherwise skip.
  - Compares X with DFLTN ($99). If DFLTN < 3, JSR $EDEF (UNTLK) to untalk the device; otherwise skip.
- Restores defaults: STX $9A (DFLTO = 3, screen) and STA $99 (DFLTN = 0, keyboard).
- Returns to caller (RTS).

Notes on values and behavior
- Default channel values: output default 3 == screen; input default 0 == keyboard.
- The code treats channels < 3 as IEEE devices that must be UNLSN/UNTLK when closing.
- LOOKUP uses table bases at $0259 (LAT), $0263 (FAT), $026D (SAT) and stores fetched registers into zero-page locations $B8 (LA), $BA (FA), $B9 (SA).
- STATUS is zeroed at start of LOOKUP (STA $90). The exact value compared (A) depends on the caller state (TXA is present in LOOKUP).

## Source Code
```asm
        ; CLOSE EXIT
.,F30D  18        CLC
.,F30E  60        RTS

        ; LOOKUP TABLIZED LOGICAL FILE DATA
.,F30F  A9 00     LDA #$00        ; LOOKUP  LDA #0
.,F311  85 90     STA $90         ; STA    STATUS
.,F313  8A        TXA             ; TXA
.,F314  A6 98     LDX $98         ; JLTLK  LDX LDTND
.,F316  CA        DEX             ; JX600  DEX
.,F317  30 15     BMI $F32E       ; BMI    JZ101
.,F319  DD 59 02  CMP $0259,X     ; CMP    LAT,X
.,F31C  D0 F8     BNE $F316       ; BNE    JX600
.,F31E  60        RTS             ; RTS

        ; ROUTINE TO FETCH TABLE ENTRIES
.,F31F  BD 59 02  LDA $0259,X     ; JZ100  LDA LAT,X
.,F322  85 B8     STA $B8         ; STA    LA
.,F324  BD 63 02  LDA $0263,X     ; LDA    FAT,X
.,F327  85 BA     STA $BA         ; STA    FA
.,F329  BD 6D 02  LDA $026D,X     ; LDA    SAT,X
.,F32C  85 B9     STA $B9         ; STA    SA
.,F32E  60        RTS             ; JZ101  RTS

        ; .LIB   CLALL
        ; CLALL -- CLOSE ALL LOGICAL FILES
.,F32F  A9 00     LDA #$00        ; NCLALL LDA #0
.,F331  85 98     STA $98         ; STA    LDTND           ; FORGET ALL FILES

        ; CLRCH -- CLEAR CHANNELS
.,F333  A2 03     LDX #$03        ; NCLRCH LDX #3
.,F335  E4 9A     CPX $9A         ; CPX    DFLTO           ; IS OUTPUT CHANNEL IEEE?
.,F337  B0 03     BCS $F33C       ; BCS    JX750           ; NO...
.,F339  20 FE ED  JSR $EDFE       ; JSR    UNLSN           ; YES...UNLISTEN IT
.,F33C  E4 99     CPX $99         ; JX750  CPX DFLTN       ; IS INPUT CHANNEL IEEE?
.,F33E  B0 03     BCS $F343       ; BCS    CLALL2          ; NO...
.,F340  20 EF ED  JSR $EDEF       ; JSR    UNTLK           ; YES...UNTALK IT

        ; RESTORE DEFAULT VALUES
.,F343  86 9A     STX $9A         ; CLALL2 STX DFLTO       ; OUTPUT CHAN=3=SCREEN
.,F345  A9 00     LDA #$00        ; LDA    #0
.,F347  85 99     STA $99         ; STA    DFLTN           ; INPUT CHAN=0=KEYBOARD
.,F349  60        RTS             ; RTS
        .END
```

## Key Registers
- $0090 - STATUS - status byte cleared by LOOKUP
- $0098 - LDTND - logical table end/count (cleared by CLALL)
- $0259 - LAT base - Logical Attachment Table (compared/loaded with X offset)
- $0263 - FAT base - File Attachment Table (loaded by fetch)
- $026D - SAT base - Secondary/Slot Attachment Table (loaded by fetch)
- $00B8 - LA - fetched Logical Address (stored by fetch helper)
- $00BA - FA - fetched File Address (stored by fetch helper)
- $00B9 - SA - fetched Secondary Address (stored by fetch helper)
- $009A - DFLTO - Default output channel (restored to 3 by CLALL)
- $0099 - DFLTN - Default input channel (restored to 0 by CLALL)

## References
- "jxr_mv_and_lookup" — expands on LOOKUP/JZ routines that locate table entries used across open/close routines

## Labels
- LOOKUP
- JLTLK
- CLALL
- LDTND
