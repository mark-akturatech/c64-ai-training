# RAD2 — LONGLONG handler (KERNAL ROM, .FA10-.FA5D)

**Summary:** Handler for "longlong" pulses in the KERNAL disk-bit decode path; checks block sync ($96 SYNO) and byte-sync ($B4 SNSW1), adjusts timeouts (TEMP $B1 / CMP0 $B0), sets the bit-throw-away flag (DPSW $9C), toggles CIA1 Timer1 interrupt control ($DC0D), saves DIFF ($B5) and assembled character (MYCH $BF -> OCHAR $BD), and combines error flags (RER $A8 / REZ $A9 -> PRP $B6).

## Description
This routine is invoked when a detected pulse may be a "longlong" (an extra-long pulse that can indicate end-of-byte, block sync, or an error). High-level flow:

- Test for block sync present (SYNO at $96). If no block sync, continue to RAD2Y path to check PCNTR.
- If SNSW1 ($B4) indicates no previous byte-sync, branch to RAD2X and adjust timeouts for a long-long pulse:
  - Shift TEMP ($B1) right (LSR), load #$93, subtract TEMP, add CMP0 ($B0), shift left the result and transfer to X, then call STT1 (JSR $F8E2). This sequence computes/sets a new timeout for the last bit.
  - INC $9C (DPSW) to mark that bits should be thrown away.
- If SNSW1 indicates byte-synchronized, skip to pass-character behavior (RADQ2).
- If not byte-synchronized but block-sync active (SYNO set):
  - Flag a read error by storing RER ($A8).
  - Clear SYNO ($96).
  - Set CIA1 Timer1 interrupt control ($DC0D) to $81 and set SNSW1 ($B4) to indicate byte sync established.
- Save SYNO into DIFF ($B5).
  - If SYNO was zero, skip clearing SNSW1 and timer changes and fall through to pass-character.
  - Otherwise (SYNO non-zero), clear SNSW1 ($B4) and write $01 to $DC0D (adjust Timer1 control).
- Pass assembled character:
  - Move MYCH ($BF) to OCHAR ($BD).
  - Combine RER ($A8) OR REZ ($A9) and save into PRP ($B6).
- Return by jumping to PREND (JMP $FEBC).

Behavioral and flag effects (as implemented by the code):
- DPSW ($9C) is incremented to indicate subsequent bits should be discarded.
- SYNO ($96) is used to detect block sync; DIFF ($B5) saves its status for later logic.
- SNSW1 ($B4) is used to indicate byte synchronization; code sets/clears it depending on sync presence.
- CIA1 $DC0D is written with $81 in one path and $01 in another to effect Timer1/interrupt behavior during the sync process.
- Errors are merged: RER and REZ are ORed and stored into PRP ($B6) before returning.

Branch targets in this excerpt:
- RADL (JMP $F997) — treat as a long read (not included here).
- STT1 (JSR $F8E2) — sets timeout for last bit (not included here).
- PREND (JMP $FEBC) — return to byte-handling continuation.

