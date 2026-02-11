# 6502 STY (Store Y) — pseudocode and opcodes

**Summary:** STY (Store Y) writes the Y register to memory using Zero Page ($84), Zero Page,X ($94) and Absolute ($8C) addressing; see opcode bytes, cycles, zero-page wrap behavior, and pseudocode for effective-address calculation.

## Operation
STY copies the current Y register value into a memory location computed by the instruction's addressing mode. It does not affect any processor status flags (N, V, Z, C are unchanged).

Addressing modes supported:
- Zero Page (ZP): 8-bit operand. Effective address = operand (0x00–0xFF).
- Zero Page,X (ZP,X): 8-bit operand. Effective address = (operand + X) & $FF (wraps within page).
- Absolute (ABS): 16-bit operand (low byte first). Effective address = operand16.

Notes:
- There is no Absolute,X or Absolute,Y variant for STY on the NMOS 6502.
- Zero-page,X addressing wraps within the zero page; it does not generate a carry into the high byte.
- Store instructions do not set or clear status flags and do not trigger additional cycle penalties for page crossings (since STY lacks index modes that cross pages except ZP,X which wraps).

Pseudocode (high-level mapping):
- STY(addressing, operand) => STORE(effective_address, Y)
- Effective address calculation:
  - ZP: EA := operand
  - ZP,X: EA := (operand + X) & $FF
  - ABS: EA := operand16

## Source Code
```text
Opcode summary (mnemonic — addressing — opcode — bytes — cycles)
STY — Zero Page     — $84 — 2 bytes — 3 cycles
STY — Zero Page,X   — $94 — 2 bytes — 4 cycles
STY — Absolute      — $8C — 3 bytes — 4 cycles
```

```asm
; Examples — assembly and bytes

; STY Zero Page
        STY $44        ; bytes: $84 $44    ; cycles: 3

; STY Zero Page,X (zero-page wrap)
        STY $F0,X      ; bytes: $94 $F0    ; effective EA = ($F0 + X) & $FF ; cycles: 4

; STY Absolute
        STY $1234      ; bytes: $8C $34 $12 ; cycles: 4
```

```text
Pseudocode example (conceptual)
; STORE(address, (src)) — implementation for STY
; src is Y register

IF addressing_mode == ZP THEN
    EA = operand & $FF
ELSE IF addressing_mode == ZP,X THEN
    EA = (operand + X) & $FF        ; wrap in zero page
ELSE IF addressing_mode == ABS THEN
    EA = operand16                  ; low byte then high byte
END IF

MEMORY[EA] = Y
; No flags affected
```

## References
- "instruction_tables_sty" — expands on STY opcodes and related instruction tables

## Mnemonics
- STY
