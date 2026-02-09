# NMOS 6510 — SHA / SHX / SHY / TAS / LAS (unintended opcodes)

**Summary:** Unintended NMOS 6510 opcodes SHA, SHX, SHY store masked values combining A/X/Y with the high byte of the effective address (H = high byte of address + 1). TAS and LAS are compound store/load opcodes combining A/X with the stack pointer (SP = stack pointer) and the high-byte mask; NOP is listed here as having no effect.

**Details**

- **SHA (AHX, AXA)**
  - **Opcode:** $93 (indirect,Y), $9F (absolute,Y)
  - **Addressing Modes:** (indirect),Y; absolute,Y
  - **Behavior:** Stores A & X & H into memory at the effective address.
  - **H Definition:** H = (high byte of the effective address) + 1.
  - **Cycle Counts:** 6 cycles for (indirect),Y; 5 cycles for absolute,Y.
  - **Notes:** Unstable; if the target address crosses a page boundary, the instruction may not store at the intended address. The high byte of the target address will get incremented and then ANDed with the value stored. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

- **SHX (A11, SXA, XAS)**
  - **Opcode:** $9E
  - **Addressing Mode:** Absolute,Y
  - **Behavior:** Stores X & H into memory at the effective address.
  - **H Definition:** H = (high byte of the effective address) + 1.
  - **Cycle Count:** 5 cycles.
  - **Notes:** Unstable; similar page boundary crossing issues as SHA. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

- **SHY (A11, SYA, SAY)**
  - **Opcode:** $9C
  - **Addressing Mode:** Absolute,X
  - **Behavior:** Stores Y & H into memory at the effective address.
  - **H Definition:** H = (high byte of the effective address) + 1.
  - **Cycle Count:** 5 cycles.
  - **Notes:** Unstable; similar page boundary crossing issues as SHA. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

- **TAS (XAS, SHS)**
  - **Opcode:** $9B
  - **Addressing Mode:** Absolute,Y
  - **Behavior:** Stores A & X into SP and stores A & X & H into memory at the effective address.
  - **H Definition:** H = (high byte of the effective address) + 1.
  - **Cycle Count:** 5 cycles.
  - **Notes:** Unstable; similar page boundary crossing issues as SHA. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

- **LAS (LAR)**
  - **Opcode:** $BB
  - **Addressing Mode:** Absolute,Y
  - **Behavior:** Loads A and X from (memory at effective address & SP) and also sets SP to (memory at effective address & SP).
  - **Cycle Count:** 4 cycles.
  - **Notes:** Unstable; behavior may vary across different hardware. ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

- **NOP**
  - **Opcode:** $EA
  - **Addressing Mode:** Implied
  - **Behavior:** No effect.
  - **Cycle Count:** 2 cycles.
  - **Notes:** Officially documented opcode; performs no operation. ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

## Source Code

```assembly
; Example of SHA (AHX, AXA) usage
LDA #$FF
LDX #$FF
STA $2000
SHA $2000,Y ; Stores (A & X & (high byte of $2000 + 1)) into $2000 + Y

; Example of SHX (A11, SXA, XAS) usage
LDX #$FF
SHX $3000,Y ; Stores (X & (high byte of $3000 + 1)) into $3000 + Y

; Example of SHY (A11, SYA, SAY) usage
LDY #$FF
SHY $4000,X ; Stores (Y & (high byte of $4000 + 1)) into $4000 + X

; Example of TAS (XAS, SHS) usage
LDA #$FF
LDX #$FF
TAS $5000,Y ; Stores (A & X) into SP and (A & X & (high byte of $5000 + 1)) into $5000 + Y

; Example of LAS (LAR) usage
LAS $6000,Y ; Loads A, X, and SP with ($6000 + Y) & SP

; Example of NOP usage
NOP ; No operation
```

## Key Registers

- **A (Accumulator):** Used in SHA, TAS, and LAS operations.
- **X (X Register):** Used in SHA, SHX, TAS, and LAS operations.
- **Y (Y Register):** Used in SHY and LAS operations.
- **SP (Stack Pointer):** Modified in TAS and LAS operations.

## References

- "unintended_opcodes_overview" — expands on SHA/SHX/SHY listing
- ([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))
- ([masswerk.at](https://www.masswerk.at/6502/6502_instruction_set.html?utm_source=openai))