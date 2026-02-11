# Kick Assembler - RMB (Reset Memory Bit) family: rmb0..rmb7

**Summary:** RMB0..RMB7 (Reset Memory Bit) Kick Assembler mnemonics with opcode bytes $07, $17, $27, $37, $47, $57, $67, $77. See SMB (complementary Set Memory Bit) and TRB/TSB (related memory-bit byte operations) for related instructions.

## Description
This chunk lists the RMB (Reset Memory Bit) mnemonic family as recognized by Kick Assembler and the corresponding opcode byte values. The entry is a direct mapping of mnemonic -> opcode byte (hex). The family covers eight bit-reset variants rmb0 through rmb7 with their opcode bytes as shown below.

## Source Code
```text
rmb0

$07

rmb1

$17

rmb2

$27

rmb3

$37

rmb4

$47

rmb5

$57

rmb6

$67

rmb7

$77

```

## References
- "smb_instructions" — SMB (Set Memory Bit) family, complementary to RMB
- "trb_tsb_instructions" — TRB/TSB byte-granularity memory bit operations, related to RMB/SMB

## Mnemonics
- RMB0
- RMB1
- RMB2
- RMB3
- RMB4
- RMB5
- RMB6
- RMB7
