# KERNAL: RD300 (restore pointers) and NEWCH (initialize new character) — $FB8E–$FBA5

**Summary:** Disassembly of two Commodore 64 KERNAL routines at $FB8E–$FBA5: RD300 restores starting address pointers (STAH->SAH, STAL->SAL) and returns (RTS); NEWCH initializes PCNTR (8 bits + parity), clears dipole counters (FIRT), error flag (RER), parity accumulator (PRTY) and zero count (REZ) and returns with A=0.

## Description
- RD300 (entry $FB8E)
  - Restores the starting-address pointer pair SAH/SAL from temporary storage STAH/STAL.
  - Implements: SAH ← STAH, SAL ← STAL, then RTS.
  - Uses zero page variables: STAH at $00C2, STAL at $00C1; destination SAH at $00AD, SAL at $00AC.

- NEWCH (entry $FB97)
  - Initializes the per-byte assembly/read state for the next character:
    - Sets PCNTR ← #$08 (configure for 8 data bits plus parity counting).
    - Clears dipole counter FIRT ← #$00.
    - Clears error flag RER ← #$00.
    - Clears parity accumulator PRTY ← #$00.
    - Clears zero-count REZ ← #$00.
  - Returns with A = 0.
  - Uses zero page variables: PCNTR $00A3, FIRT $00A4, RER $00A8, PRTY $009B, REZ $00A9.

(No control-flow or additional housekeeping is present in these small utilities beyond the loads/stores and RTS.)

## Source Code
```asm
.,FB8E A5 C2    LDA $C2         RD300  LDA STAH        ; RESTORE STARTING ADDRESS...
.,FB90 85 AD    STA $AD         STA    SAH             ;...POINTERS (SAH & SAL)
.,FB92 A5 C1    LDA $C1         LDA    STAL
.,FB94 85 AC    STA $AC         STA    SAL
.,FB96 60       RTS             RTS
.,FB97 A9 08    LDA #$08        NEWCH  LDA #8          ;SET UP FOR 8 BITS+PARITY
.,FB99 85 A3    STA $A3         STA    PCNTR
.,FB9B A9 00    LDA #$00        LDA    #0              ;INITILIZE...
.,FB9D 85 A4    STA $A4         STA    FIRT            ;..DIPOLE COUNTER
.,FB9F 85 A8    STA $A8         STA    RER             ;..ERROR FLAG
.,FBA1 85 9B    STA $9B         STA    PRTY            ;..PARITY BIT
.,FBA3 85 A9    STA $A9         STA    REZ             ;..ZERO COUNT
.,FBA5 60       RTS             RTS                    ;.A=0 ON RETURN
                                .END
```

## Key Registers
- $00C2 - Zero Page (KERNAL variable) - STAH (saved start address high)
- $00C1 - Zero Page (KERNAL variable) - STAL (saved start address low)
- $00AD - Zero Page (KERNAL variable) - SAH (start address high)
- $00AC - Zero Page (KERNAL variable) - SAL (start address low)
- $00A3 - Zero Page (KERNAL variable) - PCNTR (bit counter for new character)
- $00A4 - Zero Page (KERNAL variable) - FIRT (dipole/detection counter)
- $00A8 - Zero Page (KERNAL variable) - RER (error flag)
- $009B - Zero Page (KERNAL variable) - PRTY (parity accumulator/bit)
- $00A9 - Zero Page (KERNAL variable) - REZ (zero-count)

## References
- "load_sync_and_block_start_handling" — expands on RD300 usage to restore SAL/SAH when preparing to read block data
- "finish_byte_and_newchar_call" — expands on NEWCH being called by RADJ to initialize state for the next assembled byte

## Labels
- RD300
- NEWCH
- STAH
- STAL
- SAH
- SAL
- PCNTR
- PRTY
