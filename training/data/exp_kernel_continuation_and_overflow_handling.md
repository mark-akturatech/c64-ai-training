# KERNAL EXP() continuation (starts at $E000)

**Summary:** Disassembly of KERNAL EXP() continuation at $E000 — saves FAC2 rounding byte ($56), copies FAC1→FAC2, checks exponent against overflow threshold (CMP #$88), calls overflow/underflow handler if needed, invokes INT() to normalise/adjust exponent, swaps FAC1 and FAC2 (block copy), restores rounding byte to FAC1, performs FAC2-from-FAC1 subtraction and a negation, sets up a coefficient-table pointer and jumps to the series-evaluation driver, then final accumulator checks and RTS.

## Description
This chunk continues the EXP() implementation in the KERNAL floating-point library.

Step-by-step behavior:
- Save FAC2 rounding byte at $56.
- JSR $BC0F — copy FAC1 to FAC2 (routine entry for FAC copy).
- Load FAC1 exponent (LDA $61) and compare it to immediate #$88. If exponent >= #$88 the code jumps to the overflow/underflow handler (JSR $BAD4).
  **[Note: Source may contain an error — comment says "compare with EXP limit (256d)" which contradicts the immediate value #$88 used by CMP.]**
- If exponent < #$88, call INT() via JSR $BCCC to normalise/adjust; INT() returns a mantissa byte in $07.
- Take the INT() mantissa byte ($07), add #$81 (ADC #$81) to perform a normalise +1; if this addition yields zero (BEQ) the code treats that as an overflow and calls the overflow/underflow handler.
- Adjust exponent (SBC #$01) with carry set, then PHA the result (saved FAC2 exponent).
- Swap FAC1 and FAC2 by copying 6 bytes with X = #$05 and looping LDA $69,X / LDY $61,X then STA $61,X / STY $69,X with DEX/BPL; this performs a block swap (X = 5 downto 0).
- Restore saved FAC2 rounding byte: LDA $56 → STA $70 (FAC1 rounding byte).
- JSR $B853 — perform FAC2-from-FAC1 subtraction.
- JSR $BFB4 — negate FAC1 (do -FAC1).
- Load pointer $BFC4 (LDA #$C4; LDY #$BF) and JSR $E059 — branch into the generic series-evaluation routine.
- Clear A and store zero into $6F (clear sign-compare flag).
- PLA to restore saved FAC2 exponent, then JSR $BAB9 to test and adjust accumulators.
- RTS returns to caller.

Subroutine mapping (as used here):
- $BC0F — copy FAC1 → FAC2
- $BAD4 — overflow/underflow handler
- $BCCC — INT() (normalise/adjust exponent; returns mantissa byte in $07)
- $B853 — FAC1 − FAC2 subtraction driver
- $BFB4 — negate FAC1 (unary -)
- $E059 — series-evaluation driver (uses pointer set to $BFC4)
- $BAB9 — test & adjust accumulators (final checks before return)

Behavioral notes:
- The swap copies bytes using indexed addressing with X from 5→0, performing six byte moves (covers exponent + mantissa/sign bytes as implemented).
- Rounding byte handling: FAC2 rounding saved at $56 and then written into $70 (FAC1 rounding) after the swap.
- Sign compare is represented at $6F and cleared here prior to final accumulator adjustments.

## Source Code
```asm
.,E000 85 56    STA $56         save FAC2 rounding byte
.,E002 20 0F BC JSR $BC0F       copy FAC1 to FAC2
.,E005 A5 61    LDA $61         get FAC1 exponent
.,E007 C9 88    CMP #$88        compare with EXP limit (256d)
.,E009 90 03    BCC $E00E       branch if less
.,E00B 20 D4 BA JSR $BAD4       handle overflow and underflow
.,E00E 20 CC BC JSR $BCCC       perform INT()
.,E011 A5 07    LDA $07         get mantissa 4 from INT()
.,E013 18       CLC             clear carry for add
.,E014 69 81    ADC #$81        normalise +1
.,E016 F0 F3    BEQ $E00B       if $00 result has overflowed so go handle it
.,E018 38       SEC             set carry for subtract
.,E019 E9 01    SBC #$01        exponent now correct
.,E01B 48       PHA             save FAC2 exponent
                                swap FAC1 and FAC2
.,E01C A2 05    LDX #$05        4 bytes to do
.,E01E B5 69    LDA $69,X       get FAC2,X
.,E020 B4 61    LDY $61,X       get FAC1,X
.,E022 95 61    STA $61,X       save FAC1,X
.,E024 94 69    STY $69,X       save FAC2,X
.,E026 CA       DEX             decrement count/index
.,E027 10 F5    BPL $E01E       loop if not all done
.,E029 A5 56    LDA $56         get FAC2 rounding byte
.,E02B 85 70    STA $70         save as FAC1 rounding byte
.,E02D 20 53 B8 JSR $B853       perform subtraction, FAC2 from FAC1
.,E030 20 B4 BF JSR $BFB4       do - FAC1
.,E033 A9 C4    LDA #$C4        set counter pointer low byte
.,E035 A0 BF    LDY #$BF        set counter pointer high byte
.,E037 20 59 E0 JSR $E059       go do series evaluation
.,E03A A9 00    LDA #$00        clear A
.,E03C 85 6F    STA $6F         clear sign compare (FAC1 EOR FAC2)
.,E03E 68       PLA             get saved FAC2 exponent
.,E03F 20 B9 BA JSR $BAB9       test and adjust accumulators
.,E042 60       RTS             
```

## Key Registers
- $0056 - RAM - saved FAC2 rounding byte (temporary)
- $006F - RAM - sign-compare flag (FAC1 EOR FAC2), cleared here
- $007 - Zero page RAM - INT() result: mantissa byte 4
- $0061 - RAM - FAC1 base (exponent at $61; code uses $61,X for mantissa bytes)
- $0069 - RAM - FAC2 base (used with $69,X for mantissa/exponent bytes)
- $0070 - RAM - FAC1 rounding byte (restored from $56)

## References
- "exp_entry_prepare" — expands on entry code jumps here after initial prepare/rounding
- "series_evaluation_routine" — expands on this routine sets up and then branches into the generic series evaluator
- "power_function_driver" — expands on EXP called by the power driver for X^Y computation

## Labels
- FAC1
- FAC2
