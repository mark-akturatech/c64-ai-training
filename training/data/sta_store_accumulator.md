# STA — Store Accumulator (6502)

**Summary:** STA stores the accumulator (A) into memory (A -> M). Includes opcodes and cycles for Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X) and (Indirect),Y addressing modes; no processor flags are affected.

## Description
STA writes the current contents of the accumulator to a memory location specified by the instruction's addressing mode. The operation is A -> M. STA does not modify any processor status flags (N, Z, C, I, D, V remain unchanged).

Addressing modes supported:
- Zero Page: one-byte address in page $00 (fast, 3 cycles).
- Zero Page,X: zero page address plus X (wraps within page $00).
- Absolute: 16-bit address.
- Absolute,X / Absolute,Y: 16-bit address plus X or Y (no page-boundary penalty for STA writes).
- (Indirect,X): zero page indirect indexed by X (pre-indexed).
- (Indirect),Y: zero page indirect then indexed by Y (post-indexed).

Reference: 2.1.2 (instruction summary).

## Source Code
```text
STA  Store accumulator in memory   Operation: A -> M   Flags: N Z C I D V (unchanged)   (Ref: 2.1.2)

+----------------+-----------------------+---------+---------+----------+
| Addressing Mode| Assembly Language Form| OP CODE |No. Bytes|No. Cycles|
+----------------+-----------------------+---------+---------+----------+
| Zero Page      | STA Oper              | $85     |   2     |    3     |
| Zero Page,X    | STA Oper,X            | $95     |   2     |    4     |
| Absolute       | STA Oper              | $8D     |   3     |    4     |
| Absolute,X     | STA Oper,X            | $9D     |   3     |    5     |
| Absolute,Y     | STA Oper,Y            | $99     |   3     |    5     |
| (Indirect,X)   | STA (Oper,X)          | $81     |   2     |    6     |
| (Indirect),Y   | STA (Oper),Y          | $91     |   2     |    6     |
+----------------+-----------------------+---------+---------+----------+
```

## References
- "lda_load_accumulator" — loading accumulator (complementary operation)
- "stx_store_x" — storing X register (related store instruction)
- "sty_store_y" — storing Y register (related store instruction)

## Mnemonics
- STA
