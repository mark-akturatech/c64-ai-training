# NMOS 6510 — Undocumented mnemonic ISC (aka ISB / INS)

**Summary:** ISC (also listed as ISB or INS in some assemblers) is an undocumented 6502/6510 opcode family that increments a memory location then performs SBC with that memory; common opcode bytes: $E7, $F7, $E3, $F3, $EF, $FF, $FB. Searchable terms: ISC, ISB, INS, $E7, $F7, $E3, $F3, $EF, $FF, $FB, (zp,X), (zp),Y, zero page, absolute.

**Description**
ISC (often called ISB or INS) implements the combined operation: INC memory; SBC A, memory. It is effectively the two-instruction sequence INC (memory) followed by SBC (memory) performed as a single opcode.

- Functional effect (semantic): memory ← memory + 1; A ← A - memory - (1 - C).
- Equivalent instruction sequence (for correctness, not atomically): INC addr ; SBC addr
- Flags affected: N (negative), V (overflow), Z (zero), C (carry) — same set as SBC, but the increment step can change the zero/sign of the memory operand before the SBC.
- Common assembler synonyms: ISC, ISB, INS (varies by assembler; some list one or more of these names).
- Addressing modes implemented by the opcode family: Zero Page, Zero Page,X, (Zero Page,X) indirect,X, (Zero Page),Y indirect,Y, Absolute, Absolute,X, Absolute,Y.

Known opcode-to-addressing-mode mapping is provided in Source Code below.

Caveats:
- This is an undocumented/illegal opcode; behavior is derived from hardware effects on NMOS 6502 variants and is consistent across many NMOS 6502/6510 implementations but not guaranteed by any official specification.
- Cycle counts and exact internal timing are not listed here (not present in the source).

## Source Code
```asm
; ISC / ISB / INS — opcode bytes, addressing modes, and cycle counts
; Each entry: opcode byte(s) — assembly form — addressing mode — cycles

; Zero Page
$E7 $00      ISC $00        ; Zero Page        ; 5 cycles

; Zero Page,X
$F7 $00      ISC $00,X      ; Zero Page,X      ; 6 cycles

; (Zero Page,X)  — indirect,X
$E3 $00      ISC ($00,X)    ; (zp,X)           ; 8 cycles

; (Zero Page),Y  — indirect,Y
$F3 $00      ISC ($00),Y    ; (zp),Y           ; 8 cycles

; Absolute
$EF $00 $00  ISC $0000      ; Absolute         ; 6 cycles

; Absolute,X
$FF $00 $00  ISC $0000,X    ; Absolute,X       ; 7 cycles

; Absolute,Y
$FB $00 $00  ISC $0000,Y    ; Absolute,Y       ; 7 cycles

; Example (pseudo-assembly usage):
;    ISC $10        ; increment zero-page $10 then SBC A,$10
;    ISC ($20),Y    ; increment memory at address (zp $20) + Y then SBC A,(that address)
```

## References
- "dcp_dcp_mnemonic_mapping" — mapping and details for the related undocumented DCP (DCP/DOP) family
- "anc_anc_mnemonic_mapping" — mapping and details for the related ANC (logical/arith) family

## Mnemonics
- ISC
- ISB
- INS
