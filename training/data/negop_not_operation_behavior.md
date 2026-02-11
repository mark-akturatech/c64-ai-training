# NEGOP — NOT and '>' behavior for Floating Point Accumulator (FAC1)

**Summary:** Implements logical NOT and related '>' comparison behavior for the BASIC floating-point accumulator (FAC1) by toggling the sign byte (XOR with $FF); preserves zero. Search terms: FAC1, NEGOP, XOR $FF, NOT X=-(X+1), Commodore BASIC ROM $BFB4.

**Operation**
NEGOP negates the floating-point accumulator by exclusive-ORing the stored sign byte with $FF (255). Zero is explicitly left unchanged so that logical semantics behave correctly. The operation follows the arithmetic identity used by the ROM:

NOT X = -(X + 1)

Thus, applying NOT to a value of -1 (the BASIC true) yields 0 (false). This routine is used to implement the NOT operator and related '>' comparison behavior in the BASIC ROM.

Behavior summary:
- Action: XOR the FAC1 sign byte with $FF.
- Special-case: Zero remains unchanged.
- Semantic formula: NOT X = -(X + 1).
- Example: NOT(-1) → 0.

## Source Code
```asm
; NEGOP routine at $BFB4
; Negates the Floating Point Accumulator (FAC1)
; by XORing the sign byte with $FF.
; Zero is left unchanged.

BFB4  LDA $61        ; Load exponent of FAC1
BFB6  BNE BFBF       ; If exponent is non-zero, proceed to negate
BFB8  LDA $62        ; Load first byte of mantissa
BFBA  BNE BFBF       ; If mantissa is non-zero, proceed to negate
BFBC  RTS            ; If FAC1 is zero, return without change

BFBF  LDA $66        ; Load sign byte of FAC1
BFC1  EOR #$FF       ; Toggle all bits (negate sign)
BFC3  STA $66        ; Store back to sign byte
BFC5  RTS            ; Return
```

## Key Registers
- **$61**: Exponent of FAC1
- **$62-$65**: Mantissa of FAC1
- **$66**: Sign byte of FAC1

## References
- "normalization_negation_overflow" — related sign/negation handling (NEGFAC) and overflow behavior
- "sign_and_comparison_routines" — SGN/SIGN/ABS interaction with NEGOP semantics for logical operations

## Labels
- NEGOP
