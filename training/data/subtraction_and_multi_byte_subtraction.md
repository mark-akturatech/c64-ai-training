# 6502 Subtraction (SEC/SBC, inverted-borrow, multi-byte rules)

**Summary:** 6502 subtraction uses SEC before SBC so the carry flag functions as an "inverted borrow"; perform multi-byte subtraction least-significant byte first, check C for unsigned overflow (clear = borrow/overflow) or V for signed overflow (set = two's‑complement overflow). Example addresses: $0380, $0381, $0382.

## Subtraction rules
- Treat subtraction as "upside-down" addition: SBC effectively uses the carry as an inverted borrow.
- Before any subtraction sequence, set the carry with SEC so the first borrow is handled correctly.
- For multi-byte values, subtract low byte first and propagate borrows via the carry flag; all subtraction occurs through the A register (SBC takes an immediate or memory operand).
- On completion:
  - For unsigned numbers: check C — clear C indicates a borrow/unsigned overflow.
  - For signed numbers (two's complement): check V — set V indicates signed overflow.
- A BCC (branch if carry clear) can be used after the subtraction sequence to jump to an error/overflow routine.

## Source Code
```asm
; Subtract unsigned value at $0381 from value at $0380, store result at $0382
; (carry must be set before subtraction; BCC can detect unsigned underflow)

        SEC         ; set carry = 1 (inverted borrow = 0)
        LDA $0380   ; low byte (A <- minuend low)
        SBC $0381   ; subtract subtrahend low (A <- A - M - (1-C))
        STA $0382   ; store result low
        ; BCC error ; if carry clear -> unsigned borrow/underflow
```

## References
- "addition_and_multi_byte_addition" — handling of carries/borrows for multi-byte arithmetic

## Mnemonics
- SBC
- SEC
- BCC
