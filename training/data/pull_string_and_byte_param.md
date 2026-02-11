# pull_string_and_byte_from_stack (B761)

**Summary:** Helper routine at $B761 for BASIC string functions (LEFT$/RIGHT$/MID$) that scans for ')', preserves and restores the BASIC return address, pulls a byte parameter into X and A, stores the string pointer into $50/$51 (zero page), clears Y and returns (JSR $AEF7, PLA/TAX/STA/TXA, RTS).

**Description**
This common BASIC helper is invoked by string functions (LEFT$/RIGHT$/MID$) via JSR $B761. Its purpose is to extract a single-byte numeric parameter and a string pointer from the BASIC function call stack, while preserving the original return address so execution can resume normally.

Behavior and stack handling:
- Calls JSR $AEF7 to scan for the closing parenthesis ')' of the function call; $AEF7 performs syntax checking and will trigger a syntax error/warm start if ')' is missing.
- Pops the BASIC return address low and high bytes from the stack and temporarily stores them (low in Y, high in $55).
- Pops and discards two bytes that hold the function-call vector (these are pushed by BASIC's function-call sequence).
- Pops the byte parameter (numeric argument) and transfers it to X (TAX). The byte parameter is also returned in A (via TXA later).
- Pops the string pointer low/high bytes and saves them into zero page descriptor $50 (low) and $51 (high). After this, the routine restores the original return address by pushing back high then low.
- Clears Y to zero (LDY #$00).
- Copies the parameter from X to A (TXA) and returns with RTS.

Return state on exit:
- Descriptor pointer: $50 = pointer low, $51 = pointer high
- Byte parameter: X = parameter, A = parameter
- Index register Y = 0
- Stack contains the original return address (restored), so RTS returns to the BASIC caller correctly.

Notes:
- The routine expects the BASIC call stack to have (from top) return address low, return address high, function vector low, function vector high, byte parameter, string pointer low, string pointer high (popped in that order).
- JSR $AEF7 is responsible for parsing to the ')' and performing syntax error handling if needed.

## Source Code
```asm
.,B761 20 F7 AE    JSR $AEF7       ; scan for ")", else syntax error then warm start
.,B764 68          PLA             ; pull return address low byte
.,B765 A8          TAY             ; save return address low byte (Y)
.,B766 68          PLA             ; pull return address high byte
.,B767 85 55       STA $55         ; save return address high byte
.,B769 68          PLA             ; dump call to function vector low byte
.,B76A 68          PLA             ; dump call to function vector high byte
.,B76B 68          PLA             ; pull byte parameter
.,B76C AA          TAX             ; copy byte parameter to X
.,B76D 68          PLA             ; pull string pointer low byte
.,B76E 85 50       STA $50         ; save pointer low
.,B770 68          PLA             ; pull string pointer high byte
.,B771 85 51       STA $51         ; save pointer high
.,B773 A5 55       LDA $55         ; get return address high byte
.,B775 48          PHA             ; push it back on stack
.,B776 98          TYA             ; get return address low byte
.,B777 48          PHA             ; push it back on stack
.,B778 A0 00       LDY #$00        ; clear index Y
.,B77A 8A          TXA             ; copy byte parameter to A
.,B77B 60          RTS             ; return
```

## Key Registers
- $0050-$0051 - Zero Page - saved string pointer low/high (descriptor returned to caller)
- $0055 - Zero Page - temporary storage for saved return-address high byte

## References
- "left_string_function" — LEFT$ entry that calls JSR $B761
- "right_string_function" — RIGHT$ entry that calls JSR $B761
- "mid_string_function" — MID$ entry that calls JSR $B761

## Labels
- $0050
- $0051
- $0055
