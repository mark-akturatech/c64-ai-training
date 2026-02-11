# 6502 Opcode Table Layout and Jump Vectors (aaabbbcc Mapping, ROR Example)

**Summary:** This document details the 6502 opcode bit-field mapping (aaabbbcc — bits 7-5, 4-2, 1-0), presents opcode matrices grouped by c, a, and b, discusses layout exceptions (such as c=3 empty columns; c=0,2 where b selects special groups), provides a detailed ROR example, and outlines 6502 stack and jump vector locations ($0100-$01FF, $FFFA-$FFFF).

**Opcode Bit-Field Mapping (aaabbbcc)**

The 6502 opcode byte is structured as aaabbbcc:
- **Bits 7..5 (aaa):** Typically select the operation group.
- **Bits 4..2 (bbb):** Generally determine the addressing mode.
- **Bits 1..0 (cc):** Select one of four major instruction families.

### General Layout Rules

- **Grouping by cc, then aaa, then bbb:** The opcode map is effectively organized by cc (c = 0..3), followed by aaa (a), and then bbb (b).
- **Addressing Mode Selection:** For most values of c, bbb selects addressing-mode columns (7 useful values plus irregular/unused columns). When c = 3, there are empty/unused columns, resulting in holes in the map.
- **Layout Exceptions:** When c = 0 or c = 2, the meaning of bbb can switch to select special groups (e.g., branch instructions and single-bit set/clear or flag operations), so the simple "bbb = addressing-mode" rule does not uniformly apply.
- **Illegal Opcodes:** Many undocumented opcodes arise from these layout regularities and exceptions.

### Full Opcode Matrices Grouped by c, a, b

The following table lists the 6502 instruction set, organized by c, then a, then b. This layout highlights the relationships between opcodes and their addressing modes.


*Note: This table is a partial representation. For the complete opcode matrix, refer to authoritative sources such as the [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html).*

### ROR (Rotate Right) Example

The ROR instruction (Rotate Right) serves as an example of the opcode mapping:

- **Opcode Structure:** All ROR instructions share a = 3 and c = 2 (3b2) with the address mode in b.
- **Addressing Modes:**
  - **Accumulator:** b = 2, opcode = $6A
  - **Zero Page:** b = 1, opcode = $66
  - **Zero Page,X:** b = 5, opcode = $76
  - **Absolute:** b = 3, opcode = $6E
  - **Absolute,X:** b = 7, opcode = $7E

This mapping illustrates how the aaabbbcc structure determines the opcode for ROR across different addressing modes.

**Stack and Interrupt Vectors (Behavior & Addresses)**

- **Processor Stack:** The 6502 hardware stack is located at $0100–$01FF in memory, growing downward (push decrements SP).
- **Interrupt Vectors:** Three 2-byte vectors are located near the top of the 64K address space:
  - **$FFFA,$FFFB:** NMI (Non-Maskable Interrupt) vector (low, high)
  - **$FFFC,$FFFD:** Reset vector
  - **$FFFE,$FFFF:** IRQ (Interrupt Request) vector
- **Interrupt Handling Sequence:**
  1. The currently executing instruction completes.
  2. The program counter (PC) is pushed onto the stack (low byte first).
  3. The status register is pushed.
  4. Control transfers to the address found in the appropriate vector.
  5. RTI restores the status and PC from the stack to return from the interrupt.
- **JSR/RTS Behavior:**
  - **JSR:** Pushes the return address (address of the last byte of the JSR operand) onto the stack.
  - **RTS:** Pulls that address and returns to PC+1 effectively (return address stored is the address before the location to return to).

## Source Code

