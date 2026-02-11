# KERNAL READ IRQ: Timer2 Delta, Reload, Noise Rejection, and Bit Classification (cassette read)

**Summary:** Disassembly of the KERNAL READ interrupt entry handling timer2 ($DC06/$DC07) delta computation, reload of timer2, enabling timer ($DC0F), clearing interrupt ($DC0D), minimum-pulse noise rejection (CMP0/TEMP), and branching into DSPW/RADJ/RDBK bit-processing paths. Includes pulse normalization, dipole flip, REZ adjustment and SVXT accumulation logic.

## Behavior and algorithm (step-by-step)
- Read CIA timer2 high byte ($DC07) into X and compute the elapsed count since the last interrupt by subtracting the previous low byte ($DC06) from A (using Y=$FF and SBC). If the high byte changed during the subtraction (rollover), recompute (loop BNE back to start).
- Store the computed high byte (LDX -> $B1 = TEMP) and then reload timer2 by writing Y (#$FF) into D1T2L/D1T2H ($DC06/$DC07). This effectively restarts timer2 (countdown from $FFFF).
- Enable the timer by writing #$19 to D1CRB ($DC0F).
- Clear the read interrupt flag by loading D1ICR ($DC0D) and storing it into zero-page $02A3 (KIKA26) for later use.
- Compute a combined timing value: subtract TEMP ($B1) from A, store result back into TEMP, then transfer two low bits from the high byte into TEMP by successive LSR (A) and ROR (TEMP) operations — this moves two bits from the computed high into the TEMP byte.
- Compute minimum pulse threshold: load CMP0 ($B0), add #$3C, then compare the result with TEMP ($B1). If TEMP >= CMP0+#$3C (BCS), the pulse is considered noise and execution branches to RDBK (ignore).
- Branch decision based on DPSW ($9C): if zero, continue read-bit processing (RJDJ); if non-zero, jump to RADJ (finish current byte).
- Load PCNTR ($A3). If negative (BMI), go to JRAD2 (finish/ending). Otherwise proceed to classify the incoming pulse:
  - Start with LDX #$00 (assume bit value zero). Use a series of ADCs with constants (#$30, #$26, #$2C) and addition of CMP0 ($B0) to position the sampling point relative to pulse lengths.
  - Compare TEMP ($B1) with computed thresholds to decide between SHORT (RADX2), ONE (RADL), LONGLONG (JRAD2), or ERROR (SRER).
  - On ERROR path (SRER), check SNSW1 ($B4) and possibly set RER ($A8) if synchronized, otherwise ignore (RDBK).
  - On SHORT: increment REZ ($A9); on ONE: decrement REZ ($A9). After adjusting REZ, compute an adjustment for SVXT ($92): subtract #$13, SBC TEMP ($B1), ADC SVXT ($92), then store back to SVXT.
- Flip the dipole flag FIRT ($A4) via EOR #$01 and store it. If this was the second half of the dipole (BEQ RAD3), branch accordingly; otherwise store current bit into DATA ($D7).
- Flow control uses many small branches to route into RADJ/RAD2/RADX2/etc. The listing handles both bit timing discrimination and servo/soft-adjust accumulation (SVXT) for later use.

## Source Code
```asm
.,F92C AE 07 DC LDX $DC07       READ   LDX D1T2H       ;GET TIME SINCE LAST INTERRUPT
.,F92F A0 FF    LDY #$FF        LDY    #$FF            ;COMPUTE COUNTER DIFFERENCE
.,F931 98       TYA             TYA
.,F932 ED 06 DC SBC $DC06       SBC    D1T2L
.,F935 EC 07 DC CPX $DC07       CPX    D1T2H           ;CHECK FOR TIMER HIGH ROLLOVER...
.,F938 D0 F2    BNE $F92C       BNE    READ            ;...YES THEN RECOMPUTE
.,F93A 86 B1    STX $B1         STX    TEMP
.,F93C AA       TAX             TAX
.,F93D 8C 06 DC STY $DC06       STY    D1T2L           ;RELOAD TIMER2 (COUNT DOWN FROM $FFFF)
.,F940 8C 07 DC STY $DC07       STY    D1T2H
.,F943 A9 19    LDA #$19        LDA    #$19            ;ENABLE TIMER
.,F945 8D 0F DC STA $DC0F       STA    D1CRB
.,F948 AD 0D DC LDA $DC0D       LDA    D1ICR           ;CLEAR READ INTERRUPT
.,F94B 8D A3 02 STA $02A3       STA    KIKA26          ;SAVE FOR LATTER
.,F94E 98       TYA             TYA
.,F94F E5 B1    SBC $B1         SBC    TEMP            ;CALCULATE HIGH
.,F951 86 B1    STX $B1         STX    TEMP
.,F953 4A       LSR             LSR    A               ;MOVE TWO BITS FROM HIGH TO TEMP
.,F954 66 B1    ROR $B1         ROR    TEMP
.,F956 4A       LSR             LSR    A
.,F957 66 B1    ROR $B1         ROR    TEMP
.,F959 A5 B0    LDA $B0         LDA    CMP0            ;CALC MIN PULSE VALUE
.,F95B 18       CLC             CLC
.,F95C 69 3C    ADC #$3C        ADC    #60
.,F95E C5 B1    CMP $B1         CMP    TEMP            ;IF PULSE LESS THAN MIN...
.,F960 B0 4A    BCS $F9AC       BCS    RDBK            ;...THEN IGNORE AS NOISE
.,F962 A6 9C    LDX $9C         LDX    DPSW            ;CHECK IF LAST BIT...
.,F964 F0 03    BEQ $F969       BEQ    RJDJ            ;...NO THEN CONTINUE
.,F966 4C 60 FA JMP $FA60       JMP    RADJ            ;...YES THEN GO FINISH BYTE
.,F969 A6 A3    LDX $A3         RJDJ   LDX PCNTR       ;IF 9 BITS READ...
.,F96B 30 1B    BMI $F988       BMI    JRAD2           ;... THEN GOTO ENDING
.,F96D A2 00    LDX #$00        LDX    #0              ;SET BIT VALUE TO ZERO
.,F96F 69 30    ADC #$30        ADC    #48             ;ADD UP TO HALF WAY BETWEEN...
.,F971 65 B0    ADC $B0         ADC    CMP0            ;...SHORT PULSE AND SYNC PULSE
.,F973 C5 B1    CMP $B1         CMP    TEMP            ;CHECK FOR SHORT...
.,F975 B0 1C    BCS $F993       BCS    RADX2           ;...YES IT'S A SHORT
.,F977 E8       INX             INX                    ;SET BIT VALUE TO ONE
.,F978 69 26    ADC #$26        ADC    #38             ;MOVE TO MIDDLE OF HIGH
.,F97A 65 B0    ADC $B0         ADC    CMP0
.,F97C C5 B1    CMP $B1         CMP    TEMP            ;CHECK FOR ONE...
.,F97E B0 17    BCS $F997       BCS    RADL            ;...YES IT'S A ONE
.,F980 69 2C    ADC #$2C        ADC    #44             ;MOVE TO LONGLONG
.,F982 65 B0    ADC $B0         ADC    CMP0
.,F984 C5 B1    CMP $B1         CMP    TEMP            ;CHECK FOR LONGLONG...
.,F986 90 03    BCC $F98B       BCC    SRER            ;...GREATER THAN IS ERROR
.,F988 4C 10 FA JMP $FA10       JRAD2  JMP RAD2        ;...IT'S A LONGLONG
.,F98B A5 B4    LDA $B4         SRER   LDA SNSW1       ;IF NOT SYNCRONIZED...
.,F98D F0 1D    BEQ $F9AC       BEQ    RDBK            ;...THEN NO ERROR
.,F98F 85 A8    STA $A8         STA    RER             ;...ELSE FLAG RER
.,F991 D0 19    BNE $F9AC       BNE    RDBK            ;JMP
.,F993 E6 A9    INC $A9         RADX2  INC REZ         ;COUNT REZ UP ON ZEROS
.,F995 B0 02    BCS $F999       BCS    RAD5            ;JMP
.,F997 C6 A9    DEC $A9         RADL   DEC REZ         ;COUNT REZ DOWN ON ONES
.,F999 38       SEC             RAD5   SEC             ;CALC ACTUAL VALUE FOR COMPARE STORE
.,F99A E9 13    SBC #$13        SBC    #19
.,F99C E5 B1    SBC $B1         SBC    TEMP            ;SUBTRACT INPUT VALUE FROM CONSTANT...
.,F99E 65 92    ADC $92         ADC    SVXT            ;...ADD DIFFERENCE TO TEMP STORAGE...
.,F9A0 85 92    STA $92         STA    SVXT            ;...USED LATER TO ADJUST SOFT SERVO
.,F9A2 A5 A4    LDA $A4         LDA    FIRT            ;FLIP DIPOLE FLAG
.,F9A4 49 01    EOR #$01        EOR    #1
.,F9A6 85 A4    STA $A4         STA    FIRT
.,F9A8 F0 2B    BEQ $F9D5       BEQ    RAD3            ;SECOND HALF OF DIPOLE
.,F9AA 86 D7    STX $D7         STX    DATA            ;FIRST HALF SO STORE ITS VALUE
```

## Key Registers
- $DC00-$DC0F - CIA1 - Timer/Control/ICR range (used here for D1T2L $DC06, D1T2H $DC07, D1ICR $DC0D, D1CRB $DC0F)
- $02A3 - Zero Page - KIKA26 (stores D1ICR snapshot)
- $B0 - Zero Page - CMP0 (comparison baseline for pulse thresholds)
- $B1 - Zero Page - TEMP (computed timing high/merged bits)
- $9C - Zero Page - DPSW (decision flag if last bit)
- $A3 - Zero Page - PCNTR (bit/position counter)
- $B4 - Zero Page - SNSW1 (synchronization status)
- $A8 - Zero Page - RER (read error flag)
- $A9 - Zero Page - REZ (rezero/zero-count accumulator)
- $92 - Zero Page - SVXT (soft-servo adjustment accumulator)
- $A4 - Zero Page - FIRT (dipole/phase flag)
- $D7 - Zero Page - DATA (stores decoded bit)

## References
- "variables_used_in_cassette_read" — expands on TEMP, CMP0, KIKA26, DPSW and other variables used
- "first_half_detection_and_bit_handling" — expands on branches into bit/half-dipole handling when pulse passes noise checks

## Labels
- CMP0
- TEMP
- DPSW
- PCNTR
- SVXT
- REZ
- FIRT
- DATA
