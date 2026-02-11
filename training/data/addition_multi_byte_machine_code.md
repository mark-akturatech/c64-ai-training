# MACHINE - Principles of addition applied to bytes and multi-byte values

**Summary:** Describes multi-byte addition rules for 6502 machine code: clear the carry with CLC, add from the low-order byte upward using ADC into A, and check the processor flags (C = unsigned overflow, V = signed overflow). Includes decimal/ASCII carry illustration and assembly examples (LDA/ADC/STA) for 1-byte and 2-byte additions at addresses like $0380/$03A0-$03B1.

## Principles

- Start with the low-order byte (least-significant byte) and work toward the high-order bytes.
- Each column (byte) addition includes any carry from the previous (less-significant) column; ADC uses the carry flag and may set it to 0 or 1.
- Clear the carry before beginning a new multi-byte addition (CLC).
- If, after completing an unsigned addition, the carry flag is set, the result overflowed (answer "won't fit"); for signed additions, check the V (overflow) flag instead.

## Machine-language implementation

- Clear the carry: CLC.
- Perform additions byte-wise in the A register, using ADC for each corresponding byte starting at the low byte and proceeding to high bytes. Use STA to store intermediate results.
- At the end of the sequence:
  - For unsigned arithmetic, test the carry flag (BCS to branch on carry/overflow).
  - For signed arithmetic, test the overflow flag (BVS to branch on signed overflow).
- Identical code works for signed multi-byte values; only the final flag tested differs (V instead of C).

## Source Code

```text
Decimal example (illustrates column addition rules):

  142856
+ 389217
--------
(Work right-to-left, carry each column into the next)
```

```text
ASCII figure (low/high bytes and carry):

    HIGH BYTE        LOW BYTE
                       Start:
    00101011         10111001  No carry
    00001010         11100101 /
    -------------------------/
                     10011110
                    /
                   /
              Carry
             /
            /
    00110110
```

```asm
; Single-byte addition: add contents at $0380 and $0381, store at $0382
        CLC
        LDA $0380
        ADC $0381
        STA $0382
        ; Optionally:
        ; BCS handle_unsigned_overflow  ; branch if carry set (unsigned overflow)

; Two-byte addition: add 2-byte value at $03A0/$03A1 to 2-byte value at $03B0/$03B1
; result stored at $03C0/$03C1 (low byte at low address)
        CLC
        LDA $03A0       ; low byte of first number
        ADC $03B0       ; low byte of second number (includes carry from previous ADC)
        STA $03C0       ; store low result
        LDA $03A1       ; high byte of first number
        ADC $03B1       ; high byte of second number (includes carry from low-byte addition)
        STA $03C1       ; store high result
        ; For unsigned overflow:
        ; BCS handle_unsigned_overflow
        ; For signed overflow (same code path, different check):
        ; BVS handle_signed_overflow
```

## References
- "big_numbers_multi_byte" — expands on carries across bytes and sizing multi-byte numbers
- "subtraction_multi_byte_machine_code" — rules for multi-byte subtraction (borrows, SEC, SBC)

## Mnemonics
- ADC
- CLC
- BCS
- BVS
