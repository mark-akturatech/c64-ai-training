# NLOAD (KERNAL ROM) — store VERIFY flag and validate device number

**Summary:** Stores the verify flag (VERCK $93) and clears STATUS ($90), then reads the device number from zero page $BA (FA) and validates it (disallowing device #0 and #3). Branches to error handlers for invalid device numbers and to the tape-load path when the compare indicates a device number less than #$03.

## Description
This KERNAL entry sequence (labelled NLOAD in the disassembly) performs initial bookkeeping for a load request and validates the device number held in zero page $BA (symbol FA in the disassembly):

- STA $93 (VERCK) — save the current accumulator (verify flag) to zero page location $93.
- LDA #$00; STA $90 (STATUS) — clear the STATUS byte.
- LDA $BA (FA) — fetch the device number to test.
- BNE $F4B2 — if device number is non-zero continue; if zero branch to error handler at $F713 (labelled ERROR9 / LD10) which treats device #0 (keyboard) as an invalid target for LOAD.
- CMP #$03 — compare device number with 3.
- BEQ $F4AF — if device number equals 3 branch back to $F4AF (ERROR9 / LD10), disallowing screen loads (device #3).
- BCC $F533 — if device < 3 (carry clear after CMP #$03) branch to $F533. The disassembly comment indicates tapes are handled differently; this branch selects the alternative tape load logic for device numbers below 3 (after excluding 0 and 3).

Control-flow labels referenced in the snippet:
- LD10 / ERROR9 ($F713) — handler for device #0 (keyboard) and for device #3 (screen) as invalid load targets.
- LD20 (falls through from the BNE target) — compares against #$03.
- LD100 ($F533) — tape-load dispatch path when device number is less than 3 (and not zero).

**[Note: Source may contain an error — the earlier human summary stated "carry set" selects tape device handling, but the code uses BCC (branch if carry clear) so tape-path selection actually occurs when the compare sets carry clear (device < #$03).]**

## Source Code
```asm
                                ;
.,F4A5 85 93    STA $93         NLOAD  STA VERCK       ;STORE VERIFY FLAG
.,F4A7 A9 00    LDA #$00        LDA    #0
.,F4A9 85 90    STA $90         STA    STATUS
                                ;
.,F4AB A5 BA    LDA $BA         LDA    FA              ;CHECK DEVICE NUMBER
.,F4AD D0 03    BNE $F4B2       BNE    LD20
                                ;
.,F4AF 4C 13 F7 JMP $F713       LD10   JMP ERROR9      ;BAD DEVICE #-KEYBOARD
                                ;
.,F4B2 C9 03    CMP #$03        LD20   CMP #3
.,F4B4 F0 F9    BEQ $F4AF       BEQ    LD10            ;DISALLOW SCREEN LOAD
.,F4B6 90 7B    BCC $F533       BCC    LD100           ;HANDLE TAPES DIFFERENT
```

## Key Registers
- $BA - Zero Page - FA (device number used by LOAD)
- $90 - Zero Page - STATUS ( cleared by this sequence )
- $93 - Zero Page - VERCK (verify flag saved here)

## References
- "load_header_and_entry_points" — expands on Initial entry points and monitor-load alt-start handling
- "ieee_load_sequence" — expands on If device is not tape, proceed to IEEE device load sequence
- "tape_load_dispatch" — expands on If device indicates tape, branch to tape load logic

## Labels
- NLOAD
- LD10
- LD20
- VERCK
- STATUS
- FA
