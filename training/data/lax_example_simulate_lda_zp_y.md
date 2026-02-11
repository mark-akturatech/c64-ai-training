# NMOS 6510 — Example: Simulate LDA (zp),Y Using LAX (zp),Y to Save One Byte

**Summary:** Demonstrates using the undocumented LAX (zp),Y instruction to replace a longer LDA abs,Y sequence when the X register can be clobbered. This optimization saves one byte per loop iteration by leveraging the LAX instruction's ability to load both the accumulator and the X register simultaneously.

**Explanation and Motivation**

When copying a block of data into a destination whose base address is held in a zero-page pointer, the typical sequence involves:

- Reading the original destination byte into the accumulator (A).
- Loading the new payload byte into the X register.
- Storing the payload byte into the destination.
- Pushing the original byte onto the stack.

If the X register's prior value is not needed across the operation, the undocumented LAX (zp),Y instruction can replace the separate LDA instruction, thereby saving one byte in the loop.

**Key Details:**

- **LAX (zp),Y**: This undocumented instruction loads the memory byte into both the accumulator (A) and the X register (X), affecting the Zero and Negative flags similarly to LDA. It clobbers X by design, so it should only be used when X's prior value is not needed.
- **Byte Savings**: Replacing a 3-byte LDA abs,Y instruction with a 2-byte LAX (zp),Y instruction saves one byte per loop iteration. The exact byte savings depend on the addressing modes used in the original code.
- **Addressing Modes**:
  - **Absolute,Y (abs,Y)**: A 3-byte instruction that loads a byte from an absolute address plus the Y register offset.
  - **Zero-Page Indirect,Y ((zp),Y)**: A 2-byte instruction that loads a byte from the address pointed to by a zero-page pointer plus the Y register offset.

## Source Code

```asm
; Original (longer) sequence using LDA abs,Y (3 bytes)
    LDY #PAYLOAD_LENGTH
loop_original:
    LDA DEST_ABS,Y          ; LDA abs,Y -> load original destination byte into A
    LDX PAYLOAD_ADDR,Y      ; LDX abs,Y -> load payload byte into X
    STX DEST_ZP,Y           ; STX zp,Y  -> store payload byte to destination
    PHA                     ; push original byte (A) onto stack
    DEY
    BNE loop_original

; Optimized (one byte shorter) using undocumented LAX (zp),Y (2 bytes)
    LDY #PAYLOAD_LENGTH
loop_opt:
    LAX (DEST_ZP),Y         ; undocumented: load memory -> A and X (original byte)
    LDX PAYLOAD_ADDR,Y      ; load payload byte into X (overwrites X)
    STX DEST_ZP,Y           ; store payload byte to destination
    PHA                     ; push original byte (A) onto stack (A preserved by LDX)
    DEY
    BNE loop_opt
```

**Notes:**

- **DEST_ZP**: A zero-page pointer holding the base address of the destination.
- **DEST_ABS**: The absolute address of the destination.
- **PAYLOAD_ADDR**: The base address of the payload data.
- **PAYLOAD_LENGTH**: The number of bytes to copy.

In the optimized loop, the LAX (zp),Y instruction replaces the LDA abs,Y instruction. After LAX, both A and X contain the original destination byte. The subsequent LDX instruction loads the new payload byte into X without changing A, so the PHA instruction still pushes the original byte onto the stack. This optimization reduces the loop size by one byte per iteration.

## Key Registers

- **A (Accumulator)**: Holds the original destination byte after LAX and is pushed onto the stack.
- **X (Index Register X)**: Temporarily holds the payload byte before storing it into the destination.

## References

- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [6502 Instruction Tables](https://masswerk.at/6502/instruction-tables/)
- [6502 Instruction Set Decoded](https://llx.com/Neil/a2/opcodes.html)

## Mnemonics
- LAX
