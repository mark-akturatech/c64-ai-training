# NMOS 6510 — Wanted / Open Issues and Calls for Contribution

**Summary:** Outstanding verification and contribution requests for NMOS 6510 / 6502 behavior: RDY dependency of ANE#imm and LAX#imm, page-boundary crossing and RDY behaviour for “unstable address hi byte” opcodes, ARR behaviour during disk reads, and requests for more real-world examples and porting of tests to other 6502 variants (Atari, Apple II, VIC-20, Plus/4).

## Outstanding verification tasks
- RDY dependency of ANE#imm and LAX#imm:
  - Test programs on C-64 can exercise the behaviour, but the mechanism cannot be fully explained yet.
  - Someone able to read die shots is needed to investigate internal implementation and confirm RDY dependency.
  - Collect more real-world code examples that use ANE#imm / LAX#imm to determine the “best” emulation behaviour and the effective value of the “magic constant”.
  - Note: LAX#imm appears more stable than commonly assumed; locating examples that rely on unstable behaviour would help narrow the magic constant value.

- “Unstable address high-byte” opcodes (page-boundary crossing):
  - Verify page-boundary crossing effects and RDY interaction on a broader range of 6502-family CPUs (different NMOS and variants).
  - Confirm whether behaviour observed on one die/revision generalizes across hardware revisions.

- ARR and other opcodes under DMA-like conditions:
  - Test ARR and similar opcodes while disk drives are performing reads (i.e., while the CPU may be affected by bus timing or shared-bus activity) to see if results differ from isolated CPU tests.

## Requests for example code and test expansion
- Share short test snippets or demonstrations showing:
  - Interesting or abusive uses of the decimal mode (BCD arithmetic edge cases).
  - Interesting or abusive uses of dummy memory accesses (the “internal” reads/writes that do not affect logical state but may affect timing or bus lines).
- Port existing test cases to other 6502 platforms and variants for cross-platform verification:
  - Atari 2600, Atari 8-bit (2600/800)
  - Apple II
  - VIC‑20
  - Commodore Plus/4 and other 6502-family machines

## How contributors can help
- Provide die-shot analysis or point to authoritative die images showing the relevant logic for ANE#imm / LAX#imm and RDY gating.
- Submit reproducing test programs and documented run results from real hardware across multiple CPU revisions.
- Supply real-world code examples (binaries or disassemblies) that use LAX#imm / ANE#imm in ways that exercise corner behaviour.
- Run ARR and other opcode tests while exercising disk drive I/O and report any deviations from emulator expectations.
- Share concise example snippets demonstrating decimal-mode corner cases and dummy-access observations.
- Port and run the existing test suite on other 6502-based systems and report differences.

## References
- "references_and_test_programs" — links and test programs for reproducing/verifying the checks described above  
- "history_and_revisions" — change history and notes motivating the requested verification items