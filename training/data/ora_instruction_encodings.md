# ORA — 6502 inclusive-OR (opcode encodings)

**Summary:** ORA (A := A OR M) opcode encodings for the 6502: official encodings $09, $05, $15, $01, $11, $0D, $1D, $19 with addressing modes and cycles, plus a raw list of additional/undocumented opcode bytes ($12, $F5, $E1, $F1, $ED, $FD, $F9, $F2) included in the source.

**Description**
ORA performs a bitwise inclusive-OR between the accumulator and a memory operand, storing the result in A and updating the Negative and Zero flags (N,Z). It does not change Carry or Overflow.

Official/standard addressing modes and typical cycle counts on NMOS 6502:
- Immediate (#$nn): 2 cycles.
- Zero Page ($nn): 3 cycles.
- Zero Page,X ($nn,X): 4 cycles.
- Absolute ($nnnn): 4 cycles.
- Absolute,X ($nnnn,X): 4 cycles (+1 if page crossed).
- Absolute,Y ($nnnn,Y): 4 cycles (+1 if page crossed).
- (Indirect,X) / Indexed Indirect ($nn,X) -> (addr): 6 cycles.
- (Indirect),Y / Indirect Indexed ($nn),Y -> (addr): 5 cycles (+1 if page crossed).

Undocumented/illegal opcode bytes exist on many 6502 variants; their behavior (and whether they perform an ORA-like operation or a composite/undefined effect) varies by CPU revision and emulator. The source lists several such bytes; see below for details.

## Source Code
```text
; Official/standard ORA opcodes (NMOS 6502)
; Opcode  Mode              Bytes  Cycles  Notes
$09      Immediate         2      2       A := A OR imm
$05      Zero Page         2      3       A := A OR zp
$15      Zero Page,X       2      4       A := A OR zp,X
$01      (Indirect,X)      2      6       A := A OR (zp,X)
$11      (Indirect),Y      2      5 (+1)  A := A OR (zp),Y ; +1 if page crossed
$0D      Absolute          3      4       A := A OR abs
$1D      Absolute,X        3      4 (+1)  A := A OR abs,X ; +1 if page crossed
$19      Absolute,Y        3      4 (+1)  A := A OR abs,Y ; +1 if page crossed

; Undocumented/illegal opcodes (NMOS 6502)
; Opcode  Mnemonic  Mode              Bytes  Cycles  Notes
$12      KIL       Implied           1      1       Halts the CPU
$F5      ISC       Zero Page,X       2      6       INC zp,X; SBC zp,X
$E1      ISC       (Indirect,X)      2      8       INC (zp,X); SBC (zp,X)
$F1      ISC       (Indirect),Y      2      8       INC (zp),Y; SBC (zp),Y
$ED      ISC       Absolute          3      6       INC abs; SBC abs
$FD      ISC       Absolute,X        3      7       INC abs,X; SBC abs,X
$F9      ISC       Absolute,Y        3      7       INC abs,Y; SBC abs,Y
$F2      KIL       Implied           1      1       Halts the CPU
```

## References
- "lda_instruction_encodings" — expands on LDA/ORA shared addressing-mode patterns
- "phx_phy_plx_ply" — expands on stack operations used around accumulator/X/Y manipulation

## Mnemonics
- ORA
- ISC
- KIL
