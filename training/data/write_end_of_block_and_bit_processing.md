# KERNAL ROM: WRTL3 / WRTN — End-of-Block Flagging and Per-Byte Finalization ($FBC8-$FC09)

**Summary:** Implements end-of-block flagging (PRP) and per-byte finalization for cassette write routines in the KERNAL (VIC/6526-era). Addresses and mnemonics shown: $FBC8-$FC09, SEC, ROR, JSR WRTX/WRTW/WRITE, PRP, RER, REZ, OCHAR, FIRT, PRTY.

## Description
This code fragment contains two tightly-coupled routines used by the KERNAL cassette write path:

- WRTL3 (at $FBC8): signals the end of a block by forcing the end-of-block flag (PRP) using SEC; ROR PRP then branches on the sign bit to WRT3/exit if set. (Rationale: SEC sets carry = 1, ROR shifts carry into PRP's bit7; BMI tests that bit.)

- WRTN (at $FBCD): called after each byte to finalize output state and handle special long/one-bit sequences:
  - Checks zero-page RER ($A8). If non-zero, a "long" bit is pending: it loads #$10 into A, sets X=1, JSR WRTX (generates long-bit pulses), increments RER, then tests PRP for end-of-block — jumping to WRNC if set.
  - If RER is zero, checks REZ ($A9). If REZ non-zero, JSR WRTW (write-with-other-timing), increments REZ, and branches to WRT3 if WRTW requested exit.
  - If neither RER nor REZ applied, calls WRITE (JSR $FBA6). If WRITE returns with carry clear (branch on BNE/$D0), the bit was low and routine exits.
  - Handles dipole/complementary-bit state: toggles FIRT ($A4) with EOR #$01 (first-of-dipole flip). If FIRT becomes zero (BEQ WRT2), the dipole pair is complete and routine returns.
  - Otherwise flips OCHAR ($BD) (the complementary output bit) and updates parity PRTY ($9B) by AND #$01 then EOR $9B / STA $9B.
  - Finally jumps to PREND ($FEBC) via JMP $FEBC (labelled WRT3) to restore registers and RTI out.

Zero-page variables used (by name where present in comments): RER ($A8), REZ ($A9), FIRT ($A4), OCHAR ($BD), PRTY ($9B), PRP ($B6). These are KERNAL zero-page/labelled variables controlling long/one-bit counts, dipole state, parity, and the end-of-block flag.

Behavioral notes (preserved from source):
- SEC + ROR PRP sets the top bit of PRP to indicate end-of-block; BMI checks that bit.
- Long-bit handling writes a 16-value pattern (A=#$10, X=#$01) via WRTX.
- Parity is updated only for the complementary (second) half of a dipole.
- Exit path to PREND restores registers and performs RTI.

## Source Code
```asm
                                ;
.,FBC8 38       SEC             WRTL3  SEC             ;FLAG PRP FOR END OF BLOCK
.,FBC9 66 B6    ROR $B6         ROR    PRP
.,FBCB 30 3C    BMI $FC09       BMI    WRT3            ; JMP
                                ;
                                ; WRTN - CALLED AT THE END OF EACH BYTE
                                ;   TO WRITE A LONG RER    REZ
                                ;              HHHHHHLLLLLLHHHLLL...
                                ;
.,FBCD A5 A8    LDA $A8         WRTN   LDA RER         ;CHECK FOR ONE LONG
.,FBCF D0 12    BNE $FBE3       BNE    WRTN1
.,FBD1 A9 10    LDA #$10        LDA    #16             ;WRITE A LONG BIT
.,FBD3 A2 01    LDX #$01        LDX    #1
.,FBD5 20 B1 FB JSR $FBB1       JSR    WRTX
.,FBD8 D0 2F    BNE $FC09       BNE    WRT3
.,FBDA E6 A8    INC $A8         INC    RER
.,FBDC A5 B6    LDA $B6         LDA    PRP             ;IF END OF BLOCK(BIT SET BY WRTL3)...
.,FBDE 10 29    BPL $FC09       BPL    WRT3            ;...NO END CONTINUE
.,FBE0 4C 57 FC JMP $FC57       JMP    WRNC            ;...END ...FINISH OFF
                                ;
.,FBE3 A5 A9    LDA $A9         WRTN1  LDA REZ         ;CHECK FOR A ONE BIT
.,FBE5 D0 09    BNE $FBF0       BNE    WRTN2
.,FBE7 20 AD FB JSR $FBAD       JSR    WRTW
.,FBEA D0 1D    BNE $FC09       BNE    WRT3
.,FBEC E6 A9    INC $A9         INC    REZ
.,FBEE D0 19    BNE $FC09       BNE    WRT3
                                ;
.,FBF0 20 A6 FB JSR $FBA6       WRTN2  JSR WRITE
.,FBF3 D0 14    BNE $FC09       BNE    WRT3            ;ON BIT LOW EXIT
.,FBF5 A5 A4    LDA $A4         LDA    FIRT            ;CHECK FOR FIRST OF DIPOLE
.,FBF7 49 01    EOR #$01        EOR    #1
.,FBF9 85 A4    STA $A4         STA    FIRT
.,FBFB F0 0F    BEQ $FC0C       BEQ    WRT2            ;DIPOLE DONE
.,FBFD A5 BD    LDA $BD         LDA    OCHAR           ;FLIPS BIT FOR COMPLEMENTARY RIGHT
.,FBFF 49 01    EOR #$01        EOR    #1
.,FC01 85 BD    STA $BD         STA    OCHAR
.,FC03 29 01    AND #$01        AND    #1              ;TOGGLE PARITY
.,FC05 45 9B    EOR $9B         EOR    PRTY
.,FC07 85 9B    STA $9B         STA    PRTY
.,FC09 4C BC FE JMP $FEBC       WRT3   JMP PREND       ;RESTORE REGS AND RTI EXIT
```

## References
- "cassette_write_toggle_and_timer_setup" — expands on WRITE/WRTX/WRTW pulse generation and timer setup
- "byte_finish_parity_and_header_character_output" — expands on per-bit advancement, parity and header output

## Labels
- WRTL3
- WRTN
- PRP
- RER
- REZ
- FIRT
- OCHAR
- PRTY
