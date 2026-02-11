# RRA — Kick Assembler illegal mnemonic (opcodes $63, $67, $77, $6F, $7F, $7B, $73)

**Summary:** Kick Assembler supports the illegal 6502 mnemonic RRA (combined ROR memory then ADC into A). This chunk documents the opcode bytes $63, $67, $77, $6F, $7F, $7B, and $73, along with their addressing-mode encodings: (Indirect,X), Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, and (Indirect),Y.

**Description**
RRA is an undocumented/illegal 6502 instruction that performs a ROR on the memory operand, writes the rotated result back to memory, then performs ADC A,mem using the new memory value and the processor carry (which is updated by the ROR). In effect:

- Perform ROR on the addressed memory byte:
  - new_mem = (mem >> 1) | (C << 7)
  - C := (mem & 1)
  - store new_mem back to memory
- Perform ADC A, new_mem (using the updated C)
  - A := A + new_mem + C (with normal ADC overflow/flags behavior)

Flags affected: N, V, Z, and C (ADC semantics; C also updated by the ROR step). RRA is illegal—behavior is implementation-defined on different 6502 variants, but on common NMOS chips, it behaves as above. Kick Assembler exposes it as the mnemonic RRA.

This chunk lists the specific opcode bytes provided: $63, $67, $77, $6F, $7F, $7B, and $73—addressing-mode-specific encodings for (Indirect,X), Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, and (Indirect),Y respectively.

## Source Code
```asm
; RRA — Kick Assembler encodings shown here as assembled bytes

; Addressing forms included in this chunk:
; RRA ($44,X)    -> $63 $44
; RRA $44        -> $67 $44
; RRA $44,X      -> $77 $44
; RRA $4400      -> $6F $00 $44
; RRA $4400,X    -> $7F $00 $44
; RRA $4400,Y    -> $7B $00 $44
; RRA ($44),Y    -> $73 $44

; Examples:
        RRA ($20,X)    ; assembles to: $63 $20
        RRA $44        ; assembles to: $67 $44
        RRA $44,X      ; assembles to: $77 $44
        RRA $4400      ; assembles to: $6F $00 $44
        RRA $4400,X    ; assembles to: $7F $00 $44
        RRA $4400,Y    ; assembles to: $7B $00 $44
        RRA ($44),Y    ; assembles to: $73 $44
```

## References
- "rla_illegal_mnemonic" — expands on related rotate+memory-and-AND illegal op RLA
- "slo_illegal_mnemonic" — expands on other shift+OR illegal instructions (SLO family)

## Mnemonics
- RRA
