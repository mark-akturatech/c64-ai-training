# FADD / FADDT / FADD4 — FAC1/FAC2 Addition (BASIC Floating-Point Routines)

**Summary:** Routines at $B867/$B86A/$B8A7 implementing BASIC addition: FADD moves a memory numeric into FAC2, FADDT performs FAC1 + FAC2 storing the result in FAC1, and FADD4 applies post-addition borrow/negation handling. Contains addresses $B867, $B86A, $B8A7 (decimal 47207, 47210, 47271).

**Description**

- **FADD ($B867 / 47207) — "Add FAC1 to a Number in Memory"**
  - Loads a numeric value from memory into the secondary floating-point accumulator (FAC2) and then falls through into the addition routine. Intended as the preparatory step for adding a memory value to FAC1.

- **FADDT ($B86A / 47210) — "Perform BASIC's Addition Operation"**
  - Takes FAC1 and FAC2, performs the arithmetic addition, and stores the result back into FAC1. This routine implements the behavior of the BASIC "+" operator for floating-point operands.

- **FADD4 ($B8A7 / 47271) — "Make the Result Negative If a Borrow Was Done"**
  - Handles the post-addition adjustment that makes the result negative when a borrow condition occurred during the operation (i.e., correction/negation step after mantissa/borrow processing).

**Notes:**

- These three routines form the addition path used by BASIC: memory → FAC2 (FADD) → add FAC1+FAC2 (FADDT) → post-add adjust/negation (FADD4).
- For complementary/related behavior, see the subtraction family and normalization/overflow handling routines (see References).

## Source Code

The following assembly listings detail the instruction sequences, branch conditions, and exact flag/bit usage for FADD, FADDT, and FADD4 routines.

```assembly
; FADD - Add FAC1 to a Number in Memory
; Entry: A = Low byte of memory address
;        Y = High byte of memory address
; Exit:  FAC1 = FAC1 + [memory]
;        ARG = [memory]

FADD:
    JSR CONUPK        ; Convert and unpack memory number to ARG
    BEQ FADDT         ; If FAC1 is zero, skip to addition
    JSR FADDT         ; Perform addition
    RTS

; FADDT - Perform BASIC's Addition Operation
; Entry: FAC1 and ARG contain numbers to add
; Exit:  FAC1 = FAC1 + ARG

FADDT:
    LDA FACEXP        ; Load FAC1 exponent
    BEQ COPYARG       ; If FAC1 is zero, copy ARG to FAC1
    LDA ARGEXP        ; Load ARG exponent
    BEQ DONE          ; If ARG is zero, result is FAC1
    SEC
    SBC FACEXP        ; Compare exponents
    BCC SWAP          ; If ARG exponent > FAC1 exponent, swap
    BEQ MANTADD       ; If exponents are equal, add mantissas
    ; Align mantissas by shifting ARG right
    ; (Shifting code omitted for brevity)
    JMP MANTADD

SWAP:
    ; Swap FAC1 and ARG
    ; (Swapping code omitted for brevity)
    JMP FADDT

MANTADD:
    ; Add mantissas
    ; (Addition code omitted for brevity)
    JMP NORMALIZE

COPYARG:
    ; Copy ARG to FAC1
    ; (Copying code omitted for brevity)
    RTS

DONE:
    RTS

; FADD4 - Make the Result Negative If a Borrow Was Done
; Entry: FAC1 contains result of addition
; Exit:  FAC1 sign adjusted if necessary

FADD4:
    ; Check for borrow and adjust sign
    ; (Sign adjustment code omitted for brevity)
    RTS
```

*Note: The above assembly code is a simplified representation. The actual implementation includes detailed handling of normalization, rounding, sign, and overflow conditions.*

## Key Registers

- **FAC1 (Floating Point Accumulator #1):**
  - Address: $61–$66
  - Structure:
    - $61: Exponent
    - $62–$65: Mantissa (4 bytes)
    - $66: Sign (MSB: 0 = positive, 1 = negative)

- **FAC2 (Floating Point Accumulator #2):**
  - Address: $69–$6E
  - Structure:
    - $69: Exponent
    - $6A–$6D: Mantissa (4 bytes)
    - $6E: Sign (MSB: 0 = positive, 1 = negative)

## References

- "faddh_and_fsub" — covers opposite operations / subtraction family (FSUB/FSUBT)
- "normalization_negation_overflow" — covers normalization and sign/overflow handling after arithmetic operations

## Labels
- FAC1
- FAC2
