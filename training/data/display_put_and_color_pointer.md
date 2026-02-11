# DSPP / DSPP2 / SCOLOR / TOFROM / SETPNT / CLRLN (KERNAL ROM, "CBM")

**Summary:** Routines that place characters and their colors on the screen (DSPP, DSPP2), build a pointer into VIC color RAM (SCOLOR), copy color bytes to/from character addresses (TOFROM), set up the screen pointer from a table (SETPNT), and clear a line (CLRLN). Uses zero-page pointers PNT/PNT+1 ($D1/$D2), USER pointer ($F3), and the VIC color RAM region ($D800-$DBFF).

## Routine descriptions

- SCOLOR (EA24–EA2C)
  - Builds a pointer into VIC color RAM from the PNT/PNT+1 screen pointer. It loads PNT/PNT+1, masks the high byte with AND #$03 to keep only low two bits (A10–A11), ORs with #$D8 to form the high byte of the color-RAM page ($D8-$DB), and stores the result into USER (zero page pointer at $F3). This yields a two-byte pointer into $D800–$DBFF corresponding to the screen memory location.
  - Key instructions: LDA $D1; STA $F3 · LDA $D2; AND #$03; ORA #$D8; STA $F3+1.

- DSPP (EA13–EA23)
  - Place a character on screen and set up blink counter:
    - Saves A into Y (TAY) to preserve the character.
    - Sets BLNCT ($CD) = #$02 to drive blink timing for the cursor.
    - Calls SCOLOR to set USER (color pointer).
    - Restores character from Y and writes the character to (PNT),Y; writes color from (USER),Y.
  - DSPP2 is effectively the continuation restoring the color pointer column index (LDY $D3) and performing the writes.

- TOFROM (E9E0–E9EF)
  - Copies character-derived address bytes into zero-page pointer pair $AE/$AF for later (color) operations.
  - Calls SCOLOR first to build USER, then loads SAL (source character pointer) from $AC/$AD and converts to a color RAM pointer high byte by masking with #$03 and ORing with #$D8, storing result in $AE/$AF.

- SETPNT (E9F0–E9FE)
  - Build PNT/PNT+1 (screen memory pointer) from tables indexed by X:
    - LDA LDTB2,X (at $ECF0,X) → PNT ($D1)
    - LDA LDTB1,X (at $D9,X) → high byte candidate
    - AND #$03; ORA $0288 (HIBASE) to form the high byte; store to PNT+1 ($D2).
  - Used to position the PNT pointer to the start of a line or other screen offsets.

- CLRLN (E9FF–EA11)
  - Clears an entire line pointed to by the current .X index:
    - LDY #$27 (LLEN-1), calls SETPNT and SCOLOR, then loops calling CPATCH (E4DA) in reversed order per comment, writes spaces (#$20) to (PNT),Y and decrements Y until done.

- Usage notes in context
  - KEY (not shown in this listing) updates jiffies/clock, handles BLNCT decrementing for blinking, checks cassette switches, and calls SCNKEY to scan the keyboard when needed. DSPP/SCOLOR are used by the blinking cursor/character display path invoked from KEY and other text output routines.

