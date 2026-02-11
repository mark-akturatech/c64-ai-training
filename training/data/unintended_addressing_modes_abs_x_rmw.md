# NMOS 6510 undocumented R-M-W: Absolute,X and (ZP,X) Indexed-Indirect timing for 7-cycle/8-cycle opcodes

**Summary:** This document details the read-modify-write (R-M-W) timing sequences for NMOS 6510 undocumented opcodes utilizing Absolute,X addressing (7-cycle behavior) and Zeropage Indexed Indirect (zp,X) addressing (8-cycle behavior). It includes per-cycle bus operations, opcode bytes, and references to related materials. The undocumented opcodes covered are: DCP, ISC, RLA, RRA, SLO, and SRE, along with their legal-mode equivalents: ASL, DEC, LSR, ROL, and ROR.

**Description**

This document provides detailed timing and bus operation sequences for undocumented 6502 opcodes that perform read-modify-write operations using X-indexed absolute addressing (Absolute,X) and the Zeropage,X Indexed Indirect addressing mode ((zp,X)). It outlines the specific cycles during which opcode and operand fetches occur, when the effective address low and high bytes are fetched, and when memory is read (old data) versus written (new data). The undocumented opcodes discussed include DCP, ISC, RLA, RRA, SLO, and SRE, as well as their legal-mode counterparts: ASL, DEC, LSR, ROL, and ROR.

## Source Code

```text
Absolute,X (R-M-W) Timing Sequence (7 cycles):

Cycle  Address Bus  Data Bus        R/W  Description
1      PC          Opcode fetch     R    Fetch opcode, increment PC
2      PC          Low byte of AA   R    Fetch low byte of address, increment PC
3      PC          High byte of AA  R    Fetch high byte of address, increment PC
4      AA + X      -                R    Read from effective address (AA + X)
5      AA + X      Old Data         R    Read old data from effective address
6      AA + X      Old Data         W    Write back old data to effective address
7      AA + X      New Data         W    Write new data to effective address
```

Opcode bytes for Absolute,X R-M-W instructions:

- ASL abs,X: 1E
- DEC abs,X: DE
- LSR abs,X: 5E
- ROL abs,X: 3E
- ROR abs,X: 7E
- DCP abs,X: DF
- ISC abs,X: FF
- RLA abs,X: 3F
- RRA abs,X: 7F
- SLO abs,X: 1F
- SRE abs,X: 5F

Zeropage Indexed Indirect (R-M-W) Timing Sequence (8 cycles):

Cycle  Address Bus  Data Bus        R/W  Description
1      PC          Opcode fetch     R    Fetch opcode, increment PC
2      PC          Direct Offset    R    Fetch direct offset (DO), increment PC
3      DO          Pointer Low      R    Read low byte of pointer from DO
4      DO + 1      Pointer High     R    Read high byte of pointer from DO + 1
5      (Ptr) + X   -                R    Read from effective address (Ptr + X)
6      (Ptr) + X   Old Data         R    Read old data from effective address
7      (Ptr) + X   Old Data         W    Write back old data to effective address
8      (Ptr) + X   New Data         W    Write new data to effective address
```

Opcode bytes for Zeropage Indexed Indirect R-M-W instructions:

- DCP (zp,X): C3
- ISC (zp,X): E3
- RLA (zp,X): 23
- RRA (zp,X): 63
- SLO (zp,X): 03
- SRE (zp,X): 43
```

## References

