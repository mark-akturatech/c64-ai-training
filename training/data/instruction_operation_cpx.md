# CPX (Compare X Register)

**Summary:** CPX compares the X register (XR) with a memory operand by computing XR - operand and setting processor flags: Carry if no borrow (XR >= operand), Zero if equal, and Sign (Negative) from the result's bit 7. Searchable terms: CPX, X register, flags (Carry/Zero/Negative), 6502.

**Operation**
CPX performs a subtraction XR - M (where M is the memory operand) without storing the result back into XR or memory; only flags are affected.

- The subtraction is performed with at least 9-bit precision so the CPU can detect a borrow. If the subtraction produces no borrow (i.e., result fits in 0..255), the Carry flag is set.
- The Zero flag is set when XR == M (the low 8 bits of the result are zero).
- The Negative (Sign) flag is set from bit 7 of the low 8 bits of the subtraction result (two's‑complement sign bit).
- CPX does not modify XR or the memory operand.

Short interpretation:
- Carry = 1 means XR >= M (unsigned comparison).
- Zero = 1 means XR == M.
- Negative reflects the signed result (bit 7 of the low byte).

**Addressing Modes and Opcodes**

CPX supports the following addressing modes:

- **Immediate**: Compares XR with an immediate value.
  - Syntax: `CPX #$nn`
  - Opcode: `$E0`
  - Bytes: 2
  - Cycles: 2

- **Zero Page**: Compares XR with the value at a zero-page address.
  - Syntax: `CPX $nn`
  - Opcode: `$E4`
  - Bytes: 2
  - Cycles: 3

- **Absolute**: Compares XR with the value at a specified address.
  - Syntax: `CPX $nnnn`
  - Opcode: `$EC`
  - Bytes: 3
  - Cycles: 4

**Example Usage**


## Source Code

```assembly
; Example 1: Compare X register with immediate value
CPX #$10  ; Compare XR with $10

; Example 2: Compare X register with value at zero-page address $20
CPX $20   ; Compare XR with value at memory address $0020

; Example 3: Compare X register with value at absolute address $1234
CPX $1234 ; Compare XR with value at memory address $1234
```

```text
/* CPX */
src = XR - src;
SET_CARRY(src < $100);
SET_SIGN(src);
SET_ZERO(src &= $FF);
```

## Key Registers
- **X Register (XR)**: The register compared against the memory operand.

## References
- "instruction_tables_cpx" — expands on CPX opcodes and addressing-mode details

## Mnemonics
- CPX
