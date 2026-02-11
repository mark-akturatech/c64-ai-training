# KERNAL ROM wrapper: JTP20 call + BUFPT increment ($F80D-$F816)

**Summary:** Small KERNAL utility (addresses $F80D-$F816) that calls an external TAPECONTROL routine (JSR $F7D0 / JTP20), increments the zero-page buffer pointer BUFPT ($00A6), loads Y from BUFPT and compares it to BUFSZ (#$C0) before returning.

## Description
This routine is a compact wrapper that performs three actions in sequence:
- Calls the TAPECONTROL library entry JTP20 via JSR $F7D0 (symbol ZZZ / JTP20).
- Increments the zero-page buffer pointer BUFPT (zero-page address $00A6).
- Loads Y from BUFPT and compares Y to the buffer-size constant BUFSZ (#$C0), then returns.

The CPY #$C0 sets processor flags to allow caller code to act on the comparison result (no branches or updates are performed here). The routine is declared with the .LIB TAPECONTROL directive (references external library symbols).

## Source Code
```asm
                                .LIB   TAPECONTROL
.,F80D 20 D0 F7 JSR $F7D0       JTP20  JSR ZZZ
.,F810 E6 A6    INC $A6         INC    BUFPT
.,F812 A4 A6    LDY $A6         LDY    BUFPT
.,F814 C0 C0    CPY #$C0        CPY    #BUFSZ
.,F816 60       RTS             RTS
```

## Key Registers
- $F80D-$F816 - KERNAL ROM - wrapper routine (calls JTP20, updates BUFPT)
- $F7D0 - KERNAL ROM / TAPECONTROL - JTP20 (external JSR target)
- $00A6 - Zero Page - BUFPT (buffer pointer)

## References
- "press_play_prompt_and_debounce" — uses TAPECONTROL library routines; adjacent cassette prompt logic

## Labels
- BUFPT
- JTP20
- BUFSZ
