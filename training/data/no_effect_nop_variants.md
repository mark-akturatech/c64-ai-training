# NMOS 6510 — No‑Effect NOP Variants and HALT/JAM

**Summary:** Describes NMOS 6510 no‑effect opcode variants (certain NOP forms that fetch operands but perform no side effects), and the HALT/JAM behavior that stops the CPU and forces buses to $FF. Mentions a stable illegal opcode family SLO (aka ASO) which combines ASL and ORA sub-operations.

**No‑Effect NOP Variants**

Certain undocumented opcodes on the NMOS 6510 behave as no‑effect NOPs: they execute the fetch and timing for their addressing mode (including immediate and memory forms that perform extra operand fetches) but have no visible side effects on registers or memory. These variants are useful to represent encodings that only consume cycles and fetch data.

- **Scope:** Immediate and memory addressing forms (fetches occur, but operand is discarded).
- **Observable Behavior:** Instruction timing and bus activity occur exactly as for the addressing mode; no state changes other than program counter advancement and cycle consumption.
- **Bus State During Operand Fetches:** Reads occur as normal; no write-back or register changes produced by the opcode.

### Detailed Opcode Encodings and Cycle Counts

The following table lists the no‑effect NOP variants, their opcode values, addressing modes, and cycle counts:

| Opcode | Mnemonic | Addressing Mode | Bytes | Cycles | Notes |
|--------|----------|-----------------|-------|--------|-------|
| $80    | NOP      | Immediate       | 2     | 2      |       |
| $82    | NOP      | Immediate       | 2     | 2      |       |
| $89    | NOP      | Immediate       | 2     | 2      |       |
| $C2    | NOP      | Immediate       | 2     | 2      |       |
| $E2    | NOP      | Immediate       | 2     | 2      |       |
| $04    | NOP      | Zero Page       | 2     | 3      |       |
| $44    | NOP      | Zero Page       | 2     | 3      |       |
| $64    | NOP      | Zero Page       | 2     | 3      |       |
| $14    | NOP      | Zero Page,X     | 2     | 4      |       |
| $34    | NOP      | Zero Page,X     | 2     | 4      |       |
| $54    | NOP      | Zero Page,X     | 2     | 4      |       |
| $74    | NOP      | Zero Page,X     | 2     | 4      |       |
| $D4    | NOP      | Zero Page,X     | 2     | 4      |       |
| $F4    | NOP      | Zero Page,X     | 2     | 4      |       |
| $0C    | NOP      | Absolute        | 3     | 4      |       |
| $1C    | NOP      | Absolute,X      | 3     | 4*     | +1 cycle if page boundary crossed |
| $3C    | NOP      | Absolute,X      | 3     | 4*     | +1 cycle if page boundary crossed |
| $5C    | NOP      | Absolute,X      | 3     | 4*     | +1 cycle if page boundary crossed |
| $7C    | NOP      | Absolute,X      | 3     | 4*     | +1 cycle if page boundary crossed |
| $DC    | NOP      | Absolute,X      | 3     | 4*     | +1 cycle if page boundary crossed |
| $FC    | NOP      | Absolute,X      | 3     | 4*     | +1 cycle if page boundary crossed |

*Note: For Absolute,X addressing mode, add 1 cycle if a page boundary is crossed.*

**HALT / JAM Behavior**

- **Function:** Halt the CPU. Execution stops.
- **Bus State When Halted/Jammed:** The system buses will be driven to $FF.
- **Effect on Program Flow:** CPU stops fetching/executing further instructions (requires reset/power cycle to recover).

### Opcode Encodings for HALT/JAM

The following opcodes cause the CPU to halt:

| Opcode | Mnemonic | Addressing Mode | Bytes | Cycles | Notes |
|--------|----------|-----------------|-------|--------|-------|
| $02    | JAM      | Implied         | 1     | -      | Halts CPU |
| $12    | JAM      | Implied         | 1     | -      | Halts CPU |
| $22    | JAM      | Implied         | 1     | -      | Halts CPU |
| $32    | JAM      | Implied         | 1     | -      | Halts CPU |
| $42    | JAM      | Implied         | 1     | -      | Halts CPU |
| $52    | JAM      | Implied         | 1     | -      | Halts CPU |
| $62    | JAM      | Implied         | 1     | -      | Halts CPU |
| $72    | JAM      | Implied         | 1     | -      | Halts CPU |
| $92    | JAM      | Implied         | 1     | -      | Halts CPU |
| $B2    | JAM      | Implied         | 1     | -      | Halts CPU |
| $D2    | JAM      | Implied         | 1     | -      | Halts CPU |
| $F2    | JAM      | Implied         | 1     | -      | Halts CPU |

*Note: Execution of these opcodes halts the CPU, and the system buses are driven to $FF.*

**Stable Illegal Opcode Family: SLO (ASO)**

- **Name:** SLO (also called ASO in some listings)
- **Type:** Combination instruction — effectively performs two sub‑operations using the same addressing mode.
- **Sub-instructions:** ASL (arithmetic shift left) followed by ORA (logical OR with accumulator).

### Opcode Encodings for SLO (ASO)

The following table lists the SLO opcodes, their addressing modes, and cycle counts:

| Opcode | Mnemonic | Addressing Mode | Bytes | Cycles |
|--------|----------|-----------------|-------|--------|
| $03    | SLO      | (Indirect,X)    | 2     | 8      |
| $07    | SLO      | Zero Page       | 2     | 5      |
| $0F    | SLO      | Absolute        | 3     | 6      |
| $13    | SLO      | (Indirect),Y    | 2     | 8      |
| $17    | SLO      | Zero Page,X     | 2     | 6      |
| $1B    | SLO      | Absolute,Y      | 3     | 7      |
| $1F    | SLO      | Absolute,X      | 3     | 7      |

## Source Code

```text
; Example trace showing bus state when halted (JAM instruction executed)
; Address Bus | Data Bus | R/W | Description
; ------------|----------|-----|------------------------------
; 0000        | 02       | R   | Fetch JAM opcode ($02)
; ----        | ----     | -   | CPU halts, buses driven to $FF
```

## References

- "NMOS 6510 Unintended Opcodes — No More Secrets" by Groepaz, v0.99, December 24, 2024.

## Mnemonics
- NOP
- JAM
- SLO
- ASO
