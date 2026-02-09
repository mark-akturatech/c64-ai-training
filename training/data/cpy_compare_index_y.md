# CPY — Compare Memory and Index Y

**Summary:** CPY compares the Y index register with a memory operand (operation Y - M). Searchable terms: CPY, Y register, compare, flags N Z C, opcodes $C0 $C4 $CC, addressing modes Immediate/Zero Page/Absolute, cycles.

## Description
CPY performs an unsigned comparison of the Y register against a memory operand by internally computing Y - M (no registers or memory are modified). Flags affected:
- N (Negative): set from bit 7 of the 8-bit result (i.e., (Y - M) & $80).
- Z (Zero): set if Y == M.
- C (Carry): set if Y >= M (no borrow), cleared if Y < M.

The remaining processor flags are unchanged: I, D, V (interrupt, decimal, overflow unaffected). The instruction uses unsigned comparison semantics — carry indicates Y was greater-or-equal, zero indicates equality, negative reflects the high bit of the subtraction result.

Assembly syntax examples (mnemonic forms):
- Immediate: CPY #$nn
- Zero Page: CPY $nn
- Absolute: CPY $nnnn

Reference: Manual Ref: 7.9

## Source Code
```text
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   CPY #Oper           |   $C0   |    2    |    2     |
| Zero Page     |   CPY Oper            |   $C4   |    2    |    3     |
| Absolute      |   CPY Oper            |   $CC   |    3    |    4     |
+----------------+-----------------------+---------+---------+----------+
```

```asm
; Examples (machine bytes shown)
CPY #$05      ; Immediate compare Y to 5            -> $C0 $05
CPY $10       ; Zero Page compare Y to [#$0010]     -> $C4 $10
CPY $1234     ; Absolute compare Y to [#$1234]      -> $CC $34 $12
```

## Key Registers
- (omitted) — instruction uses the Y index register but no memory-mapped chip registers are referenced.

## References
- "cpx_compare_index_x" — related compare instruction for X register (CPX)
- "dec_decrement_memory" — next data-modifying instruction (DEC)