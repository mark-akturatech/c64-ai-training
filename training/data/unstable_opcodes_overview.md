# NMOS 6510 — Overview of Seven "Unstable" Undocumented Opcodes

**Summary:** This document details seven undocumented opcodes of the NMOS 6510 CPU, categorized into two groups: (A) a five-opcode "unstable address high byte" group, where the high byte of the address written to memory can be influenced by CPU register values (A, X, or Y), and (B) a two-opcode "magic-constant" group, whose behavior depends on a chip-specific constant, rendering their results unpredictable.

**Overview**

The NMOS 6510 CPU includes seven undocumented instructions exhibiting non-standard behaviors:

- **Unstable Address High Byte Group (5 opcodes):** These instructions perform memory writes where the high byte of the effective address may be sourced from CPU registers (A, X, or Y) instead of the expected address high byte. This behavior is influenced by factors such as page-boundary crossings and the state of RDY/DMA lines during execution.

- **Magic-Constant Group (2 opcodes):** These instructions involve operations that incorporate a chip-dependent "magic constant." The value of this constant varies between individual NMOS chips and manufacturing batches, leading to unpredictable results across different machines.

The two groups present different levels of risk: the magic-constant group is inherently unpredictable and unsafe for reliable use, while the unstable-address-high-byte group can be conditionally utilized if specific preconditions are strictly maintained (see Preconditions section).

**Behavior Details**

- **Unstable Address High Byte Group:** These opcodes can cause the high byte of the memory address being written to be replaced by the value of a CPU register (A, X, or Y). This substitution is influenced by micro-timing factors:

  1. **Page-Boundary/Index Crossing:** When indexed addressing causes the low byte of the address to wrap from $FF to $00 (crossing a page boundary), internal sequencing changes may result in the high byte being sourced from a register.

  2. **RDY/DMA Insertion:** If RDY or external DMA signals stretch or insert wait cycles during the critical cycle where the high byte is latched, the expected high byte may be masked or replaced by a register value.

- **Magic-Constant Group:** These opcodes utilize an internal value dependent on the physical chip, making their behavior non-deterministic from a software perspective and thus considered "truly unstable."

- **Cycle Counts:** Observed cycle counts for these opcodes vary, with some taking 4 or 5 cycles. The exact cycle count depends on the specific undocumented opcode and its addressing mode.

**Preconditions and Precautions for (Conditional) Use**

To mitigate nondeterminism when using unstable-address-high-byte opcodes, enforce the following preconditions:

- **Avoid Page-Boundary/Index Crossing:** Ensure that indexed addressing does not cross page boundaries.

- **Control RDY/DMA Signals:** Guarantee that no RDY or DMA-induced cycle stretching occurs during the critical cycle.

- **Initialize Registers:** Set CPU registers (A, X, Y) to known values before executing the instruction, as the high byte may be sourced from these registers.

- **Hardware Testing:** Conduct extensive testing on the target hardware and revision, as behavior may vary between chips and even among the same model.

- **Avoid Magic-Constant Group:** Due to their inherent unpredictability, do not rely on the results of magic-constant group opcodes across different machines.

Do not assume that undocumented opcodes will behave identically across machines or runs unless the above conditions are strictly controlled.

## Source Code

```text
Opcode | Group                         | High Byte Source | Cycle Count
-------|-------------------------------|------------------|------------
$9F    | Unstable Address High Byte    | A & X            | 5
$93    | Unstable Address High Byte    | Y                | 4
$9E    | Unstable Address High Byte    | X                | 4
$9C    | Unstable Address High Byte    | Y                | 4
$9D    | Unstable Address High Byte    | X                | 4
$8B    | Magic-Constant                | A | CONST        | 2
$AB    | Magic-Constant                | A | CONST        | 2
```

*Note: The "CONST" in the Magic-Constant group represents a chip-dependent value that varies between individual NMOS chips and manufacturing batches.*

## References

- "Unstable Address High Byte Group" — Detailed analysis of the five opcodes in the unstable address high byte group.

- "ANE and LAX Magic Constant" — Examination of the two opcodes involving a chip-dependent magic constant.