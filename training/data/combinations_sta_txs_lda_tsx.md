# NMOS 6510 — TAS / LAS behaviors, NOP, JAM (undocumented/illegal opcodes)

**Summary:** Describes undocumented NMOS 6510 illegal-opcode behaviors: TAS and LAS (stack-pointer-involving masked store/load), simple NOP forms that fetch operands but do nothing, and the JAM (lock-up) opcode. Searchable terms: TAS, LAS, NOP #{imm}, NOP {addr}, JAM, SP (stack pointer), masked store/load.

**TAS / LAS (brief behavior)**

**TAS {addr}**

- **Opcode:** $9B
- **Addressing Mode:** Absolute,Y
- **Cycles:** 5
- **Semantics:** Stores A & X into SP and stores A & X & (H+1) into memory.
- **Formalized:** SP := A & X; M[{addr}] := A & X & (H+1)
- **Note:** H denotes the high byte of the effective address (H = high byte of {addr}).

**LAS {addr}**

- **Opcode:** $BB
- **Addressing Mode:** Absolute,Y
- **Cycles:** 4
- **Semantics:** Loads A, X, and SP from memory & SP.
- **Formalized:** tmp := M[{addr}] & SP; A := tmp; X := tmp; SP := tmp
- **Text shorthand:** A, X, SP = {addr} & SP

**Notes:**

- Both TAS and LAS are undocumented/illegal NMOS 6502/6510 behaviors involving bitwise ANDs between accumulator, X, memory, and the stack pointer.
- These instructions are considered unstable and may not function reliably across all systems. ([masswerk.at](https://masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

**NOP (no effect) forms**

**NOP #{imm}**

- **Opcodes:** $80, $82, $89, $C2, $E2
- **Addressing Mode:** Immediate
- **Cycles:** 2
- **Behavior:** Fetches the immediate operand byte (#{imm}) and performs no architectural effects.

**NOP {addr}**

- **Opcodes and Addressing Modes:**
  - $04, $44, $64: Zero Page (3 cycles)
  - $14, $34, $54, $74, $D4, $F4: Zero Page,X (4 cycles)
  - $0C: Absolute (4 cycles)
  - $1C, $3C, $5C, $7C, $DC, $FC: Absolute,X (4 cycles, add 1 if page boundary is crossed)
- **Behavior:** Fetches the operand byte(s) from {addr} (addressing-mode dependent) and performs no architectural effects.

**Notes:**

- These NOP variants are undocumented and may not be stable across all 6510 implementations. ([masswerk.at](https://masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

**Lock-up**

**JAM**

- **Opcodes:** $02, $12, $22, $32, $42, $52, $62, $72, $92, $B2, $D2, $F2
- **Addressing Mode:** Implied
- **Cycles:** Undefined (CPU halts)
- **Behavior:** Executing JAM causes the CPU to freeze/hang (no further normal instruction execution). The data and address buses are set to $FF, and only a reset will restart execution. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

## Source Code

```text
; Example demonstrating the bitwise masking behavior of TAS and LAS

; Initialize registers
LDA #$AA        ; A = $AA
LDX #$55        ; X = $55
LDY #$10        ; Y = $10
LDSP #$FF       ; SP = $FF

; TAS example
TAS $2000,Y     ; SP = A & X = $00, M[$2010] = A & X & (H+1) = $00

; LAS example
LAS $2000,Y     ; tmp = M[$2010] & SP = $00, A = tmp, X = tmp, SP = tmp
```

## Key Registers

- **TAS:**
  - **SP:** Set to A & X
  - **Memory at {addr}:** Set to A & X & (H+1)
- **LAS:**
  - **A, X, SP:** Set to M[{addr}] & SP

## References

- "unintended_opcodes_overview" — expands on TAS/LAS entries and other undocumented opcodes. ([esocop.org](https://www.esocop.org/docs/MOS6510UnintendedOpcodes-20152412.pdf?utm_source=openai))

## Mnemonics
- TAS
- LAS
- NOP
- JAM