## Source Code
```asm
        .,E9D8 B1 AE    LDA ($AE),Y            ; LDA ($AE),Y
        .,E9DA 91 F3    STA ($F3),Y            ; STA ($F3),Y
        .,E9DC 88       DEY
        .,E9DD 10 F5    BPL $E9D4
        .,,E9DF 60       RTS

; DO COLOR TO AND FROM ADDRESSES
; FROM CHARACTER TO AND FROM ADRS
TOFROM
        .,,E9E0 20 24 EA JSR $EA24             ; JSR SCOLOR
        .,,E9E3 A5 AC    LDA $AC               ; LDA SAL        ; CHARACTER FROM
        .,,E9E5 85 AE    STA $AE               ; STA EAL        ; MAKE COLOR FROM
        .,,E9E7 A5 AD    LDA $AD               ; LDA SAL+1
        .,,E9E9 29 03    AND #$03
        .,,E9EB 09 D8    ORA #$D8               ; ORA #>VICCOL
        .,,E9ED 85 AF    STA $AF               ; STA EAL+1
        .,,E9EF 60       RTS

; SET UP PNT AND Y
; FROM .X
SETPNT
        .,,E9F0 BD F0 EC LDA $ECF0,X           ; LDA LDTB2,X
        .,,E9F3 85 D1    STA $D1               ; STA PNT
        .,,E9F5 B5 D9    LDA $D9,X             ; LDA LDTB1,X
        .,,E9F7 29 03    AND #$03
        .,,E9F9 0D 88 02 ORA $0288             ; ORA HIBASE
        .,,E9FC 85 D2    STA $D2               ; STA PNT+1
        .,,E9FE 60       RTS

; CLEAR THE LINE POINTED TO BY .X
CLRLN
        .,,E9FF A0 27    LDY #$27              ; LDY #LLEN-1
        .,,EA01 20 F0 E9 JSR $E9F0            ; JSR SETPNT
        .,,EA04 20 24 EA JSR $EA24            ; JSR SCOLOR
        .,,EA07 20 DA E4 JSR $E4DA            ; JSR CPATCH      ; REVERSED ORDER FROM 901227-02
        .,,EA0A A9 20    LDA #$20              ; LDA #$20        ; STORE A SPACE
        .,,EA0C 91 D1    STA ($D1),Y           ; STA (PNT)Y     ; TO DISPLAY
        .,,EA0E 88       DEY
        .,,EA0F 10 F6    BPL $EA07
        .,,EA11 60       RTS
        .,,EA12 EA       NOP

; PUT A CHAR ON THE SCREEN
DSPP
        .,,EA13 A8       TAY                   ; TAY             ; SAVE CHAR
        .,,EA14 A9 02    LDA #$02              ; LDA #$02
        .,,EA16 85 CD    STA $CD               ; STA BLNCT       ; BLINK CURSOR
        .,,EA18 20 24 EA JSR $EA24            ; JSR SCOLOR      ; SET COLOR PTR
        .,,EA1B 98       TYA                   ; TYA             ; RESTORE CHAR
DSPP2
        .,,EA1C A4 D3    LDY $D3               ; LDY PNTR        ; GET COLUMN
        .,,EA1E 91 D1    STA ($D1),Y           ; STA (PNT)Y      ; CHAR TO SCREEN
        .,,EA20 8A       TXA
        .,,EA21 91 F3    STA ($F3),Y           ; STA (USER)Y     ; COLOR TO SCREEN
        .,,EA23 60       RTS

SCOLOR
        .,,EA24 A5 D1    LDA $D1               ; LDA PNT         ; GENERATE COLOR PTR
        .,,EA26 85 F3    STA $F3               ; STA USER
        .,,EA28 A5 D2    LDA $D2               ; LDA PNT+1
        .,,EA2A 29 03    AND #$03
        .,,EA2C 09 D8    ORA #$D8              ; ORA #>VICCOL
        .,,            ; (result stored in $F3/$F4 as pointer to $D800-$DBFF)
```

## Key Registers
- $AC - zero page - SAL low (character source low byte)
- $AD - zero page - SAL high (character source high byte)
- $AE - zero page - temporary pointer low (EAL / target low)
- $AF - zero page - temporary pointer high (EAL+1 / target high)
- $CD - zero page - BLNCT (blink counter)
- $D1-$D2 - zero page - PNT / PNT+1 (screen memory pointer low/high)
- $D3 - zero page - PNTR (column index used when writing characters)
- $D9 - zero page - LDTB1 table used by SETPNT (table low/high bytes)
- $ECF0 - ROM - LDTB2 table base used by SETPNT (LDTB2,X)
- $F3 - zero page - USER (color RAM pointer low; USER+1 = color RAM pointer high)
- $D800-$DBFF - VIC-II - Color RAM region (VIC color bytes for screen positions)

## References
- "keyboard_scan_and_irq" — expands on KEY calling SCNKEY to scan keyboard and update jiffies/blink
- "tofrom_setup_pnt" — expands on SCOLOR and TOFROM coordinate mapping and copying colors

## Labels
- SAL
- AE
- AF
- BLNCT
- PNT
- PNTR
- USER
