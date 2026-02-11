# NMOS 6510 — Undocumented RRA (also shown as RRD)

**Summary:** Undocumented NMOS 6510 instruction RRA (aka RRD) combines a memory ROR and an ADC into A using the same addressing mode. Covers opcodes ($67,$77,$63,$73,$6F), addressing modes (zp, zp,X, (zp,X), (zp),Y, abs), sizes, cycle counts, and semantics ({addr} = ROR {addr}; A = A ADC {addr}).

## Description
RRA is a single opcode that performs two sub-operations with the same addressing mode in sequence:
1. ROR {addr}  — rotate right the memory byte at {addr}, writing the result back to {addr} and updating the carry based on the low bit shifted out (standard ROR on memory).
2. ADC A, {addr} — add the (now-rotated) memory byte and the processor carry to the accumulator (standard ADC semantics).

Effectively: {addr} = ROR({addr}); A = A + {addr} + C (with ADC flag behavior).

This instruction is undocumented on NMOS 6510/6502 variants. The final processor flags reflect the ADC result (Negative, Overflow, Zero, Carry); the intermediate ROR updates carry and memory but the ADC result and flags are what remain after the full instruction. Mnemonics seen in sources: RRA and occasionally RRD.

Addressing modes implemented: zero page (zp), zero page,X (zp,X), (zp,X), (zp),Y, absolute (abs). Byte sizes and cycle counts vary by addressing mode (see table).

## Source Code
```text
RRA (RRD)
Type: Combination of two operations with the same addressing mode (Sub-instructions: ROR, ADC)

Opc.    Mnemonic         Function
$67    RRA zp            {addr} = ROR {addr} ; A = A ADC {addr}
$77    RRA zp,X          {addr} = ROR {addr} ; A = A ADC {addr}
$63    RRA (zp,X)        {addr} = ROR {addr} ; A = A ADC {addr}
$73    RRA (zp),Y        {addr} = ROR {addr} ; A = A ADC {addr}
$6F    RRA abs           {addr} = ROR {addr} ; A = A ADC {addr}

Size / Cycles / Affected flags (summary)
Mnemonic         Size  Cycles    Flags affected
RRA zp           2     5         N V Z C
RRA zp,X         2     6         N V Z C
RRA (zp,X)       2     8         N V Z C
RRA (zp),Y       2     8         N V Z C
RRA abs          3     6         N V Z C

(Note: Flags shown reflect the ADC result: Negative, Overflow, Zero, Carry.)
```

## References
- "isc_instruction" — Related undocumented INC+SBC combination (ISC) described immediately before

## Mnemonics
- RRA
- RRD
