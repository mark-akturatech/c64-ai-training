# NMOS 6510 — Classification of Unintended (Undocumented) Opcode Types

**Summary:** This document categorizes the unintended opcodes of the NMOS 6510 processor, detailing their behaviors, addressing modes, and cycle counts.

**Classification and Concise Behavior**

The undocumented NMOS 6510 opcodes can be grouped into several categories based on their combined operations and addressing modes. Below are these categories with their respective opcode families, effective behaviors, addressing modes, and cycle counts.

### 1. Combinations of Two Operations with the Same Addressing Mode (Memory Forms)

These opcodes perform two operations sequentially on the same memory location.

- **SLO (ASL + ORA):** Shifts the memory location left and ORs the result with the accumulator.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 8 cycles
    - Zero Page: 5 cycles
    - Zero Page,X: 6 cycles
    - Absolute: 6 cycles
    - Absolute,X: 7 cycles
    - Absolute,Y: 7 cycles
    - (Indirect),Y: 8 cycles

- **RLA (ROL + AND):** Rotates the memory location left and ANDs the result with the accumulator.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 8 cycles
    - Zero Page: 5 cycles
    - Zero Page,X: 6 cycles
    - Absolute: 6 cycles
    - Absolute,X: 7 cycles
    - Absolute,Y: 7 cycles
    - (Indirect),Y: 8 cycles

- **SRE (LSR + EOR):** Shifts the memory location right and EORs the result with the accumulator.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 8 cycles
    - Zero Page: 5 cycles
    - Zero Page,X: 6 cycles
    - Absolute: 6 cycles
    - Absolute,X: 7 cycles
    - Absolute,Y: 7 cycles
    - (Indirect),Y: 8 cycles

- **RRA (ROR + ADC):** Rotates the memory location right and adds the result to the accumulator with carry.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 8 cycles
    - Zero Page: 5 cycles
    - Zero Page,X: 6 cycles
    - Absolute: 6 cycles
    - Absolute,X: 7 cycles
    - Absolute,Y: 7 cycles
    - (Indirect),Y: 8 cycles

- **SAX (STA + STX):** Stores the result of A AND X into the memory location.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 6 cycles
    - Zero Page: 3 cycles
    - Zero Page,Y: 4 cycles
    - Absolute: 4 cycles

- **LAX (LDA + LDX):** Loads the memory location into both A and X registers.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 6 cycles
    - Zero Page: 3 cycles
    - Zero Page,Y: 4 cycles
    - Absolute: 4 cycles
    - Absolute,Y: 4 cycles
    - (Indirect),Y: 5 cycles

- **DCP (DEC + CMP):** Decrements the memory location and compares the result with the accumulator.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 8 cycles
    - Zero Page: 5 cycles
    - Zero Page,X: 6 cycles
    - Absolute: 6 cycles
    - Absolute,X: 7 cycles
    - Absolute,Y: 7 cycles
    - (Indirect),Y: 8 cycles

- **ISC (INC + SBC):** Increments the memory location and subtracts the result from the accumulator with borrow.
  - Addressing Modes and Cycle Counts:
    - (Indirect,X): 8 cycles
    - Zero Page: 5 cycles
    - Zero Page,X: 6 cycles
    - Absolute: 6 cycles
    - Absolute,X: 7 cycles
    - Absolute,Y: 7 cycles
    - (Indirect),Y: 8 cycles

### 2. Combinations of an Immediate Operand and an Implied Register Transfer/Shift (Immediate Forms)

These opcodes perform operations involving an immediate value and an implied register operation.

- **ANC #imm (AND + ASL/ROL):** ANDs the accumulator with the immediate value and sets the carry flag based on bit 7 of the result. The shift behavior (ASL vs. ROL) varies between NMOS and CMOS variants.
  - Addressing Mode and Cycle Count:
    - Immediate: 2 cycles

- **ALR #imm (AND + LSR):** ANDs the accumulator with the immediate value and then performs a logical shift right.
  - Addressing Mode and Cycle Count:
    - Immediate: 2 cycles

- **ARR #imm (AND + ROR):** ANDs the accumulator with the immediate value and then rotates the result right.
  - Addressing Mode and Cycle Count:
    - Immediate: 2 cycles

- **SBX #imm (CMP + DEX):** Compares the accumulator with the immediate value and then decrements the X register.
  - Addressing Mode and Cycle Count:
    - Immediate: 2 cycles

### 3. Special STA/STX/STY Combos and Related Store/Stack Quirks

These opcodes involve special store operations that combine register values or affect the stack pointer in unique ways.

- **SHA (STA + SHX):** Stores the result of A AND X AND (high byte of the address + 1) into the memory location.
  - Addressing Modes and Cycle Counts:
    - (Indirect),Y: 6 cycles
    - Absolute,Y: 5 cycles

- **SHX (STX + SHY):** Stores the result of X AND (high byte of the address + 1) into the memory location.
  - Addressing Mode and Cycle Count:
    - Absolute,Y: 5 cycles

- **SHY (STY + SHX):** Stores the result of Y AND (high byte of the address + 1) into the memory location.
  - Addressing Mode and Cycle Count:
    - Absolute,X: 5 cycles

- **TAS (TAX + STA + TSX):** Transfers A to X, stores A AND X AND (high byte of the address + 1) into the memory location, and then transfers X to the stack pointer.
  - Addressing Mode and Cycle Count:
    - Absolute,Y: 5 cycles

- **LAS (LDA + LDX + TSX):** Loads the memory location AND stack pointer into A, X, and the stack pointer.
  - Addressing Mode and Cycle Count:
    - Absolute,Y: 4 cycles

## Mnemonics
- SLO
- RLA
- SRE
- RRA
- SAX
- LAX
- DCP
- ISC
- ANC
- ALR
- ARR
- SBX
- SHA
- SHX
- SHY
- TAS
- LAS
