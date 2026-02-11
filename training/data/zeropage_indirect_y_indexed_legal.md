# NMOS 6510 — Zeropage Indirect,Y Addressing (2 Bytes, 5+1 Cycles) and Unintended Decimal Mode

**Summary:** This document details the 6510 (NMOS 6502-family) Zeropage Indirect,Y addressing mode ((zp),Y), including instruction length, base timing, page-crossing behavior, dummy reads, and associated opcodes. It also explores the NMOS 6510's decimal (BCD) mode behavior for ADC and SBC instructions, covering nibble correction rules and flag effects.

**Zeropage Indirect,Y Addressing ((zp),Y)**

- **Addressing Mode Synopsis:**
  - **Operand:** One-byte zero page pointer (P).
  - **Effective Address:** Read 16-bit address from zero page at P and P+1 (wrapping within zero page), then add Y to the low byte; carry into high byte when the low byte overflows.
  - **Instruction Length:** 2 bytes (opcode + zp operand).
  - **Timing:** Base 5 cycles for read-type instructions; add 1 cycle when indexing causes a page boundary crossing, or when the instruction performs a memory write.
  - **Dummy Reads:** The CPU performs intermediate memory reads from zero page to fetch the low and high bytes of the indirect vector; a further dummy read occurs during the page-cross case before the final memory access.

- **Instructions Utilizing (zp),Y Addressing:**
  - **Read-Type Instructions:**
    - ADC (Opcode: $71)
    - AND (Opcode: $31)
    - CMP (Opcode: $D1)
    - EOR (Opcode: $51)
    - LDA (Opcode: $B1)
    - ORA (Opcode: $11)
    - SBC (Opcode: $F1)
  - **Store-Type Instruction:**
    - STA (Opcode: $91)
  - **Undocumented/Illegal Opcodes:**
    - LAX (Opcode: $B3)
    - SHA (Opcode: $93)

- **Per-Cycle Behavior:**
  1. **Cycle 1:** Fetch opcode from memory; increment PC.
  2. **Cycle 2:** Fetch zero-page address (P); increment PC.
  3. **Cycle 3:** Read low byte of effective address from zero page at P.
  4. **Cycle 4:** Read high byte of effective address from zero page at P+1; add Y to low byte; if overflow, increment high byte.
  5. **Cycle 5:** If no page-crossing, read from effective address; if page-crossing, perform dummy read from effective address with incorrect high byte.
  6. **Cycle 6 (if page-crossing):** Read from correct effective address.

- **Timing Diagram for Page-Crossing Case:**


  *EA* represents the effective address with the incorrect high byte during the dummy read.

- **Write Instructions:**
  - For write instructions (e.g., STA (zp),Y), the write requires an additional cycle, making the total 6 cycles.

**Decimal Mode (Unintended / NMOS 6510 Behavior)**

- **Scope:**
  - Applies to the NMOS 6510 (6502 family NMOS chips).
  - Only ADC and SBC (and undocumented instructions derived from them) are affected by the decimal (D) flag.

- **Purpose:**
  - Decimal mode treats each nibble (4 bits) as a decimal digit (0–9).
  - Documents exact behavior for all nibble values (valid and invalid BCD) on the NMOS 6510.

- **Nibble Decimal-Correction Rules:**
  - **Addition Correction:**
    - If (nibble > $9) or (carry-in == 1), then nibble += $6.
    - If (nibble > $F), then set carry-out to 1; else, carry-out = carry-in.
  - **Subtraction Correction:**
    - If (borrow-in == 0), then nibble -= $6.
    - If (nibble < $6), then set borrow-out to 1; else, borrow-out = borrow-in.

- **Processor Flags Behavior in Decimal Mode:**
  - **Carry (C):** Acts as a multi-byte carry/borrow as expected.
  - **Negative (N) and Overflow (V):**
    - Set using binary rules based on an intermediate result computed after high-order nibble is added/subtracted but before decimal correction.
    - N = bit 7 of that intermediate result.
    - V uses the same logic as binary mode, but on an intermediate (pre-correction) result.
  - **Zero (Z):** Set according to the binary (non-BCD) result.

- **Example Illustrating Flag Differences:**
  - ```assembly
    SED
    CLC
    LDA #$80
    ADC #$80
Timing Diagram for Page-Crossing Case:

Cycle:    1    2    3    4    5    6
         ---  ---  ---  ---  ---  ---
Address: PC   PC+1 P    P+1  EA*  EA
Data:    OP   P    ADL  ADH  --   DATA

## Source Code

  ```text
  Cycle:    1    2    3    4    5    6
           ---  ---  ---  ---  ---  ---
  Address: PC   PC+1 P    P+1  EA*  EA
  Data:    OP   P    ADL  ADH  --   DATA
  ```

    ```
  - This sequence demonstrates how V and N are set from the intermediate binary result before BCD correction.

## Source Code

```text

## Mnemonics
- ADC
- SBC
- LDA
- AND
- CMP
- EOR
- ORA
- STA
- LAX
- SHA
