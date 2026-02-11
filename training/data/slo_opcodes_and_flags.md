# NMOS 6510 — SLO (ASO) undocumented opcode: specification and encodings

**Summary:** SLO (also called ASO) is an undocumented NMOS 6510/6502 combined opcode that performs a memory ASL (logical left shift) then ORs that shifted memory into A. Includes encodings for zp,X; (zp,X); (zp),Y; abs; abs,X; abs,Y and example opcode bytes such as $03, $13, $0F, $1F, $1B.

**Operation**
- Low-level semantics (atomic single opcode): {addr} = {addr} * 2 (logical left shift), then A = A OR {addr}.  
  - Effectively: perform ASL on the memory operand, then OR that shifted memory into the accumulator.
- Flags (combined effects):
  - C: set from the bit shifted out by the ASL (high bit of original memory).
  - N, Z: updated according to the result of the OR operation (A OR M after the shift).
  - V, B, D, I: unaffected by this combined opcode.
- Behavior note: this is an undocumented/illegal opcode present on NMOS 6502-family chips (including the 6510 used in the C64). The operation is equivalent to executing ASL (memory) followed by ORA A,(memory) in terms of final register/flag effects.

## Source Code
```text
{addr} = {addr} * 2

Size

A = A or {addr}

Cycles N V - B D I Z C

2

5

o

o o

SLO zp, x

2

6

o

o o

$03

SLO (zp, x)

2

8

o

o o

$13

SLO (zp), y

2

8

o

o o

$0F

SLO abs

3

6

o

o o

$1F

SLO abs, x

3

7

o

o o

$1B

SLO abs, y

3

7

o

o o

$1B
```

(Above table reproduced from source: addressing modes, operand sizes, cycle counts, and opcode bytes where listed.)

## References
- "slo_operation_and_examples" — expands on operation details, equivalent instructions, and usage examples for SLO
- "rla_intro_opcodes" — expands on another undocumented combined-opcode (RLA) that follows in the document

## Mnemonics
- SLO
- ASO
