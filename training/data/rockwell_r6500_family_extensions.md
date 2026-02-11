# Rockwell R6500 family: RMB/SMB/STP/STZ/TRB instruction notes

**Summary:** Rockwell R6500-family additions to the 6502 instruction set: bit-manipulation instructions (RMB/SMB — zeropage bit reset/set), TRB (Test and Reset Memory bits), STZ (Store Zero), and STP (Stop). Includes opcode bytes and cycle counts as shown in the source tables (RMB/SMB/STZ/STP); TRB opcode/addressing table appears incomplete in the source.

**RMB — Reset Memory Bit**

RMBn clears a single bit (n = 0..7) in a zeropage memory operand. The operand is a zero page address. Each RMB instruction targets a specific bit (RMB0..RMB7). The source lists opcode bytes and cycle counts for the eight instructions.

**SMB — Set Memory Bit**

SMBn sets a single bit (n = 0..7) in a zeropage memory operand. The operand is a zero page address. The source lists opcode bytes and cycle counts for SMB0..SMB7.

**STP — Stop Mode**

STP stops the processor by forcing PHI2 high; a reset wakes the processor. Addressing is implied. The source gives an opcode byte and cycles.

**STZ — Store Zero in Memory**

STZ writes zero to memory. Addressing modes shown in the source: zeropage, zeropage,X, absolute, absolute,X. Opcode bytes and cycle counts are provided (absolute,X shows a starred cycle count in the source).

**TRB — Test and Reset Memory Bit**

TRB performs A AND M to set the Z flag (like BIT), then writes M AND (NOT A) back to memory (clearing bits that were set in A). In other words, TRB clears the bits set in A in the specified memory location and sets Z if any of those bits were set. The source provides the behavioral description, but the opcode/addressing table is incomplete/missing.

## Source Code

```text
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

                      SMB  Set Memory Bit ***
                      Similar to RMB, but sets the respective bit.
                      This is an entire family of eight instructions
                      in total, setting one of bits #0 to #7, each.
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
                      4 [---1----]   SMB4 zpg         C7   2      5
                      5 [--1-----]   SMB5 zpg         D7   2      5
                      6 [-1------]   SMB6 zpg         E7   2      5
                      7 [1-------]   SMB7 zpg         F7   2      5

                 STP  Stop Mode
                      Stops and sets the signal on pin PHI2 to high.
                      A reset signal will "wake up" the processor quickly.
                      stop the clock (sleep)              N Z C I D V
                                                          - - - - - -
                      addressing     assembler       opc bytes cycles
                      implied        STP              DB   1      3

                 STZ  Store Zero in Memory
                      0 -> M                              N Z C I D V
                                                          - - - - - -
                      addressing     assembler       opc bytes cycles
                      zeropage       STZ oper         64   2      3
                      zeropage,X     STZ oper,X       74   2      4
                      absolute       STZ oper         9C   3      4
                      absolute,X     STZ oper,X       9E   3      4*

                 TRB  Test and Reset Memory Bit***
                      This instruction first ANDs the contents of the given
                      memory location with the contents of the accumulator (A)
                      and sets the Z flag accordingly to the result, much
                      like the BIT instruction. Then, the contents of the
                      memory location is ANDed with the complement of the
                      mask in A, and then written back, thus clearing the
                      bit(s) set in A.
                      In other words, TRB clears the bits set in A in the
                      specified location and sets Z, if any of these bits
                      were set, otherwise resetting Z.
                                                                   N Z C I D V
                                                          - + - - - -
                      addressing     assembler       opc bytes cycles
                      zeropage       TRB oper         14   2      5
                      absolute       TRB oper         1C   3      6

                 BBR — Branch on Bit Reset
                      BBRn tests bit n (0..7) in a zeropage memory operand;
                      if the bit is clear (0), it branches to the specified
                      relative address. The operand is a zero page address,
                      and the branch is relative. Each BBR instruction targets
                      a specific bit (BBR0..BBR7).
                      bit test       assembler       opc bytes cycles
                      0 [-------0]   BBR0 zpg,rel    0F   3      5
                      1 [------0-]   BBR1 zpg,rel    1F   3      5
                      2 [-----0--]   BBR2 zpg,rel    2F   3      5
                      3 [----0---]   BBR3 zpg,rel    3F   3      5
                      4 [---0----]   BBR4 zpg,rel    4F   3      5
                      5 [--0-----]   BBR5 zpg,rel    5F   3      5
                      6 [-0------]   BBR6 zpg,rel    6F   3      5
                      7 [0-------]   BBR7 zpg,rel    7F   3      5

                 BBS — Branch on Bit Set
                      BBSn tests bit n (0..7) in a zeropage memory operand;
                      if the bit is set (1), it branches to the specified
                      relative address. The operand is a zero page address,
                      and the branch is relative. Each BBS instruction targets
                      a specific bit (BBS0..BBS7).
                      bit test       assembler       opc bytes cycles
                      0 [-------1]   BBS0 zpg,rel    8F   3      5
                      1 [------1-]   BBS1 zpg,rel    9F   3      5
                      2 [-----1--]   BBS2 zpg,rel    AF   3      5
                      3 [----1---]   BBS3 zpg,rel    BF   3      5
                      4 [---1----]   BBS4 zpg,rel    CF   3      5
                      5 [--1-----]   BBS5 zpg,rel    DF   3      5
                      6 [-1------]   BBS6 zpg,rel    EF   3      5
                      7 [1-------]   BBS7 zpg,rel    FF   3      5
```

## References

- "w65c02_additional_instructions_bit_manipulation" — expands on WDC/Rockwell bit-manipulation instruction families (BBR/BBS/RMB/SMB) and related opcodes.

## Mnemonics
- RMB
- SMB
- STP
- STZ
- TRB
- BBR
- BBS
