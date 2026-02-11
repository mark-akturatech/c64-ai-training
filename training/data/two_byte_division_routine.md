# 6502 16-bit Division (Trial‑Subtract) Example — NUM1 / NUM2 → NUM1 (quotient), REM (remainder)

**Summary:** 6502 assembly trial‑subtract division of a 16‑bit dividend (NUM1) by a 16‑bit divisor (NUM2), using bit‑shifting (ASL/ROL), SEC/SBC multi‑byte subtraction, and quotient bit recording via INC/DEX loop over 16 bits. Registers/instructions: ASL, ROL, SEC, SBC, STA, STY, INC, DEX, BNE.

## Algorithm Overview
This code implements non‑restoring binary division by trial subtraction (shift‑and‑subtract):

- REM (two bytes) is initialized to 0 and used as the running remainder/work area.
- The 16‑bit dividend in NUM1 (two bytes) is shifted left one bit per loop iteration; the high bit shifted out is pushed into REM via ROL. Two ROLs are used so the full two‑byte REM receives incoming bits.
- After each shift, the algorithm attempts to subtract the 16‑bit divisor (NUM2) from REM:
  - SEC sets carry so SBC performs a borrow‑aware subtraction.
  - The low byte subtraction result is saved in Y (TAY) and the high byte subtraction is performed with SBC on REM+1 and NUM2+1; BCC tests for a borrow (subtraction failed).
- If the subtraction succeeded (no borrow), the subtraction result replaces REM (STA REM+1 / STY REM) and a 1 bit is recorded in the quotient by incrementing NUM1 (which vacated a low bit earlier during shifting).
- If the subtraction failed, the subtraction result is discarded and a 0 bit remains in the quotient.
- The loop repeats for 16 bits (LDX #16, DEX/BNE).

This produces the quotient in NUM1 (overwriting the dividend) and the final remainder in REM.

## Implementation Notes
- REM must be two bytes (REM, REM+1). NUM1 and NUM2 are two‑byte values (NUM1, NUM1+1 and NUM2, NUM2+1).
- The code performs a two‑byte left shift of NUM1 into REM, then a two‑byte conditional subtraction of NUM2 from REM. The quotient bit is written into the low byte of NUM1 by INC NUM1 after a successful subtraction (because the low bit slot was vacated by the shift).
- SEC is required before the SBC sequence so the subtraction is performed with no initial borrow.
- Multi‑byte SBC uses the processor carry/borrow between the low and high byte SBC operations; TAY/STA are used to hold intermediate low‑byte results.
- The loop counter X is initialized to 16 for 16 shifts (bits) and decremented each iteration.

## Source Code
```asm
        ; Divide 16-bit NUM1 by 16-bit NUM2
        ; Result: NUM1 = quotient, REM = remainder

        LDA #0      ; Initialize REM to 0
        STA REM
        STA REM+1
        LDX #16     ; There are 16 bits in NUM1
L1      ASL NUM1    ; Shift hi bit of NUM1 into REM
        ROL NUM1+1  ; (vacating the lo bit, which will be used for the quotient)
        ROL REM
        ROL REM+1
        LDA REM
        SEC         ; Trial subtraction
        SBC NUM2
        TAY
        LDA REM+1
        SBC NUM2+1
        BCC L2      ; Did subtraction succeed?
        STA REM+1   ; If yes, save it
        STY REM
        INC NUM1    ; and record a 1 in the quotient
L2      DEX
        BNE L1
```

## References
- "binary_division_example_and_concept" — conceptual origin and explanation of trial‑subtract method
- "quotient_and_remainder_widths" — considerations about quotient and remainder sizes
- "llx.com - 6502 code example" — original source of this example
