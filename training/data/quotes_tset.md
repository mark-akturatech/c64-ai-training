# QUOTES TSET ($E684..$E690)

**Summary:** KERNAL routine that tests A for ASCII quote ($22) and, if matched, toggles the QTSW flag at $D4 (zero page). Used by INPUT/edit and some output paths to track whether an open quote is active; restores A to the quote character before returning.

## Description
On entry A contains the character to be tested. If A equals ASCII quote ($22) the routine toggles the single-bit quotes flag stored at zero page address $D4 (labelled QTSW). After toggling, A is restored to $22 so the caller still sees the quote character. If A is not a quote the routine returns immediately, leaving A unchanged. The routine is a small KERNAL helper invoked from input-from-screen/keyboard and from output routines that need to maintain quote state for editing/printing behavior.

Behavior summary:
- Entry: A = character to test.
- Test: CMP #$22
- If equal: LDA $D4; EOR #$01; STA $D4 (toggle low bit); LDA #$22 (restore A).
- Exit: RTS

No other flags or registers are modified by this routine beyond A and the single zero-page byte at $D4.

## Source Code
```asm
        ; QUOTES TSET ($E684..$E690)
        ; Entry: A = character to test
.,E684  C9 22    CMP #$22        ; ASCII quote (")
.,E686  D0 08    BNE $E690       ; if not quote, return
.,E688  A5 D4    LDA $D4         ; QTSW, quotes mode flag (zero page $D4)
.,E68A  49 01    EOR #$01        ; toggle low bit
.,E68C  85 D4    STA $D4         ; store back
.,E68E  A9 22    LDA #$22        ; restore A to quote character
.,E690  60       RTS             ; return
```

## Key Registers
- $00D4 - Zero Page - QTSW quotes mode flag (toggled by QUOTES TSET)

## References
- "input_from_screen_or_keyboard" — expands on invoking this routine when reading screen characters to update quotes state
- "output_to_screen_unshifted_and_control_codes" — expands on output path calls QUOTES TSET before printing characters to determine quotes mode

## Labels
- QUOTES TSET
- QTSW
