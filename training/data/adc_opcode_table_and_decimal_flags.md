# NMOS 6510 — ADC opcodes and decimal-mode flag behavior

**Summary:** ADC instruction opcodes $61/$75/$65/$69 (ADC (zp,X), ADC zp,X, ADC zp, ADC #imm) with byte/cycle counts and a concise summary of how N, V, Z and C are computed in NMOS decimal (BCD) mode.

## Opcodes and addressing modes
This chunk lists the common 6502/6510 ADC opcodes covered and their byte/cycle costs for the NMOS 6510:

- $61 — ADC (zp,X) — 2 bytes, 6 cycles
- $75 — ADC zp,X    — 2 bytes, 4 cycles
- $65 — ADC zp      — 2 bytes, 3 cycles
- $69 — ADC #imm    — 2 bytes, 2 cycles

Operation (imm form): A = A + #{imm} (+ carry). (All addressing modes perform the same arithmetic; only operand fetch differs.)

## Decimal-mode (BCD) flag behavior (NMOS)
Precise behavior used by NMOS ADC when the Decimal flag (D) is set:

- N and V:
  - The N (negative) and V (overflow) flags are determined after the lower-nibble (BCD low digit) fixup has been applied but before any upper-nibble fixup.
  - The logic used to set N and V is the same as in binary-mode ADC: they reflect the binary result bits at that point of computation (i.e., using the 7th bit and signed-overflow detection).
- Z (zero):
  - Z reflects the binary result of the addition before BCD adjustment. In decimal mode the Z flag is set if the binary sum (A + operand + carry interpreted as binary) is zero — it does not reflect whether the final BCD-corrected value is zero.
- C (carry):
  - C behaves as a multi-byte carry bit: it is set if the overall addition produces a carry out of bit 7 (after full BCD fixups it will reflect whether there was an overall carry into the next higher byte).
  - In multi-byte (multi-byte BCD) routines, treat C as the carry to the next byte as usual.

## Test programs
NMOS test programs referenced for ADC decimal-mode behavior:
- CPU/decimalmode/adc00.prg
- CPU/decimalmode/adc01.prg
- CPU/decimalmode/adc02.prg
- CPU/decimalmode/adc10.prg
- CPU/decimalmode/adc11.prg
- CPU/decimalmode/adc12.prg

## Source Code
```text
$61
ADC (zp, x)
2
6
o o
i
o
x

$75
ADC zp, x
2
4
o o
i
o
x

$65
ADC zp
2
3
o o
i
o
x

$69
ADC #imm
2
2
o o
i
o
x

A = A + #{imm}

Operation: add immediate value from accumulator with carry.
Flags
•
The N and V flags are set after fixing the lower nibble but before fixing the upper one. They
use the same logic as binary mode ADC.

•
Z flag is not affected by decimal mode, it will be set if the binary operation would become
zero, regardless of the BCD result.

•
C flag works as a carry for multi byte operations as expected

Test code: CPU/decimalmode/adc00.prg CPU/decimalmode/adc01.prg
CPU/decimalmode/adc02.prg CPU/decimalmode/adc10.prg
CPU/decimalmode/adc11.prg CPU/decimalmode/adc12.prg
```

## References
- "adc_decimal_mode_pseudocode" — detailed pseudocode for BCD fixups and exact flag computations
- "adc_decimal_examples_and_compatibility" — worked examples and NMOS vs CMOS compatibility tests

## Mnemonics
- ADC
