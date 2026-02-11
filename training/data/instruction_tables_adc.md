# ADC (6502)

**Summary:** Add memory to accumulator with carry: A + M + C -> A,C. Affects flags N, Z, C, V (I and D unchanged). Opcodes: $69 (Immediate), $65 (Zero Page), $75 (Zero Page,X), $60 (Absolute), $70 (Absolute,X), $79 (Absolute,Y), $61 ((Indirect,X)), $71 ((Indirect),Y). Bytes and base cycle counts are listed below; +1 cycle on page boundary crossing for indexed/addressing modes marked with *.

## Description
ADC adds the memory operand plus the processor carry flag to the accumulator: A ← A + M + C. The instruction updates:
- N (negative) — set from bit 7 of result
- Z (zero) — set if result == 0
- C (carry) — set if unsigned overflow (carry out of bit 7)
- V (overflow) — set if signed overflow (two's‑complement)

I and D are not modified by ADC. The Decimal flag D selects BCD (decimal) mode when set (instruction behavior changes under D — see instruction_operation_adc). Page-boundary crossing on indexed/addressing modes incurs an extra cycle where noted.

## Source Code
```text
Operation:  A + M + C -> A, C                         Flags affected: N Z C I D V
                                                        / / / _ _ /
                                (Ref: 2.2.1)
+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Immediate     |   ADC #Oper           |   $69   |    2    |    2     |
| Zero Page     |   ADC Oper            |   $65   |    2    |    3     |
| Zero Page,X   |   ADC Oper,X          |   $75   |    2    |    4     |
| Absolute      |   ADC Oper            |   $60   |    3    |    4     |
| Absolute,X    |   ADC Oper,X          |   $70   |    3    |    4*    |
| Absolute,Y    |   ADC Oper,Y          |   $79   |    3    |    4*    |
| (Indirect,X)  |   ADC (Oper,X)        |   $61   |    2    |    6     |
| (Indirect),Y  |   ADC (Oper),Y        |   $71   |    2    |    5*    |
+----------------+-----------------------+---------+---------+----------+

* Add 1 if page boundary is crossed.
```

## References
- "instruction_operation_adc" — expands on ADC pseudocode and flag semantics (binary and BCD)
- "instruction_timing_tables" — expands on page crossing cycle penalty

## Mnemonics
- ADC
