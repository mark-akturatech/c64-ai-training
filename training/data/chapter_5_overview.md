# Addressing Modes — Chapter 5

**Summary:** This chapter provides detailed definitions of each 6502 addressing mode, including implied/accumulator, immediate, absolute, zero-page, indexed (X/Y), relative (branches), indirect, indirect-indexed, and indexed-indirect. It includes example assembly code, opcode encodings, timing/cycle counts, and worked examples illustrating address calculations such as zero-page wrap and page crossings.

**Addressing Modes**

The 6502 microprocessor supports several addressing modes, each determining how the operand for an instruction is specified. Understanding these modes is crucial for effective assembly programming.

### 1. Implied (Implicit) Addressing

In implied addressing, the operand is implicitly defined by the instruction itself. No additional data is required.

- **Example:**
  - `INX` (Increment X Register)
  - Opcode: `$E8`
  - Bytes: 1
  - Cycles: 2

### 2. Accumulator Addressing

The instruction operates directly on the accumulator register.

- **Example:**
  - `ASL A` (Arithmetic Shift Left Accumulator)
  - Opcode: `$0A`
  - Bytes: 1
  - Cycles: 2

### 3. Immediate Addressing

The operand is provided as an immediate value within the instruction.

- **Example:**
  - `LDA #$10` (Load Accumulator with Immediate Value $10)
  - Opcode: `$A9 10`
  - Bytes: 2
  - Cycles: 2

### 4. Zero Page Addressing

The operand is located at an address in the first 256 bytes of memory (page zero). This mode allows for shorter instructions and faster execution.

- **Example:**
  - `LDA $00` (Load Accumulator from Zero Page Address $00)
  - Opcode: `$A5 00`
  - Bytes: 2
  - Cycles: 3

### 5. Zero Page,X Addressing

The effective address is calculated by adding the contents of the X register to a zero-page address. If the sum exceeds $FF, it wraps around within the zero page.

- **Example:**
  - `LDA $10,X` (Load Accumulator from Zero Page Address $10 Offset by X)
  - Opcode: `$B5 10`
  - Bytes: 2
  - Cycles: 4

- **Address Calculation Example:**
  - If X = $20 and instruction is `LDA $F0,X`:
    - Base Address: $F0
    - X Register: $20
    - Effective Address: ($F0 + $20) & $FF = $10

### 6. Zero Page,Y Addressing

Similar to Zero Page,X but uses the Y register. This mode is available only for the `LDX` and `STX` instructions.

- **Example:**
  - `LDX $10,Y` (Load X Register from Zero Page Address $10 Offset by Y)
  - Opcode: `$B6 10`
  - Bytes: 2
  - Cycles: 4

### 7. Relative Addressing

Used exclusively for branch instructions. The operand is an 8-bit signed offset added to the program counter (PC) if the branch is taken.

- **Example:**
  - `BEQ LABEL` (Branch if Equal to LABEL)
  - Opcode: `$F0 xx` (where `xx` is the offset)
  - Bytes: 2
  - Cycles: 2 (plus 1 if branch is taken, plus 1 if page boundary is crossed)

- **Address Calculation Example:**
  - If PC = $1000 and instruction is `BEQ $05`:
    - Offset: $05
    - Effective Address: $1000 + 2 (size of instruction) + $05 = $1007

### 8. Absolute Addressing

The operand is specified by a full 16-bit address.

- **Example:**
  - `JMP $1234` (Jump to Address $1234)
  - Opcode: `$4C 34 12`
  - Bytes: 3
  - Cycles: 3

### 9. Absolute,X Addressing

The effective address is calculated by adding the contents of the X register to a 16-bit absolute address. If this addition crosses a page boundary, an additional cycle is required.

- **Example:**
  - `LDA $3000,X` (Load Accumulator from Address $3000 Offset by X)
  - Opcode: `$BD 00 30`
  - Bytes: 3
  - Cycles: 4 (plus 1 if page boundary is crossed)

- **Address Calculation Example:**
  - If X = $92 and instruction is `LDA $2000,X`:
    - Base Address: $2000
    - X Register: $92
    - Effective Address: $2000 + $92 = $2092