```text
c=0
a=0
b=0  BRK impl
b=1  ORA (ind,X)
b=2  -
b=3  -
b=4  ORA zpg
b=5  ASL zpg
b=6  PHP impl
b=7  ORA #imm
a=1
b=0  ASL A
b=1  -
b=2  ORA abs
b=3  ASL abs
b=4  BPL rel
b=5  ORA (ind),Y
b=6  -
b=7  -
a=2
b=0  ORA zpg,X
b=1  ASL zpg,X
b=2  CLC impl
b=3  ORA abs,Y
b=4  -
b=5  -
b=6  ORA abs,X
b=7  ASL abs,X
...
```


```text
          The overflow flag has no meaning in decimal mode.
          Multi-byte operations are just as in decimal mode: We first prepare the carry
          and then chain operations of the individual bytes in increasing value order,
          starting with the lowest value pair.
          (It may be important to note that Western Design Center (WDC) version of
          the processor, the 65C02, always clears the decimal flag when it enters an
          interrupt, while the original NMOS version of the 6502 does not.)
          6502 Jump Vectors and Stack Operations
          The 256 bytes processor stack of the 6502 is located at $0100 ... $01FF in
          memory, growing down from top to bottom.
          There are three 2-byte address locations at the very top end of the 64K address
          space serving as jump vectors for reset/startup and interrupt operations:
            $FFFA, $FFFB ... NMI (Non-Maskable Interrupt) vector
            $FFFC, $FFFD ... RES (Reset) vector
            $FFFE, $FFFF ... IRQ (Interrupt Request) vector
          As an interrupt occurs, any instruction currently processed is completed first.
          Only then, the value of the program counter (PC) is put in high-low order onto
          the stack, followed by the value currently in the status register, and control
          will be transferred to the address location found in the respective interrupt
          vector. The registers stored on the stack are recovered at the end of an
          interrupt routine, as control is transferred back to the interrupted code by
          the RTI instruction.
                                                                     6502 Instruction Set
                                ADDRESS           MEMORY
                               ADH   ADL   MNEMONIC OP CODE  LOW MEMORY
                              0  1  0   E                       SP AFTER IRQ OR NMI
                                                                BUT BEFORE RTI
                              0  1  0   F   STATUS       •
                              0  1  1   0     PCL       02
                              0  1  1   1     PCH       03      SP BEFORE IRQ OR NMI
                                                                AND AFTER RTI
                              0  1  1   2
                                                       STACK
                                                               PC AT TIME OF IRQ OR
                  PC          0  3  0   0                      NMI · THIS INSTRUCTION
                              0  3  0   1                      WILL COMPLETE BEFORE
                                                               INTERRUPT IS SERVICED
                              0  3  0   2                      PC AFTER RTI
                              0  4  0   5      •               INTERRUPT SERVICE
                                                               MAIN BODY
                              0  4  0   6      •
                              0  4  0   7     RTI       40     RETURN FROM
                                                               INTERRUPT
                              F  F  F   A     ADL
                                                               NMI VECTOR
                              F  F  F   B     ADH
                              F  F  F   C     ADL
                                                               RES VECTOR
                              F  F  F   D     ADH
                              F  F  F   E     ADL       05
                                                               IRQ VECTOR
                              F  F  F   F     ADH       04
                                                             HIGH MEMORY
                               IRQ, NMI, RTI, BRK OPERATION
                (Reset after: MCS6502 Instruction Set Summary, MOS Technology, Inc.)
          Similarly, as a JSR instruction is encountered, PC is dumped onto the stack
          and recovered by the RTS instruction. (Here, the value stored is actually the
          address before the location, the program will eventually return to. Thus, the
          effective return address is PC+1.)
                                                                     6502 Instruction Set
```

## Key Registers

- **$0100-$01FF:** 6502 Processor stack page (256 bytes, grows down)
- **$FFFA-$FFFB:** 6502 NMI vector (low, high)
- **$FFFC-$FFFD:** 6502 Reset vector (low, high)
- **$FFFE-$FFFF:** 6502 IRQ vector

## Labels
- NMI
- RESET
- IRQ
- STACK

## Mnemonics
- ROR
- JSR
- RTS
- RTI
