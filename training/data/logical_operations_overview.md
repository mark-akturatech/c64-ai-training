# Logical operations: AND, ORA, EOR (A register)

**Summary:** The three logical instructions that operate on the 6502 A register are AND, ORA, and EOR; they are commutative, follow a "value and mask" mental model, and operate independently on each bit (making them ideal for extracting or manipulating bits).

**Logical Operations**
These three instructions operate on the A register only.

- **Commutativity:** The bitwise operations are commutative (order of operands does not affect the result). Example: $3A "AND" $57 gives exactly the same result as $57 "AND" $3A.
- **Mental model:** Programmers commonly think in terms of a "value" modified by a "mask" (e.g., value AND mask, value OR mask).
- **Per-bit independence:** Each bit in the byte is processed independently of the others. This is why these instructions are ideal for extracting single bits or manipulating specific bits while leaving others unchanged.
- **Intuitive behaviors:**
  - **AND** — turns bits off (useful for masking out bits).
  - **ORA** — turns bits on (useful for forcing bits to 1).
  - **EOR** — flips (toggles) bits (useful for inverting selected bits).

**Formal Definitions and Truth Tables**

- **AND (Logical AND):** The result is true (1) if and only if both inputs are true; otherwise, it is false (0).

  | Input A | Input B | AND Result |
  |---------|---------|------------|
  |    0    |    0    |     0      |
  |    0    |    1    |     0      |
  |    1    |    0    |     0      |
  |    1    |    1    |     1      |

- **ORA (Logical OR):** The result is true (1) if either of the inputs is true; otherwise, it is false (0).

  | Input A | Input B | ORA Result |
  |---------|---------|------------|
  |    0    |    0    |     0      |
  |    0    |    1    |     1      |
  |    1    |    0    |     1      |
  |    1    |    1    |     1      |

- **EOR (Exclusive OR):** The result is true (1) if and only if one input is true and the other is false; otherwise, it is false (0).

  | Input A | Input B | EOR Result |
  |---------|---------|------------|
  |    0    |    0    |     0      |
  |    0    |    1    |     1      |
  |    1    |    0    |     1      |
  |    1    |    1    |     0      |

## References
- "instruction_review_and_branch_limits" — expands on Logical operators operate on the A register discussed in instruction review
- "logical_and_and_examples" — expands on AND details and example
- "logical_ora_and_examples" — expands on ORA details and example
- "logical_eor_and_examples" — expands on EOR details and example

## Mnemonics
- AND
- ORA
- EOR
