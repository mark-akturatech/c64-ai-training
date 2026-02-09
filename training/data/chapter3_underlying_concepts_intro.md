# Underlying Concepts (Chapter 3)

**Summary:** Introduces bits/bytes and the hexadecimal numbering system, the 6510 programming model, and a high-level Commodore 64 hardware overview (VIC-II, SID, CIAs, memory map). Keywords: 6510, hexadecimal, bits/bytes, Commodore 64, VIC-II, SID, CIA.

**Chapter Scope**

This chapter defines the terms and names used throughout the book and prepares the reader for low-level hardware descriptions. It covers three interrelated topics:

- **Binary Data Organization:** Bits and bytes and their relationship to hexadecimal notation (used throughout hardware descriptions).
- **The 6510 Programming Model:** Conceptual overview of the CPU as used in the C64 (registers, addressing modes, and how the CPU interacts with memory and I/O).
- **Commodore 64 Hardware Overview:** The major chips (VIC-II, SID, CIAs) and how they fit into the system architecture and memory map.

The chapter positions the hexadecimal (base-16) numbering system as the preferred notation for discussing memory addresses, register values, and bit patterns (hex digits map naturally to 4-bit groups). These foundational concepts are presented first to make subsequent, detailed descriptions clearer.

**Binary Data Organization**

**Bits and Bytes:**

- **Bit:** The smallest unit of data in computing, representing a binary value of 0 or 1.
- **Byte:** A group of 8 bits, capable of representing 256 distinct values (0 to 255).

**Hexadecimal Notation:**

Hexadecimal (base-16) is a numbering system that uses 16 symbols: 0-9 and A-F. Each hex digit corresponds to a 4-bit binary sequence:

- 0 = 0000
- 1 = 0001
- 2 = 0010
- 3 = 0011
- 4 = 0100
- 5 = 0101
- 6 = 0110
- 7 = 0111
- 8 = 1000
- 9 = 1001
- A = 1010
- B = 1011
- C = 1100
- D = 1101
- E = 1110
- F = 1111

**Example:**

The binary number `11011010` can be grouped into two 4-bit segments: `1101` and `1010`. These correspond to the hexadecimal digits `D` and `A`, respectively, making the hex representation `DA`.

**The 6510 Programming Model**

**Registers:**

The 6510 CPU includes the following registers:

- **Accumulator (A):** Used for arithmetic and logic operations.
- **Index Registers (X and Y):** Used for indexing memory locations.
- **Program Counter (PC):** Holds the address of the next instruction to execute.
- **Stack Pointer (SP):** Points to the current position in the stack.
- **Status Register (P):** Contains flags that reflect the outcome of operations (Negative, Overflow, Break, Decimal, Interrupt Disable, Zero, Carry).

**Addressing Modes:**

The 6510 supports various addressing modes, including:

- **Immediate:** Operand is a constant value.
- **Zero Page:** Operand is located in the first 256 bytes of memory.
- **Absolute:** Operand is located at a specific memory address.
- **Indexed:** Operand address is calculated by adding an index register to a base address.
- **Indirect:** Operand address is obtained from a pointer in memory.

**Example Instruction Sequence:**

To load a value into the accumulator and store it in memory:


**Commodore 64 Hardware Overview**

**Memory Map:**

The C64's memory is organized as follows:

- **$0000-$00FF:** Zero Page (256 bytes)
- **$0100-$01FF:** Stack (256 bytes)
- **$0200-$03FF:** Screen Input Buffer, Scratchpad (512 bytes)
- **$0400-$07E7:** Screen RAM (~2 KB)
- **$0800-$9FFF:** Main RAM (~37 KB)
- **$A000-$BFFF:** BASIC ROM (8 KB, can be banked out)
- **$C000-$CFFF:** Additional RAM (4 KB)
- **$D000-$DFFF:** I/O Area & Character ROM (4 KB)
- **$E000-$FFFF:** KERNAL ROM (8 KB)

**Key Hardware Components:**

- **VIC-II (Video Interface Chip):** Handles graphics and video output.
- **SID (Sound Interface Device):** Manages audio synthesis.
- **CIA (Complex Interface Adapter) Chips:** Control I/O operations, timers, and the keyboard.

**I/O Register Map:**

The I/O registers are mapped within the $D000-$DFFF range:

- **$D000-$D3FF:** VIC-II Registers
- **$D400-$D7FF:** SID Registers
- **$D800-$DBFF:** Color RAM
- **$DC00-$DCFF:** CIA1 Registers
- **$DD00-$DDFF:** CIA2 Registers

Understanding this memory map is crucial for effective programming on the Commodore 64.

## Source Code

```assembly
LDA #$0A    ; Load immediate value $0A into accumulator
STA $0200   ; Store accumulator value into memory address $0200
```


## References

- "bits_and_bytes_and_hex_notation" — expands on hexadecimal and bit/byte basics
- "c64_hardware_overview" — expands on overview of major chips (6510, VIC-II, SID, CIAs)