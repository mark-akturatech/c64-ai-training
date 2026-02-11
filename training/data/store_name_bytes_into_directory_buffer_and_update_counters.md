# KERNAL: Copy parsed filename bytes into directory buffer and update counters ($FAC0–$FB05)

**Summary:** Calls KERNAL device routine $FCD1 to check device ACK, uses $A7 as a length/index counter, compares parsed filename bytes via indirect ($AC),Y against the current directory buffer pointer, sets $B6 if a modification is required, and when modification is needed copies $AD/$AC into $0101+X and $0100+X while updating $9E and jumping to the next stage ($FB3A).

## Operation
- Entry at $FAC0: test zero-page flag $B5. If $B5 = 0 branch to $FACE; otherwise load A=#$04 and JSR $FE1C (determine write parameters), clear A, then jump to $FB4A (exit/next stage).
- $FACE: JSR $FCD1 (device routine); if carry clear (BCC) control continues, otherwise jump to $FB48 (device NAK/exit).
- $FAD6: load X from zero-page $A7, decrement X and if result = 0 branch to $FB08 (end/skip loop). This treats $A7 as a length/index counter (decrement before use).
- $FADB–$FAEB: if zero-page $93 = 0 branch to $FAEB (skip compare). Otherwise:
  - Y := #$00
  - A := $BD
  - Compare A with memory pointed by ($AC),Y (CMP ($AC),Y). If equal branch to $FAEB (no change for this byte).
  - If not equal, set $B6 := 1 (mark modification required).
- $FAEB: load $B6 and BEQ $FB3A — if $B6 = 0 then jump to $FB3A (no modification required; proceed to next processing stage).
- When modification required ($B6 ≠ 0):
  - LDX #$3D
  - Compare X with $9E (CPX $9E). If X < $9E (BCC) branch to $FB33 (skip write loop).
  - Otherwise load X from $9E and perform the write loop:
    - LDA $AD ; STA $0101,X  (store AD at $0101+X)
    - LDA $AC ; STA $0100,X  (store AC at $0100+X)
    - INX ; INX
    - STX $9E             (store updated X back to $9E)
  - Finally JMP $FB3A to continue to next processing stage.
- Summary of roles for main zero-page variables used:
  - $A7: loop/length counter (DEcremented before byte processing)
  - ($AC),Y: source pointer to parsed filename bytes compared against $BD
  - $AD/$AC: two-byte pair copied into buffer at $0101+X / $0100+X
  - $9E: stores current X index into the directory buffer area
  - $B6: modification flag (set when a byte differs)
  - $B5/$93/$BD: flags/values checked earlier in the flow

## Source Code
```asm
.,FAC0 A5 B5    LDA $B5
.,FAC2 F0 0A    BEQ $FACE
.,FAC4 A9 04    LDA #$04
.,FAC6 20 1C FE JSR $FE1C
.,FAC9 A9 00    LDA #$00
.,FACB 4C 4A FB JMP $FB4A
.,FACE 20 D1 FC JSR $FCD1
.,FAD1 90 03    BCC $FAD6
.,FAD3 4C 48 FB JMP $FB48
.,FAD6 A6 A7    LDX $A7
.,FAD8 CA       DEX
.,FAD9 F0 2D    BEQ $FB08
.,FADB A5 93    LDA $93
.,FADD F0 0C    BEQ $FAEB
.,FADF A0 00    LDY #$00
.,FAE1 A5 BD    LDA $BD
.,FAE3 D1 AC    CMP ($AC),Y
.,FAE5 F0 04    BEQ $FAEB
.,FAE7 A9 01    LDA #$01
.,FAE9 85 B6    STA $B6
.,FAEB A5 B6    LDA $B6
.,FAED F0 4B    BEQ $FB3A
.,FAEF A2 3D    LDX #$3D
.,FAF1 E4 9E    CPX $9E
.,FAF3 90 3E    BCC $FB33
.,FAF5 A6 9E    LDX $9E
.,FAF7 A5 AD    LDA $AD
.,FAF9 9D 01 01 STA $0101,X
.,FAFC A5 AC    LDA $AC
.,FAFE 9D 00 01 STA $0100,X
.,FB01 E8       INX
.,FB02 E8       INX
.,FB03 86 9E    STX $9E
.,FB05 4C 3A FB JMP $FB3A
```

## Key Registers
- $00B5 - zero page - flag tested at routine entry
- $00A7 - zero page - length/index counter (loaded to X then DEX)
- $0093 - zero page - conditional flag checked before compare
- $00AC - zero page - pointer (indirect base) used with Y: CMP ($AC),Y
- $00AD - zero page - byte copied to $0101+X
- $00B6 - zero page - modification flag (set to 1 when byte differs)
- $009E - zero page - stored X index into the directory buffer
- $00BD - zero page - byte compared against ($AC),Y
- $0100-$0101 - RAM - directory buffer base; writes performed to $0100+X and $0101+X
- $FCD1 - KERNAL - device talk/check routine (JSR $FCD1 called to check device ACK)
- $FE1C - KERNAL - write-parameter routine (JSR $FE1C called earlier)
- $FB3A - KERNAL - continuation/next processing stage (JMP target)
- $FB4A - KERNAL - exit/next stage (JMP target)
- $FB48 - KERNAL - error/NAK exit (JMP target)
- $FB33 - local branch target (skip write loop)
- $FB08 - local branch target (exit/skip loop)

## References
- "determine_write_parameters_and_call_device_routine" — expands on uses the write parameters ($A7,$AA,$AB) determined earlier
- "check_for_duplicate_entries_and_write_buffer_to_device" — expands on after copying bytes the routine proceeds to check for duplicates and write buffers to device

## Labels
- A7
- AC
- AD
- 9E
- B6
- B5
- 93
- BD
