# Kick Assembler — SBC, SEC/SED/SEI, and Transfer Instructions (TAX/TAY/TSX/TXA/TXS/TYA)

**Summary:** Opcode bytes for 6502 instructions SBC (all addressing modes), the processor flag setters SEC/SED/SEI, and register-transfer instructions TAX, TAY, TSX, TXA, TXS, TYA as shown in the Kick Assembler quick-reference.

## Opcode table
The following lists canonical 6502 opcodes for the named instructions with their addressing modes. Flag-setter and transfer instructions are implied (single-byte) opcodes. SBC has the standard eight legal addressing-mode encodings.

## Source Code
```text
; SBC — Subtract with Borrow (A = A - M - (1 - C))
; Addressing modes and opcodes (6502 canonical)
SBC Immediate        $E9
SBC Zero Page        $E5
SBC Zero Page,X      $F5
SBC Absolute         $ED
SBC Absolute,X       $FD
SBC Absolute,Y       $F9
SBC (Indirect,X)     $E1
SBC (Indirect),Y     $F1

; Processor flag set instructions (implied)
SEC (Set Carry)      $38
SED (Set Decimal)    $F8
SEI (Set Interrupt)  $78

; Register transfer instructions (implied)
TAX (A -> X)         $AA
TAY (A -> Y)         $A8
TSX (SP -> X)        $BA
TXA (X -> A)         $8A
TXS (X -> SP)        $9A
TYA (Y -> A)         $98
```

**[Note: Source may contain an error — the original raw block ended with extra bytes "$96 $8e $94 $8c 88" which appear unrelated or truncated; those bytes are not part of the instructions listed above (they match other store/decrement opcodes).]**

## References
- "store_instructions_sta_stx_sty" — expands on the store instruction opcodes referenced elsewhere
- "addressing_mode_indirect_and_relative" — explains ind/rel addressing-mode labels used in quick-reference tables

## Mnemonics
- SBC
- SEC
- SED
- SEI
- TAX
- TAY
- TSX
- TXA
- TXS
- TYA
