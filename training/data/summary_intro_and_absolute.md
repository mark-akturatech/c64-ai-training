# 6502 Addressing Modes

**Summary:** The 6502 microprocessor supports various addressing modes, each determining how the operand for an instruction is specified. These modes include immediate, zero page, indexed, indirect, and absolute addressing.

**Immediate Addressing**

In immediate addressing, the operand is specified directly within the instruction. This mode is indicated by a `#` symbol preceding the operand.

- **Instruction Encoding:** Opcode followed by a single byte operand.
- **Example:** `LDA #$10` loads the accumulator with the value `$10`.

**Zero Page Addressing**

Zero page addressing allows access to memory locations in the first 256 bytes of memory (addresses `$0000` to `$00FF`) using a single-byte address operand.

- **Instruction Encoding:** Opcode followed by a single byte address.
- **Example:** `LDA $00` loads the accumulator with the value at memory location `$0000`.

**Indexed Addressing**

Indexed addressing modes involve adding the contents of the X or Y register to a base address to determine the effective address.

### Zero Page Indexed Addressing

- **Zero Page,X:** The effective address is calculated by adding the contents of the X register to a zero page address. If the sum exceeds `$FF`, it wraps around within the zero page.

  - **Instruction Encoding:** Opcode followed by a single byte zero page address.
  - **Example:** `LDA $10,X` with X = `$0F` accesses memory location `$001F`.

- **Zero Page,Y:** Similar to Zero Page,X but uses the Y register. This mode is only available for the `LDX` and `STX` instructions.

  - **Instruction Encoding:** Opcode followed by a single byte zero page address.
  - **Example:** `LDX $10,Y` with Y = `$0F` accesses memory location `$001F`.

### Absolute Indexed Addressing

- **Absolute,X:** The effective address is calculated by adding the contents of the X register to a 16-bit absolute address. If this addition crosses a page boundary (i.e., the high byte of the address changes), an additional cycle is required.

  - **Instruction Encoding:** Opcode followed by a two-byte absolute address (low byte first).
  - **Example:** `LDA $1000,X` with X = `$10` accesses memory location `$1010`.

- **Absolute,Y:** Similar to Absolute,X but uses the Y register.

  - **Instruction Encoding:** Opcode followed by a two-byte absolute address (low byte first).
  - **Example:** `LDA $1000,Y` with Y = `$10` accesses memory location `$1010`.

**Indirect Addressing**

Indirect addressing modes use pointers to determine the effective address.

### Indirect

- **Instruction Encoding:** Opcode followed by a two-byte address (low byte first) that points to the least significant byte of the target address.
- **Example:** `JMP ($1000)` reads the address stored at `$1000` and `$1001` and jumps to that address.

### Indexed Indirect (Pre-Indexed Indirect)

- **Instruction Encoding:** Opcode followed by a single byte zero page address. The effective address is found by adding the contents of the X register to this address (with wrap-around in zero page), then reading the 16-bit address from the resulting location.
- **Example:** `LDA ($20,X)` with X = `$04` accesses the address stored at `$0024` and `$0025`.

### Indirect Indexed (Post-Indexed Indirect)

- **Instruction Encoding:** Opcode followed by a single byte zero page address. The effective address is found by reading the 16-bit address from this zero page location, then adding the contents of the Y register to it. If this addition crosses a page boundary, an additional cycle is required.
- **Example:** `LDA ($20),Y` with Y = `$04` accesses the address stored at `$0020` and `$0021`, plus `$04`.

**Instruction Byte-Length and Encoding Details**

Each addressing mode affects the instruction's byte length and execution time:

- **Immediate:** 2 bytes; 2 cycles.
- **Zero Page:** 2 bytes; 3 cycles.
- **Zero Page,X/Y:** 2 bytes; 4 cycles.
- **Absolute:** 3 bytes; 4 cycles.
- **Absolute,X/Y:** 3 bytes; 4 cycles (+1 if page boundary is crossed).
- **Indirect:** 3 bytes; 5 cycles.
- **Indexed Indirect (Pre-Indexed):** 2 bytes; 6 cycles.
- **Indirect Indexed (Post-Indexed):** 2 bytes; 5 cycles (+1 if page boundary is crossed).

**Page-Crossing Behavior**

When using indexed addressing modes, if the addition of the index register to the base address results in crossing a page boundary (i.e., the high byte of the address changes), the 6502 incurs an additional cycle to handle this. This behavior is crucial for timing-sensitive applications.

## Source Code

```asm
; Immediate addressing example
LDA #$10    ; Load accumulator with the immediate value $10

; Zero Page addressing example
LDA $00     ; Load accumulator with the value at memory location $0000

; Zero Page,X addressing example
LDX #$0F    ; Load X register with $0F
LDA $10,X   ; Load accumulator with the value at memory location $001F

; Absolute,X addressing example
LDX #$10    ; Load X register with $10
LDA $1000,X ; Load accumulator with the value at memory location $1010

; Indirect addressing example
JMP ($1000) ; Jump to the address stored at memory location $1000

; Indexed Indirect addressing example
LDX #$04    ; Load X register with $04
LDA ($20,X) ; Load accumulator with the value at the address stored at $0024/$0025

; Indirect Indexed addressing example
LDY #$04    ; Load Y register with $04
LDA ($20),Y ; Load accumulator with the value at the address stored at $0020/$0021 plus $04
```

## References

- "6502 Addressing Modes" — detailed explanations and examples of 6502 addressing modes.
- "6502 Instruction Set" — comprehensive list of instructions and their addressing modes.