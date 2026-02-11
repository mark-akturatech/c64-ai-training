# NMOS 6510 Undocumented RRA (aka RRD) — abs,X and abs,Y

**Summary:** The undocumented RRA (Rotate Right and Add) instruction on the NMOS 6510/6502 performs a memory Rotate Right (ROR) followed immediately by an Add with Carry (ADC) to the accumulator. The ADC operation respects the current state of the decimal mode flag (D).

**Description**

The RRA instruction combines the effects of ROR and ADC:

- **Operation:**
  - Rotate the specified memory location one bit to the right.
  - Add the rotated value to the accumulator, including the carry flag.

This is functionally equivalent to executing a ROR followed by an ADC on the same memory location.

**Addressing Modes and Opcodes:**

| Addressing Mode | Opcode | Bytes | Cycles |
|-----------------|--------|-------|--------|
| Absolute,X      | $7F    | 3     | 7      |
| Absolute,Y      | $7B    | 3     | 7      |

*Note: The opcode $7B is used for the Absolute,Y addressing mode, while $7F is used for Absolute,X.*

**Instruction Details:**

- **Bytes:** Number of bytes the instruction occupies in memory.
- **Cycles:** Number of clock cycles the instruction takes to execute.

**Cycle-by-Cycle Bus Behavior:**

For the Absolute,X and Absolute,Y addressing modes, the RRA instruction follows this sequence:

1. **Fetch Instruction:** Read the opcode from memory.
2. **Fetch Low Byte of Address:** Read the low byte of the target address.
3. **Fetch High Byte of Address:** Read the high byte of the target address.
4. **Calculate Effective Address:** Add the index register (X or Y) to the base address. If this addition crosses a page boundary, an extra cycle is consumed.
5. **Read from Effective Address:** Read the value from the effective address.
6. **Write Rotated Value:** Write the rotated value back to the effective address.
7. **Perform ADC:** Add the rotated value to the accumulator, including the carry flag.

**Flag Effects:**

After execution, the following flags are affected:

- **Negative (N):** Set if the result of the ADC is negative.
- **Overflow (V):** Set if the ADC operation results in a signed overflow.
- **Zero (Z):** Set if the result of the ADC is zero.
- **Carry (C):** Set if the ADC operation results in a carry out.

*Note: The ADC operation respects the current state of the decimal mode flag (D). In decimal mode, the ADC performs binary-coded decimal addition.*

## Source Code

```text
RRA abs,X

3

7

o o

i

o x

$7F

RRA abs,Y

3

7

o o

i

o x

$7B

Operation: Rotate one bit right in memory, then add memory to accumulator (with carry).
This instruction works exactly like ROR followed by ADC, with ADC inheriting the decimal mode
as described above.
Test code: CPU/decimalmode/rra00.prg CPU/decimalmode/rra01.prg
CPU/decimalmode/rra02.prg CPU/decimalmode/rra03.prg
CPU/decimalmode/rra10.prg CPU/decimalmode/rra11.prg
CPU/decimalmode/rra12.prg CPU/decimalmode/rra13.prg
```

## References

- "CPU/decimalmode/rra00.prg" — test program (decimal-mode RRA tests)
- "CPU/decimalmode/rra01.prg" — test program
- "CPU/decimalmode/rra02.prg" — test program
- "CPU/decimalmode/rra03.prg" — test program
- "CPU/decimalmode/rra10.prg" — test program
- "CPU/decimalmode/rra11.prg" — test program
- "CPU/decimalmode/rra12.prg" — test program
- "CPU/decimalmode/rra13.prg" — test program
- "unintended_memory_accesses_and_dummy_fetches_accumulator" — expands on unintended memory-access behavior and dummy fetches affecting instruction bus cycles
- "dummy_fetches_implied_instructions" — expands on dummy fetch behavior for implied instructions (different cycle pattern)

## Mnemonics
- RRA
- RRD
