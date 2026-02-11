# BIT (65C02) — opcode list from Kick Assembler

**Summary:** Kick Assembler listing of the 65C02 BIT instruction and its opcode encodings ($89, $24, $34, $2C, $3C) for the instruction's addressing-mode variants; the original listing includes a blank line after the opcode lines.

## Listing contents
This chunk preserves the literal Kick Assembler listing for the 65C02 BIT mnemonic and the five opcode bytes shown in the source. The opcodes correspond to the 65C02 forms: immediate ($89), zero page ($24), zero page,X ($34), absolute ($2C), and absolute,X ($3C). The original source included an explicit blank line following the opcode lines; that blank line is preserved in the Source Code section.

## Source Code
```text
bit

$89

$24

$34

$2c

$3c

```

## References
- "bbr_bbs_branch_on_bit_reset_set" — expands on branch-on-bit (BBR/BBS) instructions that rely on tested bit results
- "cmp_eor_inc_dec_group" — expands on logical/arithmetic instructions that interact with flags affected by BIT

## Mnemonics
- BIT
