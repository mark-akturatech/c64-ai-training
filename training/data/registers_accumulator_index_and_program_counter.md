# 6502 Registers: PC, A (AC), X, Y, SR (P), SP

**Summary:** Describes the 6502 core registers: Program Counter (PC $0000-$FFFF 16-bit), Accumulator A/AC (8-bit), Index registers X and Y (8-bit), Status Register SR/P (flags NV-BDIZC bit7→bit0), and Stack Pointer SP (8-bit offset into $0100–$01FF). Covers accumulator as ALU primary register, X/Y used for indexed effective addresses (loops, table lookups), and typical monitor display formats.

**Core registers**
- **PC (Program Counter)** — 16-bit: holds the address of the next instruction byte. Automatically increments during execution and is modified by branch and jump instructions. It is the only 16-bit register on the 6502 and addresses the full 64K space.
- **AC / A / Accumulator** — 8-bit: primary ALU operand and destination; most arithmetic and logic operations use A as the first operand and place results back into A (hence "accumulator").
- **X register (XR)** — 8-bit: auxiliary index register; can be loaded (immediate or from memory), incremented/decremented, transferred to/from A, and added to base addresses to form effective addresses.
- **Y register (YR)** — 8-bit: same capabilities as X; used as a second index register.
- **SP / S / Stack Pointer** — 8-bit: low byte offset into the processor stack page $0100–$01FF. Stack grows downward (push decrements, pull increments). Because SP is only 8 bits it implicitly addresses $0100 + SP; wrap-around occurs on overflow/underflow.
- **SR / P / Status Register** — 8-bit flags: records results and processor state (see flag layout below). Also called P.

Common monitor display (example shown in contemporary PET monitors):
PC IRQ SR AC XR YR SP
. ; 0401 E62E 32 04 5E 00 F8
("IRQ" here is an interrupt vector address, not a CPU register.)

**Accumulator and ALU role**
The accumulator is the ALU's primary register: arithmetic and logical instructions typically take A as the implicit operand and store the result back into A. This makes A the central working register for computations and data accumulation.

**X/Y as index registers and effective address**
X and Y are used to form effective addresses by adding their 8-bit contents to a base memory address (either a zero-page address, an absolute address, or through indirect addressing modes). The resulting address (the effective address) is where loads/stores or other memory operations occur. Typical uses:
- Loops: increment/decrement X or Y as loop counters.
- Table lookups: use X or Y as an index into tables (e.g., LDA table,X).
(Effective address: the computed memory address used by a memory operand after indexing.)

**Stack pointer and stack page**
- The processor stack resides at page #1: $0100–$01FF (256 bytes). SP contains only the low byte; the high byte is implicitly $01.
- The stack is LIFO and grows top-down (push decrements SP, pop increments SP).
- SP wrap-around: since SP is 8-bit, pushing/popping beyond $00/$FF wraps within $0100–$01FF.
- Primary uses: subroutine return addresses, temporary storage for registers/flags, interrupt handling helpers.

**Status register (SR / P) — bit layout**
Status register flags, bit 7 down to bit 0:
- Bit 7: **N** — Negative
- Bit 6: **V** — Overflow
- Bit 5: **-** — Unused / typically constant 1 on some variants (informational)
- Bit 4: **B** — Break (software interrupt flag)
- Bit 3: **D** — Decimal mode (BCD)
- Bit 2: **I** — Interrupt disable (set = mask IRQ)
- Bit 1: **Z** — Zero
- Bit 0: **C** — Carry

The SR records result flags (N, V, Z, C), processor mode/config flags (D, I, B), and contains one unused/reserved bit. Flags are modified by arithmetic/logical instructions and by explicit flag instructions (SEC, CLC, SEI, CLI, SED, CLD, PLP, PHP, etc.).

**Status Register Flags Detailed Description**

