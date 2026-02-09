# BSIV — Table-driven IRQ vector changer (KERNAL)

**Summary:** Table-driven KERNAL subroutine that writes two bytes from a table ($FD93/$FD94 + X) into the IRQ vector at $0314/$0315 (CINV/CINV+1). Select .X = $08/$0A/$0C/$0E to choose different tape/keyboard handlers; uses absolute loads and stores then RTS.

## Description
BSIV is a compact KERNAL routine that replaces the runtime IRQ vector pair stored at $0314/$0315 (labels CINV/CINV+1 in the original source). It is table-driven: it loads two consecutive bytes from a table located at $FD93 and $FD94 (commented as BSIT-8 and BSIT+1-8) indexed by X, then stores those bytes into the two vector bytes.

Usage:
- The caller sets X to select which table entry to use. The documented selector values are:
  - .X = $08 — write zeros to tape
  - .X = $0A — write data to tape
  - .X = $0C — restore to keyscan
  - .X = $0E — read data from tape
- BSIV performs:
  1. LDA $FD93,X  ; load low byte of new IRQ vector
  2. STA $0314    ; store into CINV (IRQ vector low)
  3. LDA $FD94,X  ; load high byte of new IRQ vector
  4. STA $0315    ; store into CINV+1 (IRQ vector high)
  5. RTS          ; return to caller

Effect: After BSIV returns, the IRQ vector used by the KERNAL for interrupt dispatch (as referenced by routines that use CINV) points to the address assembled from the two stored bytes until another routine restores it.

Caveats:
- Overwrites the IRQ vector pair in zero page RAM; callers must ensure restoration if original vector is required later.
- The routine assumes the table bytes are reachable at $FD93/$FD94 plus the index in X.

## Source Code
```asm
        ; BSIV - SUBROUTINE TO CHANGE IRQ VECTORS
        ;  ENTRYS - .X = 8 WRITE ZEROS TO TAPE
        ;           .X = 10 WRITE DATA TO TAPE
        ;           .X = 12 RESTORE TO KEYSCAN
        ;           .X = 14 READ DATA FROM TAPE
        ;
.,FCBD BD 93 FD LDA $FD93,X     BSIV   LDA BSIT-8,X    ;MOVE IRQ VECTORS, TABLE TO INDIRECT
.,FCC0 8D 14 03 STA $0314       STA    CINV
.,FCC3 BD 94 FD LDA $FD94,X     LDA    BSIT+1-8,X
.,FCC6 8D 15 03 STA $0315       STA    CINV+1
.,FCC9 60       RTS             RTS
```

## Key Registers
- $0314-$0315 - KERNAL - IRQ vector (CINV / CINV+1), overwritten by BSIV

## References
- "block_completion_sync_and_write_zero_sequence" — expands on called-to change IRQ handlers for zero/data write sequences
- "interrupt_restore_and_vic_keyboard_restore_tnif_tniq" — covers restoration routines that depend on proper IRQ vector management