### 10. Absolute,Y Addressing

Similar to Absolute,X but uses the Y register. It also incurs an additional cycle if a page boundary is crossed.

- **Example:**
  - `LDA $4000,Y` (Load Accumulator from Address $4000 Offset by Y)
  - Opcode: `$B9 00 40`
  - Bytes: 3
  - Cycles: 4 (plus 1 if page boundary is crossed)

### 11. Indirect Addressing

Used exclusively with the `JMP` instruction. The operand is a 16-bit address pointing to another 16-bit address, which is the actual target.

- **Example:**
  - `JMP ($1234)` (Jump to Address Stored at $1234)
  - Opcode: `$6C 34 12`
  - Bytes: 3
  - Cycles: 5

- **Address Calculation Example:**
  - If memory at $1234 contains $78 and at $1235 contains $56:
    - Target Address: $5678

- **Note:** Due to a bug in the original 6502, if the indirect vector address ends in $FF (e.g., `JMP ($12FF)`), the high byte is fetched from $1200 instead of $1300.

### 12. Indexed Indirect (Pre-Indexed) Addressing

The effective address is found by adding the X register to a zero-page address, then using the resulting address to fetch the low and high bytes of the target address.

- **Example:**
  - `LDA ($20,X)` (Load Accumulator Indirectly from Zero Page Address $20 Offset by X)
  - Opcode: `$A1 20`
  - Bytes: 2
  - Cycles: 6

- **Address Calculation Example:**
  - If X = $04 and memory at $24 contains $78 and at $25 contains $56:
    - Base Address: $20 + $04 = $24
    - Target Address: $5678

### 13. Indirect Indexed (Post-Indexed) Addressing

The effective address is found by fetching a 16-bit address from a zero-page location, then adding the Y register to this address.

- **Example:**
  - `LDA ($20),Y` (Load Accumulator Indirectly from Address Pointed to by Zero Page Address $20 Offset by Y)
  - Opcode: `$B1 20`
  - Bytes: 2
  - Cycles: 5 (plus 1 if page boundary is crossed)

- **Address Calculation Example:**
  - If Y = $04 and memory at $20 contains $78 and at $21 contains $56:
    - Base Address: $5678
    - Effective Address: $5678 + $04 = $567C

**Timing Diagrams**

Below is a timing diagram for the `LDA ($20),Y` instruction, illustrating the sequence of operations and cycles:


*Note: An additional cycle is added if a page boundary is crossed during the address calculation.*

**Opcode Table**

Below is a partial opcode table for the `LDA` instruction across various addressing modes:


*Note: The "+1 if page crossed" indicates an additional cycle is required if the effective address calculation crosses a page boundary.*

## Source Code

```text
Cycle | Operation
------+---------------------------------
  1   | Fetch opcode ($B1)
  2   | Fetch zero-page address ($20)
  3   | Read low byte of target address from zero page ($20)
  4   | Read high byte of target address from zero page ($21)
  5   | Add Y to low byte of target address; if carry, increment high byte
  6   | Fetch operand from effective address
```

```text
Addressing Mode | Opcode | Bytes | Cycles
----------------+--------+-------+-------
Immediate       |   $A9  |   2   |   2
Zero Page       |   $A5  |   2   |   3
Zero Page,X     |   $B5  |   2   |   4
Absolute        |   $AD  |   3   |   4
Absolute,X      |   $BD  |   3   | 4 (+1 if page crossed)
Absolute,Y      |   $B9  |   3   | 4 (+1 if page crossed)
Indirect,X      |   $A1  |   2   |   6
Indirect,Y      |   $B1  |   2   | 5 (+1 if page crossed)
```


## References

- "6502 Addressing Modes" — Detailed coverage, examples, and opcode mappings. [Source](https://www.nesdev.org/obelisk-6502-guide/addressing.html)
- "6502 Instruction Set" — Comprehensive instruction set reference. [Source](https://masswerk.at/6502/6502_instruction_set.html)
- "6502 Programmers Reference" — In-depth programming reference. [Source](https://www.csh.rit.edu/~moffitt/docs/6502.html)