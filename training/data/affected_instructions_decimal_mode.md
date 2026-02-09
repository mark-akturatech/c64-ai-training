# NMOS 6510: ADC/SBC and derived undocumented instructions affected by the decimal flag

**Summary:** On NMOS 6510 (NMOS 6502 core) the ADC and SBC instructions honor the decimal flag (D) and perform BCD arithmetic when D=1; undocumented instructions that are implemented by or route through the ADC/SBC micro‑operations (ARR, RRA, ISC/ISB and the undocumented $EB SBC immediate) inherit that decimal‑mode behavior.

## Behavior
- ADC and SBC: On the NMOS 6502 core used in the 6510, setting the decimal flag (D=1) causes ADC and SBC to perform packed BCD (binary‑coded decimal) adjustments rather than pure binary addition/subtraction.
- Undocumented opcodes that are implemented by or use the ADC/SBC internal routine will therefore be affected by D:
  - ARR (undocumented) — inherits ADC decimal behavior (see arr_decimal_mode for expanded behavior).
  - RRA (undocumented) — performs a memory ROR then ADC; the ADC step is affected by D (see rra_instruction for details).
  - ISC/ISB (undocumented) — increments memory then performs SBC; the SBC step is affected by D.
  - $EB (undocumented SBC immediate) — this opcode is a variant of SBC and is affected by D.
- Practical implication: when D=1, these derived/undocumented instructions will perform BCD math and set flags according to the NMOS decimal implementation, which differs in subtle ways from pure binary arithmetic (see referenced chunks for opcode‑specific quirks).
- Validation: the statement above is supported by test suites / scanners that exercise decimal behavior across documented and undocumented opcodes.

## Source Code
(omitted — this chunk contains no assembly or register map)

## Key Registers
(omitted — this chunk documents CPU instruction behavior, not memory‑mapped chip registers)

## References
- "arr_decimal_mode" — detailed ARR behavior in decimal mode  
- "rra_instruction" — RRA behavior and note that it inherits ADC decimal mode  
- "test_code_scanner" — validation tests and scanner used to confirm decimal behavior across opcodes