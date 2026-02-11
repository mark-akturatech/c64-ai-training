# NMOS 6510 — Naming conventions and shorthand

**Summary:** Naming and shorthand for 6510/6502 assembler-level documentation: register names (A, X, Y, SP, PC), status flags (NV-BDIZC), immediate/effective-address notation ({imm}, {addr}, {H+1}), magic constants ({CONST}), operator symbols (& | ^ + - * /), color-coded opcode stability (GREEN/YELLOW/RED), and address-mode abbreviations (A, abs, abs,X, abs,Y, #, impl, ind, X,ind, ind,Y, rel).

**Conventions and shorthand**

- **Register names**
  - A — Accumulator
  - X — X-register
  - Y — Y-register
  - SP — Stack-pointer
  - PC — Program Counter

- **Status flags**
  - NV-BDIZC — Flags in the status register (notation preserved as written)

- **Operand/address notation (literal forms used in opcode descriptions)**
  - {imm} — An immediate value
  - {addr} — Effective address given in the opcode (including indexing)
  - {H+1} — High byte of the address given in the opcode, plus 1
  - {CONST} — 'Magic' chip and/or temperature dependent constant value

- **Common operator symbols (as used in formulas and address calculations)**
  - & — binary AND
  - | — binary OR
  - ^ — binary XOR
  - + — integer addition
  - - — integer subtraction
  - * — integer multiplication (powers of two behave like bitshift)
  - / — integer division (powers of two behave like bitshift)

- **Opcode stability color-coding**
  - GREEN — completely stable opcodes (safe to use)
  - YELLOW — partially unstable opcodes (require special care)
  - RED — highly unstable opcodes (use only with severe restrictions)

- **Address-mode abbreviations**
  - A — Accumulator
  - abs — Absolute
  - abs,X — Absolute, X-indexed
  - abs,Y — Absolute, Y-indexed
  - # — Immediate
  - impl — Implied
  - ind — Indirect
  - X,ind — X-indexed, indirect
  - ind,Y — Indirect, Y-indexed
  - rel — Relative

## References
- "address_mode_abbreviations" — expands on abbreviations used with these names
- "processor_flags" — expands on flag notation and meanings
