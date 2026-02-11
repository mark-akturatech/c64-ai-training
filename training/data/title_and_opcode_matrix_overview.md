# 6502 Instruction Set — TOC, Opcode Matrix & Addressing Modes

**Summary:** High-level NMOS 6502 opcode matrix and table of contents with view toggles (standard / illegal / WDC 65C02), plus concise addressing-mode definitions (A, abs, abs,X, abs,Y, # immediate, impl, ind, (X,ind), (ind),Y, rel, zpg, zpg,X, zpg,Y) and notes on little-endian 16-bit words and page-crossing (carry) behavior. Chips referenced: NMOS 6502, WDC 65C02.

**Description**
This chunk contains:
- The document-level table of contents and tool list for a 6502 instruction reference.
- A high-level opcode matrix (hex rows/columns) showing the standard NMOS 6502 instruction layout, with view toggles for illegal opcodes and WDC 65C02 extensions.
- Compact definitions of addressing mode mnemonics used throughout the instruction set (including the WDC 65C02 extended addressing modes).

The opcode matrix in Source Code is an ASCII high-level overview (not a cycle-accurate timing table or exhaustive list of illegal opcodes). Use the matrix for quick opcode lookup; consult more detailed instruction entries for full timing, flags affected, and edge cases.

**Address Modes**
- A (Accumulator)
  - Syntax: OPC A
  - Operand is the accumulator (single-byte instruction operating on A).
- abs (absolute)
  - Syntax: OPC $LLHH
  - Operand is a 16-bit address word stored little-endian (low byte then high byte).
- abs,X (absolute, X-indexed)
  - Syntax: OPC $LLHH,X
  - Effective address = 16-bit address + X with carry (may cross page boundary; extra cycle if page crossed).
- abs,Y (absolute, Y-indexed)
  - Syntax: OPC $LLHH,Y
  - Effective address = 16-bit address + Y with carry (may cross page).
- # (immediate)
  - Syntax: OPC #$BB
  - Operand is an immediate byte value BB.
- impl (implied)
  - Syntax: OPC
  - Operand is implied; no operand bytes.
- ind (indirect)
  - Syntax: OPC ($LLHH)
  - Operand is a 16-bit address; effective address = 16-bit word fetched from memory at $HHLL (little-endian read).
- X,ind (X-indexed, indirect) — usually written ($LL,X)
  - Syntax: OPC ($LL,X)
  - Operand is a zeropage address LL; effective 16-bit address = word at (LL + X, LL + X + 1) on zeropage; increment without carry (high byte remains $00).
- ind,Y (indirect, Y-indexed) — usually written ($LL),Y
  - Syntax: OPC ($LL),Y
  - Operand is a zeropage address LL; base 16-bit address = word at (LL, LL+1) on zeropage; effective address = base + Y with carry (may cross page).
- rel (relative)
  - Syntax: OPC $BB
  - Branch target = PC + signed 8-bit offset BB (range -128..+127). Page transitions may add an extra cycle.
- zpg (zeropage)
  - Syntax: OPC $LL
  - Operand is zeropage address ($00LL). High byte is implicitly $00.
- zpg,X (zeropage, X-indexed)
  - Syntax: OPC $LL,X
  - Effective address = ($00LL + X) within zeropage (no carry into high byte).
- zpg,Y (zeropage, Y-indexed)
  - Syntax: OPC $LL,Y
  - Effective address = ($00LL + Y) within zeropage (no carry).

Notes on byte ordering and page behavior:
- 16-bit address words are little-endian: low byte first, then high byte. Assemblers commonly display addresses as $HHLL (human-readable).
- The 16-bit address space is segmented into 256-byte pages (high-byte = page index). Adding an index register (X/Y) to a 16-bit absolute address is performed with carry: the high byte can change and crossing a page boundary may add an extra cycle. Adding to a zeropage address is performed without carry (high byte remains $00), so no page crossing occurs.
- Branch offsets are signed 8-bit two's-complement values (-128..+127). Branches can cross pages, potentially adding cycles.

WDC 65C02 extended address modes (not present on NMOS 6502):
- (zpg) — zeropage indirect
  - Syntax: OPC ($LL)
  - Effective address = 16-bit word at (LL, LL + 1) on zeropage.
- (abs,X) — absolute indexed indirect (used e.g. by JMP in some 65C02 variants)
  - Syntax: JMP ($LLHH,X)
  - Operand is base absolute address; effective address read from ($HHLL + X, $HHLL + 1 + X).

## Source Code
```text
6502 Instruction Set
TOC: Description / Instructions by Type / Address Modes in Detail / Instructions in Detail / "Illegal" Opcodes / WDC Extensions / Rockwell Extensions /
      Comparisons & BIT / A Primer of 6502 Arithmetic Operations / Jump Vectors and Stack Operations / Instruction Layout / Pinout / 65xx-Family
Tools: 6502 Emulator / 6502 Assembler / 6502 Disassembler

         HI                                                                               LO-NIBBLE
                   ‐0         ‐1       ‐2       ‐3        ‐4        ‐5          ‐6       ‐7        ‐8          ‐9       ‐A      ‐B         ‐C          ‐D             ‐E      ‐F
         0‐     BRK impl  ORA X,ind  ---     ---      ---       ORA zpg     ASL zpg   ---       PHP impl   ORA #     ASL A    ---      ---        ORA abs        ASL abs   ---
         1‐     BPL rel   ORA ind,Y  ---     ---      ---       ORA zpg,X   ASL zpg,X ---       CLC impl   ORA abs,Y ---      ---      ---        ORA abs,X      ASL abs,X ---
         2‐     JSR abs   AND X,ind  ---     ---      BIT zpg   AND zpg     ROL zpg   ---       PLP impl   AND #     ROL A    ---      BIT abs    AND abs        ROL abs   ---
         3‐     BMI rel   AND ind,Y  ---     ---      ---       AND zpg,X   ROL zpg,X ---       SEC impl   AND abs,Y ---      ---      ---        AND abs,X      ROL abs,X ---
         4‐     RTI impl  EOR X,ind  ---     ---      ---       EOR zpg     LSR zpg   ---       PHA impl   EOR #     LSR A    ---      JMP abs    EOR abs        LSR abs   ---
         5‐     BVC rel   EOR ind,Y  ---     ---      ---       EOR zpg,X   LSR zpg,X ---       CLI impl   EOR abs,Y ---      ---      ---        EOR abs,X      LSR abs,X ---
         6‐     RTS impl  ADC X,ind  ---     ---      ---       ADC zpg     ROR zpg   ---       PLA impl   ADC #     ROR A    ---      JMP ind    ADC abs        ROR abs   ---
         7‐     BVS rel   ADC ind,Y  ---     ---      ---       ADC zpg,X   ROR zpg,X ---       SEI impl   ADC abs,Y ---      ---      ---        ADC abs,X      ROR abs,X ---
         8‐     ---       STA X,ind  ---     ---      STY zpg   STA zpg     STX zpg   ---       DEY impl   ---       TXA impl ---      STY abs    STA abs        STX abs   ---
         9‐     BCC rel   STA ind,Y  ---     ---      STY zpg,X STA zpg,X   STX zpg,Y ---       TYA impl   STA abs,Y TXS impl ---      ---        STA abs,X      ---       ---
         A‐     LDY #     LDA X,ind  LDX #   ---      LDY zpg   LDA zpg     LDX zpg   ---       TAY impl   LDA #     TAX impl ---      LDY abs    LDA abs        LDX abs   ---
         B‐     BCS rel   LDA ind,Y  ---     ---      LDY zpg,X LDA zpg,X   LDX zpg,Y ---       CLV impl   LDA abs,Y TSX impl ---      LDY abs,X  LDA abs,X      LDX abs,Y ---
         C‐     CPY #     CMP X,ind  ---     ---      CPY zpg   CMP zpg     DEC zpg   ---       INY impl   CMP #     DEX impl ---      CPY abs    CMP abs        DEC abs   ---
         D‐     BNE rel   CMP ind,Y  ---     ---      ---       CMP zpg,X   DEC zpg,X ---       CLD impl   CMP abs,Y ---      ---      ---        CMP abs,X      DEC abs,X ---
         E‐     CPX #     SBC X,ind  ---     ---      CPX zpg   SBC zpg     INC zpg   ---       INX impl   SBC #     NOP impl ---      CPX abs    SBC abs        INC abs   ---
         F‐     BEQ rel   SBC ind,Y  ---     ---      ---       SBC zpg,X   INC zpg,X ---       SED impl   SBC abs,Y ---      ---      ---        SBC abs,X      INC abs,X ---
View:      standard set only      illegal opcodes (NMOS)     WDC extensions (65C02)
```

## References
- "address_modes_details" — expands addressing modes and page-crossing notes
- "instructions_by_name" — full instruction mnemonic list and per-instruction detail

## Mnemonics
- ADC
- AND
- ASL
- BCC
- BCS
- BEQ
- BIT
- BMI
- BNE
- BPL
- BRK
- BVC
- BVS
- CLC
- CLD
- CLI
- CLV
- CMP
- CPX
- CPY
- DEC
- DEX
- DEY
- EOR
- INC
- INX
- INY
- JMP
- JSR
- LDA
- LDX
- LDY
- LSR
- NOP
- ORA
- PHA
- PHP
- PLA
- PLP
- ROL
- ROR
- RTI
- RTS
- SBC
- SEC
- SED
- SEI
- STA
- STX
- STY
- TAX
- TAY
- TSX
- TXA
- TXS
- TYA
