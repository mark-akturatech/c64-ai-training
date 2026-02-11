# 6502 Instructions: LDA, LDX, LDY, LSR, NOP, ORA, PHA/PHP/PLA/PLP, ROL

**Summary:** Opcode tables and flag effects for LDA (load accumulator), LDX (load X register), LDY (load Y register), LSR (logical shift right), NOP (no operation), ORA (logical OR with accumulator), stack push/pull instructions (PHA/PHP/PLA/PLP), and ROL (rotate left). Includes addressing modes, assembler mnemonics, opcodes, byte counts, and cycle counts.

**LDA (Load Accumulator)**
LDA loads a byte of memory into the accumulator. Affected flags: N (set if bit 7 of the result is 1), Z (set if result is zero). Other flags are unchanged.

**LDX (Load X Register)**
LDX loads a byte of memory into the X register. Affected flags: N (set if bit 7 of the result is 1), Z (set if result is zero). Other flags are unchanged.

**LDY (Load Y Register)**
LDY loads a byte of memory into the Y register. Affected flags: N (set if bit 7 of the result is 1), Z (set if result is zero). Other flags are unchanged.

**LSR (Logical Shift Right)**
LSR shifts each bit of the operand one place to the right. Bit 0 is shifted into Carry; bit 7 is filled with 0. The accumulator form (LSR A) operates on A; memory forms operate on the specified memory location. Affected flags: N is cleared (result MSB is 0), Z is set if result is zero, C is set to the previous bit 0.

**NOP (No Operation)**
Performs no operation and affects no processor flags. Opcode: EA (implied addressing).

**ORA (Logical OR with Accumulator)**
Performs bitwise OR between the accumulator and memory (A ← A OR M). Affects N (set from result bit 7) and Z (set if result is zero). Other flags are unchanged.

**Stack Instructions: PHA, PHP, PLA, PLP**
- PHA (48): Push accumulator onto the stack. Does not affect flags.
- PHP (08): Push processor status onto the stack. The status pushed has the Break flag and bit 5 set to 1.
- PLA (68): Pull accumulator from the stack; affects N and Z (set from pulled value).
- PLP (28): Pull processor status from stack. The pulled status has the Break flag ignored and bit 5 ignored.

**ROL (Rotate One Bit Left)**
ROL rotates bits left through the Carry: the previous Carry becomes bit 0, and bit 7 becomes the new Carry. Affects N (from result bit 7), Z (zero result), and C (old bit 7).

## Source Code
```asm
; LDA Load Accumulator with Memory
; M -> A
; Flags: N Z C I D V
;        + + - - - -
addressing       assembler      opc   bytes  cycles
immediate        LDA #oper      A9     2      2
zeropage         LDA oper       A5     2      3
zeropage,X       LDA oper,X     B5     2      4
absolute         LDA oper       AD     3      4
absolute,X       LDA oper,X     BD     3      4*   ; * = +1 cycle on page-cross
absolute,Y       LDA oper,Y     B9     3      4*
(indirect,X)     LDA (oper,X)   A1     2      6
(indirect),Y     LDA (oper),Y   B1     2      5*

; LDX Load Index X with Memory
; M -> X
; Flags: N Z C I D V
;        + + - - - -
addressing       assembler      opc   bytes  cycles
immediate        LDX #oper      A2     2      2
zeropage         LDX oper       A6     2      3
zeropage,Y       LDX oper,Y     B6     2      4
absolute         LDX oper       AE     3      4
absolute,Y       LDX oper,Y     BE     3      4*

; LDY Load Index Y with Memory
; M -> Y
; Flags: N Z C I D V
;        + + - - - -
addressing       assembler      opc   bytes  cycles
immediate        LDY #oper      A0     2      2
zeropage         LDY oper       A4     2      3
zeropage,X       LDY oper,X     B4     2      4
absolute         LDY oper       AC     3      4
absolute,X       LDY oper,X     BC     3      4*

; LSR Shift One Bit Right (Memory or Accumulator)
; 0 -> [76543210] -> C
; Flags: N Z C I D V
;        0 + + - - -
addressing     assembler    opc   bytes  cycles
accumulator    LSR A        4A     1      2
zeropage       LSR oper     46     2      5
zeropage,X     LSR oper,X   56     2      6
absolute       LSR oper     4E     3      6
absolute,X     LSR oper,X   5E     3      7

; NOP No Operation
; Flags: N Z C I D V
;        - - - - - -
addressing     assembler    opc   bytes  cycles
implied        NOP          EA     1      2

; ORA OR Memory with Accumulator
; A OR M -> A
; Flags: N Z C I D V
;        + + - - - -
addressing       assembler      opc   bytes  cycles
immediate        ORA #oper      09     2      2
zeropage         ORA oper       05     2      3
zeropage,X       ORA oper,X     15     2      4
absolute         ORA oper       0D     3      4
absolute,X       ORA oper,X     1D     3      4*   ; * = +1 cycle on page-cross
absolute,Y       ORA oper,Y     19     3      4*
(indirect,X)     ORA (oper,X)   01     2      6
(indirect),Y     ORA (oper),Y   11     2      5*

; PHA Push Accumulator on Stack
; push A
; Flags: N Z C I D V
;        - - - - - -
addressing     assembler    opc   bytes  cycles
implied        PHA          48     1      3

; PHP Push Processor Status on Stack
; The status register will be pushed with the break flag and bit 5 set to 1.
; push SR
; Flags: N Z C I D V
;        - - - - - -
addressing     assembler    opc   bytes  cycles
implied        PHP          08     1      3

; PLA Pull Accumulator from Stack
; pull A
; Flags: N Z C I D V
;        + + - - - -
addressing     assembler    opc   bytes  cycles
implied        PLA          68     1      4

; PLP Pull Processor Status from Stack
; The status register will be pulled with the break flag ignored and bit 5 ignored.
; pull SR
; Flags: (from stack)
addressing     assembler    opc   bytes  cycles
implied        PLP          28     1      4

; ROL Rotate One Bit Left (Memory or Accumulator)
; C <- [76543210] <- C
; Flags: N Z C I D V
;        + + + - - -
addressing      assembler     opc   bytes  cycles
accumulator     ROL A         2A     1      2
zeropage        ROL oper      26     2      5
zeropage,X      ROL oper,X    36     2      6
absolute        ROL oper      2E     3      6
absolute,X      ROL oper,X    3E     3      7
```

## References
- "shift_and_rotate_instructions" — expands on LSR and relation to ASL/ROL/ROR
- "load_store_transfer_instructions" — expands on LDA/LDX/LDY usage patterns

## Mnemonics
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
