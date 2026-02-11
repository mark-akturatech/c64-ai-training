# 6502 Y Index Register (Y)

**Summary:** The Y index register (6502) is an 8-bit index register similar to the X register but used by a different set of instructions and addressing modes (including indexed addressing). CPU instructions can load memory into Y, store Y to memory, transfer/modify Y, and transfer between Y and other registers.

**Description**

The Y register is an 8-bit index register on the MOS 6502. It functions like the X register in that it is primarily used for indexed addressing and offset calculations, but the CPU provides a distinct set of instructions and addressing-mode uses that operate on Y rather than X.

The source text emphasizes three categories of operations involving Y:
- Copying the contents of a memory location into Y (load Y).
- Copying the contents of Y into a memory location (store Y).
- Modifying the contents of Y, or transferring/modifying other registers with respect to Y.

For detailed uses of Y in indexed addressing (e.g., address+Y, base+Y), see the referenced addressing_modes_indexed chunk.

**Instructions Operating on Y Register**

The following instructions operate on the Y register:

- **LDY (Load Y Register):** Loads a byte of memory into the Y register, setting the zero and negative flags as appropriate.
  - Addressing Modes:
    - Immediate: `LDY #$nn` (Opcode: $A0, Bytes: 2, Cycles: 2)
    - Zero Page: `LDY $nn` (Opcode: $A4, Bytes: 2, Cycles: 3)
    - Zero Page,X: `LDY $nn,X` (Opcode: $B4, Bytes: 2, Cycles: 4)
    - Absolute: `LDY $nnnn` (Opcode: $AC, Bytes: 3, Cycles: 4)
    - Absolute,X: `LDY $nnnn,X` (Opcode: $BC, Bytes: 3, Cycles: 4 (+1 if page crossed))

- **STY (Store Y Register):** Stores the contents of the Y register into memory.
  - Addressing Modes:
    - Zero Page: `STY $nn` (Opcode: $84, Bytes: 2, Cycles: 3)
    - Zero Page,X: `STY $nn,X` (Opcode: $94, Bytes: 2, Cycles: 4)
    - Absolute: `STY $nnnn` (Opcode: $8C, Bytes: 3, Cycles: 4)

- **TAY (Transfer Accumulator to Y):** Transfers the contents of the accumulator into the Y register, setting the zero and negative flags as appropriate.
  - Addressing Mode:
    - Implied: `TAY` (Opcode: $A8, Bytes: 1, Cycles: 2)

- **TYA (Transfer Y to Accumulator):** Transfers the contents of the Y register into the accumulator, setting the zero and negative flags as appropriate.
  - Addressing Mode:
    - Implied: `TYA` (Opcode: $98, Bytes: 1, Cycles: 2)

- **INY (Increment Y Register):** Adds one to the Y register, setting the zero and negative flags as appropriate.
  - Addressing Mode:
    - Implied: `INY` (Opcode: $C8, Bytes: 1, Cycles: 2)

- **DEY (Decrement Y Register):** Subtracts one from the Y register, setting the zero and negative flags as appropriate.
  - Addressing Mode:
    - Implied: `DEY` (Opcode: $88, Bytes: 1, Cycles: 2)

- **CPY (Compare Y Register):** Compares the contents of the Y register with a memory value, setting the carry, zero, and negative flags as appropriate.
  - Addressing Modes:
    - Immediate: `CPY #$nn` (Opcode: $C0, Bytes: 2, Cycles: 2)
    - Zero Page: `CPY $nn` (Opcode: $C4, Bytes: 2, Cycles: 3)
    - Absolute: `CPY $nnnn` (Opcode: $CC, Bytes: 3, Cycles: 4)

**Example Code Snippets**

**1. Indexed Addressing with Y:**


**2. Looping with Y Register:**


**3. Table Access Using Y:**


**Addressing Modes Accepting Y as Index**

The Y register is used in the following addressing modes:

- **Zero Page,X:** `LDY $nn,X` (Opcode: $B4, Bytes: 2, Cycles: 4)
- **Absolute,X:** `LDY $nnnn,X` (Opcode: $BC, Bytes: 3, Cycles: 4 (+1 if page crossed))
- **Absolute,Y:** `LDA $nnnn,Y` (Opcode: $B9, Bytes: 3, Cycles: 4 (+1 if page crossed))
- **(Indirect),Y:** `LDA ($nn),Y` (Opcode: $B1, Bytes: 2, Cycles: 5 (+1 if page crossed))

Note: The Y register is not used in Zero Page,Y addressing mode; this mode is exclusive to the X register.

## Source Code

```assembly
LDY #$00        ; Initialize Y to 0
LDA DATA,Y      ; Load A with DATA[Y]
STA $0200,Y     ; Store A into $0200 + Y
INY             ; Increment Y
CPY #$10        ; Compare Y with 16
BNE LOOP        ; If Y != 16, repeat loop
```

```assembly
LDY #$0A        ; Load Y with 10
LOOP:
  ; Loop body code here
  DEY           ; Decrement Y
  BNE LOOP      ; If Y != 0, repeat loop
```

```assembly
LDY #$00        ; Initialize Y to 0
LDA TABLE,Y     ; Load A with TABLE[Y]
; Process A
INY             ; Increment Y
CPY #TABLE_SIZE ; Compare Y with table size
BNE LOOP        ; If Y != TABLE_SIZE, repeat loop
```


## References

- "addressing_modes_indexed" — expands on indexed addressing uses of Y

## Mnemonics
- LDY
- STY
- TAY
- TYA
- INY
- DEY
- CPY
