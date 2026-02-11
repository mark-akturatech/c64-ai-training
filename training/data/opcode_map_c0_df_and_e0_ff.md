# Opcode map: 6502 ranges $C0-$DF and $E0-$FF (compare / arithmetic / inc/dec / branches)

**Summary:** Opcode map for 6502 hex ranges $C0-$DF and $E0-$FF listing CPY/CPX/CMP (Immediate/Zero Page/Absolute/Indexed), DEC/INC (Zero Page/Absolute and X-indexed), INX/INY/DEX, SBC (Immediate/Zero Page/Absolute/Indexed), branch forms (BNE/BEQ and others), flag ops (CLD/SED), NOP ($EA), and "Future Expansion" placeholders for unused/undefined opcodes.

**Opcode map $C0-$DF and $E0-$FF — notes**
This chunk lists the standard 6502 opcodes in the two 32-byte ranges $C0-$DF and $E0-$FF that mostly cover compare (CPY/CPX/CMP), decrement/increment (DEC/INC), single-register increments/decrements (INX/INY/DEX), subtract-with-carry (SBC), branch pairs (BNE/BEQ), decimal flag ops (CLD/SED), and NOP ($EA). "Future Expansion" marks opcodes unused/undefined in the original 6502 opcode set. Addressing modes shown are Immediate, Zero Page, Absolute, Zero Page,X, Absolute,X, Absolute,Y, (Indirect,X) and (Indirect),Y where applicable.

- CPY: immediate ($C0), zero page ($C4), absolute ($CC).
- CPX: immediate ($E0), zero page ($E4), absolute ($EC).
- CMP: immediate ($C9), zero page ($C5), absolute ($CD), (Indirect,X) ($C1), (Indirect),Y ($D1), absolute,X ($DD), absolute,Y ($D9), zero page,X ($D5).
- SBC: immediate ($E9), zero page ($E5), absolute ($ED), (Indirect,X) ($E1), (Indirect),Y ($F1), absolute,X ($FD), absolute,Y ($F9), zero page,X ($F5).
- DEC: zero page ($C6), absolute ($CE), zero page,X ($D6), absolute,X ($DE).
- INC: zero page ($E6), absolute ($EE), zero page,X ($F6), absolute,X ($FE).
- Single-register inc/dec: INX ($E8), INY ($C8), DEX ($CA).
- Branches: BNE ($D0), BEQ ($F0).
- Flag ops: CLD ($D8) clears decimal mode; SED ($F8) sets decimal mode.
- NOP: $EA.

## Source Code
```text
        C0 - CPY - Immediate            E0 - CPX - Immediate
        C1 - CMP - (Indirect,X)         E1 - SBC - (Indirect,X)
        C2 - Future Expansion           E2 - Future Expansion
        C3 - Future Expansion           E3 - Future Expansion
        C4 - CPY - Zero Page            E4 - CPX - Zero Page
        C5 - CMP - Zero Page            E5 - SBC - Zero Page
        C6 - DEC - Zero Page            E6 - INC - Zero Page
        C7 - Future Expansion           E7 - Future Expansion
        C8 - INY                        E8 - INX
        C9 - CMP - Immediate            E9 - SBC - Immediate
        CA - DEX                        EA - NOP
        CB - Future Expansion           EB - Future Expansion
        CC - CPY - Absolute             EC - CPX - Absolute
        CD - CMP - Absolute             ED - SBC - Absolute
        CE - DEC - Absolute             EE - INC - Absolute
        CF - Future Expansion           EF - Future Expansion
        D0 - BNE                        F0 - BEQ
        D1 - CMP - (Indirect),Y         F1 - SBC - (Indirect),Y
        D2 - Future Expansion           F2 - Future Expansion
        D3 - Future Expansion           F3 - Future Expansion
        D4 - Future Expansion           F4 - Future Expansion
        D5 - CMP - Zero Page,X          F5 - SBC - Zero Page,X
        D6 - DEC - Zero Page,X          F6 - INC - Zero Page,X
        D7 - Future Expansion           F7 - Future Expansion
        D8 - CLD                        F8 - SED
        D9 - CMP - Absolute,Y           F9 - SBC - Absolute,Y
        DA - Future Expansion           FA - Future Expansion
        DB - Future Expansion           FB - Future Expansion
        DC - Future Expansion           FC - Future Expansion
        DD - CMP - Absolute,X           FD - SBC - Absolute,X
        DE - DEC - Absolute,X           FE - INC - Absolute,X
        DF - Future Expansion           FF - Future Expansion
```

## References
- "opcode_map_00_1f_and_20_3f" — complementary opcode map $00-$1F and $20-$3F (control, logical, shift, branch instructions)
- "opcode_map_40_5f_and_60_7f" — complementary opcode map $40-$5F and $60-$7F (EOR/ADC families, shifts, JMP, stack ops)
- "opcode_map_80_9f_and_a0_bf" — complementary opcode map $80-$9F and $A0-$BF (loads/stores, transfers, branch groups)

## Mnemonics
- CPY
- CPX
- CMP
- DEC
- INC
- INX
- INY
- DEX
- SBC
- BNE
- BEQ
- CLD
- SED
- NOP
