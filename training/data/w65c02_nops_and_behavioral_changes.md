# W65C02 — Additional Instructions and Behavioral Changes (BBR/BBS, BRA, PHX/PHY, PLX/PLY, RMB, decimal/RMW/BRK/RDY differences)

**Summary:** W65C02 additions and behavior deltas vs NMOS 6502: BBR/BBS bit-branch opcodes ($0F..$7F / $8F..$FF), BRA ($80), PHX/PHY ($DA/$5A), PLX/PLY ($FA/$7A), RMB family (zeropage bit-reset), ADC/SBC decimal-mode extra-cycle penalty, modified read‑modify‑write timing (dummy read instead of writeback), indirect JMP page-boundary fix (adds a cycle on boundary), reserved opcodes treated as NOPs, and changed BRK / RDY / WAI semantics.

**Instruction additions and behavior (concise)**
- **BBRn (Branch on Bit Reset) and BBSn (Branch on Bit Set)**
  - Test a single bit (n = 0..7) in a zeropage memory location; if the tested bit matches (reset or set), branch relative using a signed 8-bit offset.
  - These instructions do not alter processor flags.
  - Opcodes follow byte patterns:
    - BBR0..7 = $0F, $1F, $2F, $3F, $4F, $5F, $6F, $7F
    - BBS0..7 = $8F, $9F, $AF, $BF, $CF, $DF, $EF, $FF
  - See Source Code for the full table and cycle annotations.
- **BRA (Branch Always)**
  - Unconditional relative branch (signed 8-bit offset). Equivalent to relative jump; opcode $80.
- **Stack push/pull of X and Y**
  - PHX (push X): opcode $DA. Does not change flags.
  - PHY (push Y): opcode $5A. Does not change flags.
  - PLX (pull X): opcode $FA. Pull sets N and Z according to loaded value.
  - PLY (pull Y): opcode $7A. Pull sets N and Z according to loaded value.
- **RMB (Reset Memory Bit)**
  - Zeropage bit-clear family (RMB0..RMB7). Clears specified bit in zeropage operand.
  - Opcodes:
    - RMB0: $07
    - RMB1: $17
    - RMB2: $27
    - RMB3: $37
    - RMB4: $47
    - RMB5: $57
    - RMB6: $67
    - RMB7: $77
  - Each instruction is 2 bytes and takes 5 cycles.

**Behavioral differences from NMOS 6502 (summary)**
- **Decimal mode and flags**
  - Decimal flag (D) is cleared on reset and on interrupts (different observed default than some NMOS behavior).
  - ADC/SBC produce correct N/V/Z results for decimal arithmetic on W65C02 (where NMOS results were sometimes undefined).
  - ADC and SBC incur an extra cycle penalty when operating in decimal mode (additional cycle for BCD arithmetic).
- **Read‑Modify‑Write (RMW) instructions**
  - RMW timing changed: the W65C02 performs a dummy read instead of an initial writeback that NMOS 6502 did; the write occurs only once (the final write), and timing/penalties differ accordingly.
  - Absolute-indexed RMW instructions may be faster on W65C02 if no page crossing occurs (fewer cycles than NMOS in some cases).
- **Indirect JMP page-boundary behavior**
  - The page-boundary bug of NMOS 6502 (JMP indirect not crossing page boundary correctly) is fixed in W65C02; but fixing it adds a cycle on page-boundary cases.
- **Undefined/reserved opcodes**
  - W65C02 has no truly undefined opcodes: most reserved/previously "illegal" opcodes are implemented to act as NOPs (no operation) with various byte lengths and cycle counts.
- **BRK timing**
  - BRK instruction is 2 bytes; both NMOS and CMOS devices increment the program counter twice, effectively skipping the second byte. If a return from interrupt is used, it will return to the location after the second byte.
- **RDY pin / WAI**
  - RDY pin is bidirectional when used with WAI; behavior differs from NMOS implementations (affects halting and resuming cycles).

## Source Code
```text
                      2 [-----0--]   BBR2 oper        2F   2      5**
                      3 [----0---]   BBR3 oper        3F   2      5**
                      4 [---0----]   BBR4 oper        4F   2      5**
                      5 [--0-----]   BBR5 oper        5F   2      5**
                      6 [-0------]   BBR6 oper        6F   2      5**
                      7 [0-------]   BBR7 oper        7F   2      5**
                 BBS  Branch on Bit Set***
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
                 BRA  Branch Always
                      Similar to other branch instructions, but
                      branches unconditionally.
                      Equivalent to a relative jump.
                      PC+2 + operand -> PC                N Z C I D V
                                                          - - - - - -
                      addressing     assembler       opc bytes cycles
                                                     6502 Instruction Set
                      relative       BRA oper         80   2      3*
                 PHX  Push X Register on Stack
                      push X                              N Z C I D V
                                                          - - - - - -
                      addressing     assembler       opc bytes cycles
                      stack/implied PHX               DA   1      3
                 PHY  Push Y Register on Stack
                      push Y                              N Z C I D V
                                                          - - - - - -
                      addressing     assembler       opc bytes cycles
                      stack/implied PHY               5A   1      3
                 PLX  Pull X Register from Stack
                      pull X                              N Z C I D V
                                                          + + - - - -
                      addressing     assembler       opc bytes cycles
                      implied        PLX               FA   1      4
                 PLY  Pull Y Register from Stack
                      pull Y                              N Z C I D V
                                                          + + - - - -
                      addressing     assembler       opc bytes cycles
                      implied        PLY               7A   1      4
                 RMB  Reset Memory Bit ***
                      Resets a bit in memory at the given zeropage
                      location. This is an entire family of eight
                      instructions in total, resetting one of bits #0
                      to #7, each. Individual mnemonics designate the
                      bit to be reset, as in RMBn, where n = 0..7.
                      The operand is always a zeropage address.
                      reset bit n in M                     N Z C I D V
                                                          - - - - - -
                      bit reset     assembler       opc bytes cycles
                      0 [-------0]   RMB0 oper        07   2      5
                      1 [------0-]   RMB1 oper        17   2      5
                      2 [-----0--]   RMB2 oper        27   2      5
                      3 [----0---]   RMB3 oper        37   2      5
                      4 [---0----]   RMB4 oper        47   2      5
                      5 [--0-----]   RMB5 oper        57   2      5
                      6 [-0------]   RMB6 oper        67   2      5
                      7 [0-------]   RMB7 oper        77   2      5
```

## References
- "w65c02_additional_instructions_bit_manipulation" — expands on bit-manipulation instruction set and opcodes
- "implementation_specifics_and_illegal_opcodes_intro" — expands on differences between NMOS undocumented opcodes and WDC behavior

## Mnemonics
- BBR
- BBS
- BRA
- PHX
- PHY
- PLX
- PLY
- RMB
