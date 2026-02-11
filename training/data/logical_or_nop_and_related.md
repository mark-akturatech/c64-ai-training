# ORA and NOP — opcode bytes for supported addressing modes

**Summary:** Lists 6502 opcode bytes for ORA (logical OR with accumulator) addressing modes and the single-byte NOP ($EA). Includes raw opcode bytes from the quick-reference table and neighboring bytes corresponding to adjacent instructions.

**Opcode summary**
ORA performs a bitwise OR between a memory operand and the accumulator (A). The canonical 6502 addressing modes for ORA and their opcode bytes:

- Zero Page: ORA $zz -> $05
- Zero Page,X: ORA $zz,X -> $15
- Absolute: ORA $hhll -> $0D
- Absolute,X: ORA $hhll,X -> $1D
- Absolute,Y: ORA $hhll,Y -> $19
- Immediate: ORA #$ii -> $09
- (Indirect,X): ORA ($zz,X) -> $01
- (Indirect),Y: ORA ($zz),Y -> $11

NOP is the single-byte no-operation instruction:
- NOP -> $EA

The raw chunk included many opcode bytes from the quick-reference table; some belong to ORA/NOP entries above, others are adjacent entries (see Source Code for the verbatim byte list).

## Source Code
```asm
; Canonical ORA and NOP opcodes (6502)
ORA zp        ; $05
ORA zp,X      ; $15
ORA abs       ; $0D
ORA abs,X     ; $1D
ORA abs,Y     ; $19
ORA #imm      ; $09
ORA (zp,X)    ; $01
ORA (zp),Y    ; $11

NOP           ; $EA   ; single-byte NOP

; Verbatim opcode bytes present in the source chunk (appeared as a quick-reference row)
; Note: these include ORA/NOP opcodes and adjacent table entries listed without labels:
$05  ; ORA zp
$15  ; ORA zp,X
$0D  ; ORA abs
$1D  ; ORA abs,X
$4A  ; LSR A
$EA  ; NOP
$09  ; ORA #imm
$A1  ; LDA (zp,X)
$B1  ; LDA (zp),Y
$B6  ; LDX zp,Y
$AD  ; LDA abs
$BD  ; LDA abs,X
$AE  ; LDX abs
$01  ; ORA (zp,X)
$11  ; ORA (zp),Y
$59  ; EOR abs,Y
$6C  ; JMP (abs)
```

## References
- "jumps_and_load_instructions" — expands on previous jump/load instruction entries
- "loads_shifts_and_stack_ops" — expands on next block lists LDA/LSR and stack/shift operations

## Mnemonics
- ORA
- NOP
