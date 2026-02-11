# NMOS 6510 — Grouped undocumented opcode functions and CPU flag effects

**Summary:** This document provides a mapping of grouped NMOS 6510 undocumented opcode functions (such as RLA, SRE, RRA, SAX, LAX, DCP, ISC) to the observed and affected 6502 processor status flags (N V - B D I Z C). It includes function descriptions (e.g., "{addr} = {addr} * 2", "A = A eor {addr}") and a table indicating flag behaviors using specific symbols.

**Function-to-flag mapping (overview)**

This section outlines the high-level functional semantics for several groups of undocumented NMOS 6510 opcodes and their impact on processor status flags. The functions covered include memory shifts/rotates, accumulator logical/arithmetic combinations with memory, memory increments/decrements, and combined read-modify-write variants associated with opcode families commonly referred to as RLA, SRE, RRA, SAX, LAX, DCP, ISC, etc.

- **Functions listed:**
  - `{addr} = {addr} * 2`
  - `A = A or {addr}`
  - `{addr} = rol {addr}`
  - `A = A and {addr}`
  - `{addr} = {addr} / 2`
  - `A = A eor {addr}`
  - `{addr} = ror {addr}`
  - `A = A adc {addr}`
  - `{addr} = A & X`
  - `A,X = {addr}`
  - `{addr} = {addr} - 1`
  - `A cmp {addr}`
  - `{addr} = {addr} + 1`
  - `A = A - {addr}`

- **Processor status flag columns:**
  - `N V - B D I Z C` (Negative, Overflow, unused, Break, Decimal, IRQ disable, Zero, Carry)

- **Table symbols:**
  - `o` — Flag is affected by the operation.
  - `x` — Flag is set based on the result of the operation.
  - `i` — Flag is set or cleared based on the instruction's specific behavior.

The following table presents the functions alongside their corresponding processor status flag effects:


**Opcode bytes and addressing-mode mappings**

Below are the opcode bytes and their corresponding addressing modes for each function:

- **RLA (Rotate Left and AND):**
  - **Opcode:** `0x27`
  - **Addressing Mode:** Zero Page

- **SRE (Shift Right and EOR):**
  - **Opcode:** `0x47`
  - **Addressing Mode:** Zero Page

- **RRA (Rotate Right and ADC):**
  - **Opcode:** `0x67`
  - **Addressing Mode:** Zero Page

- **SAX (Store A AND X):**
  - **Opcode:** `0x87`
  - **Addressing Mode:** Zero Page

- **LAX (Load A and X):**
  - **Opcode:** `0xA7`
  - **Addressing Mode:** Zero Page

- **DCP (Decrement and Compare):**
  - **Opcode:** `0xC7`
  - **Addressing Mode:** Zero Page

- **ISC (Increment and SBC):**
  - **Opcode:** `0xE7`
  - **Addressing Mode:** Zero Page

*Note: The above opcodes are for the Zero Page addressing mode. Other addressing modes have different opcode values.*

**Examples and addressing-mode variants**

Here are explicit examples demonstrating the use of these undocumented opcodes with different addressing modes:

- **RLA (Rotate Left and AND):**
  - **Zero Page:** `RLA $44`
  - **Zero Page,X:** `RLA $44,X`
  - **Absolute:** `RLA $4400`
  - **Absolute,X:** `RLA $4400,X`
  - **Absolute,Y:** `RLA $4400,Y`
  - **(Indirect,X):** `RLA ($44,X)`
  - **(Indirect),Y:** `RLA ($44),Y`

- **SRE (Shift Right and EOR):**
  - **Zero Page:** `SRE $44`
  - **Zero Page,X:** `SRE $44,X`
  - **Absolute:** `SRE $4400`
  - **Absolute,X:** `SRE $4400,X`
  - **Absolute,Y:** `SRE $4400,Y`
  - **(Indirect,X):** `SRE ($44,X)`
  - **(Indirect),Y:** `SRE ($44),Y`

- **RRA (Rotate Right and ADC):**
  - **Zero Page:** `RRA $44`
  - **Zero Page,X:** `RRA $44,X`
  - **Absolute:** `RRA $4400`
  - **Absolute,X:** `RRA $4400,X`
  - **Absolute,Y:** `RRA $4400,Y`
  - **(Indirect,X):** `RRA ($44,X)`
  - **(Indirect),Y:** `RRA ($44),Y`

- **SAX (Store A AND X):**
  - **Zero Page:** `SAX $44`
  - **Zero Page,Y:** `SAX $44,Y`
  - **Absolute:** `SAX $4400`
  - **(Indirect,X):** `SAX ($44,X)`

- **LAX (Load A and X):**
  - **Immediate:** `LAX #$44`
  - **Zero Page:** `LAX $44`
  - **Zero Page,Y:** `LAX $44,Y`
  - **Absolute:** `LAX $4400`
  - **Absolute,Y:** `LAX $4400,Y`
  - **(Indirect,X):** `LAX ($44,X)`
  - **(Indirect),Y:** `LAX ($44),Y`

- **DCP (Decrement and Compare):**
  - **Zero Page:** `DCP $44`
  - **Zero Page,X:** `DCP $44,X`
  - **Absolute:** `DCP $4400`
  - **Absolute,X:** `DCP $4400,X`
  - **Absolute,Y:** `DCP $4400,Y`
  - **(Indirect,X):** `DCP ($44,X)`
  - **(Indirect),Y:** `DCP ($44),Y`

- **ISC (Increment and SBC):**
  - **Zero Page:** `ISC $44`
  - **Zero Page,X:** `ISC $44,X`
  - **Absolute:** `ISC $4400`
  - **Absolute,X:** `ISC $4400,X`
  - **Absolute,Y:** `ISC $4400,Y`
  - **(Indirect,X):** `ISC ($44,X)`
  - **(Indirect),Y:** `ISC ($44),Y`

*Note: The above examples demonstrate the use of undocumented opcodes with various addressing modes. The actual opcode bytes vary depending on the addressing mode.*

## Source Code

```text
Function                     | N V - B D I Z C
-----------------------------|----------------
{addr} = {addr} * 2          | o
A = A or {addr}              | o o
{addr} = rol {addr}          | o
A = A and {addr}             | o x
{addr} = {addr} / 2          | o
A = A eor {addr}             | o o
{addr} = ror {addr}          | o o
A = A adc {addr}             | i
{addr} = A & X               | o x
A,X = {addr}                 | o
{addr} = {addr} - 1          | o
A cmp {addr}                 | o
{addr} = {addr} + 1          | o o
A = A - {addr}               | o o
```


## Key Registers

- **Accumulator (A):** Used in arithmetic and logic operations.
- **Index Registers (X, Y):** Used for indexing and loop counters.
- **Processor Status Register (P):** Contains the status flags (N V - B D I Z C).

## References

- "grouped_unintended_opcodes_rla_sre_rra_sax_lax_dcp_isc" — expands with actual opcode bytes and addressing-mode mappings for RLA/SRE/RRA/SAX/LAX/DCP/ISC families
- "single_byte_immediate_anc_alr_arr_sbx_sbc" — covers single-byte immediate undocumented opcodes and related flag behaviors

## Mnemonics
- RLA
- SRE
- LSE
- RRA
- SAX
- AXS
- LAX
- DCP
- DCM
- ISC
- ISB
- INS
