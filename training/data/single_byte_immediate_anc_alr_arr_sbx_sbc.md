# NMOS 6510 — Single-byte Immediate Undocumented Opcodes (ANC, ALR, ARR, SBX, SBC)

**Summary:** Undocumented single-byte immediate 6510 opcodes: ANC ($0B, $2B), ALR ($4B), ARR ($6B), SBX ($CB), SBC ($EB). Lists opcode byte(s), high-level operation (A/X arithmetic/logic with immediate), and the flags affected.

**Overview**

This chunk records the NMOS 6510 single-byte immediate undocumented opcodes and their high-level semantics. The entries provide opcode byte(s), the operation performed (using "#{imm}" to denote the immediate operand), and the specific processor status flags affected.

**Opcode Descriptions**

- **ANC** — $0B, $2B
  - **Operation:** A = A & #{imm}
  - **Flags Affected:** N, Z, C
  - **Details:** Performs a bitwise AND between the accumulator and the immediate value. The Negative (N) and Zero (Z) flags are set based on the result. The Carry (C) flag is set to the same value as the Negative flag (i.e., bit 7 of the result). ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

- **ALR** — $4B
  - **Operation:** A = (A & #{imm}) >> 1
  - **Flags Affected:** N, Z, C
  - **Details:** Performs a bitwise AND between the accumulator and the immediate value, then shifts the result one bit to the right. The Carry (C) flag is set to the value of the least significant bit of the result before the shift. The Negative (N) and Zero (Z) flags are set based on the final result. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

- **ARR** — $6B
  - **Operation:** A = (A & #{imm}) >> 1
  - **Flags Affected:** N, Z, C, V
  - **Details:** Performs a bitwise AND between the accumulator and the immediate value, then rotates the result one bit to the right through the Carry flag. The Negative (N) and Zero (Z) flags are set based on the final result. The Carry (C) flag is set to the value of bit 6 of the result, and the Overflow (V) flag is set based on the XOR of bits 6 and 5 of the result. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

- **SBX** — $CB
  - **Operation:** X = (A & X) - #{imm}
  - **Flags Affected:** N, Z, C
  - **Details:** Performs a bitwise AND between the accumulator and the X register, subtracts the immediate value, and stores the result in the X register. The Negative (N) and Zero (Z) flags are set based on the result. The Carry (C) flag is set if the result is non-negative; otherwise, it is cleared. This operation is not affected by the state of the Carry flag and does not affect the Overflow (V) flag. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

- **SBC** — $EB
  - **Operation:** A = A - #{imm} - (1 - C)
  - **Flags Affected:** N, Z, C, V
  - **Details:** Performs a subtraction of the immediate value and the inverse of the Carry flag from the accumulator. The Negative (N), Zero (Z), Carry (C), and Overflow (V) flags are set based on the result. This operation is functionally equivalent to the standard SBC instruction. ([zxe.io](https://zxe.io/depot/documents/technical/NMOS%206510%20Unintended%20Opcodes%20-%20No%20More%20Secrets%20v0.99%20%282024-12-24%29%28groepaz%29%28en%29%5B%21%5D.pdf?utm_source=openai))

## Source Code

```text
ANC

$0B

A = A & #{imm}

N Z C

ANC

$2B

A = A & #{imm}

N Z C

ALR

$4B

A = (A & #{imm}) >> 1

N Z C

ARR

$6B

A = (A & #{imm}) >> 1

N Z C V

SBX

$CB

X = (A & X) - #{imm}

N Z C

SBC

$EB

A = A - #{imm} - (1 - C)

N Z C V
```

## References

- "functions_and_flag_effects_for_grouped_opcodes" — expands on general flag-behavior conventions used by both multi-byte and single-byte undocumented opcodes.
- "stack_and_memory_logical_sha_shy_shx_tas_las" — expands on other unusual memory/SP-affecting undocumented opcodes (SHA/SHY/SHX/TAS/LAS) listed in the next section.

## Mnemonics
- ANC
- ALR
- ARR
- SBX
- SBC
