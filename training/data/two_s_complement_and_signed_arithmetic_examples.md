# 6502 Signed Arithmetic, Two's Complement, SBC and Bit Instructions (BBR/BBS/RMB/SMB)

**Summary:** Two's‑complement examples (compute -4, signed ranges, 16‑bit -512/-516), multi‑byte signed arithmetic, how binary addition handles signed vs unsigned values, and 6502 SBC semantics (A = A + (~M) + C) with flag behavior (N, Z, C, V). Also includes opcode tables for BBR/BBS/RMB/SMB instructions.

## Two's‑complement basics (8‑bit)
- Positive numbers: ordinary binary (0..127).
- Negative numbers: two's complement — invert all bits (one's complement) and add 1.
- 8‑bit signed range: -128..+127.

Example: compute -4 (8‑bit)
- +4 = %00000100 (0x04)
- one's complement: %11111011 (0xFB)
- add 1: %11111100 (0xFC)
- So -4 (8‑bit two's complement) = $FC.

Flag implications (8‑bit operations):
- N (Negative) reflects bit7 of the 8‑bit result.
- Z (Zero) is set when result == 0.
- C (Carry) for addition => unsigned carry out; for subtraction (SBC) => carry = no borrow (set when subtraction did not require a borrow).
- V (Overflow) indicates signed overflow: set when adding two same‑sign operands produces opposite sign (for ADC) or when signed subtraction overflows (for SBC).

## Multi‑byte two's‑complement (16‑bit examples)
- Two's complement extends naturally across multiple bytes: invert each byte and add 1 to the whole multi‑byte value (LSB first, carry propagates).
- 16‑bit signed range: -32768..+32767.

Examples:
- +512 = $0200
  - one's complement: $FDFF
  - add 1: $FE00
  - So -512 (16‑bit) = $FE00
- +516 = $0204
  - one's complement: $FDFB
  - add 1: $FDFC
  - So -516 (16‑bit) = $FDFC

Multi‑byte addition example (unsigned + signed):
- Add unsigned $0200 (512) to signed $FDFC (-516):
  - Low byte: $00 + $FC = $FC, carry 0
  - High byte: $02 + $FD + carry0 = $FF
  - Result 16‑bit = $FFFC (decimal 65532) interpreted as signed 16‑bit = -4 (matches expectation).

## Binary addition / signed vs unsigned
- The binary adder is the same regardless of signedness; interpretation depends on whether you treat operands/results as signed or unsigned.
- C flag = unsigned overflow (carry out). V flag = signed overflow (two same‑sign operands produce different sign in result).
- Example showing differing indicators:
  - 70 + 70:
    - 70 = $46, 70 + 70 = $8C (140)
    - Carry (C) = 0 (140 < 256)
    - Negative (N) = 1 (bit7 set)
    - Overflow (V) = 1 (two positives produced a negative bit7 -> signed overflow)
    - Conclusion: unsigned result = 140 (no carry), signed result overflowed (V=1) — the CPU signals this.
- When combining signed and unsigned operands in code, decide interpretation up front; flags let you detect which kind of overflow occurred.

## SBC semantics and examples
- Mathematical identity on 6502:
  - SBC performs: A := A - M - (1 - C)
  - Equivalently: A := A + (~M) + C   (where ~M is one's complement of M)
- Carry semantics:
  - For subtraction, C = 1 means "no borrow" (subtract succeeded without borrow).
  - C = 0 means a borrow occurred.
- Flags after SBC:
  - N: bit7 of result (signed sign).
  - Z: result == 0.
  - C: set if subtraction did NOT require a borrow (A >= M + borrow).
  - V: set if signed overflow occurred (operands had different signs and result sign differs in a particular pattern; same V rules as ADC but for subtraction).

Examples (8‑bit):
1) A = $05, M = $03, initial C = 1 (no incoming borrow)
   - Compute via identity: A + (~M) + C = $05 + $FC + 1 = $02 (0x02)
   - Result = $02, Z=0, N=0, C=1 (no borrow), V=0

2) A = $05, M = $06, initial C = 1
   - $05 + (~$06) + 1 = $05 + $F9 + 1 = $FF
   - Result = $FF (signed -1)
   - C = 0 (borrow occurred), Z=0, N=1 (bit7 set), V depending on signed overflow rules (here no V)
   - Interpretation: 5 - 6 = -1, borrow occurred -> C cleared.

