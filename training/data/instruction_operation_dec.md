# DEC — 6502 Decrement Memory (DEC)

**Summary:** DEC is the 6502 memory-decrement instruction (mnemonic DEC). It decrements an 8-bit memory operand modulo 256 (wraps), sets the Negative (Sign) and Zero flags based on the result, and stores the result back to memory.

**Behavior**
DEC performs a read-modify-write on a memory operand: it reads the current byte, subtracts one (with 8-bit wrap), updates the processor flags for Negative (N) and Zero (Z) according to the new 8-bit result, and writes the result back to the same memory location.

Key points:
- Arithmetic: result = (memory - 1) & $FF (wraps at 0 -> $FF).
- Flags: sets N (Negative/Sign) from bit 7 of the result and Z (Zero) if result == $00.
- Unaffected flags: DEC does not change the Carry (C) flag or the Overflow (V) flag; other status flags remain as before.
- Operation type: read-modify-write memory operation — the instruction reads the operand and then writes the modified value back (can cause extra bus/memory accesses and side effects on memory-mapped hardware).
- Typical addressing usage: DEC is used with memory addressing modes (e.g., Zero Page, Zero Page,X, Absolute, Absolute,X) since it operates on memory rather than a CPU register.

**Addressing Modes and Opcodes**
DEC supports the following addressing modes:

- **Zero Page**: `DEC $nn`  
  - Opcode: `$C6`
  - Bytes: 2
  - Cycles: 5

- **Zero Page,X**: `DEC $nn,X`  
  - Opcode: `$D6`
  - Bytes: 2
  - Cycles: 6

- **Absolute**: `DEC $nnnn`  
  - Opcode: `$CE`
  - Bytes: 3
  - Cycles: 6

- **Absolute,X**: `DEC $nnnn,X`  
  - Opcode: `$DE`
  - Bytes: 3
  - Cycles: 7

**Timing Diagram**
The DEC instruction is a read-modify-write operation, which involves reading the memory operand, modifying it, and writing it back. The cycle-by-cycle breakdown is as follows:

- **Zero Page Addressing (5 cycles):**
  1. Fetch opcode.
  2. Fetch zero page address.
  3. Read from zero page address.
  4. Modify data (decrement).
  5. Write back to zero page address.

- **Zero Page,X Addressing (6 cycles):**
  1. Fetch opcode.
  2. Fetch zero page address.
  3. Read from zero page address.
  4. Add X to address.
  5. Read from calculated address.
  6. Modify data (decrement).
  7. Write back to calculated address.

- **Absolute Addressing (6 cycles):**
  1. Fetch opcode.
  2. Fetch low byte of address.
  3. Fetch high byte of address.
  4. Read from absolute address.
  5. Modify data (decrement).
  6. Write back to absolute address.

- **Absolute,X Addressing (7 cycles):**
  1. Fetch opcode.
  2. Fetch low byte of address.
  3. Fetch high byte of address.
  4. Add X to address.
  5. Read from calculated address.
  6. Modify data (decrement).
  7. Write back to calculated address.

**Assembly Usage Examples**
- **Zero Page Addressing:**

- **Absolute Addressing:**

**Hardware Side-Effects on Memory-Mapped I/O**
Since DEC is a read-modify-write operation, it can have unintended side effects when used on memory-mapped I/O registers. The sequence of reading, modifying, and writing back can trigger hardware behaviors associated with both read and write operations. For example, reading from certain I/O registers might acknowledge an interrupt or clear a status flag, while writing might initiate a device action. Therefore, caution is advised when using DEC on memory-mapped I/O locations to avoid unintended hardware interactions.

## Source Code

  ```assembly
  LDA #$10    ; Load A with 16
  STA $20     ; Store A into memory location $20
  DEC $20     ; Decrement value at memory location $20
  ```

  ```assembly
  LDA #$10    ; Load A with 16
  STA $1000   ; Store A into memory location $1000
  DEC $1000   ; Decrement value at memory location $1000
  ```


## References
- "6502 Instruction Set Quick Reference" — provides opcode and cycle information for DEC.
- "6502 Instruction Set" — details on DEC instruction behavior and addressing modes.

## Mnemonics
- DEC
