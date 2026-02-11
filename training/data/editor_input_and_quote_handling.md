# KERNAL: Editor input/display character handling (ROM $E64C-$E6B5)

**Summary:** Describes the KERNAL editor/display path that reads characters from the screen/input buffer (PNTR/$00D3), updates quote state (QTSW/$00D4) via the QTSWC handler ($E684), applies display attribute OR masks (ORA #$40, ORA #$80), handles insertion/colouring (INSRT/$00D8, RVS/$00C7, color load $0286), and special <PI> (0xDE) end-of-line handling.

## Behavior and flow
- Entry/loop region ($E64C onward) inspects the quote-switch flag QTSW (zero-page $00D4). If QTSW is non-zero the code branches to the display/loop path; otherwise it continues and may set display attribute bits.
- ORA #$40 is used in two places (at $E652 and $E691) to set the high-6th-bit attribute prior to display; ORA #$80 is conditionally OR'ed at $E697 when the reverse/colour flag (RVS/$00C7) is set, producing multicolour/attribute behaviour.
- PNTR (zero-page $00D3) is incremented at $E654 (INC $00D3) to advance the input/screen pointer after a character is consumed.
- After incrementing PNTR the routine calls QTSWC ($E684) via JSR $E684. QTSWC compares the current character to ASCII quote (0x22) and toggles QTSW:
  - QTSWC: CMP #$22; if equal, read QTSW ($00D4), EOR #$01, STA $00D4 — toggles the quote state and returns with the character set to '"' (LDA #$22 before return).
  - The branch path in QTSWC returns quickly if character is not a quote.
- The code checks an index variable at $00C8 (label INDX) and branches if not equal (CPY $00C8 / BNE $E674) — this gates a subset of end-of-line/CR handling.
- Carriage return / end-of-line handling:
  - When the CLP1/CLP2 logic is taken the routine clears/sets CRSW ($00D0) and loads ASCII $0D into DATA ($00D7) for printing/processing (LDA #$0D / STA $00D7).
  - There are checks that look at $0099/$009A (DFLTN/DFLTO) to determine whether the current source is the screen (CPX #$03) and route to print routine PRT ($E716) accordingly.
- Special <PI> handling:
  - After pulling stacked registers and restoring X/Y (PLA/TAX/PLA/TAY), the routine loads DATA ($00D7) and compares to $DE (CMP #$DE). If equal (DATA == $DE, the <PI> marker), it loads A with #$FF (LDA #$FF) before continuing; otherwise it clears carry (CLC) and returns.
- Insertion and colour handling:
  - The insertion counter INSRT ($00D8) and reverse/colour flag RVS ($00C7) control ORA #$80 and DEC/LDX operations:
    - If RVS ($00C7) is non-zero, ORA #$80 is applied to set the multicolour/attribute bit.
    - If INSRT ($00D8) is non-zero it may be DEC'ed (DEC $00D8) and used to determine whether to load a colour value from memory ($0286) into X (LDX $0286).
  - DSPP ($EA13) is called to perform the actual display/put-character operation; WLOGIC ($E6B6) is called after to check wraparound.
- Stack/frame and return:
  - After display/insert logic the routine restores registers (PLA/TAY/PLA/TAX/PLA) and clears carry/interrupt flags (CLC / CLI) before RTS ($E6B5).
- Notes on apparent discrepancy:
  - The accompanying description mentions masking with AND #$3F (to strip attribute bits), but that instruction is not present in the supplied listing fragment. **[Note: Source may contain an error — AND #$3F is referenced in description but not visible in this listing.]**

## Source Code
```asm
.,E64C A6 D4    LDX $D4         LDX    QTSW
.,E64E D0 04    BNE $E654       BNE    LOP53
.,E650 70 02    BVS $E654       LOP52  BVS LOP53
.,E652 09 40    ORA #$40        ORA    #$40
.,E654 E6 D3    INC $D3         LOP53  INC PNTR
.,E656 20 84 E6 JSR $E684       JSR    QTSWC
.,E659 C4 C8    CPY $C8         CPY    INDX
.,E65B D0 17    BNE $E674       BNE    CLP1
.,E65D A9 00    LDA #$00        CLP2   LDA #0
.,E65F 85 D0    STA $D0         STA    CRSW
.,E661 A9 0D    LDA #$0D        LDA    #$D
.,E663 A6 99    LDX $99         LDX    DFLTN           ;FIX GETS FROM SCREEN
.,E665 E0 03    CPX #$03        CPX    #3              ;IS IT THE SCREEN?
.,E667 F0 06    BEQ $E66F       BEQ    CLP2A
.,E669 A6 9A    LDX $9A         LDX    DFLTO
.,E66B E0 03    CPX #$03        CPX    #3
.,E66D F0 03    BEQ $E672       BEQ    CLP21
.,E66F 20 16 E7 JSR $E716       CLP2A  JSR PRT
.,E672 A9 0D    LDA #$0D        CLP21  LDA #$D
.,E674 85 D7    STA $D7         CLP1   STA DATA
.,E676 68       PLA             PLA
.,E677 AA       TAX             TAX
.,E678 68       PLA             PLA
.,E679 A8       TAY             TAY
.,E67A A5 D7    LDA $D7         LDA    DATA
.,E67C C9 DE    CMP #$DE        CMP    #$DE            ;IS IT <PI> ?
.,E67E D0 02    BNE $E682       BNE    CLP7
.,E680 A9 FF    LDA #$FF        LDA    #$FF
.,E682 18       CLC             CLP7   CLC
.,E683 60       RTS             RTS
.,E684 C9 22    CMP #$22        QTSWC  CMP #$22
.,E686 D0 08    BNE $E690       BNE    QTSWL
.,E688 A5 D4    LDA $D4         LDA    QTSW
.,E68A 49 01    EOR #$01        EOR    #$1
.,E68C 85 D4    STA $D4         STA    QTSW
.,E68E A9 22    LDA #$22        LDA    #$22
.,E690 60       RTS             QTSWL  RTS
.,E691 09 40    ORA #$40        NXT33  ORA #$40
.,E693 A6 C7    LDX $C7         NXT3   LDX RVS
.,E695 F0 02    BEQ $E699       BEQ    NVS
.,E697 09 80    ORA #$80        NC3    ORA #$80
.,E699 A6 D8    LDX $D8         NVS    LDX INSRT
.,E69B F0 02    BEQ $E69F       BEQ    NVS1
.,E69D C6 D8    DEC $D8         DEC    INSRT
.,E69F AE 86 02 LDX $0286       NVS1   LDX COLOR PUT COLOR ON SCREEN
.,E6A2 20 13 EA JSR $EA13       JSR    DSPP
.,E6A5 20 B6 E6 JSR $E6B6              JSR WLOGIC      ;CHECK FOR WRAPAROUND
.,E6A8 68       PLA             LOOP2  PLA
.,E6A9 A8       TAY             TAY
.,E6AA A5 D8    LDA $D8         LDA    INSRT
.,E6AC F0 02    BEQ $E6B0       BEQ    LOP2
.,E6AE 46 D4    LSR $D4         LSR    QTSW
.,E6B0 68       PLA             LOP2   PLA
.,E6B1 AA       TAX             TAX
.,E6B2 68       PLA             PLA
.,E6B3 18       CLC             CLC                    ;GOOD RETURN
.,E6B4 58       CLI             CLI
.,E6B5 60       RTS             RTS
```

## Key Registers
- $00D3 - KERNAL variable - PNTR (input/screen pointer), incremented after consuming a character
- $00D4 - KERNAL variable - QTSW (quote switch flag), toggled by QTSWC ($E684)
- $00D0 - KERNAL variable - CRSW (carriage-return switch)
- $00D7 - KERNAL variable - DATA (character/data byte placed for printing)
- $00C8 - KERNAL variable - INDX (index used in CPY/branch gating)
- $0099 - KERNAL variable - DFLTN (default-from-screen flag used in CLP logic)
- $009A - KERNAL variable - DFLTO (other default flag used in CLP logic)
- $00C7 - KERNAL variable - RVS (reverse/colour flag)
- $00D8 - KERNAL variable - INSRT (insert counter/flag)
- $0286 - RAM - colour value source used when loading colour into X (LDX $0286)

## References
- "editor_main_loop_and_print_entry" — continues the print/input processing path
- "qtsw_toggle" — QTSWC handler for quote switching (referenced)

## Labels
- PNTR
- QTSW
- CRSW
- DATA
- INDX
- DFLTN
- RVS
- INSRT