- "unintended_addressing_modes_abs_y_rmw" — expands on related R-M-W timing sequences (Absolute,Y vs Absolute,X differences)
- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [Absolute + X Mode — 8bitworkshop documentation](https://8bitworkshop.com/docs/chips/m6502/modes/absolute-x.html)
- [Addressing Modes - 6502 Emulator Guide](https://javier-varez.github.io/mos6502_docs/processor_architecture/addressing_modes.html)
- [6502 Addressing Modes | OSU CS 467 Blog](https://blogs.oregonstate.edu/ericmorgan/2022/01/21/6502-addressing-modes/)
- [6502 Programmers Reference](https://www.csh.rit.edu/~moffitt/docs/6502.html)
- [6502 Addressing Modes - CDOT Wiki](https://wiki.cdot.senecapolytechnic.ca/wiki/6502_Addressing_Modes)
- [6502 Instruction Set](https://masswerk.at/6502/6502_instruction_set.html)
- [6502 Assembly Language Programming (2nd Edition)](https://seriouscomputerist.atariverse.com/media/pdf/book/6502%20Assembly%20Language%20Programming%20%282nd%20Edition%29.pdf)
- [6502 Addressing Modes](https://www.nesdev.org/obelisk-6502-guide/addressing.html)
- [CPU - 6502](https://fceux.com/web/help/6502CPU.html)
- [MOS Technology 6502](https://en.wikipedia.org/wiki/MOS_Technology_6502)
- [WDC 65C02](https://en.wikipedia.org/wiki/WDC_65C02)
- [6502 - Why don't all Absolute,X instructions take an extra cycle to cross page boundaries? - Retrocomputing Stack Exchange](https://retrocomputing.stackexchange.com/questions/15621/why-dont-all-absolute-x-instructions-take-an-extra-cycle-to-cross-page-boundari)
- [Indirect-Indexed Mode – (Indirect) + Y — 8bitworkshop documentation](https://8bitworkshop.com/docs/chips/m6502/modes/indirect-y.html)
- [Visual6502wiki/6502 Timing States - NESdev Wiki](https://www.nesdev.org/wiki/Visual6502wiki/6502_Timing_States)
- [Reconstruc*on of the MOS 6502](https://www.cs.columbia.edu/~sedwards/classes/2013/4840/reports/6502-presentation.pdf)
- [opcodes and addressing modes – the 6502 – [ emudev ]](https://emudev.de/nes-emulator/opcodes-and-addressing-modes-the-6502/)
- [3.0 M65C02 Instruction Set Compatibility and Timing - MorrisMA/MAM65C02-Processor-Core GitHub Wiki](https://github-wiki-see.page/m/MorrisMA/MAM65C02-Processor-Core/wiki/3.0-M65C02-Instruction-Set-Compatibility-and-Timing)
- [65C02 Reference Manual](https://patpend.net/technical/6502/6502ref.html)
- [The Design and Implementation of the](https://web.mit.edu/6.111/www/f2004/projects/dkm_report.pdf)
- [6502 Programmers Reference](https://csh.rit.edu/~moffitt/docs/6502.html)
- [ORA (zp,X) — 8bitworkshop documentation](https://8bitworkshop.com/docs/chips/m6502/opcodes/01.html)
- [6502 Instruction Set](https://masswerk.at/6502/6502_instruction_set.html)
- [6502 Assembly Language Programming (2nd Edition)](https://seriouscomputerist.atariverse.com/media/pdf/book/6502%20Assembly%20Language%20Programming%20%282nd%20Edition%29.pdf)
- [6502 Addressing Modes](https://www.nesdev.org/obelisk-6502-guide/addressing.html)
- [CPU - 6502](https://fceux.com/web/help/6502CPU.html)
- [MOS Technology 6502](https://en.wikipedia.org/wiki/MOS_Technology_6502)
- [WDC 65C02](https://en.wikipedia.org/wiki/WDC_65C02)
- [6502 - Why don't all Absolute,X instructions take an extra cycle to cross page boundaries? - Retrocomputing Stack Exchange](https://retrocomputing.stackexchange.com/questions/15621/why-dont-all-absolute-x-instructions-take-an-extra-cycle-to-cross-page-boundari)
- [Indirect-Indexed Mode – (Indirect) + Y — 8bitworkshop documentation](https://8bitworkshop.com/docs/chips/m6502/modes/indirect-y.html)
- [Visual6502wiki/6502 Timing States - NESdev Wiki](https://www.nesdev.org/wiki/Visual6502wiki/6502_Timing_States)
- [Reconstruc*on of the MOS 6502](https://www.cs.columbia.edu/~sedwards/classes/2013/4840/reports/6502-presentation.pdf)
- [opcodes and addressing modes – the 6502 – [ emudev ]](https://emudev.de/nes-emulator/opcodes-and-addressing-modes-the-6502/)
- [3.0 M65C02 Instruction Set Compatibility and Timing - MorrisMA/MAM65C02-Processor-Core GitHub Wiki](https://github-wiki-see.page/m/MorrisMA/MAM65C02-Processor-Core/wiki/3.0-M65C02-Instruction-Set-Compatibility-and-Timing)
- [65C02 Reference Manual](https://patpend.net/technical/6502/6502ref.html)
- [The Design and Implementation of the](https://web.mit.edu/6.111/www/f2004/projects/dkm_report.pdf)
- [6502 Programmers Reference](https://csh.rit.edu/~moffitt/docs/6502.html)
- [ORA (zp,X) — 8bitworkshop documentation](https://8bitworkshop.com/docs/chips/m6502/opcodes/01.html)
- [6502 Instruction Set](https://masswerk.at/6502/6502_instruction_set.html)
- [6502 Assembly Language Programming (2nd Edition)](https://seriouscomputerist.atariverse.com/media/pdf/book/6502%20Assembly%20Language%20Programming%20%282nd%20Edition%29.pdf)
- [6502 Addressing Modes](https://www.nesdev.org/obelisk-6502-guide/addressing.html)
-

## Mnemonics
- DCP
- ISC
- RLA
- RRA
- SLO
- SRE
- ASL
- DEC
- LSR
- ROL
- ROR
