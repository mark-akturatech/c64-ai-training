# NMOS 6510 — Opcode color coding (GREEN / YELLOW / RED) and precautions

**Summary:** NMOS 6510 opcode matrix color coding: GREEN = stable opcodes, YELLOW = partially unstable/implementation-dependent opcodes, RED = highly unstable/undocumented/unsafe opcodes; see "opcode_matrix" for the full opcode table and cell notation such as "AAH" (Absolute Address). Guidance describes precautions when using YELLOW/RED opcodes on NMOS 6510 (C64) hardware.

**Color coding meaning**
- **GREEN** — Stable, documented opcodes that behave predictably across NMOS 6510 implementations and are safe for production code.
- **YELLOW** — Partially unstable or implementation-dependent opcodes; behavior may vary by NMOS revision, silicon errata, or by combination with addressing modes. Use with caution.
- **RED** — Highly unstable, undocumented or illegal opcodes whose behavior is unreliable and may vary widely between chips or cause system instability.

**Notation used in opcode matrix**
- **AAH** — Denotes an Absolute Address operand (two-byte address, low byte then high byte) as shown in opcode matrix cells that use this notation.
- The full opcode matrix (see "opcode_matrix") uses the color coding above applied to each matrix cell; the notation for addressing modes (e.g., AAH) appears in those cells.

**Precautions when using non-GREEN opcodes**
- Avoid YELLOW and RED opcodes in production or cross-platform code unless you have an explicit, documented reason and have tested thoroughly on the exact target hardware.
- Test on the specific NMOS 6510 revision(s) and real hardware you intend to support; emulators may not reproduce silicon-specific quirks unless explicitly modeling NMOS behavior.
- Isolate use of unstable opcodes (if necessary) to non-critical code paths and provide fallbacks using documented instructions where possible.
- Be aware that undocumented opcodes can have side effects (timing changes, register/memory side-effects) that break assumptions in surrounding code or interrupt handling.
- Document any use of YELLOW/RED opcodes in your source, including the hardware revisions tested and observed behavior, to aid future maintenance.

## Source Code
```text
Full opcode matrix with per-opcode color annotations and cell contents:

|      | 0x0 | 0x1 | 0x2 | 0x3 | 0x4 | 0x5 | 0x6 | 0x7 | 0x8 | 0x9 | 0xA | 0xB | 0xC | 0xD | 0xE | 0xF |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 0x0x | BRK | ORA | RED | RED | RED | ORA | ASL | RED | PHP | ORA | ASL | RED | RED | ORA | ASL | RED |
| 0x1x | BPL | ORA | RED | RED | RED | ORA | ASL | RED | CLC | ORA | RED | RED | RED | ORA | ASL | RED |
| 0x2x | JSR | AND | RED | RED | BIT | AND | ROL | RED | PLP | AND | ROL | RED | BIT | AND | ROL | RED |
| 0x3x | BMI | AND | RED | RED | RED | AND | ROL | RED | SEC | AND | RED | RED | RED | AND | ROL | RED |
| 0x4x | RTI | EOR | RED | RED | RED | EOR | LSR | RED | PHA | EOR | LSR | RED | JMP | EOR | LSR | RED |
| 0x5x | BVC | EOR | RED | RED | RED | EOR | LSR | RED | CLI | EOR | RED | RED | RED | EOR | LSR | RED |
| 0x6x | RTS | ADC | RED | RED | RED | ADC | ROR | RED | PLA | ADC | ROR | RED | JMP | ADC | ROR | RED |
| 0x7x | BVS | ADC | RED | RED | RED | ADC | ROR | RED | SEI | ADC | RED | RED | RED | ADC | ROR | RED |
| 0x8x | RED | STA | RED | RED | STY | STA | STX | RED | DEY | RED | TXA | RED | STY | STA | STX | RED |
| 0x9x | BCC | STA | RED | RED | STY | STA | STX | RED | TYA | STA | TXS | RED | RED | STA | RED | RED |
| 0xAx | LDY | LDA | LDX | RED | LDY | LDA | LDX | RED | TAY | LDA | TAX | RED | LDY | LDA | LDX | RED |
| 0xBx | BCS | LDA | RED | RED | LDY | LDA | LDX | RED | CLV | LDA | TSX | RED | LDY | LDA | LDX | RED |
| 0xCx | CPY | CMP | RED | RED | CPY | CMP | DEC | RED | INY | CMP | DEX | RED | CPY | CMP | DEC | RED |
| 0xDx | BNE | CMP | RED | RED | RED | CMP | DEC | RED | CLD | CMP | RED | RED | RED | CMP | DEC | RED |
| 0xEx | CPX | SBC | RED | RED | CPX | SBC | INC | RED | INX | SBC | NOP | RED | CPX | SBC | INC | RED |
| 0xFx | BEQ | SBC | RED | RED | RED | SBC | INC | RED | SED | SBC | RED | RED | RED | SBC | INC | RED |
```

**Legend:**
- **GREEN** — Stable, documented opcodes.
- **YELLOW** — Partially unstable or implementation-dependent opcodes.
- **RED** — Highly unstable, undocumented or illegal opcodes.

*Note: The above matrix is a simplified representation. For a comprehensive opcode matrix with detailed annotations, refer to authoritative sources such as the C64-Wiki's opcode page.*

Example listings showing use and observed behavior of YELLOW/RED opcodes on NMOS 6510 hardware:

1. **Example of a YELLOW opcode (LAX - Load Accumulator and X Register):**

   ```assembly
   ; Load value from memory into both A and X registers
   LAX $2000
   ```

   *Observed Behavior:* Loads the value at memory address $2000 into both the Accumulator (A) and the X register. This opcode is undocumented and may not be supported on all hardware revisions. Use with caution.

2. **Example of a RED opcode (SLO - Shift Left and OR Accumulator):**

   ```assembly
   ; Shift left the value in memory and OR with Accumulator
   SLO $2000
   ```

   *Observed Behavior:* Shifts the value at memory address $2000 one bit to the left and ORs the result with the Accumulator. This opcode is highly unstable and undocumented; its behavior can vary between different 6510 implementations and may cause system instability.

*Note: The above examples are for illustrative purposes. Actual behavior may vary depending on the specific NMOS 6510 revision and hardware configuration. Thorough testing is recommended before using undocumented opcodes.*

## References
- "opcode_matrix" — expands on matrix uses this color coding and contains the full opcode table and cell notations (e.g., AAH).
- C64-Wiki: [Opcode](https://www.c64-wiki.com/wiki/Opcode)
- Masswerk: [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- NESdev Wiki: [CPU unofficial opcodes](https://www.nesdev.org/wiki/CPU_unofficial_opcodes)

## Mnemonics
- LAX
- SLO
- ASO
