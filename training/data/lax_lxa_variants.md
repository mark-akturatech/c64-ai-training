# NMOS 6510 — LAX / LXA Assembler-Name Variants

**Summary:** This document details the undocumented NMOS 6510 opcodes commonly referred to as LAX or LXA, which load both the A and X registers simultaneously. It includes opcode-to-mnemonic mappings, addressing mode examples, assembler label variants, and explanations of specific opcode references.

**Description**

The LAX instruction is an undocumented opcode in the 6502/6510 microprocessors that loads both the accumulator (A) and the X register with the same value from memory. Different assemblers may refer to this instruction using various mnemonics, such as LAX or LXA. The opcode `$AB` is associated with the immediate addressing mode of this instruction.

**Opcode-to-Mnemonic Mapping for LAX/LXA**

The following table provides the opcode-to-mnemonic mapping for the LAX instruction across different addressing modes:

| Addressing Mode | Mnemonic | Opcode | Bytes | Cycles |
|-----------------|----------|--------|-------|--------|
| Immediate       | LXA #    | $AB    | 2     | 2      |
| Zero Page       | LAX      | $A7    | 2     | 3      |
| Zero Page,Y     | LAX      | $B7    | 2     | 4      |
| Absolute        | LAX      | $AF    | 3     | 4      |
| Absolute,Y      | LAX      | $BF    | 3     | 4*     |
| (Indirect,X)    | LAX      | $A3    | 2     | 6      |
| (Indirect),Y    | LAX      | $B3    | 2     | 5*     |

*Add 1 cycle if page boundary is crossed.

*Note:* The immediate mode is often referred to as LXA in some assemblers.

**Addressing Mode Examples**

Examples of the LAX/LXA instruction in various addressing modes:

- **Immediate:**
  Loads the value `$10` into both A and X registers.

- **Zero Page:**
  Loads the value at memory location `$20` into both A and X registers.

- **Zero Page,Y:**
  Loads the value at memory location `$20` offset by Y into both A and X registers.

- **Absolute:**
  Loads the value at memory location `$2000` into both A and X registers.

- **Absolute,Y:**
  Loads the value at memory location `$2000` offset by Y into both A and X registers.

- **(Indirect,X):**
  Loads the value from the address pointed to by `$20` offset by X into both A and X registers.

- **(Indirect),Y:**
  Loads the value from the address pointed to by `$20` offset by Y into both A and X registers.

**Assembler Variants and Syntax**

Different assemblers may use varying mnemonics for the same instruction:

- **ACME Assembler:**
  Uses `LAX` for all addressing modes.

- **DASM Assembler:**
  Uses `LAX` for all addressing modes.

- **Millfork Compiler:**
  Supports both `LAX` and `LXA` mnemonics, with `LXA` specifically for the immediate addressing mode.

*Note:* The immediate mode (`$AB`) is often referred to as `LXA` in some assemblers to distinguish it from other addressing modes.

**Explanation of Opcode `$AB`**

The opcode `$AB` corresponds to the immediate addressing mode of the LAX instruction, often referred to as `LXA`. This instruction loads both the A and X registers with the immediate value provided. Due to its undocumented nature, behavior may vary across different 6502 variants.

## Source Code

  ```
  LXA #$10
  ```

  ```
  LAX $20
  ```

  ```
  LAX $20,Y
  ```

  ```
  LAX $2000
  ```

  ```
  LAX $2000,Y
  ```

  ```
  LAX ($20,X)
  ```

  ```
  LAX ($20),Y
  ```


## References

- [Virtual 6502 Disassembler](https://www.masswerk.at/6502/disassembler.html)
- [Millfork Documentation on Undocumented Opcodes](https://millfork.readthedocs.io/en/v0.3.8/abi/undocumented/)
- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [6502 Instruction Tables](https://www.masswerk.at/6502/instruction-tables/)
- [ca65 Users Guide](https://cc65.github.io/doc/ca65.html)

## Mnemonics
- LAX
- LXA
