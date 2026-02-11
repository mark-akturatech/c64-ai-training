# 6502: INC / INX / INY, JMP, JSR, EOR (opcode summaries and behavior)

**Summary:** Opcode summaries and behavior for INC (memory increment), INX, INY (index increments), JMP (absolute and indirect), JSR (push return address then jump), and EOR (Exclusive OR). Includes addressing modes, opcode bytes, cycle counts, flags affected, and the NMOS JMP (indirect) page-wrapping bug note.

**Increment instructions (INC, INX, INY)**
INC increments memory: M + 1 -> M. Affects Negative and Zero flags (N, Z); does not affect Carry, Interrupt, Decimal, or Overflow (C I D V unchanged). INC has zeropage, zeropage,X, absolute, and absolute,X addressing modes — see the Source Code table for opcodes, byte counts, and cycle counts.

INX increments the X index register: X + 1 -> X (implied); affects N and Z only. INY increments the Y index register: Y + 1 -> Y (implied); affects N and Z only. Both INX and INY are single-byte implied instructions with 2 cycles.

(See Source Code for the full opcode table rows for INC, INX, INY.)

**JMP (absolute and indirect) and the NMOS indirect bug**
JMP absolute (JMP oper) loads the 16-bit operand into the program counter: operand low byte -> PCL, operand high byte -> PCH. JMP absolute is 3 bytes, 3 cycles (opcode $4C).

JMP indirect (JMP (oper)) reads a 16-bit pointer from the given zero-page address (little-endian) and loads that value into PC: the two pointer bytes at the operand address supply the low and high target bytes. JMP (indirect) is 3 bytes, 5 cycles (opcode $6C).

NMOS silicon bug (page-wrapping) — when the indirect address operand resides at a page boundary (pointer low byte = $FF), the 6502 NMOS implementation fetches the low byte from address (oper) and the high byte from the start of the same page (oper & $FF00), instead of reading the high byte from the next page. This causes an incorrect high-byte fetch when the pointer crosses a page boundary. Many assemblers/emulators and code examples note this behavior and avoid placing indirect vectors on $xxFF addresses unless the wrap is intended.

**JSR (Jump to Subroutine)**
JSR absolute (JSR oper) saves the return address then transfers control to the 16-bit operand target. The instruction pushes (PC+2) onto the stack (the return address so RTS can return to the instruction following the JSR), then loads the operand into PCL/PCH. JSR is 3 bytes, 6 cycles (opcode $20). The chunk lists the push of (PC+2) as the saved return address; see Source Code for the exact table row.

**EOR (Exclusive OR)**
EOR performs a bitwise exclusive OR between the accumulator and a memory location: A EOR M -> A. Affects Negative and Zero flags (N, Z); does not affect Carry, Interrupt, Decimal, or Overflow (C I D V unchanged). EOR has immediate, zeropage, zeropage,X, absolute, absolute,X, absolute,Y, (indirect,X), and (indirect),Y addressing modes — see the Source Code table for opcodes, byte counts, and cycle counts.

**LDA / LDX / LDY (start of load groups)**
The chunk begins the LDA load-group table at the end (immediate/zeropage/absolute and indexed variants). Full LDA/LDX/LDY opcode rows are included in Source Code.

## Source Code
```text
          INC Increment Memory by One
              M + 1 -> M                           N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              zeropage      INC oper        E6      2      5
              zeropage,X    INC oper,X      F6      2      6
              absolute      INC oper        EE      3      6
              absolute,X    INC oper,X      FE      3      7
          INX Increment Index X by One
              X + 1 -> X                           N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              implied       INX             E8      1      2
          INY Increment Index Y by One
              Y + 1 -> Y                           N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              implied       INY             C8      1      2
          JMP Jump to New Location
              operand 1st byte -> PCL              N Z C I D V
              operand 2nd byte -> PCH              - - - - - -
              addressing    assembler       opc   bytes cycles
              absolute      JMP oper        4C      3      3
              indirect      JMP (oper)      6C      3      5***
          JSR Jump to New Location Saving Return Address
              push (PC+2),                         N Z C I D V
              operand 1st byte -> PCL              - - - - - -
              operand 2nd byte -> PCH
              addressing    assembler       opc   bytes cycles
              absolute      JSR oper        20      3      6
          EOR Exclusive-OR Memory with Accumulator
              A EOR M -> A                         N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              immediate     EOR #oper       49      2      2
              zeropage      EOR oper        45      2      3
              zeropage,X    EOR oper,X      55      2      4
              absolute      EOR oper        4D      3      4
              absolute,X    EOR oper,X      5D      3      4*
              absolute,Y    EOR oper,Y      59      3      4*
              (indirect,X)  EOR (oper,X)    41      2      6
              (indirect),Y  EOR (oper),Y    51      2      5*
          LDA Load Accumulator with Memory
              M -> A                               N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
                                              6502 Instruction Set
              immediate     LDA #oper       A9      2      2
              zeropage      LDA oper        A5      2      3
              zeropage,X    LDA oper,X      B5      2      4
              absolute      LDA oper        AD      3      4
              absolute,X    LDA oper,X      BD      3      4*
              absolute,Y    LDA oper,Y      B9      3      4*
              (indirect,X)  LDA (oper,X)    A1      2      6
              (indirect),Y  LDA (oper),Y    B1      2      5*
          LDX Load Index X with Memory
              M -> X                               N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              immediate     LDX #oper       A2      2      2
              zeropage      LDX oper        A6      2      3
              zeropage,Y    LDX oper,Y      B6      2      4
              absolute      LDX oper        AE      3      4
              absolute,Y    LDX oper,Y      BE      3      4*
          LDY Load Index Y with Memory
              M -> Y                               N Z C I D V
                                                   + + - - - -
              addressing    assembler       opc   bytes cycles
              immediate     LDY #oper       A0      2      2
              zeropage      LDY oper        A4      2      3
              zeropage,X    LDY oper,X      B4      2      4
              absolute      LDY oper        AC      3      4
```

## References
- "indirect_and_indexed_indirect_examples" — expands on JMP (indirect) special-case behavior
- "literals_and_loads_ldx_ldy" — expands on LDA/LDX/LDY instruction group

## Mnemonics
- INC
- INX
- INY
- JMP
- JSR
- EOR
- LDA
- LDX
- LDY
