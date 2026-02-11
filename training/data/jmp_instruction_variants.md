# JMP Instruction Encodings and Related Opcodes (List of Bytes)

**Summary:** This document maps the opcode bytes listed ($CD, $DD, $CE, $DE, $4D, $5D, $EE, $FE, $D9, $D2, $59, $52, $4C, $6C, $7C) to their canonical meanings across the 6502, 65C02, and 65C816 processors. It highlights the JMP-specific opcodes ($4C, $6C, $7C), their addressing modes and encodings, and explains the 6502 indirect-JMP page-wrap bug.

**JMP Opcodes (6502 / 65C02 / 65C816)**

- **$4C — JMP Absolute**
  - **Encoding:** 3 bytes: $4C <low-byte> <high-byte>
  - **Semantics:** PC ← operand (absolute 16-bit address)
  - **Example Encoding:** JMP $C000 → 4C 00 C0

- **$6C — JMP (Indirect)**
  - **Encoding:** 3 bytes: $6C <ptr-low> <ptr-high>
  - **Semantics:** Read 16-bit vector at the 16-bit pointer operand; PC ← vector.
  - **6502 Hardware Bug:** If the pointer low byte is $FF, the high byte is fetched from the start of the same page (pointer high byte is read from address (ptr & $FF00) + $00) instead of the next page. This is the classic "indirect JMP page-boundary wrap" behavior to be aware of.

- **$7C — JMP (Absolute,X)**
  - **Availability:** 65C02 and 65C816 processors
  - **Encoding:** 3 bytes: $7C <low-byte> <high-byte>
  - **Semantics:** Read a 16-bit pointer from memory beginning at address (operand + X); PC ← pointed-to 16-bit value. This addressing mode fixes the original 6502 indirect wrap bug.
  - **Assembly Form:** Commonly written as: JMP (<addr>,X) or JMP (<addr>),X depending on assembler conventions.

**Notes:**

- On a plain NMOS 6502, only $4C and $6C are valid official JMP encodings. $7C is a 65C02/65C816 extension.
- Use $6C with care because of the page-wrap bug if the pointer crosses a page boundary.

**Other Opcode Bytes Listed (Not JMP on Standard 6502)**

The raw list included many opcode bytes that do not encode JMP on a standard 6502. For quick reference, their usual canonical meanings on a standard 6502 (or common extensions) are:

- **$CD — CMP Absolute**
  - **Encoding:** 3 bytes: $CD <low-byte> <high-byte>
  - **Semantics:** Compare accumulator with memory at absolute address.
  - **Example Encoding:** CMP $C000 → CD 00 C0

- **$DD — CMP Absolute,X**
  - **Encoding:** 3 bytes: $DD <low-byte> <high-byte>
  - **Semantics:** Compare accumulator with memory at absolute address plus X.
  - **Example Encoding:** CMP $C000,X → DD 00 C0

- **$D9 — CMP Absolute,Y**
  - **Encoding:** 3 bytes: $D9 <low-byte> <high-byte>
  - **Semantics:** Compare accumulator with memory at absolute address plus Y.
  - **Example Encoding:** CMP $C000,Y → D9 00 C0

- **$CE — DEC Absolute**
  - **Encoding:** 3 bytes: $CE <low-byte> <high-byte>
  - **Semantics:** Decrement memory at absolute address.
  - **Example Encoding:** DEC $C000 → CE 00 C0

- **$DE — DEC Absolute,X**
  - **Encoding:** 3 bytes: $DE <low-byte> <high-byte>
  - **Semantics:** Decrement memory at absolute address plus X.
  - **Example Encoding:** DEC $C000,X → DE 00 C0

- **$EE — INC Absolute**
  - **Encoding:** 3 bytes: $EE <low-byte> <high-byte>
  - **Semantics:** Increment memory at absolute address.
  - **Example Encoding:** INC $C000 → EE 00 C0

- **$FE — INC Absolute,X**
  - **Encoding:** 3 bytes: $FE <low-byte> <high-byte>
  - **Semantics:** Increment memory at absolute address plus X.
  - **Example Encoding:** INC $C000,X → FE 00 C0

- **$4D — EOR Absolute**
  - **Encoding:** 3 bytes: $4D <low-byte> <high-byte>
  - **Semantics:** Exclusive-OR accumulator with memory at absolute address.
  - **Example Encoding:** EOR $C000 → 4D 00 C0

- **$5D — EOR Absolute,X**
  - **Encoding:** 3 bytes: $5D <low-byte> <high-byte>
  - **Semantics:** Exclusive-OR accumulator with memory at absolute address plus X.
  - **Example Encoding:** EOR $C000,X → 5D 00 C0

- **$59 — EOR Absolute,Y**
  - **Encoding:** 3 bytes: $59 <low-byte> <high-byte>
  - **Semantics:** Exclusive-OR accumulator with memory at absolute address plus Y.
  - **Example Encoding:** EOR $C000,Y → 59 00 C0

**Uncertain / Variant-Status Opcodes:**

- **$D2 — CMP (Direct Page Indirect)**
  - **Availability:** 65C02 and 65C816 processors
  - **Encoding:** 2 bytes: $D2 <zero-page address>
  - **Semantics:** Compare accumulator with memory at the address pointed to by the zero-page address.
  - **Example Encoding:** CMP ($12) → D2 12

- **$52 — EOR (Direct Page Indirect)**
  - **Availability:** 65C02 and 65C816 processors
  - **Encoding:** 2 bytes: $52 <zero-page address>
  - **Semantics:** Exclusive-OR accumulator with memory at the address pointed to by the zero-page address.
  - **Example Encoding:** EOR ($12) → 52 12

**Encoding Notes and Examples**

- **Absolute JMP ($4C):**
  - **Assembled Bytes:** $4C, low(addr), high(addr)
  - **Example:** JMP $C000 → 4C 00 C0

- **Indirect JMP ($6C) — 6502 Page-Wrap Bug:**
  - **If Pointer = $02FF:**
    - 6502 reads low byte from $02FF and high byte from $0200 (wrap), producing an incorrect 16-bit vector.
  - **Example:**
    - Pointer bytes at $02FF/$0300:
      - If memory[$02FF] = $00 and memory[$0300] = $C0, 6502 reads target = $00 / memory[$0200] (wrap) not $C0.

- **Extended Indirect-X JMP ($7C on 65C02/65C816):**
  - **Assembled Bytes:** $7C, low(base), high(base)
  - **Semantics Example (65C02):**
    - With X=3 and operand = $1000, CPU reads vector low from $1003 and vector high from $1004, then jumps to that vector.

**Kick Assembler Context:**

Kick Assembler supports different CPU instruction sets, including the 65C02. To enable 65C02 instructions, use the directive:

```assembly
.cpu _65c02
```

This setting allows the assembler to recognize and correctly encode 65C02-specific instructions such as the extended JMP forms.

## Mnemonics
- JMP
- CMP
- DEC
- INC
- EOR
