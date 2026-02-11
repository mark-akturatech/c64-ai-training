# KERNAL: Tape file address computation and block load (ROM $F56C–$F5A8)

**Summary:** Computes effective load address EA = STA + (TAPEA − TAPESTA) using multi-byte SBC/ADC, stores EAL/EAH ($AE/$AF) and sets STAL/STAH ($C1/$C2) from MEMUSS ($C3/$C4) as the start buffer, calls LODING ($F5D2) then TRD ($F84A) to perform the tape block load; final ROM byte ($F5A8) is reserved for TRD's carry result.

**Operation**
This KERNAL fragment handles tape block loads for both movable and fixed files by reading TAPEA / TAPESTA entries from a tape-header pointer and computing the offset between the file's tape address and the tape's start address, then adding that offset to the start buffer (MEMUSS) to form the effective load address (EA).

Step-by-step behaviour:

- Entry assumes an indirect zero-page pointer at $B2 that indexes into the tape-header fields (labelled TAPE1 in the original listing). The code uses LDA ($B2),Y to fetch header bytes.
- For fixed loads the code stores the two-byte buffer start address into MEMUSS ($C3/$C4):
  - LDY #$01; LDA ($B2),Y → STA $C3
  - INY; LDA ($B2),Y → STA $C4
  - A branch BCS $F57D is present; the comment notes the carry is set by prior CPX (outside this snippet) and controls flow.
  - A check LDA $B9; BNE returns to fixed-load path if SA ($B9) indicates a monitor load.
- To compute TAPEA − TAPESTA:
  - LDY #$03; LDA ($B2),Y loads TAPEA low byte
  - LDY #$01; SBC ($B2),Y subtracts TAPESTA low byte → result low in A
  - TAX transfers low result into X
  - LDY #$04; LDA ($B2),Y loads TAPEA high byte
  - LDY #$02; SBC ($B2),Y subtracts TAPESTA high byte → result high in A
  - TAY transfers high result into Y
  - The pair of SBCs leaves standard borrow in the carry/borrow flag for ADC later.
- EA = STA + (TAPEA − TAPESTA):
  - CLC; TXA; ADC $C3 (MEMUSS low) → store to EAL ($AE)
  - TYA; ADC $C4 (MEMUSS high) → store to EAH ($AF)
  - These ADCs add the computed offset (in X/A and Y/A) to MEMUSS to produce the final effective address.
- Set starting buffer (STA) for TRD:
  - LDA $C3 → STA $C1 (STAL)
  - LDA $C4 → STA $C2 (STAH)
- Announce and perform load:
  - JSR $F5D2 (LODING) — displays "Loading" message
  - JSR $F84A (TRD) — performs tape block load; TRD leaves a carry result which is stored in the following ROM byte
- ROM byte at $F5A8 (.BYTE $24) is reserved so TRD can return its carry in the low 8-bit return area; this byte is defined but not executed as code.

Notes and caveats:
- The BCS at $F577 depends on a carry set by an earlier CPX (not in this snippet); control flow to fixed vs movable load depends on external state.
- The indirect pointer ($B2) and zero-page variables used here (MEMUSS, STAL/STAH, EAL/EAH, SA) are KERNAL conventions; their addresses and roles are shown below.

## Source Code
```asm
.,F56C A0 01    LDY #$01        ; LD177  LDY #1          ;FIXED LOAD...
.,F56E B1 B2    LDA ($B2),Y     ; LDA    (TAPE1)Y        ;...THE ADDRESS IN THE...
.,F570 85 C3    STA $C3         ; STA    MEMUSS          ;...BUFFER IS THE START ADDRESS
.,F572 C8       INY             ; INY
.,F573 B1 B2    LDA ($B2),Y     ; LDA    (TAPE1)Y
.,F575 85 C4    STA $C4         ; STA    MEMUSS+1
.,F577 B0 04    BCS $F57D       ; BCS    LD179           ;JMP ..CARRY SET BY CPX'S
.,F579 A5 B9    LDA $B9         ; LD178  LDA SA          ;CHECK FOR MONITOR LOAD...
.,F57B D0 EF    BNE $F56C       ; BNE    LD177           ;...YES WE WANT FIXED TYPE
.,F57D A0 03    LDY #$03        ; LD179  LDY #3          ;TAPEA - TAPESTA
                                ;CARRY SET BY CPX'S
.,F57F B1 B2    LDA ($B2),Y     ; LDA    (TAPE1)Y
.,F581 A0 01    LDY #$01        ; LDY    #1
.,F583 F1 B2    SBC ($B2),Y     ; SBC    (TAPE1)Y
.,F585 AA       TAX             ; TAX                    ;LOW TO .X
.,F586 A0 04    LDY #$04        ; LDY    #4
.,F588 B1 B2    LDA ($B2),Y     ; LDA    (TAPE1)Y
.,F58A A0 02    LDY #$02        ; LDY    #2
.,F58C F1 B2    SBC ($B2),Y     ; SBC    (TAPE1)Y
.,F58E A8       TAY             ; TAY                    ;HIGH TO .Y
.,F58F 18       CLC             ; CLC                    ;EA = STA+(TAPEA-TAPESTA)
.,F590 8A       TXA             ; TXA
.,F591 65 C3    ADC $C3         ; ADC    MEMUSS
.,F593 85 AE    STA $AE         ; STA    EAL
.,F595 98       TYA             ; TYA
.,F596 65 C4    ADC $C4         ; ADC    MEMUSS+1
.,F598 85 AF    STA $AF         ; STA    EAH
.,F59A A5 C3    LDA $C3         ; LDA    MEMUSS          ;SET UP STARTING ADDRESS
.,F59C 85 C1    STA $C1         ; STA    STAL
.,F59E A5 C4    LDA $C4         ; LDA    MEMUSS+1
.,F5A0 85 C2    STA $C2         ; STA    STAH
.,F5A2 20 D2 F5 JSR $F5D2       ; JSR    LODING          ;TELL USER LOADING
.,F5A5 20 4A F8 JSR $F84A       ; JSR    TRD             ;DO TAPE BLOCK LOAD
.:F5A8 24       .BYTE $24       ; .BYT   $24             ;CARRY FROM TRD
```

## Key Registers
- $B2 - Zero page pointer (indirect pointer to tape-header fields / TAPE1)
- $B9 - Zero page flag SA (check for monitor/fixed load)
- $C3-$C4 - Zero page - MEMUSS (start buffer low/high)
- $C1-$C2 - Zero page - STAL/STAH (start address for TRD)
- $AE-$AF - Zero page - EAL/EAH (computed Effective Address low/high)
- $F5A8 - ROM byte reserved (.BYTE $24) — carry result from TRD

## References
- "tape_load_dispatch_and_file_search" — expands on using FAF/FAH to determine TAPEA/TAPESTA and file type
- "tape_finish_and_return" — expands on finalizing end address and returning after TRD completes
- "loading_verify_message" — expands on LODING message routine used before TRD

## Labels
- MEMUSS
- STAL
- STAH
- EAL
- EAH
- SA
