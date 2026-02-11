# SRE — Illegal 6502 mnemonic (LSR then EOR)

**Summary:** Kick Assembler illegal mnemonic SRE (also seen as LSE/LRS in other assemblers) performs a memory LSR (logical shift right on the addressed memory) followed by EOR A,<memory>. Encodings: $47, $57, $43, $53, $4F, $5F, $5B (addressing modes: zp, zp,X, (zp,X), (zp),Y, abs, abs,X, abs,Y).

## Behavior and effects
SRE is a read-modify-write unofficial instruction that:
- Performs LSR on the targeted memory location (memory >> 1), stores the shifted result back to memory.
- Then EORs the accumulator with the new memory value (A ← A EOR M).
- Flags:
  - Carry (C) is set to the bit shifted out of memory (the original bit0).
  - Negative (N) and Zero (Z) are set based on the resulting accumulator after the EOR.
  - Overflow (V) is not affected by EOR; undocumented implementations do not set V as a function of the combined operation.
- Side effects: memory is modified (the shifted value is written back). The instruction acts like an atomic sequence LSR (mem); EOR A,mem.

Notes:
- Many assemblers/patches call the same opcode set LSE or LRS; Kick Assembler supports the mnemonic SRE.
- This belongs to the family of multi-effect unofficial instructions (compare SLO (ASL+ORA), RRA/ISB/ISC, DCP, etc.).

## Encodings and addressing modes
The illegal SRE encodings follow the common undocumented-opcode addressing-mode pattern. Each encoding is the opcode byte followed by operand bytes as usual.

- $47 — Zero Page: SRE $aa   (2 bytes) — operate on zero page address
- $57 — Zero Page,X: SRE $aa,X (2 bytes) — zero page with X-index
- $43 — (Indirect,X): SRE ($aa,X) (2 bytes) — pre-indexed indirect
- $53 — (Indirect),Y: SRE ($aa),Y (2 bytes) — post-indexed indirect
- $4F — Absolute: SRE $aaaa (3 bytes) — absolute address
- $5F — Absolute,X: SRE $aaaa,X (3 bytes) — absolute with X-index
- $5B — Absolute,Y: SRE $aaaa,Y (3 bytes) — absolute with Y-index

Semantics (pseudocode):
- TMP ← M(addr)
- C ← TMP & #$01            ; LSR shifts out bit0 into Carry
- TMP ← TMP >> 1
- M(addr) ← TMP             ; write-back of shifted memory
- A ← A EOR TMP             ; EOR accumulator with updated memory
- Set N,Z from A

## Source Code
```asm
; Example encodings (hex bytes shown with typical operand forms)

; Zero Page
47 aa        ; SRE $aa        ; 2 bytes: opcode $47, zp operand $aa

; Zero Page,X
57 aa        ; SRE $aa,X      ; 2 bytes: opcode $57, zp operand $aa (X added to zp)

; (Indirect,X)
43 aa        ; SRE ($aa,X)    ; 2 bytes: opcode $43, zp operand $aa (pre-indexed indirect)

; (Indirect),Y
53 aa        ; SRE ($aa),Y    ; 2 bytes: opcode $53, zp operand $aa (post-indexed indirect)

; Absolute
4F lo hi     ; SRE $hhll      ; 3 bytes: opcode $4F, 16-bit address (lo,hi)

; Absolute,X
5F lo hi     ; SRE $hhll,X    ; 3 bytes: opcode $5F, 16-bit address (lo,hi), X indexed

; Absolute,Y
5B lo hi     ; SRE $hhll,Y    ; 3 bytes: opcode $5B, 16-bit address (lo,hi), Y indexed

; Pseudocode for each encoding:
; TMP = ReadMemory(effective_addr)
; C = TMP & 1
; TMP = TMP >> 1
; WriteMemory(effective_addr, TMP)
; A = A EOR TMP
; Set N,Z from A
```

## References
- "slo_illegal_mnemonic" — SLO family (ASL then ORA) for comparison
- "dcp_dcm_and_lax_lxa_group" — other multi-effect unofficial instructions (DCP/ISC/LAX etc.)

## Mnemonics
- SRE
- LSE
- LRS