## Source Code
```asm
                                ; RAD2 - LONGLONG HANDLER (COULD BE A LONG ONE)
.,FA10 A5 96    LDA $96         RAD2   LDA SYNO        ;HAVE WE GOTTEN BLOCK SYNC...
.,FA12 F0 04    BEQ $FA18       BEQ    RAD2Y           ;...NO
.,FA14 A5 B4    LDA $B4         LDA    SNSW1           ;CHECK IF WE'VE HAD A REAL BYTE START...
.,FA16 F0 07    BEQ $FA1F       BEQ    RAD2X           ;...NO
.,FA18 A5 A3    LDA $A3         RAD2Y  LDA PCNTR       ;ARE WE AT END OF BYTE...
.,FA1A 30 03    BMI $FA1F       BMI    RAD2X           ;YES...GO ADJUST FOR LONGLONG
.,FA1C 4C 97 F9 JMP $F997       JMP    RADL            ;...NO SO TREAT IT AS A LONG ONE READ
.,FA1F 46 B1    LSR $B1         RAD2X  LSR TEMP        ;ADJUST TIMEOUT FOR...
.,FA21 A9 93    LDA #$93        LDA    #147            ;...LONGLONG PULSE VALUE
.,FA23 38       SEC             SEC
.,FA24 E5 B1    SBC $B1         SBC    TEMP
.,FA26 65 B0    ADC $B0         ADC    CMP0
.,FA28 0A       ASL             ASL    A
.,FA29 AA       TAX             TAX                    ;AND SET TIMEOUT FOR LAST BIT
.,FA2A 20 E2 F8 JSR $F8E2       JSR    STT1
.,FA2D E6 9C    INC $9C         INC    DPSW            ;SET BIT THROW AWAY FLAG
.,FA2F A5 B4    LDA $B4         LDA    SNSW1           ;IF BYTE SYNCRONIZED....
.,FA31 D0 11    BNE $FA44       BNE    RADQ2           ;...THEN SKIP TO PASS CHAR
.,FA33 A5 96    LDA $96         LDA    SYNO            ;THROWS OUT DATA UNTILL BLOCK SYNC...
.,FA35 F0 26    BEQ $FA5D       BEQ    RDBK2           ;...NO BLOCK SYNC
.,FA37 85 A8    STA $A8         STA    RER             ;FLAG DATA AS ERROR
.,FA39 A9 00    LDA #$00        LDA    #0              ;KILL 16 SYNC FLAG
.,FA3B 85 96    STA $96         STA    SYNO
.,FA3D A9 81    LDA #$81        LDA    #$81            ;SET UP FOR TIMER1 INTERRUPTS
.,FA3F 8D 0D DC STA $DC0D       STA    D1ICR
.,FA42 85 B4    STA $B4         STA    SNSW1           ;FLAG THAT WE HAVE BYTE SYNCRONIZED
                                ;
.,FA44 A5 96    LDA $96         RADQ2  LDA SYNO        ;SAVE SYNO STATUS
.,FA46 85 B5    STA $B5         STA    DIFF
.,FA48 F0 09    BEQ $FA53       BEQ    RADK            ;NO BLOCK SYNC, NO BYTE LOOKING
.,FA4A A9 00    LDA #$00        LDA    #0              ;TURN OFF BYTE SYNC SWITCH
.,FA4C 85 B4    STA $B4         STA    SNSW1
.,FA4E A9 01    LDA #$01        LDA    #$01            ;DISABLE TIMER1 INTERRUPTS
.,FA50 8D 0D DC STA $DC0D       STA    D1ICR
.,FA53 A5 BF    LDA $BF         RADK   LDA MYCH        ;PASS CHARACTER TO BYTE ROUTINE
.,FA55 85 BD    STA $BD         STA    OCHAR
.,FA57 A5 A8    LDA $A8         LDA    RER             ;COMBINE ERROR VALUES WITH ZERO COUNT...
.,FA59 05 A9    ORA $A9         ORA    REZ
.,FA5B 85 B6    STA $B6         STA    PRP             ;...AND SAVE IN PRP
.,FA5D 4C BC FE JMP $FEBC       RDBK2  JMP PREND       ;GO BACK AND GET LAST BYTE
```

## Key Registers
- $DC0D - CIA1 - Timer 1 interrupt control register (D1ICR). (This routine writes $81 in one path and $01 in another to change Timer1/interrupt behavior during byte/block sync handling.)

## References
- "first_half_detection_and_bit_handling" — expands on RAD2 invocation from bit-detection logic for longlong pulses
- "finish_byte_and_newchar_call" — expands on how RAD2 saves the assembled byte and error flags and returns via PREND

## Labels
- SYNO
- SNSW1
- TEMP
- CMP0
- DPSW
- DIFF
- MYCH
- OCHAR