| Bit | Flag | Name               | Description                                                                                                                                                                                                                   | Affected by Instructions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|-----|------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 7   | N    | Negative            | Set if the result of the last operation had bit 7 set to 1 (i.e., the result is negative in two's complement representation).                                                           | Affected by: ADC, AND, ASL, BIT, CMP, CPX, CPY, DEC, EOR, INC, LDA, LDX, LDY, LSR, ORA, ROL, ROR, SBC, TAX, TAY, TSX, TXA, TYA.                                                                                                                                                                                                                                                                                                                                                                             |
| 6   | V    | Overflow            | Set if the last arithmetic operation resulted in a two's complement overflow (e.g., adding two positive numbers yields a negative result, or vice versa).                                | Affected by: ADC, BIT, CLV, PLP, RTI, SBC.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 5   | -    | Unused              | Unused; always set to 1 when pushed to the stack.                                                                                                                                         | Not affected by any instructions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 4   | B    | Break               | Set when a BRK instruction is executed, indicating a software interrupt. Cleared when an interrupt (IRQ or NMI) is processed.                                                           | Affected by: BRK, PHP, PLP, RTI.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 3   | D    | Decimal Mode        | Set to enable Binary-Coded Decimal (BCD) mode for arithmetic operations. When set, ADC and SBC instructions perform BCD arithmetic.                                                     | Affected by: CLD, PLP, RTI, SED.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2   | I    | Interrupt Disable   | Set to disable maskable interrupts (IRQ). When set, the processor ignores IRQ interrupts.                                                                                               | Affected by: CLI, PLP, RTI, SEI.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 1   | Z    | Zero                | Set if the result of the last operation was zero.                                                                                                                                       | Affected by: ADC, AND, ASL, BIT, CMP, CPX, CPY, DEC, EOR, INC, LDA, LDX, LDY, LSR, ORA, ROL, ROR, SBC, TAX, TAY, TSX, TXA, TYA.                                                                                                                                                                                                                                                                                                                                                                             |
| 0   | C    | Carry               | Set if the last operation resulted in a carry out of bit 7 (for addition) or a borrow (for subtraction). Also used in shift and rotate instructions.                                    | Affected by: ADC, ASL, CLC, CMP, CPX, CPY, LSR, PLP, ROL, ROR, RTI, SBC, SEC.                                                                                                                                                                                                                                                                                                                                                                                                                              |

**Addressing Modes and Effective Address Calculation Examples**

The 6502 supports several addressing modes, each determining how the operand for an instruction is fetched or calculated. Below are examples illustrating the encoding and effective address calculation for each mode:

1. **Immediate Addressing**
   - **Encoding:** `LDA #$10` (Opcode: `$A9`, Operand: `$10`)
   - **Description:** The operand is a constant value provided directly in the instruction.
   - **Effective Address Calculation:** Not applicable; the operand is used as-is.

2. **Zero Page Addressing**
   - **Encoding:** `LDA $20` (Opcode: `$A5`, Operand: `$20`)
   - **Description:** The operand is an 8-bit address within the first 256 bytes of memory (zero page).
   - **Effective Address Calculation:** Effective address = `$00` + Operand = `$0020`.

3. **Zero Page,X Indexed Addressing**
   - **Encoding:** `LDA $20,X` (Opcode: `$B5`, Operand: `$20`)
   - **Description:** The operand is a zero page address; the X register is added to this address.
   - **Effective Address Calculation:** Effective address = (`$00` + Operand + X) & `$00FF`. If X = `$05`, then Effective address = (`$00` + `$20` + `$05`) & `$00FF` = `$0025`.

4. **Absolute Addressing**
   - **Encoding:** `LDA $1234` (Opcode: `$AD`, Operands: `$34 $12`)
   - **Description:** The operand is a 16-bit address.
   - **Effective Address Calculation:** Effective address = Operand = `$1234`.

5. **Absolute,X Indexed Addressing**
   - **Encoding:** `LDA $1234,X` (Opcode: `$BD`, Operands: `$34 $12`)
   - **Description:** The operand is a 16-bit address; the X register is added to this address.
   - **Effective Address Calculation:** Effective address = Operand + X. If X = `$05`, then Effective address = `$1234` + `$05` = `$1239`.

6. **Absolute,Y Indexed Addressing**
   - **Encoding:** `LDA $1234,Y` (Opcode: `$B9`, Operands: `$34 $12`)
   - **Description:** The operand is a 16-bit address; the Y register is added to this address.
   - **Effective Address Calculation:** Effective address = Operand + Y. If Y = `$05`, then Effective address = `$1234` + `$05` = `$1239`.

7. **Indirect Addressing**
   - **Encoding:** `JMP ($1234)` (Opcode: `$6C`, Operands: `$34 $12`)
   - **Description:** The operand is a 16-bit address pointing to the least significant byte of another 16-bit address.
   - **Effective Address Calculation:** Effective address = Contents of memory at Operand and Operand + 1. If memory at `$1234` contains `$78` and at `$1235` contains `$56`, then Effective address = `$5678`.

8. **Indexed Indirect (Pre-Indexed Indirect) Addressing**
   - **Encoding:** `LDA ($20,X)` (Opcode: `$A1`, Operand: `$20`)
   - **Description:** The operand is a zero page address; the X register is added