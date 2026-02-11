# KERNAL RESTOR / VECTOR (MOVOS) — copy KERNAL vector words between storage and user area

**Summary:** ROM routines at $FD15-$FD2F implement RESTOR and VECTOR (MOVOS) to copy KERNAL vector words between the KERNAL storage table (labelled CINV at $0314) and the user vector addresses listed by VECTSS..VECTSE. Uses zero-page TMP2 ($C3/$C4), indexed addressing ($0314,Y and (TMP2),Y), and the carry flag to select direction.

## Description
This chunk contains the KERNAL ROM code that initializes and transfers the vector table. RESTOR and VECTOR share the MOVOS copy loop:

- RESTOR (entry at $FD15) sets up the pointer to the VECTSS word-list (low/high bytes placed into $C3/$C4) by loading X with the low byte and Y with the high byte of VECTSS. RESTOR clears the carry before returning to VECTOR/transfer (see system startup sequence for where RESTOR is invoked).

- VECTOR (entry at $FD1A) stores the VECTSS pointer into zero page TMP2 ($C3/$C4), sets Y to the loop length (VECTSE-VECTSS-1) and runs the MOVOS loop to move each 2-byte vector word.

MOVOS loop behavior:
- The carry flag selects direction:
  - Carry = 1: copy from KERNAL storage (CINV at $0314,Y) to the user vector address (indirect via TMP2).
  - Carry = 0: copy from the user vector address (indirect via TMP2) to KERNAL storage ($0314,Y).
- Implementation detail: The code always executes two STA instructions after loading A (one to the indirect destination ($C3),Y and one to storage $0314,Y). The initial LDA is chosen according to the carry flag:
  - If carry set: LDA $0314,Y (load storage), BCS taken → STA ($C3),Y writes storage -> user; STA $0314,Y writes back same value (harmless).
  - If carry clear: BCS not taken → LDA ($C3),Y (load user), then STA ($C3),Y (writes user back) and STA $0314,Y copies user -> storage.
- Loop control: DEY / BPL loops downward from initial Y (#$1F) to 0 inclusive, covering all entries in the VECTSS..VECTSE list.

Data table:
- VECTSS..VECTSE is the WORD-list of KERNAL vector labels (KEY, TIMB, NNMI, NOPEN, NCLOSE, NCHKIN, NCKOUT, NCLRCH, NBASIN, NBSOUT, NSTOP, NGETIN, NCLALL, TIMB, NLOAD, NSAVE). The list is stored immediately after the code.

Zero-page/temp usage:
- TMP2 = $C3/$C4 is used to hold the base pointer to the word-list (VECTSS), used as an indirect pointer for user vector addresses.

Behavioral summary:
- The routine is a generic mover for the KERNAL vector table: it iterates the VECTSS word list and copies each 16-bit vector between the KERNAL storage block (labelled CINV at $0314) and the user vectors (addresses obtained from the word-list pointed at by TMP2). The carry flag determines copy direction.

## Source Code
```asm
        ; RESTOR - SET KERNAL INDIRECTS AND VECTORS (SYSTEM)
        ;
.,FD15 A2 30    LDX #$30        RESTOR LDX #<VECTSS
.,FD17 A0 FD    LDY #$FD               LDY #>VECTSS
.,FD19 18       CLC                    CLC
        ;
        ; VECTOR - SET KERNAL INDIRECT AND VECTORS (USER)
        ;
.,FD1A 86 C3    STX $C3         VECTOR STX TMP2
.,FD1C 84 C4    STY $C4                STY TMP2+1
.,FD1E A0 1F    LDY #$1F               LDY #VECTSE-VECTSS-1
.,FD20 B9 14 03 LDA $0314,Y     MOVOS1 LDA CINV,Y      ;GET FROM STORAGE
.,FD23 B0 02    BCS $FD27              BCS MOVOS2      ;C...WANT STORAGE TO USER
.,FD25 B1 C3    LDA ($C3),Y            LDA (TMP2)Y     ;...WANT USER TO STORAGE
.,FD27 91 C3    STA ($C3),Y     MOVOS2 STA (TMP2)Y     ;PUT IN USER
.,FD29 99 14 03 STA $0314,Y            STA CINV,Y      ;PUT IN STORAGE
.,FD2C 88       DEY                    DEY
.,FD2D 10 F1    BPL $FD20              BPL MOVOS1
.,FD2F 60       RTS                    RTS
        ;
        VECTSS .WOR KEY,TIMB,NNMI
                .WOR   NOPEN,NCLOSE,NCHKIN
                .WOR   NCKOUT,NCLRCH,NBASIN
                .WOR   NBSOUT,NSTOP,NGETIN
                .WOR   NCLALL,TIMB     ;GOTO BREAK ON A USRCMD JMP
.,FD30 31 EA 66 FE 47 FE 4A F3  .WOR   NLOAD,NSAVE
        VECTSE
```

## References
- "system_start_reset_sequence" — expands on RESTOR invocation during system startup
- "ramtas_memory_initialization_and_top_detection" — expands on RAM tests and tape buffer allocation occurring before restoring vectors

## Labels
- RESTOR
- VECTOR
- TMP2
- CINV
- VECTSS
