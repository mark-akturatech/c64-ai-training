# 6502 Processor Status Register (P)

**Summary:** The Processor Status Register (P) is an 8-bit register containing flags that reflect the outcome of CPU operations. The flags are: Negative (N), Overflow (V), Break (B), Decimal (D), Interrupt Disable (I), Zero (Z), and Carry (C). These flags are used to indicate operation results, control interrupt handling, and manage decimal mode operations. Individual flags can be tested, set, or cleared by specific instructions, and the entire register can be pushed to or pulled from the stack.

**Processor Status Register**

The 6502 Processor Status Register (P) is structured as follows:


- **N (Negative flag, bit 7):** Set if the result of the last operation had bit 7 set to 1, indicating a negative result in two's complement representation.
- **V (Overflow flag, bit 6):** Set if the last arithmetic operation resulted in a two's complement overflow, such as adding two positive numbers yielding a negative result.
- **- (Unused, bit 5):** This bit is unused and always set to 1 when the status register is pushed to the stack.
- **B (Break flag, bit 4):** Set when a BRK instruction is executed, indicating a software interrupt. When the status register is pushed to the stack during a BRK instruction or PHP instruction, this bit is set to 1. When pushed due to a hardware interrupt (IRQ or NMI), this bit is set to 0.
- **D (Decimal mode flag, bit 3):** When set, the processor performs arithmetic operations in Binary-Coded Decimal (BCD) mode.
- **I (Interrupt Disable flag, bit 2):** When set, maskable interrupts (IRQ) are disabled. Non-maskable interrupts (NMI) are not affected by this flag.
- **Z (Zero flag, bit 1):** Set if the result of the last operation was zero.
- **C (Carry flag, bit 0):** Set if the last operation resulted in a carry out of bit 7 or a borrow into bit 0.

**Flag Behavior and Instructions**

- **Carry Flag (C):**
  - **Set:** If the last operation caused an overflow from bit 7 or an underflow from bit 0. This occurs during arithmetic operations, comparisons, and logical shifts.
  - **Clear:** If no overflow or underflow occurred.
  - **Instructions:**
    - `SEC` (Set Carry Flag): Sets the carry flag.
    - `CLC` (Clear Carry Flag): Clears the carry flag.
    - `ADC` (Add with Carry): Adds memory to the accumulator with carry.
    - `SBC` (Subtract with Carry): Subtracts memory from the accumulator with borrow.
    - `CMP` (Compare): Compares the accumulator with memory.
    - `CPX` (Compare X Register): Compares the X register with memory.
    - `CPY` (Compare Y Register): Compares the Y register with memory.
    - `ROL` (Rotate Left): Rotates bits left through the carry flag.
    - `ROR` (Rotate Right): Rotates bits right through the carry flag.
    - `ASL` (Arithmetic Shift Left): Shifts bits left, setting the carry flag with the bit shifted out.
    - `LSR` (Logical Shift Right): Shifts bits right, setting the carry flag with the bit shifted out.

- **Zero Flag (Z):**
  - **Set:** If the result of the last operation was zero.
  - **Clear:** If the result was non-zero.
  - **Instructions:** Most instructions that result in a value update the zero flag accordingly.

- **Interrupt Disable Flag (I):**
  - **Set:** By executing the `SEI` (Set Interrupt Disable) instruction, preventing the processor from responding to maskable interrupts.
  - **Clear:** By executing the `CLI` (Clear Interrupt Disable) instruction, allowing the processor to respond to maskable interrupts.

- **Decimal Mode Flag (D):**
  - **Set:** By executing the `SED` (Set Decimal Flag) instruction, enabling BCD arithmetic mode.
  - **Clear:** By executing the `CLD` (Clear Decimal Flag) instruction, enabling binary arithmetic mode.

- **Break Flag (B):**
  - **Set:** When a `BRK` (Break) instruction is executed, indicating a software interrupt.
  - **Behavior:** When the status register is pushed to the stack:
    - During a `BRK` or `PHP` (Push Processor Status) instruction, the B flag is set to 1.
    - During a hardware interrupt (IRQ or NMI), the B flag is set to 0.
  - **Note:** The B flag does not exist as a physical register bit; it is only set in the status byte pushed to the stack.

- **Overflow Flag (V):**
  - **Set:** If the result of an arithmetic operation is too large to be represented in two's complement form, causing an overflow.
  - **Clear:** If no overflow occurred.
  - **Instructions:**
    - `CLV` (Clear Overflow Flag): Clears the overflow flag.
    - `ADC` and `SBC` instructions can set or clear the overflow flag based on the result.
    - `BIT` (Bit Test): Loads bit 6 of the addressed value into the V flag.

- **Negative Flag (N):**
  - **Set:** If the result of the last operation had bit 7 set to 1, indicating a negative result.
  - **Clear:** If bit 7 is 0.
  - **Instructions:** Most instructions that result in a value update the negative flag accordingly.

**Interaction Between Flags and Modes**

- **Interrupt Handling:**
  - When an interrupt occurs, the processor pushes the program counter and the status register to the stack. The I flag is set to prevent further maskable interrupts. The B flag in the pushed status register is set to 0 for hardware interrupts and to 1 for software interrupts (`BRK`).

- **Decimal Mode:**
  - When the D flag is set, the processor performs arithmetic operations in BCD mode. However, the N, V, and Z flags are updated based on the binary result, not the BCD result. This behavior can lead to unexpected flag states if not accounted for.

## Source Code

```
Bit:  7   6   5   4   3   2   1   0
Flag: N   V   -   B   D   I   Z   C
```


## References

- [6502 Registers](https://www.nesdev.org/obelisk-6502-guide/registers.html)
- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [Status Flags - NESdev Wiki](https://www.nesdev.org/wiki/Status_flags)
- [6502 Opcodes](https://www.atarimax.com/jindroush.atari.org/aopc.html)
- [MOS Technology 6502 - Wikipedia](https://en.wikipedia.org/wiki/MOS_Technology_6502)