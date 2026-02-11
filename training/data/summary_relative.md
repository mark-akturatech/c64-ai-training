# 6502 Relative Addressing (Branches)

**Summary:** Relative addressing for 6502 branch instructions uses a signed 2's‑complement 8-bit offset (-128 to +127) added to the address of the instruction following the branch; examples use BEQ and explicit hex addresses ($4545, $4547, $455A).

## Relative addressing
The branch operand is an 8-bit two's‑complement offset (range -128 .. +127). The CPU adds this signed offset to the address of the instruction immediately following the branch instruction (the next PC) to form the branch target address.

Example from source:
- At $4545: BEQ $13 — BEQ is two bytes, so the next instruction is at $4547. The offset $13 (decimal +19) is added to $4547 producing $455A, so control branches to $455A if Z = 1.
- The listing continues at $4547 with LDA $9333 (next sequential instruction if branch is not taken).

## Source Code
```asm
; addresses shown in original source
4545    BEQ    $13
4547    LDA    $9333
```

## References
- "relative_addressing" — expands on detailed relative addressing explanation and examples

## Mnemonics
- BEQ
