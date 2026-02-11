# 6502 — Break flag (B) semantics, status pushes/pulls, ADC/SBC flags, BCD mode, and opcode bit-vector (aaabbbcc)

**Summary:** Break flag (B) and high unused bit behavior on status pushes (BRK, PHP) and pulls (PLP, RTI); how ADC/SBC set N,V,Z,C in binary and BCD mode (D), with example sequences; opcode encoding overview using the aaabbbcc bit-vector (rows/columns mapping).

**Break flag (B), bit 5, and stack behavior**

- The Break flag (conventionally called B, bit 4 of the pushed status byte) is not a normal, persistent processor flag — it appears only in the copy of the status byte that is pushed to the stack by BRK and PHP.
- When the CPU pushes a status byte to the stack (BRK, PHP), bit 5 (the "unused" / manufacturer-reserved bit) is set to 1 in the pushed byte. Many documentation examples show pushed copies with bits 5 and 4 both set.
- BRK (software interrupt) pushes the status byte with B set (bit 4 = 1). Hardware interrupts (IRQ/NMI) push a status copy with the B bit cleared (bit 4 = 0). This lets interrupt handlers detect whether the source was BRK or a hardware interrupt by examining the stack copy.
- PLP and RTI pull a byte from the stack into the processor status, but the B bit is not a genuine persistent flag — the pulled value's B bit is ignored for the CPU’s internal break state. Bit 5 is reserved/unused and generally ignored for internal operation; it appears set in pushed copies but does not behave as a normal writable flag.
- Many emulators show the status register with bits 4 and 5 set "virtually" for display convenience; that is an emulator UI choice and not the true internal persistent flags.

Notes on return addresses:

- BRK is treated as a two-byte instruction for pushing return address; the value pushed for return differs from hardware interrupts (which push the address of the next instruction). (BRK pushes the PC as if a two-byte instruction were executed; hardware IRQ/NMI push the return address appropriate for the interrupt type.)

**Practical examples (push/pull and interrupt differences)**

- **Round-trip PHP -> PLP**

  - Assume internal P = 0x00 (all flags clear).
  - PHP pushes a copy: pushed byte = (P | 0x30) — bits 4 and 5 forced set (0x30).
  - PLP pulls that byte; bits 4 and 5 are ignored for the persistent break/unused semantics, so the internal P returns to 0x00.
  - Effect: PHP followed immediately by PLP returns the internal status to its original state (modulo any timing/side effects).

- **BRK vs hardware interrupt (summary)**

  - BRK: pushes PC (as BRK-specific return address semantics) and pushes P with B=1 (bit 4 set) and bit 5 set.
  - IRQ/NMI: push return address and push P with B=0 (bit 4 cleared) but with bit 5 set in the pushed copy.
  - On RTI, the pulled status byte is loaded back (with the CPU treating B/bit5 in the pulled value as not setting a persistent break), and the pulled PC is restored.

- **Emulators/UI:** some tools display SR with bits 4 and 5 set even though bit 4 is not a persistent internal flag — this is a display convention.

**Flags affected by ADC and SBC (binary and BCD)**

- **Arithmetic updates:**

  - Z (zero) — set if result == 0
  - N (negative) — reflects sign bit (bit 7) of the result
  - C (carry) — unsigned carry/borrow for ADC/SBC (also used for multi-byte arithmetic)
  - V (overflow) — set when signed overflow occurs (operands same sign, result sign differs)

- **Overflow (V) meaning:**

  - V signals signed overflow: when adding two values of the same sign produces a result with a different sign (e.g., +64 + +64 = -128 in 8-bit signed semantics).
  - If operands have opposite signs, signed overflow cannot occur (V cannot be set by that operation).

- **Example (binary arithmetic):**

  - LDA #$40  ; A = $40 (%01000000)
  - ADC #$40  ; A -> $80 (%10000000)
  - Result flags (relevant): N = 1 (sign bit set), V = 1 (signed overflow), C = 0, Z = 0.

- **Decimal mode (BCD)**

  - Controlled by D flag (SED to set, CLD to clear).
  - In decimal (BCD) mode, ADC and SBC operate on packed decimal nibbles (each nibble 0–9).
  - Decimal mode affects ADC/SBC only (not INC/DEC).
  - Examples reproduced from the source:
    - SED / CLC / LDA #$12 / ADC #$44  -> accumulator holds $56 (BCD addition)
    - SED / CLC / LDA #$28 / ADC #$14  -> accumulator holds $42
    - SED / SEC / LDA #$00 / SBC #$01  -> accumulator holds $99 (BCD subtraction with borrow)
  - Carry and Zero flags behave as expected in decimal mode; Negative flag follows the high bit and is of limited meaning in BCD.

**Opcode bit-vector and opcode table layout (aaabbbcc)**

- The 6502 opcode byte can be read as the bit-vector aaabbbcc (bits 7..0: aaa bbb cc).
  - cc (bits 0–1): selects a basic addressing-mode/column group (the low two bits).
  - bbb (bits 2–4): further subdivides operation families (often correlates to specific addressing-mode variants or ALU function column).
  - aaa (bits 5–7): selects the instruction family / row.

- **Relationship to opcode table:**

  - A conventional 16x16 opcode matrix can be indexed by combining fields: rows correspond to the high 3 bits (aaa), columns are determined by bbb and cc (bbb cc).
  - This mapping explains many regularities in the 6502 opcode map (groups of similar mnemonics/ addressing-mode patterns appear in rows/columns).

- **Full 256-entry opcode table:**

  The following table provides the complete mapping of 6502 opcodes, showing the relationship between the aaabbbcc bit-vector and the corresponding mnemonics and addressing modes.

  |       | 0     | 1           | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9     | A     | B     | C     | D     | E     | F     |
  |-------|-------|-------------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
  | **0** | BRK   | ORA (ind,X) |       |       |       | ORA zpg | ASL zpg |       | PHP   | ORA # | ASL A |       |       | ORA abs | ASL abs |       |
  | **1** | BPL   | ORA (ind),Y |       |       |       | ORA zpg,X | ASL zpg,X |       | CLC   | ORA abs,Y |       |       |       | ORA abs,X | ASL abs,X |       |
  | **2** | JSR   | AND (ind,X) |       |       | BIT zpg | AND zpg | ROL zpg |       | PLP   | AND # | ROL A |       | BIT abs | AND abs | ROL abs |       |
  | **3** | BMI   | AND (ind),Y |       |       |       | AND zpg,X | ROL zpg,X |       | SEC   | AND abs,Y |       |       |       | AND abs,X | ROL abs,X |       |
  | **4** | RTI   | EOR (ind,X) |       |       |       | EOR zpg | LSR zpg |       | PHA   | EOR # | LSR A |       | JMP abs | EOR abs | LSR abs |       |
  | **5** | BVC   | EOR (ind),Y |       |       |       | EOR zpg,X | LSR zpg,X |       | CLI   | EOR abs,Y |       |       |       | EOR abs,X | LSR abs,X |       |
  | **6** | RTS   | ADC (ind,X) |       |       |

## Mnemonics
- BRK
- PHP
- PLP
- RTI
- ADC
- SBC
- SED
- CLD
