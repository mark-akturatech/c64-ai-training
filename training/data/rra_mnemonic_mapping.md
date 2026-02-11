# NMOS 6510 undocumented opcode: RRA (opcode map)

**Summary:** Undocumented NMOS 6502/6510 instruction mnemonic RRA — performs ROR on memory then ADC with the accumulator; common illegal-opcode byte values by addressing mode: $63, $67, $6F, $73, $77, $7B, $7F. Covers opcode → addressing-mode mapping (assembler byte forms).

**Description**
RRA is an undocumented (illegal) 6502/6510 opcode that combines a memory ROR (rotate right) with an ADC (add with carry) using the rotated memory operand. Canonical semantic (NMOS implementation):

- Step 1: ROR M — rotate right the memory operand M; this updates the memory and the processor carry with the low bit shifted out.
- Step 2: ADC A, M — add the (new) memory value to the accumulator with carry.

Effect on flags: ADC sets N (negative), Z (zero), V (overflow) and C (carry) according to the ADC result. The ROR in step 1 also modifies the carry during the rotate (this carry is then used as input for the ADC if relevant), but the final C/ V reflect the ADC outcome.

This opcode is undocumented and behavior is implementation-dependent across 6502 variants (NMOS/CMOS), assemblers, and emulators; the mapping below is the typical NMOS 6502/6510 set found in many references and testers.

## Source Code
```text
; RRA — opcode table (NMOS 6502 / 6510 common values)
; Addressing Mode       Opcode (hex)   Cycles
; -------------------------------------------
; (indirect,X)          $63            8
; zeropage              $67            5
; (zeropage),Y          $73            8
; zeropage,X            $77            6
; absolute              $6F            6
; absolute,X            $7F            7
; absolute,Y            $7B            7

; Example assembler usages (varies by assembler):
;    RRA ($44,X)    ; uses $63
;    RRA $44        ; uses $67
;    RRA ($44),Y    ; uses $73
;    RRA $44,X      ; uses $77
;    RRA $4400      ; uses $6F
;    RRA $4400,X    ; uses $7F
;    RRA $4400,Y    ; uses $7B
```

## References
- "sre_mnemonic_mapping" — expands on related undocumented mnemonic SRE
- "sax_mnemonic_mapping" — expands on related undocumented mnemonic SAX

## Mnemonics
- RRA
