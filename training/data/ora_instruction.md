# ORA — Logical Inclusive OR (6502)

**Summary:** ORA (bitwise inclusive OR) performs A := A OR M and is available in Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X) and (Indirect),Y addressing modes; opcodes $09,$05,$15,$0D,$1D,$19,$01,$11 (2–3 bytes). Flags affected: Negative (N), Zero (Z).

## Addressing modes and opcodes
Per-addressing-mode opcodes, instruction lengths, and flags affected:

- Immediate: ORA #$aa — opcode $09 — 2 bytes
- Zero Page: ORA $aa — opcode $05 — 2 bytes
- Zero Page,X: ORA $aa,X — opcode $15 — 2 bytes
- Absolute: ORA $aaaa — opcode $0D — 3 bytes
- Absolute,X: ORA $aaaa,X — opcode $1D — 3 bytes
- Absolute,Y: ORA $aaaa,Y — opcode $19 — 3 bytes
- Indexed Indirect: ORA ($aa,X) — opcode $01 — 2 bytes
- Indirect Indexed: ORA ($aa),Y — opcode $11 — 2 bytes

Operation: A ← A OR M (bitwise inclusive OR). Flags updated: Negative set from bit 7 of the result; Zero set if result == 0. Other processor status flags (Carry, Overflow, Decimal, Interrupt) are unaffected by ORA.

## Source Code
```text
; ORA opcode summary (6502)
; Addressing Mode          Assembly        Opcode  Bytes  Flags
; Immediate                ORA #$aa        $09     2      N,Z
; Zero Page                ORA $aa         $05     2      N,Z
; Zero Page,X              ORA $aa,X       $15     2      N,Z
; Absolute                 ORA $aaaa       $0D     3      N,Z
; Absolute,X               ORA $aaaa,X     $1D     3      N,Z
; Absolute,Y               ORA $aaaa,Y     $19     3      N,Z
; Indexed Indirect (X)     ORA ($aa,X)     $01     2      N,Z
; Indirect Indexed (Y)     ORA ($aa),Y     $11     2      N,Z
```

## References
- "and_instruction" — AND (related logical operation)
- "eor_instruction" — EOR (related logical operation)

## Mnemonics
- ORA
