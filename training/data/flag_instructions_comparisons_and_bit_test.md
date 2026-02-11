# 6502 Flag & Test Instructions — CLC/SEC/CLD/SED/CLI/SEI/CLV, CMP/CPX/CPY, BIT

**Summary:** Describes 6502 flag-manipulation opcodes (CLC, SEC, CLD, SED, CLI, SEI, CLV), comparison instructions (CMP, CPX, CPY) which subtract the operand from a register without changing the register while setting Z/C/N, and the BIT instruction which computes A AND M (affecting Z) and transfers M bit7->N and bit6->V. Includes interrupt/stack notes and typical BIT use-cases (storing flags in memory and testing multiple bits).

**Flag instructions**
- **CLC** — clear Carry flag (C = 0). Affects only the Carry flag.
- **SEC** — set Carry flag (C = 1). Affects only the Carry flag.
- **CLD** — clear Decimal mode flag (D = 0). Affects only the Decimal flag.
- **SED** — set Decimal mode flag (D = 1). Affects only the Decimal flag.
- **CLI** — clear Interrupt Disable flag (I = 0). Enables IRQs (does not affect NMIs).
- **SEI** — set Interrupt Disable flag (I = 1). Inhibits IRQs; NMIs still occur.
- **CLV** — clear Overflow flag (V = 0). Affects only the Overflow flag.

Notes:
- These are implied single-byte instructions; they change status flags only and do not modify A/X/Y or memory.
- SEI/CLI control IRQ behavior (IRQ masked by I=1), NMIs are unaffected.

**Comparison instructions (CMP, CPX, CPY)**
- **Semantic:** Each compare instruction performs (Register - Operand) as an unsigned/byte subtraction for the purpose of setting flags, but does NOT store the subtraction result back into the register. The register remains unchanged.
- **Flags updated:**
  - **Z (Zero)** — set if Register == Operand (the result of Register - Operand equals zero).
  - **C (Carry)** — set if Register >= Operand (i.e., subtraction produced no borrow); clear if Register < Operand.
  - **N (Negative)** — set to bit7 of the subtraction result ((Register - Operand) & $80), representing the sign of the result in two's complement.
- **Use:** Comparisons are commonly used immediately before conditional branches (e.g., BEQ/BNE/BCC/BCS) to direct control flow.

**Example test result table:**

| Register | Operand | Z (Zero) | C (Carry) | N (Negative) |
|----------|---------|----------|-----------|--------------|
| $50      | $50     | 1        | 1         | 0            |
| $50      | $40     | 0        | 1         | 0            |
| $50      | $60     | 0        | 0         | 1            |
| $80      | $01     | 0        | 1         | 1            |
| $00      | $FF     | 0        | 0         | 1            |

**BIT instruction**
- **Operation:** Performs A AND M (memory) and sets flags based on that result; the accumulator A is NOT changed.
  - **Z** — set if (A AND M) == 0; cleared otherwise.
  - **N** — loaded from bit 7 of the memory operand M (M bit7 -> N).
  - **V** — loaded from bit 6 of the memory operand M (M bit6 -> V).
- **Behavior summary:** BIT tests masked conditions (via A AND M) and also samples two high bits of the memory operand into the status register without modifying A.
- **Common uses:**
  - Store condition bits or status words in memory and use BIT to quickly test multiple bits (e.g., have a memory byte where bit7 indicates negative-like condition and bit6 indicates overflow-like condition, and other bits used as masks).
  - Use BIT to test specific bits with a mask in A while preserving A and transferring test-result bits to N and V.

**Example BIT operation:**

- **Z** flag: Set if A AND M results in 0.
- **N** flag: Set to bit 7 of M (1 in this case).
- **V** flag: Set to bit 6 of M (0 in this case).

**Interrupts, JSR/RTS, BRK and RTI (stack behavior)**
- **JSR/RTS:**
  - **JSR** pushes the return address onto the stack so **RTS** can return. The processor pushes the high byte of the return address (PC+2), then the low byte; the stack will then contain, seen from the bottom or from the most recently added byte, [PC+2]-L [PC+2]-H.
- **IRQ/NMI/BRK/RTI:**
  - On a hardware interrupt (IRQ or NMI), the processor pushes the current program counter and then the status register onto the stack, then vectors to the interrupt handler addresses ($FFFA for NMI, $FFFE for IRQ).
  - **I (interrupt disable)** set prevents IRQ handling but does not prevent NMI.
  - **BRK** behaves like an interrupt: it pushes PC+2 then a status value with the break flag set, then vectors (BRK uses the IRQ/vector behavior described).
  - **RTI** restores the status register from the stack and returns (it pops SR then PC).

**Note:** The textual descriptions of push order for PC bytes and SR are contradictory in some sources. Confirm exact push order against canonical 6502 documentation if precise stack layout is required.

## Source Code

```
A = %11001100
M = %10101010
A AND M = %10001000
```

```text
; Example of BIT instruction usage
LDA #%11001100   ; Load A with binary 11001100
BIT $2000        ; Test bits in memory location $2000
; Flags affected:
; - Z: Set if (A AND M) == 0
; - N: Set to bit 7 of M
; - V: Set to bit 6 of M
```

## References
- "pragmatics_of_comparisons_and_bit" — practical examples and usage patterns for CMP/CPX/CPY and BIT
- "conditional_branching_and_jumps" — how branches use the flags set by these instructions

## Mnemonics
- CLC
- SEC
- CLD
- SED
- CLI
- SEI
- CLV
- CMP
- CPX
- CPY
- BIT
- JSR
- RTS
- BRK
- RTI
