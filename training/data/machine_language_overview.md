# Machine language (native opcodes)

**Summary:** Machine language (6502 native opcodes) is the fastest form of program code because instructions execute directly with no interpreter; it provides execution determinism and fully known machine state. The primary drawback is that programs are raw hexadecimal opcodes, which motivates using an assembler (tool that translates mnemonics to opcodes).

## Overview
Machine language runs at the highest possible speed on the 6502 because each opcode is fetched and executed directly by the CPU with no runtime interpretation. This yields deterministic execution — the program state (registers, flags, memory) is precisely known at each step — a behavior rarely available when running code under an interpreted environment such as BASIC.

The tradeoff is human readability: machine-language programs are sequences of hexadecimal codes the CPU understands but are cumbersome for programmers to write and read. Because memorizing and inspecting hex opcodes is impractical for most developers, assemblers are used to write programs with readable mnemonics that are translated into the native opcodes the CPU executes.

## References
- "assembly_language_definition" — expands on using an assembler to get machine speed with readable mnemonics