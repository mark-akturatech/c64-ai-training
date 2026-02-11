# NMOS 6510 — undocumented LAX (AB) immediate — empirical assembly example

**Summary:** Short assembly listing demonstrating the undocumented LAX immediate opcode (AB) on an NMOS 6510 / 6502 core, showing A and X becoming a reproducible "magic-constant" value ($EE) after LDA #$00 + LAX #$FF; includes a following undocumented DCP ($DF) memory operation and RTS. Searchable terms: AB, LAX, DCP, $FF97,X, A, X, accumulator, NMOS 6510.

## Observed behaviour
This chunk is a minimal empirical test showing that executing LDA #$00 followed by the undocumented LAX immediate (opcode AB) with operand $FF did not set A and X to $FF as expected from a normal load — instead both A and X were observed to become $EE. The original source annotates this as a "magic-constant" behaviour:

- Sequence:
  - LDA #$00
  - LAX #$FF (AB FF) — undocumented AB immediate opcode
  - DCP $FF97,X (DF 97 FF) — undocumented combined DEC memory + CMP A (DCP)
  - RTS (60)

- Observed register result (per source comment):
  - A = X = (($00 | CONST) & $FF) = $EE
  - Accumulator value reported: $EE

This listing does not attempt to explain the underlying cause of the magic constant; it records only the empirical result. The DCP instruction is used against $FF97,X (memory accessed with X index) and is noted to decrement that memory location then perform a compare with A (undocumented DCP behaviour).

(Definitions: LAX — undocumented opcode that affects A and X simultaneously; DCP — undocumented opcode: DEC memory then CMP A.)

## Source Code
```asm
; Empirical test showing undocumented LAX (AB) immediate behaviour
; Addresses shown as in original dump

A9 00        ; LDA #$00
              ; b58b

AB FF        ; LAX #$FF  (undocumented AB immediate)
              ; b58d

DF 97 FF     ; DCP $FF97,X ; decrement mem (=$85), compare with
; A = X = (($00 | CONST) & $ff) = $EE
; akku (=$EE)

b590
60           ; RTS
```

## References
- "lax_wizball_emulator_recommendation" — expands on empirical test results and emulator guidance for the LAX magic constant
- "lax_safe_usage_examples_and_magic_constant_detection" — expands on safe example usages and a method to read/detect the magic constant

## Mnemonics
- LAX
- DCP
- DCM
