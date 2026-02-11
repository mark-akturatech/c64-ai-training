# NMOS 6510 — Undocumented Combined Immediate Opcodes: ANE, LAX, ANC, ALR/ARR, SBX, SBC Variants, SHA/SHX/SHY

**Summary:** This document details undocumented NMOS 6510 opcodes that combine an implied or transfer operation with an immediate operation. These include ANE, LAX, ANC, ALR/ARR, SBX, and SBC variants, as well as SHA/SHX/SHY. Each opcode's functional composition, result placement, exact opcode bytes, addressing modes, and precise flag behaviors are provided.

**Overview**

The NMOS 6510 processor features several undocumented opcodes that perform dual operations within a single instruction cycle. These opcodes typically combine an implied transfer or shift/rotate operation with an immediate logical or arithmetic operation, storing the final result in a register or memory location. This document provides detailed information on these opcodes, including their functional compositions, opcode byte values, addressing modes, and flag behaviors.

**Opcode Behaviors**

### ANE #imm

- **Opcode Byte:** `$8B`
- **Addressing Mode:** Immediate
- **Composition:** TXA (Transfer X to A) followed by AND #imm.
- **Functional Effect:** A := (A | $EE) & X & imm.
- **Flags:**
  - **N (Negative):** Set if bit 7 of A is set; cleared otherwise.
  - **Z (Zero):** Set if A is zero; cleared otherwise.
- **Note:** This opcode is unstable and may produce unpredictable results on different hardware.

### LAX #imm

- **Opcode Byte:** `$AB`
- **Addressing Mode:** Immediate
- **Composition:** LDA #imm followed by TAX.
- **Functional Effect:** A := imm; X := imm.
- **Flags:**
  - **N (Negative):** Set if bit 7 of A is set; cleared otherwise.
  - **Z (Zero):** Set if A is zero; cleared otherwise.
- **Note:** This opcode is unstable and may produce unpredictable results on different hardware.

### ANC #imm

- **Opcode Bytes:** `$0B`, `$2B`
- **Addressing Mode:** Immediate
- **Composition:** AND #imm with carry set based on the result's bit 7.
- **Functional Effect:** A := A & imm.
- **Flags:**
  - **N (Negative):** Set if bit 7 of A is set; cleared otherwise.
  - **Z (Zero):** Set if A is zero; cleared otherwise.
  - **C (Carry):** Set if bit 7 of A is set; cleared otherwise.
- **Note:** The exact behavior may vary between the two opcode bytes.

### ALR #imm (AND + LSR)

- **Opcode Byte:** `$4B`
- **Addressing Mode:** Immediate
- **Composition:** AND #imm followed by LSR.
- **Functional Effect:**
  - Temp := A & imm
  - A := Temp >> 1
- **Flags:**
  - **N (Negative):** Set if bit 7 of A is set; cleared otherwise.
  - **Z (Zero):** Set if A is zero; cleared otherwise.
  - **C (Carry):** Set to bit 0 of Temp (the bit shifted out).

### ARR #imm (AND + ROR)

- **Opcode Byte:** `$6B`
- **Addressing Mode:** Immediate
- **Composition:** AND #imm followed by ROR.
- **Functional Effect:**
  - Temp := A & imm
  - A := ROR(Temp)
- **Flags:**
  - **N (Negative):** Set if bit 7 of A is set; cleared otherwise.
  - **Z (Zero):** Set if A is zero; cleared otherwise.
  - **C (Carry):** Set to bit 6 of Temp before rotation.
  - **V (Overflow):** Set if bit 6 of Temp before rotation XOR bit 5 of Temp before rotation is 1; cleared otherwise.

### SBX #imm

- **Opcode Byte:** `$CB`
- **Addressing Mode:** Immediate
- **Composition:** A & X followed by subtraction of imm.
- **Functional Effect:** X := (A & X) - imm.
- **Flags:**
  - **N (Negative):** Set if bit 7 of X is set; cleared otherwise.
  - **Z (Zero):** Set if X is zero; cleared otherwise.
  - **C (Carry):** Set if no borrow occurred; cleared otherwise.

### SHA / SHX / SHY

- **SHA (AHX) {addr}**
  - **Opcode Bytes:** `$93`, `$9F`
  - **Addressing Modes:** (Indirect),Y; Absolute,Y
  - **Functional Effect:** Stores A & X & (high byte of address + 1) into {addr}.
- **SHX (SHS) {addr}**
  - **Opcode Byte:** `$9E`
  - **Addressing Mode:** Absolute,Y
  - **Functional Effect:** Stores X & (high byte of address + 1) into {addr}.
- **SHY (SAY) {addr}**
  - **Opcode Byte:** `$9C`
  - **Addressing Mode:** Absolute,X
  - **Functional Effect:** Stores Y & (high byte of address + 1) into {addr}.
- **Note:** These opcodes are unstable and may produce unpredictable results on different hardware.

## Source Code

The following table summarizes the undocumented opcodes, their byte values, addressing modes, and functional descriptions:

```text
| Opcode | Mnemonic | Addressing Mode | Functional Description                          |
|--------|----------|-----------------|-------------------------------------------------|
| $8B    | ANE      | Immediate       | A := (A | $EE) & X & imm                        |
| $AB    | LAX      | Immediate       | A := imm; X := imm                              |
| $0B    | ANC      | Immediate       | A := A & imm; C := bit 7 of A                   |
| $2B    | ANC      | Immediate       | A := A & imm; C := bit 7 of A                   |
| $4B    | ALR      | Immediate       | A := (A & imm) >> 1                             |
| $6B    | ARR      | Immediate       | A := ROR(A & imm)                               |
| $CB    | SBX      | Immediate       | X := (A & X) - imm                              |
| $93    | SHA      | (Indirect),Y    | M := A & X & (high byte of address + 1)         |
| $9F    | SHA      | Absolute,Y      | M := A & X & (high byte of address + 1)         |
| $9E    | SHX      | Absolute,Y      | M := X & (high byte of address + 1)             |
| $9C    | SHY      | Absolute,X      | M := Y & (high byte of address + 1)             |
```

*Note: The above opcodes are undocumented and may exhibit unstable behavior across different hardware implementations.*

## References

- "NMOS 6510 Unintended Opcodes — No More Secrets" by Groepaz
- "6502/6510/8500/8502 Opcodes" by Oxyron
- "C64 Studio" by Georg Rottensteiner
- "MOS 6502 6510 65xx CPU Processor Opcodes" by ElfQrin

## Mnemonics
- ANE
- LAX
- ANC
- ALR
- ARR
- SBX
- SHA
- AHX
- SHX
- SHS
- SHY
- SAY
