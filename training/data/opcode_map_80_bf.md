# 6502 Opcode Map: $80–$BF

**Summary:** Textual listing of 6502 opcode mnemonics and addressing modes for byte values $80–$BF, including LDY/LDX/LDA immediate/zero page/absolute/indexed forms, STA variants, transfers TXA/TAX/TAY/DEY/TYA/TXS/TSX, branches BCC/BCS, and many "Future Expansion" reserved opcodes. This corrected version resolves typographical errors and duplicate opcode entries present in the original source.

**Opcode block description**

This chunk provides a textual listing of opcode byte values $80 through $BF in two columns (left: $80–$9F, right: $A0–$BF). Each line shows the opcode byte (hex), a mnemonic (when defined), and an addressing mode. Many entries are marked "Future Expansion" (reserved/undefined in the original 6502 listing). The original source contained typographical errors and duplicate opcode entries, which have been corrected in this version.

Use this chunk to search for opcode mnemonics and addressing-mode mentions in the $80–$BF range. The Source Code section contains the corrected listing for retrieval.

## Source Code

```text
        80 - Future Expansion           A0 - LDY - Immediate
        81 - STA - (Indirect,X)         A1 - LDA - (Indirect,X)
        82 - Future Expansion           A2 - LDX - Immediate
        83 - Future Expansion           A3 - Future Expansion
        84 - STY - Zero Page            A4 - LDY - Zero Page
        85 - STA - Zero Page            A5 - LDA - Zero Page
        86 - STX - Zero Page            A6 - LDX - Zero Page
        87 - Future Expansion           A7 - Future Expansion
        88 - DEY                        A8 - TAY
        89 - Future Expansion           A9 - LDA - Immediate
        8A - TXA                        AA - TAX
        8B - Future Expansion           AB - Future Expansion
        8C - STY - Absolute             AC - LDY - Absolute
        8D - STA - Absolute             AD - LDA - Absolute
        8E - STX - Absolute             AE - LDX - Absolute
        8F - Future Expansion           AF - Future Expansion
        90 - BCC                        B0 - BCS
        91 - STA - (Indirect),Y         B1 - LDA - (Indirect),Y
        92 - Future Expansion           B2 - Future Expansion
        93 - Future Expansion           B3 - Future Expansion
        94 - STY - Zero Page,X          B4 - LDY - Zero Page,X
        95 - STA - Zero Page,X          B5 - LDA - Zero Page,X
        96 - STX - Zero Page,Y          B6 - LDX - Zero Page,Y
        97 - Future Expansion           B7 - Future Expansion
        98 - TYA                        B8 - CLV
        99 - STA - Absolute,Y           B9 - LDA - Absolute,Y
        9A - TXS                        BA - TSX
        9B - Future Expansion           BB - Future Expansion
        9C - Future Expansion           BC - LDY - Absolute,X
        9D - STA - Absolute,X           BD - LDA - Absolute,X
        9E - Future Expansion           BE - LDX - Absolute,Y
        9F - Future Expansion           BF - Future Expansion
```

## References

- "opcode_map_00_3f" — opcode entries for $00–$3F (earlier block)
- "opcode_map_40_7f" — opcode entries for $40–$7F (previous block)
- "opcode_map_c0_ff" — opcode entries for $C0–$FF (next block)

## Mnemonics
- STA
- STY
- STX
- DEY
- TXA
- BCC
- TYA
- TXS
- LDY
- LDA
- LDX
- TAY
- TAX
- BCS
- CLV
- TSX
