# 6502 Multiplication and Division Algorithms — Binary Long Division via Shifts and SEC/SBC

**Summary:** Unsigned 16-bit division on the 6502 implemented as binary long division: shift dividend bits into a remainder work area, perform trial subtraction with SEC/SBC, and record quotient bits via ASL/ROL and INC. Includes a 6502 routine using LDA, STA, ASL, ROL, SEC, SBC, TAY, BCC that divides 2-byte NUM1 by 2-byte NUM2, leaving the quotient in NUM1 and the 16-bit remainder in REM; cautions on operand/quotient/remainder widths.

## Dividing Arbitrary Numbers

Binary long division mirrors the pencil-and-paper decimal process: at each step, compare (by subtracting) the divisor from the current work area (the “partial remainder”), decide whether the next quotient bit is 0 or 1, then incorporate the next dividend bit and repeat until all bits are processed.

### Decimal example

```
184
_______
67 ) 12345
     -67
     ---
      564
     -536
     ----
       285
      -268
      ----
        17
```

Here, 12345 ÷ 67 = 184 remainder 17.

### Binary example

```
10101
    _________
101 ) 1101101
     -101
     ----
        11
        -0
        --
        111
       -101
       ----
         100
          -0
         ---
         1001
         -101
         ----
          100
```

Binary is simpler because each step only tries subtracting 0 or the divisor.

## Algorithm

- Shift the dividend left, one bit at a time, into a work area (the remainder).
- After each shift, perform a trial subtraction: work_area − divisor using SEC/SBC.
  - If no borrow occurs (i.e., C=1 after the final SBC), keep the subtraction result as the new remainder and set the current quotient bit to 1.
  - If a borrow occurs (C=0), discard the subtraction result and set the quotient bit to 0.
- Continue until all dividend bits are processed. (On the 6502, SEC sets carry for subtraction; BCC indicates the subtraction borrowed and thus “failed.”)

## 6502 Routine (16-bit unsigned division: NUM1 / NUM2)

- Input: NUM1 (16-bit dividend), NUM2 (16-bit divisor)
- Output: NUM1 (16-bit quotient), REM (16-bit remainder)
- Notes:
  - ASL/ROL shifts bring the next dividend bit into REM and vacate the low bit of NUM1 (where the next quotient bit will go).
  - SEC before SBC ensures a proper “trial subtraction.” If SBC borrows (C=0), the subtraction failed.
  - INC NUM1 records a 1 in the vacated low bit of the quotient.

```asm
; Divide 16-bit NUM1 by 16-bit NUM2 (unsigned).
; Result: quotient in NUM1, remainder in REM (both little-endian: low byte at label, high at label+1).

        LDA #0          ; Initialize REM = 0
        STA REM
        STA REM+1
        LDX #16         ; 16 bits to process

L1      ASL NUM1        ; Shift hi bit of NUM1 into REM chain
        ROL NUM1+1      ; (vacates low bit in NUM1 for next quotient bit)
        ROL REM
        ROL REM+1

        LDA REM         ; Trial subtraction: REM - NUM2
        SEC
        SBC NUM2
        TAY             ; Save low byte of tentative remainder
        LDA REM+1
        SBC NUM2+1
        BCC L2          ; If borrow, subtraction failed → quotient bit is 0

        STA REM+1       ; Subtraction succeeded: keep new remainder
        STY REM
        INC NUM1        ; Record a 1 in the quotient's low bit

L2      DEX
        BNE L1
```

## Width considerations

- The quotient must be as wide as the dividend (e.g., dividing by 1 yields the dividend).
- The remainder must be as wide as the divisor (it can be as large as divisor−1).

## References
- "division_by_powers_of_two_with_remainder_in_carry" — Simplest case via shifts; carry-based remainder
- "signed_multiplication_and_division_strategies_and_wrappers" — Signed division conventions and wrappers