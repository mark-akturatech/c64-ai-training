# NMOS 6510 — Undocumented LAX / LXA Opcode Mapping

**Summary:** Undocumented 6502 opcode bytes for the combined A/X load (commonly called LAX or LXA) across addressing modes: zero page, zero page,Y, (indirect,X), (indirect),Y, absolute, absolute,Y — opcode bytes $A7, $B7, $A3, $B3, $AF, $BF. Assembler mnemonic names vary; see cross-reference to related SAX/DCP mappings.

**Description**

This chunk lists the known undocumented 6502 opcodes that perform a simultaneous load into the accumulator and X register (commonly referred to as LAX or LXA). The opcodes and addressing modes shown are the standard NMOS 6502 encodings observed in widely used documentation and test ROMs.

Assemblers differ in how they name or accept these undocumented instructions. For example, some assemblers use "LAX" for all addressing modes, while others use "LXA" for the immediate mode. ([millfork.readthedocs.io](https://millfork.readthedocs.io/en/v0.3.8/abi/undocumented/?utm_source=openai))

Addressing mode parentheticals: (ind,X) = indexed indirect; (ind),Y = indirect indexed.

## Source Code

```text
; Undocumented LAX / LXA opcodes (NMOS 6502)
; Opcode byte -> addressing mode -> typical mnemonic (varies by assembler)

$A7  - Zero Page          - LAX    ; LAX $zz
$B7  - Zero Page,Y        - LAX    ; LAX $zz,Y
$A3  - (Indirect,X)       - LAX    ; LAX ($zz,X)
$B3  - (Indirect),Y       - LAX    ; LAX ($zz),Y
$AF  - Absolute           - LAX    ; LAX $hhhh
$BF  - Absolute,Y         - LAX    ; LAX $hhhh,Y
$AB  - Immediate          - LXA    ; LXA #$nn

; Example assemblable encodings (assembler syntax may vary):
;    LAX $44         ; assembles to $A7 $44
;    LAX $4400       ; assembles to $AF $00 $44
;    LAX ($20,X)     ; assembles to $A3 $20
;    LAX ($20),Y     ; assembles to $B3 $20
;    LAX $44,Y       ; assembles to $B7 $44
;    LAX $4400,Y     ; assembles to $BF $00 $44
;    LXA #$44        ; assembles to $AB $44
```

## References

- "sax_mnemonic_mapping" — expands on SAX undocumented mnemonic mappings
- "dcp_dcp_mnemonic_mapping" — expands on DCP undocumented mnemonic mappings

## Mnemonics
- LAX
- LXA
