# NMOS 6510 — Undocumented Mnemonic RLA (Opcode Bytes)

**Summary:** The undocumented NMOS 6510 instruction "RLA" performs a rotate left on a memory location and then ANDs the result with the accumulator. This chunk details the opcode bytes associated with RLA across various addressing modes and provides information on assembler support, instruction lengths, cycle counts, and CPU variant considerations.

**Description**

RLA is an undocumented instruction on the NMOS 6510 processor that combines a rotate left operation on a memory operand with a bitwise AND operation with the accumulator. The operation can be described as:

1. Rotate the memory operand left (ROL).
2. AND the result with the accumulator (A := A AND mem).

This instruction affects the Negative (N), Zero (Z), and Carry (C) flags.

Several assemblers support the RLA mnemonic directly, while others may use different aliases or require manual opcode insertion. For example:

- **Millfork**: Supports the RLA mnemonic directly. ([millfork.readthedocs.io](https://millfork.readthedocs.io/en/v0.3.30/abi/undocumented/?utm_source=openai))
- **ca65**: Supports RLA in 6502X mode, which includes illegal opcodes. ([cc65.github.io](https://cc65.github.io/doc/ca65.html?utm_source=openai))
- **xa**: Does not support undocumented opcodes; they must be entered manually using the `.byte` directive. ([manpages.org](https://manpages.org/xa?utm_source=openai))

## Source Code

```text
Opcode mapping for undocumented RLA (ROL then AND with A)

Addressing Mode        Opcode (Hex)    Bytes    Cycles
------------------------------------------------------
Zero Page              $27             2        5
Zero Page,X            $37             2        6
Absolute               $2F             3        6
Absolute,X             $3F             3        7
Absolute,Y             $3B             3        7
(Indirect,X)           $23             2        8
(Indirect),Y           $33             2        8
```

Note: Cycle counts may vary depending on specific CPU revisions and conditions such as page boundary crossings.

## Key Registers

- **Accumulator (A)**: Updated with the result of the AND operation.
- **Processor Status Flags**:
  - **Negative (N)**: Set if the result is negative; cleared otherwise.
  - **Zero (Z)**: Set if the result is zero; cleared otherwise.
  - **Carry (C)**: Set according to the last bit shifted out during the ROL operation.

## References

- "slo_mnemonic_mapping" — expands on the previous illegal opcode family SLO and its mnemonic mappings.
- "sre_mnemonic_mapping" — expands on the related illegal opcode SRE and its mnemonic mappings.

**Note on CPU Variants**: The behavior of undocumented opcodes like RLA can vary between different CPU revisions. For instance, the CMOS 65C02 may not support these undocumented instructions, or they may behave differently. It's essential to test code on the target hardware to ensure compatibility.

## Mnemonics
- RLA
