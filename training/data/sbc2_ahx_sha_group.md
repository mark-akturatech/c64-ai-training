# NMOS 6510 — illegal-opcode rows: SBC2, AHX, SHA family (assembler-name mapping)

**Summary:** This document details the NMOS 6510 undocumented opcodes SBC2, AHX, SHA variants, and SHY, providing opcode byte values, assembler-specific mnemonic mappings, addressing modes, effective behaviors, cycle counts, and example assembly lines.

**Description**

The NMOS 6510 microprocessor includes several undocumented opcodes, often referred to as "illegal" opcodes. This document focuses on the following:

- **SBC2**: An alternative mnemonic for the undocumented opcode `$EB`, which functions identically to the standard `SBC` immediate instruction.
- **AHX**: Also known as `SHA` or `AXA`, this opcode stores the result of `A AND X AND (high-byte of address + 1)` into memory.
- **SHA Variants**: Multiple undocumented opcodes that store variations of `A AND X` into memory, differing by addressing modes.
- **SHY**: Stores the result of `Y AND (high-byte of address + 1)` into memory.

These opcodes are not officially documented and may exhibit unstable behavior across different hardware implementations. Their usage is generally discouraged in favor of standard opcodes.

**Opcode Details**

### SBC2

- **Opcode Byte**: `$EB`
- **Mnemonic**: `SBC2`
- **Addressing Mode**: Immediate
- **Effective Behavior**: Performs subtraction with carry, identical to the standard `SBC` immediate instruction.
- **Cycle Count**: 2 cycles
- **Example Assembly**:

### AHX (SHA, AXA)

- **Opcode Byte**: `$9F`
- **Mnemonic**: `AHX` (also known as `SHA` or `AXA`)
- **Addressing Mode**: Absolute,Y
- **Effective Behavior**: Stores the result of `A AND X AND (high-byte of address + 1)` into memory at the specified address.
- **Cycle Count**: 5 cycles
- **Example Assembly**:

### SHA Variants

1. **SHA (Absolute,Y)**
   - **Opcode Byte**: `$9F`
   - **Mnemonic**: `SHA`
   - **Addressing Mode**: Absolute,Y
   - **Effective Behavior**: Stores `A AND X AND (high-byte of address + 1)` into memory.
   - **Cycle Count**: 5 cycles
   - **Example Assembly**:

2. **SHA (Indirect),Y**
   - **Opcode Byte**: `$93`
   - **Mnemonic**: `SHA`
   - **Addressing Mode**: (Indirect),Y
   - **Effective Behavior**: Stores `A AND X AND (high-byte of address + 1)` into memory.
   - **Cycle Count**: 6 cycles
   - **Example Assembly**:

### SHY (SAY)

- **Opcode Byte**: `$9C`
- **Mnemonic**: `SHY` (also known as `SAY`)
- **Addressing Mode**: Absolute,X
- **Effective Behavior**: Stores `Y AND (high-byte of address + 1)` into memory.
- **Cycle Count**: 5 cycles
- **Example Assembly**:

**Assembler-Specific Mnemonic Mappings**

Different assemblers may use varying mnemonics for these undocumented opcodes. Below is a mapping of common assemblers and their respective mnemonics:

| Opcode Byte | Addressing Mode | Mnemonic (Assembler A) | Mnemonic (Assembler B) | Mnemonic (Assembler C) |
|-------------|-----------------|------------------------|------------------------|------------------------|
| `$EB`       | Immediate       | `SBC2`                 | `SBC`                  | `USBC`                 |
| `$9F`       | Absolute,Y      | `AHX`                  | `SHA`                  | `AXA`                  |
| `$93`       | (Indirect),Y    | `SHA`                  | `AHX`                  | `AXA`                  |
| `$9C`       | Absolute,X      | `SHY`                  | `SAY`                  | `SYA`                  |

*Note: The actual mnemonics used can vary; consult the documentation for the specific assembler in use.*

## Source Code

  ```assembly
  SBC2 #$10  ; Subtract 16 from the accumulator with carry
  ```

  ```assembly
  AHX $2000,Y  ; Store A AND X AND (high-byte of $2000 + 1) into memory at $2000 + Y
  ```

     ```assembly
     SHA $3000,Y  ; Store A AND X AND (high-byte of $3000 + 1) into memory at $3000 + Y
     ```

     ```assembly
     SHA ($40),Y  ; Store A AND X AND (high-byte of address pointed by $40 + 1) into memory
     ```

  ```assembly
  SHY $4000,X  ; Store Y AND (high-byte of $4000 + 1) into memory at $4000 + X
  ```


## References

- "sbc_sbc_mnemonic" — expands on SBC / SBC2 naming
- "shy_shy_mnemonic" — expands on SHY / related family naming

*Disclaimer: The use of undocumented opcodes is generally discouraged due to potential instability and lack of support across different hardware and assemblers.*

## Mnemonics
- SBC2
- SBC
- USBC
- AHX
- SHA
- AXA
- SHY
- SAY
- SYA
