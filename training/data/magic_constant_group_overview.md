# NMOS 6510 — "Magic Constant" Opcode Group (ANE / XAA / LAX)

**Summary:** The undocumented 6502/6510 opcodes ANE (also known as XAA, opcode $8B) and LXA (opcode $AB) exhibit behavior dependent on an internal "magic constant" that varies with chip revision and temperature. Bits 0 and 4 of this constant are particularly unstable. Additionally, these opcodes interact with the RDY line, affecting their execution timing. Due to their unpredictable nature, reliance on these opcodes is discouraged.

**Behavior**

- **Category:** Undocumented/illegal opcode behavior (ANE/XAA and LXA).
- **Effect:** Execution results depend on the accumulator, X register, immediate operand, and an internal "magic constant" that varies by chip and temperature. The RDY line can further influence execution timing.
- **Practical Implications:**
  - Results can differ between chips and change with temperature and CPU timing (RDY).
  - Bits 0 and 4 of the magic constant are described as 'weaker' (i.e., less stable / more likely to flip), making low-bit results especially unreliable.
  - You should not rely on being able to read or reproduce the constant programmatically.
  - To eliminate the magic-constant influence, choose immediate operands or accumulator values that mask those bits (so the final visible result is the expected value regardless of the magic constant).
- **Side-effect Note:** The ANE opcode does not alter unrelated memory locations; executing ANE will not modify memory at $02.
- **Related Hardware Control:** RDY line activity (wait states) can change the opcode's effect; this ties behavior to bus timing.

**Known Tests and Simulations**

- **Test Program Filenames:**
  - CPU/asap/cpu_ane.prg
  - Lorenz-2.15/aneb.prg
  - general/ane-lax/ane-lax.prg (temperature dependency)
  - CPU/ane/ane.prg (RDY dependency)
  - CPU/ane/anenone.prg
  - CPU/ane/ane-border.prg
- **Simulation / Deep-Dive Links:**
  - Visual6502 JSSim trace (example read magic constant): http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=13&d=a200a9ff8bffea
  - Visual6502 wiki entry on opcode 8B (XAA, ANE): http://visual6502.org/wiki/index.php?title=6502_Opcode_8B_(XAA,_ANE)

## Source Code

```asm
; Example assembling/inspection snippets (reference only — illegal opcode behavior varies)
; Standard AND immediate / memory for comparison:
AND $02        ; logical AND with memory location $0002

; Illegal-form example (seen in tests / real-world): ANE #$imm
; Behavior is hardware-dependent; do not expect consistent results across machines.
; Note (from source): Memory location $02 would not be altered by the ANE opcode.
; (Do not assume side-effects beyond accumulator/result.)
```

```text
Test files (from repository):
- CPU/asap/cpu_ane.prg
- Lorenz-2.15/aneb.prg
- general/ane-lax/ane-lax.prg
- CPU/ane/ane.prg
- CPU/ane/anenone.prg
- CPU/ane/ane-border.prg

Simulation links:
- http://visual6502.org/JSSim/expert.html?graphics=f&a=0&steps=13&d=a200a9ff8bffea
- http://visual6502.org/wiki/index.php?title=6502_Opcode_8B_(XAA,_ANE)
```

## Key Registers

- **Accumulator (A):** Involved in the operation and affected by the magic constant.
- **X Register (X):** Participates in the operation alongside the accumulator.

## References

- "ane_and_lax_magic_constant" — expands on ANE and LAX as the two opcodes in this unstable category.

## Mnemonics
- ANE
- XAA
- LAX
- LXA
