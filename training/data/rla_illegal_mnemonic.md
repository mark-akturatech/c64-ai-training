# rla (Kick Assembler illegal-6502 table)

**Summary:** Kick Assembler lists the illegal mnemonic "rla" with opcode bytes $27, $37, $23, $2F, $3F, $3B, and $33, each corresponding to specific addressing modes. This chunk records the raw entries and points to related illegal-opcode groups.

**Description**

This entry records Kick Assembler's illegal-6502 table lines for the mnemonic "rla" and the opcode bytes explicitly listed in the provided source. The source lists seven opcode bytes ($27, $37, $23, $2F, $3F, $3B, $33), each corresponding to specific addressing modes:

- $27: Zero Page
- $37: Zero Page,X
- $23: (Zero Page,X)
- $2F: Absolute
- $3F: Absolute,X
- $3B: Absolute,Y
- $33: (Zero Page),Y

The "rla" instruction performs a rotate left operation on the memory operand, followed by an AND operation between the accumulator and the result. The operation can be described as:

1. Rotate the memory operand left through the carry flag.
2. AND the accumulator with the result of the rotation.

This sequence affects the processor flags as follows:

- **Negative (N):** Set if the result of the AND operation is negative.
- **Zero (Z):** Set if the result of the AND operation is zero.
- **Carry (C):** Set according to the result of the rotate left operation.

No additional opcode encodings for "rla" are listed in Kick Assembler's table beyond the seven mentioned. The table does not provide variant names or aliases for this instruction.

## Source Code

```text
rla

$27

$37

$23

$2F

$3F

$3B

$33
```

## References

- "rra_illegal_mnemonic" — expands on related illegal rotate+memory/accumulator opcode RRA
- "dcp_dcm_and_lax_lxa_group" — expands on other illegal multi-byte/multi-effect opcodes
- "dtv_instruction_set" — expands on alternative CPU modes (DTV) and their mnemonics

## Mnemonics
- RLA
