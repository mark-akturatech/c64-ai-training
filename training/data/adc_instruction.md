# 6502 ADC (Add with Carry)

**Summary:** ADC (6502) — Add with Carry instruction (mnemonic ADC) for the MOS 6502. Addressing modes include Immediate, Zero Page, Zero Page,X, Absolute, Absolute,X, Absolute,Y, (Indirect,X), and (Indirect),Y; affects processor flags N, V, Z, C.

## Operation
Performs accumulator + memory + Carry (A + M + C) and stores the result in the accumulator (A). The instruction updates the Negative (N), Overflow (V), Zero (Z), and Carry (C) flags based on the arithmetic result. (Carry is the incoming carry flag; result replaces A.)

## Addressing modes (syntax)
- Immediate: ADC #$aa
- Zero Page: ADC $aa
- Zero Page,X: ADC $aa,X
- Absolute: ADC $aaaa
- Absolute,X: ADC $aaaa,X
- Absolute,Y: ADC $aaaa,Y
- Indexed Indirect: ADC ($aa,X)
- Indirect Indexed: ADC ($aa),Y

## Source Code
```asm
; ADC - Add with Carry - 6502 opcodes and instruction lengths
; Addressing Mode         Assembly        Opcode  Bytes  Flags Affected
; Absolute                ADC $aaaa       $6D     3      N,V,Z,C
; Zero Page               ADC $aa         $65     2      N,V,Z,C
; Immediate               ADC #$aa        $69     2      N,V,Z,C
; Absolute Indexed,X      ADC $aaaa,X     $7D     3      N,V,Z,C
; Absolute Indexed,Y      ADC $aaaa,Y     $79     3      N,V,Z,C
; Zero Page Indexed,X     ADC $aa,X       $75     2      N,V,Z,C
; Indexed Indirect        ADC ($aa,X)     $61     2      N,V,Z,C
; Indirect Indexed        ADC ($aa),Y     $71     2      N,V,Z,C

; Alternate compact listing:
; ADC   Add with Carry
;   Absolute              ADC $aaaa     $6D  3  N,V,Z,C
;   Zero Page             ADC $aa       $65  2  N,V,Z,C
;   Immediate             ADC #$aa      $69  2  N,V,Z,C
;   Absolute Indexed X    ADC $aaaa,X   $7D  3  N,V,Z,C
;   Absolute Indexed Y    ADC $aaaa,Y   $79  3  N,V,Z,C
;   Zero Page Indexed X   ADC $aa,X     $75  2  N,V,Z,C
;   Indexed Indirect      ADC ($aa,X)   $61  2  N,V,Z,C
;   Indirect Indexed      ADC ($aa),Y   $71  2  N,V,Z,C
```

## References
- "sbc_instruction" — related arithmetic (Subtract with Carry, SBC)

## Mnemonics
- ADC
