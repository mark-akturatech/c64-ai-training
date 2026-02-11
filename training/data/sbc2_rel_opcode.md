# sbc2 — Kick Assembler illegal/variant mnemonic (imm -> $EB)

**Summary:** Kick Assembler defines an illegal/variant 6502 mnemonic "sbc2" mapped to the immediate addressing mode ("imm") with opcode $EB. This opcode functions identically to the standard SBC immediate instruction ($E9). Availability and exact opcode mappings may vary with CPU mode.

**Description**

In Kick Assembler's table of illegal/variant 6502 mnemonics, the mnemonic "sbc2" is associated with the immediate addressing mode and assigned opcode $EB.

- **Mnemonic:** sbc2
- **Addressing mode:** Immediate
- **Opcode (hex):** $EB

This entry is part of Kick Assembler's collection of illegal or variant opcodes. The opcode $EB performs the same operation as the standard SBC immediate instruction ($E9), subtracting the operand and the carry flag from the accumulator.

## Source Code

```assembly
; Example usage of sbc2 in Kick Assembler
sbc2 #$10  ; Subtracts $10 and the carry flag from the accumulator
```

## Key Registers

- **Accumulator (A):** Stores the result of the subtraction.
- **Processor Status Flags:**
  - **Negative (N):** Set if the result is negative.
  - **Overflow (V):** Set if signed overflow occurs.
  - **Zero (Z):** Set if the result is zero.
  - **Carry (C):** Cleared if a borrow occurs; set otherwise.

## References

- "dcp_dcm_and_lax_lxa_group" — expands on other illegal arithmetic and combined-effect opcodes
- "dtv_instruction_set" — expands on different CPU modes and how opcode mappings may change

## Mnemonics
- SBC2
- SBC
