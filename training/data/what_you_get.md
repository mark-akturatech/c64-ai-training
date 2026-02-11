# NMOS 6510 — Overview: illegal opcodes, cycle-by-cycle addressing, quirks

**Summary:** Overview of a reference for NMOS 6510 (6502-family) undocumented opcodes, cycle-by-cycle addressing breakdowns, per-opcode formal descriptions (flags, behavior), dummy memory-access descriptions, decimal-mode hints, and VICE test-program references. Searchable terms: undocumented opcodes, 6510, dummy memory accesses, decimal mode, VICE test-programs, opcode_matrix.

**Overview**
This chunk is a high-level descriptor of a comprehensive document that provides exhaustive coverage of NMOS 6510 undocumented ("illegal") opcodes and CPU quirks. The full work contains:

- Cycle-by-cycle breakdowns of the undocumented addressing modes and the internal memory accesses performed by each undocumented opcode variant.
- For every undocumented opcode:
  - A formal description (flags affected, exact result semantics).
  - A general description of operation and any known quirks or edge cases.
  - An equivalent sequence of legal opcodes where applicable.
  - References to test programs that demonstrate and verify observed behavior (VICE test-suite).
  - Real-world usage examples when available.
- Notes and examples showing unintended (and sometimes useful) uses of decimal mode.
- A description of so-called "dummy" memory accesses (brief fetches or writes the CPU performs that don't affect program-visible state) and examples demonstrating how they can be observed or exploited.
- A short catalogue of other unintended bugs and quirks of the NMOS 6510 CPU core.

This overview is intended for experienced developers and emulator authors; it focuses on precise behavioral detail rather than introductory explanation.

**Contents (what the full document promises)**
- Opcode matrix (named "opcode_matrix") expanding to a full opcode table and per-opcode descriptions.
- Cycle-by-cycle addressing-mode traces for all undocumented opcodes (showing internal read/write fetches and timing).
- Formal per-opcode entries including:
  - Instruction mnemonic and opcode byte(s).
  - Effective addressing mode(s).
  - Cycle counts and per-cycle bus actions.
  - Flags read/modified/written and exact semantics (including side effects).
  - Equivalent legal implementation (where known).
  - Test references (VICE test programs) demonstrating behavior.
- Explanations and examples of dummy reads/writes and how they affect memory-mapped devices.
- Hints and examples for decimal mode (binary-coded decimal, undocumented interactions).
- Summary of other CPU errata and implementation quirks.

**Test code & verification**
- All documented behaviors are stated to be backed by test programs available in the VICE test-programs repository:
  - https://sourceforge.net/p/vice-emu/code/HEAD/tree/testprogs/
- Per-opcode entries cite the specific test program(s) that exercise the observed behavior.

**Naming conventions**
- The document uses mnemonic headings such as "A" for Accumulator and contains an "opcode_matrix" resource that expands the opcode table and provides per-opcode data.

## References
- "VICE test-programs repository" — test code for verifying opcode behavior: https://sourceforge.net/p/vice-emu/code/HEAD/tree/testprogs/
- "opcode_matrix" — expands to the full opcode matrix and per-opcode descriptions (referred to by the source)