3) Borrow behavior summary:
   - If you want to subtract with borrow-in, preload C with prior borrow state (typical in multi-byte subtraction: clear C if previous byte borrowed, set C otherwise); then do SBC per byte LSB→MSB.

## Flags summary for ADC/SBC (quick)
- ADC (A := A + M + C)
  - C = unsigned carry out
  - V = signed overflow (two same sign inputs → result opposite sign)
  - N = bit7(result), Z = result==0
- SBC (A := A - M - (1 - C)  ≡ A + ~M + C)
  - C = 1 means no borrow (subtraction succeeded without borrow)
  - V = signed overflow for subtraction
  - N, Z as above

## Source Code
```text
                      bit tested     assembler       opc bytes cycles
                      0 [-------0]   BBR0 oper        0F   2      5**
                      1 [------0-]   BBR1 oper        1F   2      5**
                      2 [-----0--]   BBR2 oper        2F   2      5**
                      3 [----0---]   BBR3 oper        3F   2      5**
                      4 [---0----]   BBR4 oper        4F   2      5**
                      5 [--0-----]   BBR5 oper        5F   2      5**
                      6 [-0------]   BBR6 oper        6F   2      5**
                      7 [0-------]   BBR7 oper        7F   2      5**
                 BBS  Branch on Bit Set
                      Similar to BBR, but branches on bit n set.
                      Individual mnemonics designate the tested bit,
                      as in BBSn, where n = 0..7.
                      As with all branch instructions, the address
                      mode is relative, taking a signed single-byte
                      offset as operand.
                      branch on An = 1                    N Z C I D V
                                                          - - - - - -
                      bit tested     assembler       opc bytes cycles
                      0 [-------1]   BBS0 oper        8F   2      5**
                      1 [------1-]   BBS1 oper        9F   2      5**
                      2 [-----1--]   BBS2 oper        AF   2      5**
                      3 [----1---]   BBS3 oper        BF   2      5**
                      4 [---1----]   BBS4 oper        CF   2      5**
                      5 [--1-----]   BBS5 oper        DF   2      5**
                      6 [-1------]   BBS6 oper        EF   2      5**
                      7 [1-------]   BBS7 oper        FF   2      5**
                 RMB  Reset Memory Bit
                      Resets a bit in memory at the given zeropage
                      location. This is an entire family of eight
                      instructions in total, resetting one of bits #0
                      to #7, each. Individual mnemonics designate the
                      bit to be reset, as in RMBn, where n = 0..7.
                      The operand is always a zeropage address.
                                                                  6502 Instruction Set
                      0 -> Mn                             N Z C I D V
                                                          - - - - - -
                      bit reset      assembler       opc bytes cycles
                      0 [-------0]   RMB0 zpg         07   2      5
                      1 [------0-]   RMB1 zpg         17   2      5
                      2 [-----0--]   RMB2 zpg         27   2      5
                      3 [----0---]   RMB3 zpg         37   2      5
                      4 [---0----]   RMB4 zpg         47   2      5
                      5 [--0-----]   RMB5 zpg         57   2      5
                      6 [-0------]   RMB6 zpg         67   2      5
                      7 [0-------]   RMB7 zpg         77   2      5
                 SMB  Set Memory Bit
                      Similar to RMB, but sets the respective bit.
                      This is an entire family of eight instructions
                      in total, setting one of bits #0to #7, each.
                      Individual mnemonics designate the bit to be
                      set, as in SMBn, where n = 0..7.
                      The operand is always a zeropage address.
                      1 -> Mn                             N Z C I D V
                                                          - - - - - -
                      bit set        assembler       opc bytes cycles
                      0 [-------1]   SMB0 zpg         87   2      5
                      1 [------1-]   SMB1 zpg         97   2      5
                      2 [-----1--]   SMB2 zpg         A7   2      5
                      3 [----1---]   SMB3 zpg         B7   2      5
```

## References
- "a_primer_of_6502_arithmetic_operations" — expands on multi-byte addition/subtraction examples and carry/borrow semantics

## Mnemonics
- ADC
- SBC
- BBR
- BBS
- RMB
- SMB
