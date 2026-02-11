# SRE (undocumented NMOS 6510 instruction) — opcode list and assembler mnemonics

**Summary:** Undocumented 6510/6502 instruction SRE (shift-right memory then EOR accumulator) with opcode bytes $43, $47, $4F, $53, $57, $5B, $5F and addressing modes (IND,X), ZP, ZP,X, (IND),Y, ABS, ABS,Y, ABS,X. Behavior: memory LSR then A EOR memory (flags: C from LSR; N/Z from result of EOR).

**Description**
SRE is an undocumented 6502/6510 opcode that performs a logical shift-right (LSR) on a memory operand, stores the shifted result back to that memory location, then exclusive-ORs (EOR) the accumulator with that shifted memory value.

Canonical combined operation (pseudocode):
- tmp = M         ; read memory operand
- C = tmp & 1     ; LSR captures low bit into Carry
- tmp = tmp >> 1  ; logical shift right
- M = tmp         ; write shifted value back to memory
- A = A XOR tmp   ; accumulator XOR with shifted memory
- N = (A & 0x80) != 0
- Z = (A == 0)
- V unaffected by instruction
- Decimal mode not involved (binary operation)

Notes:
- The Carry flag is set from the LSR portion (original bit 0 of memory).
- The Negative and Zero flags reflect the EOR result in A.
- This description follows standard documented behavior seen for combined undocumented opcodes (LSR+EOR).

**Assembler Mnemonics**
Different assemblers use various mnemonics for this instruction:

- **SRE**: Commonly used in assemblers like ACME and DASM.
- **LSE**: Used in some other assemblers.

([masswerk.at](https://masswerk.at/6502/6502_instruction_set.html?utm_source=openai))

**Cycle Counts and Addressing Modes**
The SRE instruction supports multiple addressing modes, each with specific opcode bytes and cycle counts:

| Addressing Mode | Opcode | Bytes | Cycles |
|-----------------|--------|-------|--------|
| (indirect,X)    | $43    | 2     | 8      |
| zero page       | $47    | 2     | 5      |
| zero page,X     | $57    | 2     | 6      |
| (indirect),Y    | $53    | 2     | 8*     |
| absolute        | $4F    | 3     | 6      |
| absolute,X      | $5F    | 3     | 7*     |
| absolute,Y      | $5B    | 3     | 7*     |

*Note: Add 1 cycle if a page boundary is crossed.

([masswerk.at](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes?utm_source=openai))

## Source Code
```text
; SRE — opcode mapping (undocumented)
; Addressing modes and opcode bytes (hex)

Mnemonic  Addressing Mode    Opcode
SRE       (indirect,X)       $43
SRE       zero page          $47
SRE       zero page,X        $57
SRE       (indirect),Y       $53
SRE       absolute           $4F
SRE       absolute,X         $5F
SRE       absolute,Y         $5B

; Assembly examples (bytes shown after instruction)
; Note: operand bytes shown in hex, low-byte first for absolute addressing.

SRE ($44,X)   ; $43 $44
SRE $44       ; $47 $44
SRE $44,X     ; $57 $44
SRE ($44),Y   ; $53 $44
SRE $1234     ; $4F $34 $12
SRE $1234,X   ; $5F $34 $12
SRE $1234,Y   ; $5B $34 $12
```

## References
- "rla_mnemonic_mapping" — expands on previous undocumented mnemonic RLA
- "rra_mnemonic_mapping" — expands on next related illegal opcode RRA

## Mnemonics
- SRE
- LSE
