# CMP / DEC / EOR / INC — grouped opcodes (immediate, zero page, indexed, indirect-index)

**Summary:** Opcode mapping for CMP, DEC, EOR, and INC covering immediate, accumulator (65C02), zero page, zero-page,X, absolute, absolute,X/Y, and indirect-indexed ((zp,X) / (zp),Y) variants. Searchable terms: $C9, $49, $C5, $D5, $C1, $D1, $3A, $1A, 65C02, (zp,X), (zp),Y, $CD, $DD, $D9, $CE, $DE, $4D, $5D, $59, $EE, $FE.

**Description**
This chunk lists grouped opcode bytes for CMP, DEC, EOR, and INC across several addressing modes present on 6502-family CPUs (including the 65C02 accumulator forms). Included addressing modes in the table below:

- Immediate (e.g., CMP #imm, EOR #imm)
- Accumulator (DEC A / INC A — 65C02 extensions)
- Zero Page and Zero Page,X
- Absolute and Absolute,X/Y
- Indirect-indexed zero page: (zp,X) and (zp),Y

CMP performs A - M comparison and sets flags (N, Z, C) (compare operation). EOR performs bitwise exclusive OR. DEC/INC decrement/increment memory or accumulator.

## Source Code
```asm
; Immediate / accumulator variants
C9  CMP #imm        ; CMP immediate
3A  DEC A           ; DEC accumulator (65C02)
49  EOR #imm        ; EOR immediate
1A  INC A           ; INC accumulator (65C02)

; Zero Page / Zero Page,X / Zero Page decrement/increment
C5  CMP zp          ; CMP zero page
D5  CMP zp,X        ; CMP zero page,X

C6  DEC zp          ; DEC zero page
D6  DEC zp,X        ; DEC zero page,X

45  EOR zp          ; EOR zero page
55  EOR zp,X        ; EOR zero page,X

E6  INC zp          ; INC zero page
F6  INC zp,X        ; INC zero page,X

; Absolute / Absolute,X / Absolute,Y variants
CD  CMP abs         ; CMP absolute
DD  CMP abs,X       ; CMP absolute,X
D9  CMP abs,Y       ; CMP absolute,Y

CE  DEC abs         ; DEC absolute
DE  DEC abs,X       ; DEC absolute,X

4D  EOR abs         ; EOR absolute
5D  EOR abs,X       ; EOR absolute,X
59  EOR abs,Y       ; EOR absolute,Y

EE  INC abs         ; INC absolute
FE  INC abs,X       ; INC absolute,X

; Indirect-indexed (zero page) variants
C1  CMP (zp,X)      ; CMP (zp,X)
D1  CMP (zp),Y      ; CMP (zp),Y

41  EOR (zp,X)      ; EOR (zp,X)
51  EOR (zp),Y      ; EOR (zp),Y
```

## References
- "bit_instruction_65c02" — BIT and flag behavior affecting CMP/EOR-like operations
- "sbc_instruction" — related arithmetic instruction SBC

## Mnemonics
- CMP
- DEC
- EOR
- INC
