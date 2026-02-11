# NMOS 6510 — LAX undocumented "magic-constant" immediate values observed in Wizball (emulation)

**Summary:** Empirical testing of Wizball binaries in emulation found specific immediate values for the undocumented LAX #imm (NMOS 6510 illegal opcode) that cause crashes: $63, $64, $67, $68, $69, $6A, $D1, $D2, $EF. Recommendation: emulators should treat the magic constant as $EE (not $EF) for both normal and RDY-cycle behavior.

**Empirical findings**

- Several Wizball binaries were exercised in emulation with all possible immediate byte values for LAX #imm.
- The immediate values that produced misbehavior/crash in the tested Wizball builds are:
  - $63, $64, $67, $68, $69, $6A, $D1, $D2, $EF
- The presence of $EF in this crash list is taken as evidence that $EF likely did not occur on real C64 hardware for these titles (no historical reports of Wizball failing randomly in the 1980s).
- One known other program — "Blackmail FLI" — explicitly uses LAX #imm and may be broken by emulator behavior changes; that program was historically flaky and may have depended on undocumented LAX behavior.

**Recommendation for emulator behavior**

- Emulators are advised to implement the LAX undocumented immediate magic-constant handling using $EE (not $EF) for both:
  - Normal CPU cycles
  - RDY-stalled cycles (RDY behavior)
- This change aligns emulation with the observed absence of $EF in real-world usage (per the Wizball tests) and avoids triggering crashes seen in those test binaries.
- Be aware this will break at least one known program ("Blackmail FLI") that relies on LAX #imm; the program was historically unreliable and may itself have depended on undefined behavior.

**Notes**

- The report is empirical (from emulation testing of Wizball variants) and does not provide low-level traces or hardware test logs in this chunk.
- The term "magic constant" here refers to immediate operand values for the undocumented LAX #imm instruction that cause emulator-visible misbehavior.

## References

- "lax_opcode_example_lax_ff" — example showing LAX #$FF and resulting magic-constant behaviour
- "lax_safe_usage_examples_and_magic_constant_detection" — examples and guidance for safe LAX immediate usage and detection methods

## Mnemonics
- LAX
