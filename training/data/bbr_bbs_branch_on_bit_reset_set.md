# Kick Assembler: 65C02 BBR/BBS opcode definitions (partial)

**Summary:** Defines 65C02 bit-test-and-branch assembler mnemonics BBR5, BBR6, BBR7 and BBS0..BBS7 with their opcode bytes ($5F..$FF). Useful search terms: 65C02, BBR, BBS, opcodes, Kick Assembler.

## Description
This chunk documents Kick Assembler defines for the 65C02 single-bit branch instructions: BBR (Branch if Bit Reset) and BBS (Branch if Bit Set). These instructions test a single bit in a memory location and branch based on the bit's state (zero or one). (Zero-page addressing and 8-bit relative displacement are used by the 65C02 bit-branch instructions.)

The provided list contains the opcode byte values as defined in the assembler for the listed mnemonics. Only the listed mnemonics/opcodes are present in this source: BBR5, BBR6, BBR7 and BBS0 through BBS7.

## Source Code
```text
bbr5

$5f

bbr6

$6f

bbr7

$7f

bbs0

$8f

bbs1

$9f

bbs2

$af

bbs3

$bf

bbs4

$cf

bbs5

$df

bbs6

$ef

bbs7

$ff

```

## References
- "bit_instruction_65c02" — expands on bit instruction and related opcodes (test bit)
- "smb_instructions" — expands on complementary single-bit memory set operations (SMB family)