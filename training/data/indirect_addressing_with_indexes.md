# Indirect Addressing (Indexed Indirect X) and (Indirect),Y on the 6510

**Summary:** The 6510 microprocessor supports two primary indirect addressing modes: Indexed Indirect (pre-indexed) and Indirect Indexed (post-indexed). Both utilize zero-page pointers to access memory indirectly, facilitating flexible data manipulation and array processing.

**Indirect Addressing with Indexes**

Indirect addressing allows instructions to reference memory locations indirectly through pointers stored in the zero page. These pointers are 16-bit addresses split into two consecutive bytes: the low byte at the specified zero-page address and the high byte at the next address.

**Key Details:**

- **Pointer Storage:** Two consecutive zero-page bytes store the 16-bit address, with the low byte first.
- **Zero-Page Wrapping:** When accessing the high byte of the pointer, the address wraps within the zero page (i.e., if the low byte is at $FF, the high byte is at $00).
- **Zero-Page Allocation:** Ensure sufficient zero-page addresses are reserved for all pointers used.

### Indexed Indirect (Pre-Indexed) — Assembler Syntax: (zp,X)

- **Operation:**
  - The operand specifies a zero-page address (ZP).
  - The CPU adds the X register to ZP (modulo 256) to determine the effective zero-page address.
  - The 16-bit target address is read from this computed zero-page location (low byte) and the next (high byte).
  - The instruction operates on the memory at this target address.

- **Example:**
  - If ZP = $20 and X = $04, the CPU accesses the pointer at $24/$25 to retrieve the target address.

- **Use Case:** Efficient for accessing elements in a table of pointers stored in the zero page.

### Indirect Indexed (Post-Indexed) — Assembler Syntax: (zp),Y

- **Operation:**
  - The operand specifies a zero-page address (ZP) containing the low byte of a 16-bit base address; the high byte is at ZP+1.
  - The CPU reads this base address and adds the Y register to it to form the final effective address.
  - The instruction operates on the memory at this computed address.

- **Example:**
  - If ZP = $30, and the memory at $30/$31 contains $4000, with Y = $05, the effective address is $4005.

- **Use Case:** Commonly used for accessing elements in an array where the base address is stored in the zero page, and Y serves as the index.

**Note:** The 6510 does not support a general indirect addressing mode for most data operations; only the two zero-page indirect variants described above are available.

## References

- "6502 Addressing Modes" — Detailed explanation of 6502 addressing modes, including indirect addressing.
- "6502 Instruction Set" — Comprehensive list of 6502 instructions and their addressing modes.
- "6502 Programmers Reference" — In-depth reference for 6502 programming, covering addressing modes and instruction set.