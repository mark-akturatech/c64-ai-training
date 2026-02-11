# KERNAL MAIN IRQ Entry (CINV via $FF48) — EA31..EA86

**Summary:** IRQ entry at $FF48 -> CINV ($0314) that calls the realtime-clock updater (JSR $FFEA -> UDTIM), handles cursor blinking (BLNSW $00CC, BLNCT $00CD, BLNON $00CF), toggles/inverts the character under the cursor (EOR #$80, stored via $00CE), synchronises colour pointer and GDCOL ($0287/$0286), prints the cursor glyph (JSR $EA1C), processes processor port flags in $01 (STOP key handling), calls the keyboard scanner (JSR $EA87), clears CIA#1 interrupt control (read $DC0D), and restores registers before RTI.

## Main flow and behavior
This routine is the KERNAL's primary IRQ handler invoked via the IRQ vector at $FF48 and continuing to the CINV vector. Execution flow:

- Update realtime clock: JSR $FFEA (UDTIM).
- Check cursor enable flag BLNSW at $00CC; if zero, skip blink processing.
- Decrement blink counter BLNCT at $00CD; when it reaches zero, reload BLNCT with #$14 (blink speed), handle BLNON (byte at $00CF) to toggle blink state, and update the character under the cursor:
  - LDY $D3 loads PNTR (cursor column index).
  - LDA ($D1),Y fetches the screen character under the cursor (screen pointer at $D1).
  - Temporarily store the character in $00CE.
  - JSR $EA24 to synchronise the colour pointer (internal routine).
  - LDA ($F3),Y fetches the colour byte for that character (colour map pointer at $F3) and STA $0287 to update GDCOL (background colour under cursor).
  - LDX $0286 loads current COLOR.
  - LDA $00CE and EOR #$80 toggles/inverts the character (flip bit 7) to create the blinking cursor glyph.
  - JSR $EA1C prints the modified character via the KERNAL printing/display routine.
- Handle processor port ($01) flags (STOP key):
  - Test $01 & #$10; if set, clear Y/C0 state accordingly and set/clear bits in $01 (AND/ORA/AND #$1F) to reflect STOP behavior.
  - Store modified $01 back to $01.
- Call keyboard scanner: JSR $EA87 (SCNKEY entry).
- Clear/acknowledge CIA#1 interrupt by reading $DC0D (CIA#1 ICR).
- Restore A/X/Y from stack (PLA/TAY/PLA/TAX/PLA) and RTI.

All addresses in the listing are absolute KERNAL/zero-page uses as annotated in the code comments.

## Source Code
```asm
.,EA31 20 EA FF JSR $FFEA       update realtime clock, routine UDTIM
.,EA34 A5 CC    LDA $CC         read BLNSW to see if cursor is enabled
.,EA36 D0 29    BNE $EA61       nope
.,EA38 C6 CD    DEC $CD         read BLNCT
.,EA3A D0 25    BNE $EA61       if zero, toggle cursor - else jump
.,EA3C A9 14    LDA #$14        blink speed
.,EA3E 85 CD    STA $CD         restore BLCNT
.,EA40 A4 D3    LDY $D3         get PNTR, cursor column
.,EA42 46 CF    LSR $CF         BLNON, flag last cursor blink on/off
.,EA44 AE 87 02 LDX $0287       get background colour under cursor, GDCOL
.,EA47 B1 D1    LDA ($D1),Y     get screen character
.,EA49 B0 11    BCS $EA5C       ?
.,EA4B E6 CF    INC $CF         increment BLNON
.,EA4D 85 CE    STA $CE         temporary store character under cursor
.,EA4F 20 24 EA JSR $EA24       synchronise colour pointer
.,EA52 B1 F3    LDA ($F3),Y     get colour under character
.,EA54 8D 87 02 STA $0287       store in GDCOL
.,EA57 AE 86 02 LDX $0286       get current COLOR
.,EA5A A5 CE    LDA $CE         retrieve character under cursor
.,EA5C 49 80    EOR #$80        toggle cursor by inverting character
.,EA5E 20 1C EA JSR $EA1C       print to screen by using part of 'print to screen'
.,EA61 A5 01    LDA $01
.,EA63 29 10    AND #$10
.,EA65 F0 0A    BEQ $EA71
.,EA67 A0 00    LDY #$00
.,EA69 84 C0    STY $C0
.,EA6B A5 01    LDA $01
.,EA6D 09 20    ORA #$20
.,EA6F D0 08    BNE $EA79
.,EA71 A5 C0    LDA $C0
.,EA73 D0 06    BNE $EA7B
.,EA75 A5 01    LDA $01
.,EA77 29 1F    AND #$1F
.,EA79 85 01    STA $01
.,EA7B 20 87 EA JSR $EA87       scan keyboard
.,EA7E AD 0D DC LDA $DC0D       clear CIA#1 I.C.R to enable next IRQ
.,EA81 68       PLA             restore (Y), (X), (A)
.,EA82 A8       TAY
.,EA83 68       PLA
.,EA84 AA       TAX
.,EA85 68       PLA
.,EA86 40       RTI             back to normal
```

## Key Registers
- $FF48 - KERNAL vector entry for IRQ -> main IRQ/CINV entry
- $FFEA - KERNAL routine UDTIM (realtime-clock updater) called from IRQ
- $01 - Processor port (data direction/bank select / STOP-key & lines)
- $00CC - BLNSW - cursor enable flag (zero = disabled)
- $00CD - BLNCT - blink counter (decremented each IRQ)
- $00CE - temporary storage: character under cursor (used for toggling)
- $00CF - BLNON - blink-on/off state (rotated/updated each blink)
- $00C0 - temporary storage used during $01 STOP handling (C0)
- $D3 - PNTR (cursor column, used as Y index)
- $D1 - screen pointer (indirect Y addressing for screen characters)
- $F3 - colour pointer (indirect Y addressing for colour bytes)
- $0287 - GDCOL (stored background colour under cursor)
- $0286 - COLOR (current colour)
- $DC0D - CIA#1 ICR (read here to clear/acknowledge IRQ)

## References
- "scnkey_keyboard_scan" — expands on keyboard scanning entry point called by MAIN IRQ
- "process_key_image_decode_and_buffer" — expands on processing of key once SCNKEY found a key

## Labels
- CINV
- UDTIM
- SCNKEY
- BLNSW
- BLNCT
- BLNON
