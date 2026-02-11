# SBC — SUBTRACT WITH CARRY (6502 / 6510) — opcodes $E9, $E5

**Summary:** SBC (Subtract with Carry) arithmetic instruction; opcodes $E9 (immediate) and $E5 (zero page) on 6502/6510. Note: an adjacent value "90" appears in the source but 0x90 is BCC (branch) — not an SBC opcode.

**Description**
SBC performs A := A - M - (1 - C) (equivalently A + (~M) + C using two's complement). It updates the N (negative), V (overflow), Z (zero) and C (carry/borrow) flags. In binary mode the result is standard two's-complement subtraction; in Decimal mode (BCD) the 6502/6510 applies a BCD subtraction algorithm (behavior historically differs on some 6502-family variants — 6510 on the C64 follows MOS behavior).

Behavioral notes:
- Carry flag is treated as NOT-borrow: C=1 means no borrow, C=0 means borrow.
- Overflow (V) is set on signed overflow (when operands signs differ unexpectedly after subtraction).
- Zero (Z) set if result == 0; Negative (N) reflects bit 7 of the result.
- Decimal (D) flag modifies operation to BCD on the 6502/6510 (use with caution).

This chunk documents the specific opcodes shown in the source: $E9 and $E5. The raw source also lists "90" adjacent; that value is not an SBC opcode and is flagged below.

## Source Code
```text
sbc

$e9

$e5

90
```

```text
; Opcode reference (selected)
; Opcode  Addressing     Bytes  Cycles   Notes
E9       Immediate       2      2        SBC #imm
E5       Zero Page       2      3        SBC zp
90       Relative        2      2/3+     BCC (Branch if Carry Clear) — not SBC
```

```asm
; Example (not present in original source; short illustrative snippet)
; LDA #$10
; SBC #$03    ; uses opcode $E9
; SBC $05     ; uses opcode $E5 (zero page)
```

## References
- "cmp_eor_inc_dec_instructions" — expands on other arithmetic/logic instructions and flag interactions

## Mnemonics
- SBC
