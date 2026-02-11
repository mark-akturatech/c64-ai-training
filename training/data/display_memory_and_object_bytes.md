# Using the monitor memory display (.M) to inspect object bytes and BRK termination

**Summary:** Shows how to use the monitor .M command (e.g. `.M 033C 0341`) to view object bytes in memory and why bytes after a BRK ($00) are irrelevant for program execution; includes an example memory dump and address-to-byte mapping.

## Inspecting object bytes with .M
Use the machine monitor memory display command `.M start end` to view the raw object bytes placed in RAM by the assembler. The monitor may show bytes beyond the program's meaningful area; execution is determined by opcodes and control-flow (for example BRK), not by whatever leftover values follow.

In the example below the BRK opcode `$00` appears at address `$0341`. The program will stop when it reaches that BRK, so the bytes at `$0342` and `$0343` (and beyond) are irrelevant to execution — they were simply whatever was previously in memory.

Example behavior to search for: `.M 033C 0341`, displayed bytes, BRK at `$0341`, bytes after BRK ignored by execution.

## Example and address map
The monitor output shown below corresponds to a memory range starting at `$033C`. The first six bytes shown are the assembled program; the two trailing bytes are leftover memory and do not affect runtime because execution stops at the BRK (`$00`) at `$0341`.

Address map (from the example):
- $033C: A9
- $033D: 48
- $033E: 20
- $033F: D2
- $0340: FF
- $0341: 00   (BRK — program stops here)
- $0342: xx   (previous contents, irrelevant)
- $0343: xx   (previous contents, irrelevant)

Note: BRK opcode is `$00` on the 6502; encountering it causes the program to stop (or enter the BRK handling vector), so bytes following that value do not form part of the executed program in this case.

## Source Code
```asm
.M 033C 0341
.:033C A9 48 20 D2 FF 00 xx xx
```

## References
- "assembling_using_monitor_example" — expands on inspecting what the assembler stored
- "disassembler_checking_and_editing" — expands on using the disassembler to translate bytes back to readable source

## Mnemonics
- BRK
