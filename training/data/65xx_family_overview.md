# 6502 Instruction Set and 65xx Family Variants

**Summary:** Overview of the 6502 instruction set (including unofficial/illegal opcodes and opcode-layout patterns) and a concise feature list of 65xx family variants (6502, 65C02, 6510, 65816, etc.). Includes opcode mnemonics and matrix views of legal and undocumented opcodes (useful for disassemblers/emulators); see also emulator/assembler tools and pinouts (e.g. VIC-II, $D012).

## Variants overview
- 6502 — Original NMOS 8-bit CPU core.
- 6502A / 6502C — Stepped revisions/steppings of the NMOS 6502 (silicon revisions).
- 65C02 — CMOS revision with added instructions and addressing modes; reduced illegal opcodes.
- 6503 / 6505 / 6506 — 12-bit address variants (smaller address bus).
- 6504 — 13-bit address variant; no NMI.
- 6507 — 13-bit address variant with interrupts removed (commonly used in cartridges).
- 6509 — Extended to 20-bit addressing via bank-switching mechanism.
- 6510 — 6502 with integrated 6-bit I/O port (used in the Commodore 64).
- 6511 / 65F11 (Rockwell / microcontroller variants) — MCU versions with integrated I/O, serial, and onboard RAM/features.
- 7501 — Another derivative (used in some systems; MCU-like features).
- 8500 / 8502 — Variants used in some home computers (NMOS/CMOS/revisions).
- 65816 — 16-bit registers and ALU, 24-bit linear address bus (backwards-compatible 65xx superset).
- 65802 — Related variant of the 65816 (CMOS, selected compatibility mode).
- WDC (Western Design Center) — ongoing support and further derivatives / intellectual property stewarding; modern toolchains and cores available from WDC.
- Virtual tools / community resources — emulators, assemblers, disassemblers, opcode analyzers and test ROMs are commonly used to explore official and unofficial opcodes.

## Undocumented / Illegal opcodes (behavioral notes)
- Illegal opcodes cluster into vertical patterns in the opcode matrix; many undocumented instructions combine behavior of two legal instructions located in the rows above them (bitwise combination observation).
- The matrix can be viewed in multiple rotated perspectives (rows/columns labeled a,b,c in some references) to reveal grouping: legal instructions occupy predictable opcode positions; illegal ones usually inherit partial functionality from adjacent legal ops.
- Example behavior observation: many illegal opcodes at c = 3 can be seen as a combination of the operations from c = 1 and c = 2 (bit 0 and bit 1 set = 3). This explains why some illegal opcodes perform combined operations or appear as fused effects (e.g., memory operation + register transfer).
- Some illegal combinations are effectively NOPs or nonsensical (e.g., opcode $89 would correspond to "STA #" — storing the accumulator to an immediate constant — which is non-sensible and results in a NOP-like behavior on many NMOS chips).
- Unofficial opcodes include fused operations like RLA, SRE, RRA, SAX, LAX, DCP, ISC, ANC, ALR, ARR, ANE, LXA, SBX, USBC, etc., across various addressing modes (zpg, abs, ind, X/Y indexed, immediate).
- When emulating or disassembling, rely on opcode tables and empirical behavior for the target CPU stepping (NMOS vs CMOS, specific mask revisions) because behavior can differ across die revisions and CMOS implementations (65C02 removes or changes some illegal opcodes).

