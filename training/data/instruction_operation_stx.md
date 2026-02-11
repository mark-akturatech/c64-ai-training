# 6502 STX — STORE X Register

**Summary:** STX stores the X register to memory. Common opcodes: $86 (Zero Page), $96 (Zero Page,Y), $8E (Absolute); addressing modes, byte lengths, and cycle counts are shown below.

## Operation
STX copies the current X register value into the effective memory address computed by the instruction's addressing mode.

Behavior details:
- Effect: Mem[EA] ← X
- Flags: No processor status flags are changed.
- Memory side effects: Performs a single write to EA (can be used to write memory-mapped I/O).
- Zero Page,Y wrapping: For the Zero Page,Y mode the effective address wraps within page zero (EA = (operand + Y) & $FF).
- There is no Absolute,X variant on the NMOS 6502; only Zero Page, Zero Page,Y and Absolute are supported.

Pseudocode (high-level):
- STORE(EA, X) ; memory[EA] = X

Cycle/length and addressing behavior (see Source Code table for bytes/cycles).

## Source Code
```asm
; STX opcode summary for NMOS 6502
; Opcode  Addressing      Bytes  Cycles  Effective address / notes
; $86     Zero Page       2      3       EA = operand                ; operand = next byte
; $96     Zero Page,Y     2      4       EA = (operand + Y) & $FF     ; zero page wrap-around
; $8E     Absolute        3      4       EA = operand_lo + (operand_hi << 8)

; Example usages:
        LDX #$42
        STX $10        ; stores X to zero page $0010    (opcode $86)
        STX $20,Y      ; stores X to zero page (wrap)    (opcode $96)
        STX $1234      ; stores X to absolute $1234       (opcode $8E)
```

## References
- "instruction_tables_stx" — expands on STX opcodes and addressing tables

## Mnemonics
- STX
