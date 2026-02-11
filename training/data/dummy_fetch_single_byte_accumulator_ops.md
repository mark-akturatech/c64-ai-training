# NMOS 6510 — dummy fetch for single-byte accumulator operations (ASL/LSR/ROL/ROR; implied)

**Summary:** NMOS 6510 behavior: single-byte accumulator instructions (ASL A, LSR A, ROL A, ROR A) perform an opcode fetch from PC, then a dummy read of PC+1 (the byte after the opcode). Same dummy-fetch pattern is shown for implied stack-push instructions (PHA, PHP). Terms: opcode fetch, dummy fetch, PC+1, accumulator addressing, implied mode.

## Behavior
For single-byte implied accumulator operations (ASL A, LSR A, ROL A, ROR A) the NMOS 6510 executes two bus cycles visible on the address/data bus:
- Cycle 1 — Opcode fetch from the program counter (PC). This reads the instruction byte.
- Cycle 2 — Dummy read from PC+1 (the byte following the opcode). This read does not affect the instruction semantics; it is a "fetch after opcode" dummy read.

The snippet in the source also lists stack push instructions (PHA, PHP) in the same section — the same dummy-fetch-after-opcode behavior is indicated for those implied stack operations.

This behavior is relevant when observing address/data activity on the bus (e.g., for cycle-exact timing, bus contention, or hardware snooping): after the CPU fetches the opcode it will perform an extra read from PC+1 even when the instruction has no operand bytes.

## Source Code
```text
NMOS 6510 - Dummy fetch behaviour for single-byte accumulator operations (ASL, LSR, ROL, ROR acting on accumulator): shows that after opcode fetch the CPU performs a dummy fetch of PC+1 (byte after opcode).

R

2 (*)

PC + 1

Byte after opcode

R

(*) fetch after opcode
Stack (push)
PHA

PHP

Cycle    Address-Bus    Data-Bus          Read/Write
1        PC             Opcode fetch      R
2 (*)    PC + 1         Byte after opcode R
```

## References
- "dummy_fetch_implied_instructions" — expands on other implied-address dummy fetch behaviour

## Mnemonics
- ASL
- LSR
- ROL
- ROR
- PHA
- PHP
