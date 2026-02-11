# SQR / FPWRT — Square-root entry and Exponentiation (FAC1/FAC2 routines)

**Summary:** SQR ($BF71 / dec 49009) moves FAC1 to FAC2 and loads the constant 0.5 (FHALF) into FAC1, then falls through to the exponentiation routine FPWRT ($BF7B / dec 49019). FPWRT raises FAC2 to the power in FAC1 and leaves the result in FAC1 (used by the UPARROW operator). FAC1/FAC2 are the 5-byte BASIC floating accumulators.

**Description**
- **SQR ($BF71 / 49009)**
  - **Purpose:** Entry point for square-root operation.
  - **Behavior:** Moves the current value in FAC1 to FAC2, loads the constant 0.5 (FHALF) into FAC1, and falls through to the exponentiation routine FPWRT.
  - **Effectively computes:** result = FAC2^(0.5) → FAC1 (via FPWRT).

- **FPWRT ($BF7B / 49019)**
  - **Purpose:** General exponentiation routine (also invoked by the UPARROW operator).
  - **Behavior:** Raises the value in FAC2 to the power specified in FAC1; on return, the computed result is stored in FAC1.
  - **Calling convention/context:** Expects operands in the BASIC floating accumulators (FAC2 = base, FAC1 = exponent).

- **Constants and tables:**
  - The constant 0.5 used by SQR is stored as FHALF at address $BF11. Its 5-byte floating-point representation is:
    - Exponent: $80
    - Mantissa: $00, $00, $00, $00
    - This corresponds to the value 0.5 in the Commodore 64's floating-point format.

## Source Code
```assembly
; SQR routine at $BF71
BF71: 20 0C BC  JSR MOVFA    ; Move FAC1 to FAC2
BF74: A9 11     LDA #$11     ; Load low byte of FHALF address
BF76: A0 BF     LDY #$BF     ; Load high byte of FHALF address
BF78: 4C A2 BB  JMP MOVFM    ; Load FHALF into FAC1 and jump to FPWRT

; FPWRT routine at $BF7B
BF7B: 20 0C BC  JSR MOVFA    ; Move FAC1 to FAC2
BF7E: 20 0F B8  JSR FCOMP    ; Compare FAC1 and FAC2
BF81: F0 03     BEQ $BF86    ; If equal, skip next instruction
BF83: 4C 12 B8  JMP FADD     ; FAC1 = FAC1 + FAC2
BF86: 4C 00 B8  JMP FMUL     ; FAC1 = FAC1 * FAC2
```

## Key Registers
- **FAC1 (Floating Point Accumulator 1):** Primary accumulator for floating-point operations.
- **FAC2 (Floating Point Accumulator 2):** Secondary accumulator used for operations involving two operands.

## References
- "fp_conversion_constants_tables" — FHALF and other floating constants (representation and usage)
- "exp_constants_and_exp_function" — Exponentiation and exponential-function routines, constants, and tables used by FPWRT

## Labels
- SQR
- FPWRT
- FAC1
- FAC2
- FHALF
