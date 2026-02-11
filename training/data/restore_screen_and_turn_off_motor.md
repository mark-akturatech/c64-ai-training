# Restore VIC-II Screen and Turn Off Datasette Motor

**Summary:** Restores the VIC-II screen by setting bit $10 in $D011 and turns the datasette motor off by setting bit $$20 in CPU port $0001 (lda/st a/ora sequence). Searchable terms: $D011, VIC-II, $0001, datasette motor, ORA, STA, LDA.

## Description
This finalization sequence restores system state after a datasette load:

- Screen restore: Read VIC-II control register $D011, OR in #$10 and write it back to re-enable the screen (non-destructive: other bits are preserved).
- Motor off: Read CPU port at address $0001 (zero page $01), OR in #$20 and store it back to set the datasette motor-off bit (non-destructive).

Both operations use ORA to set individual bits without clearing other control bits already present.

## Source Code
```asm
    lda $d011
    ora #$10
    sta $d011       ; screen on (restore VIC-II state)

    lda 1           ; load CPU port $0001 (zero page)
    ora #$20        ; set datasette motor-off bit
    sta 1
```

## Key Registers
- $D011 - VIC-II - Control register (restore screen by ORing in $10)
- $0001 - 6510 CPU port - Memory/config I/O port (datasette motor control bit $20)

## References
- "disable_interrupts_and_screen" — expands on restoring the screen state changed earlier
- "enable_datasette_motor" — expands on turning motor off to undo earlier change

## Labels
- $D011
- $0001
