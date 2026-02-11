# EOR / INC / INX / INY (opcode summary)

**Summary:** 6502 opcode bytes for EOR (exclusive OR) and the increment family (INC, INX, INY), with addressing modes, instruction lengths, and cycle counts; includes raw opcode byte list extracted from the source.

**Description**
This chunk enumerates the standard 6502 encodings for EOR and the INC/INX/INY instructions, listing addressing modes, opcode hex bytes, instruction lengths (bytes), and typical cycle counts (including page-cross penalties where applicable). EOR supports immediate, zero page, zero page,X, absolute, absolute,X, absolute,Y, (indirect,X), and (indirect),Y addressing modes. INC is the memory read-modify-write increment (zero page/zero page,X/absolute/absolute,X); INX and INY increment the X and Y registers.

Cycle notes:
- EOR: immediate 2 cycles; zero page 3; zero page,X 4; absolute 4; absolute,X / absolute,Y add +1 if page crossed; (indirect,X) 6; (indirect),Y 5 (+1 if page crossed).
- INC (memory RMW): zero page 5; zero page,X 6; absolute 6; absolute,X 7.
- INX/INY: 2 cycles each.

(No hardware register map applies; this chunk is instruction/opcode data.)

## Source Code
```text
Opcode table: mnemonic - addressing mode - opcode - bytes - cycles

EOR
- Immediate        - $49 - 2 bytes - 2 cycles
- Zero Page        - $45 - 2 bytes - 3 cycles
- Zero Page,X      - $55 - 2 bytes - 4 cycles
- Absolute         - $4D - 3 bytes - 4 cycles
- Absolute,X       - $5D - 3 bytes - 4 cycles (+1 if page crossed)
- Absolute,Y       - $59 - 3 bytes - 4 cycles (+1 if page crossed)
- (Indirect,X)     - $41 - 2 bytes - 6 cycles
- (Indirect),Y     - $51 - 2 bytes - 5 cycles (+1 if page crossed)

INC / INX / INY
- INC Zero Page    - $E6 - 2 bytes - 5 cycles
- INC Zero Page,X  - $F6 - 2 bytes - 6 cycles
- INC Absolute     - $EE - 3 bytes - 6 cycles
- INC Absolute,X   - $FE - 3 bytes - 7 cycles
- INX              - $E8 - 1 byte  - 2 cycles
- INY              - $C8 - 1 byte  - 2 cycles

Related decrement opcodes (listed in source raw bytes; full DEC mappings are in "decrement_instructions")
- DEC Absolute     - $CE - 3 bytes - 6 cycles
- DEC Absolute,X   - $DE - 3 bytes - 7 cycles
(See reference for full DEC/DEX/DEY details.)

Raw opcode bytes extracted from source (unordered snippet):
$49 $E8 $C8 $C6 $D6 $45 $55 $E6 $F6 $41 $51 $CE $DE $4D $5D $EE $FE

Assembly examples:
```asm
    LDA #$0F
    EOR #$F0       ; EOR immediate ($49)
    INC $0010      ; INC absolute ($EE)
    INX            ; INX ($E8)
```
```

## References
- "decrement_instructions" — DEC / DEX / DEY opcode encodings and cycles
- "jumps_and_load_instructions" — next block covering JMP/JSR and LDA/LDX/LDY entries

## Mnemonics
- EOR
- INC
- INX
- INY
- DEC