## Source Code
```text
                         1       $23   RLA X,ind    $27 RLA zpg   $2B ANC #     $2F RLA abs     $33   RLA ind,Y $37 RLA zpg,X $3B RLA abs,Y $3F RLA abs,X
                         2       $43   SRE X,ind    $47 SRE zpg   $4B ALR #     $4F SRE abs     $53   SRE ind,Y $57 SRE zpg,X $5B SRE abs,Y $5F SRE abs,X
                         3       $63   RRA X,ind    $67 RRA zpg   $6B ARR #     $6F RRA abs     $73   RRA ind,Y $77 RRA zpg,X $7B RRA abs,Y $7F RRA abs,X
               3
                         4       $83   SAX X,ind    $87 SAX zpg   $8B ANE #     $8F SAX abs     $93   SHA ind,Y $97 SAX zpg,Y $9B TAS abs,Y $9F SHA abs,Y
                         5       $A3   LAX X,ind    $A7 LAX zpg   $AB LXA #     $AF LAX abs     $B3   LAX ind,Y $B7 LAX zpg,Y $BB LAS abs,Y $BF LAX abs,Y
                         6       $C3   DCP X,ind    $C7 DCP zpg   $CB SBX #     $CF DCP abs     $D3   DCP ind,Y $D7 DCP zpg,X $DB DCP abs,Y $DF DCP abs,X
                         7       $E3   ISC X,ind    $E7 ISC zpg   $EB USBC #    $EF ISC abs     $F3   ISC ind,Y $F7 ISC zpg,X $FB ISC abs,Y $FF ISC abs,X
          And, again, as a rotated view, rows as combinations of c and b, and columns as a.
          We may observe a close relationship between the legal and the undocumented
          instructions in the vertical (quarter-)segements of each column.
               c         b                                                                    a
                                         0               1             2             3                  4            5             6             7
                         0       $00   BRK impl     $20 JSR abs   $40 RTI impl  $60 RTS impl    $80   NOP #     $A0 LDY #     $C0 CPY #     $E0 CPX #
                         1       $04   NOP zpg      $24 BIT zpg   $44 NOP zpg   $64 NOP zpg     $84   STY zpg   $A4 LDY zpg   $C4 CPY zpg   $E4 CPX zpg
                         2       $08   PHP impl     $28 PLP impl  $48 PHA impl  $68 PLA impl    $88   DEY impl  $A8 TAY impl  $C8 INY impl  $E8 INX impl
                         3       $0C   NOP abs      $2C BIT abs   $4C JMP abs   $6C JMP ind     $8C   STY abs   $AC LDY abs   $CC CPY abs   $EC CPX abs
               0
                         4       $10   BPL rel      $30 BMI rel   $50 BVC rel   $70 BVS rel     $90   BCC rel   $B0 BCS rel   $D0 BNE rel   $F0 BEQ rel
                         5       $14   NOP zpg,X    $34 NOP zpg,X $54 NOP zpg,X $74 NOP zpg,X   $94   STY zpg,X $B4 LDY zpg,X $D4 NOP zpg,X $F4 NOP zpg,X
                         6       $18   CLC impl     $38 SEC impl  $58 CLI impl  $78 SEI impl    $98   TYA impl  $B8 CLV impl  $D8 CLD impl  $F8 SED impl
                         7       $1C   NOP abs,X    $3C NOP abs,X $5C NOP abs,X $7C NOP abs,X   $9C   SHY abs,X $BC LDY abs,X $DC NOP abs,X $FC NOP abs,X
               1         0       $01   ORA X,ind    $21 AND X,ind $41 EOR X,ind $61 ADC X,ind   $81   STA X,ind $A1 LDA X,ind $C1 CMP X,ind $E1 SBC X,ind
                         1       $05   ORA zpg      $25 AND zpg   $45 EOR zpg   $65 ADC zpg     $85   STA zpg   $A5 LDA zpg   $C5 CMP zpg   $E5 SBC zpg
                                                                       6502 Instruction Set
               c         b                                                                     a
                                         0               1             2             3                   4            5             6             7
                         2       $09   ORA #        $29 AND #     $49 EOR #     $69 ADC #        $89   NOP #     $A9 LDA #     $C9 CMP #     $E9 SBC #
                         3       $0D   ORA abs      $2D AND abs   $4D EOR abs   $6D ADC abs      $8D   STA abs   $AD LDA abs   $CD CMP abs   $ED SBC abs
                         4       $11   ORA ind,Y    $31 AND ind,Y $51 EOR ind,Y $71 ADC ind,Y    $91   STA ind,Y $B1 LDA ind,Y $D1 CMP ind,Y $F1 SBC ind,Y
                         5       $15   ORA zpg,X    $35 AND zpg,X $55 EOR zpg,X $75 ADC zpg,X    $95   STA zpg,X $B5 LDA zpg,X $D5 CMP zpg,X $F5 SBC zpg,X
                         6       $19   ORA abs,Y    $39 AND abs,Y $59 EOR abs,Y $79 ADC abs,Y    $99   STA abs,Y $B9 LDA abs,Y $D9 CMP abs,Y $F9 SBC abs,Y
                         7       $1D   ORA abs,X    $3D AND abs,X $5D EOR abs,X $7D ADC abs,X    $9D   STA abs,X $BD LDA abs,X $DD CMP abs,X $FD SBC abs,X
                         0       $02   JAM          $22 JAM       $42 JAM       $62 JAM          $82   NOP #     $A2 LDX #     $C2 NOP #     $E2 NOP #
                         1       $06   ASL zpg      $26 ROL zpg   $46 LSR zpg   $66 ROR zpg      $86   STX zpg   $A6 LDX zpg   $C6 DEC zpg   $E6 INC zpg
                         2       $0A   ASL A        $2A ROL A     $4A LSR A     $6A ROR A        $8A   TXA impl  $AA TAX impl  $CA DEX impl  $EA NOP impl
                         3       $0E   ASL abs      $2E ROL abs   $4E LSR abs   $6E ROR abs      $8E   STX abs   $AE LDX abs   $CE DEC abs   $EE INC abs
               2
                         4       $12   JAM          $32 JAM       $52 JAM       $72 JAM          $92   JAM       $B2 JAM       $D2 JAM       $F2 JAM
                         5       $16   ASL zpg,X    $36 ROL zpg,X $56 LSR zpg,X $76 ROR zpg,X    $96   STX zpg,Y $B6 LDX zpg,Y $D6 DEC zpg,X $F6 INC zpg,X
                         6       $1A   NOP impl     $3A NOP impl  $5A NOP impl  $7A NOP impl     $9A   TXS impl  $BA TSX impl  $DA NOP impl  $FA NOP impl
                         7       $1E   ASL abs,X    $3E ROL abs,X $5E LSR abs,X $7E ROR abs,X    $9E   SHX abs,Y $BE LDX abs,Y $DE DEC abs,X $FE INC abs,X
                         0       $03   SLO X,ind    $23 RLA X,ind $43 SRE X,ind $63 RRA X,ind    $83   SAX X,ind $A3 LAX X,ind $C3 DCP X,ind $E3 ISC X,ind
                         1       $07   SLO zpg      $27 RLA zpg   $47 SRE zpg   $67 RRA zpg      $87   SAX zpg   $A7 LAX zpg   $C7 DCP zpg   $E7 ISC zpg
                         2       $0B   ANC #        $2B ANC #     $4B ALR #     $6B ARR #        $8B   ANE #     $AB LXA #     $CB SBX #     $EB USBC #
                         3       $0F   SLO abs      $2F RLA abs   $4F SRE abs   $6F RRA abs      $8F   SAX abs   $AF LAX abs   $CF DCP abs   $EF ISC abs
               3
                         4       $13   SLO ind,Y    $33 RLA ind,Y $53 SRE ind,Y $73 RRA ind,Y    $93   SHA ind,Y $B3 LAX ind,Y $D3 DCP ind,Y $F3 ISC ind,Y
                         5       $17   SLO zpg,X    $37 RLA zpg,X $57 SRE zpg,X $77 RRA zpg,X    $97   SAX zpg,Y $B7 LAX zpg,Y $D7 DCP zpg,X $F7 ISC zpg,X
                         6       $1B   SLO abs,Y    $3B RLA abs,Y $5B SRE abs,Y $7B RRA abs,Y    $9B   TAS abs,Y $BB LAS abs,Y $DB DCP abs,Y $FB ISC abs,Y
                         7       $1F   SLO abs,X    $3F RLA abs,X $5F SRE abs,X $7F RRA abs,X    $9F   SHA abs,Y $BF LAX abs,Y $DF DCP abs,X $FF ISC abs,X
          And, finally, in a third view, we may observe how each of the rows of "illegal"
          instructions at c = 3 inherits behavior from the two rows with c = 1 and c = 2
          immediately above, combining the operations of these instructions with the
          address mode of the respective instruction at c = 1.
          (Mind that in binary 3 is the combination of 2 and 1, bits 0 and 1 both set.)
          We may further observe that additional NOPs result from non-effective or non-
          sensical combinations of operations and address modes, e.g., instr. $89, which
          would be "STA #", storing the contents of the accumulator in the operand.
                                                                   6502 Instruction Set
```

## References
- "pinouts_and_physical_signals" — expands on physical interface differences across variants
- "external_links_and_tools" — expands on emulators, assemblers, disassemblers and community resources

## Mnemonics
- RLA
- SRE
- RRA
- SAX
- LAX
- DCP
- ISC
- ANC
- ALR
- ARR
- ANE
- LXA
- SBX
- USBC
- SLO
- SHA
- TAS
- LAS
- JAM
