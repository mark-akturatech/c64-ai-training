# 6502 Illegal Opcodes — revisits, combining behavior, and interrupt/BRK stack quirks

**Summary:** Revisits NMOS 6502 illegal/undefined opcodes (examples: NOP variants, JAM, SLO, RLA, SRE, RRA, SAX, LAX, DCP, ISC, ANE, LXA), explains how many c=3 illegal opcodes behave as combinations of c=1 and c=2 micro-threads (addressing mode mapping from the c=1 entry) and documents interrupt/BRK/stack edge cases (NMI/BRK interaction, 65C02 decimal flag behavior, break flag push/pull semantics).

**Illegal / undefined opcode behavior (overview)**

- Illegal opcodes on the NMOS 6502 are not single, consistent instructions implemented in ROM; many arise from partially-overlapped micro-operations. Some illegal opcodes behave as effective combinations of two legal operations executed across overlapping internal cycles.
- The source groups illegal opcodes by their effective micro-thread count:
  - c=1 entries: single-thread legal opcodes (reference for addressing-mode mapping).
  - c=2 entries: another class of legal/known micro-threads.
  - c=3 entries: often appear as the combination of a c=1 thread and a c=2 thread executing in sequence (resulting behavior depends on timing/race conditions).
- Mapping of addressing mode for many illegal opcodes is often taken from the c=1 entry (i.e., the first micro-thread's addressing mode determines which memory operand location is used).
- Common illegal/opcode families noted in the source (listed without exhaustive opcode values):
  - NOP variations (single-byte and multi-byte NOPs that may consume different addressing-mode cycles)
  - JAM (CPU lock / freeze)
  - SLO, RLA, SRE, RRA — shift/rotate combined with an arithmetic or logical operation
  - SAX, LAX — store/transfer combos that write partial results
  - DCP, ISC (commonly named DEC+CMP / INC+SBC combinations)
  - ANE, LXA — listed as unstable or "highly unstable" cases (results may vary between CPU revisions or depending on timing)
- Race conditions and instability:
  - c=3 combinations are especially prone to race conditions: whether and how the second micro-thread executes can depend on internal timing, page-cross crossings, and preceding instruction types.
  - Some opcodes produce deterministic results on a given NMOS revision but behave differently (or not at all) on others; documented problematic/unstable cases include ANE and LXA.
- The source references additional material specifically titled "illegal_opcode_mechanism_and_race_conditions" for deeper microarchitectural analysis (not included here).

**Interrupts, BRK, and the Break flag (P) on stack semantics**

- NMOS/NMOS-specific BRK / NMI interaction:
  - On the NMOS 6502, if an NMI occurs at the start of a BRK instruction, the NMI can "hijack" the BRK handling so that the BRK still executes as normal but the NMI vector (instead of the IRQ vector) is used for the interrupt transfer.
  - Branch instructions that take 3 cycles (no page crossing): an interrupt triggered during such a branch will be delayed — it will trigger only after an extra CPU cycle.
- 65C02 behavior (not NMOS): the 65C02 clears the decimal flag on ANY interrupt (and on BRK).
- Break flag (B) and stack transfer rules:
  - The break flag has no physical bit in the processor's SR; it is only represented in the pushed copy of P on the stack.
  - When P is pushed because of software BRK or PHP, the break flag bit in the pushed value is set to 1.
  - When P is pushed because of a hardware interrupt, the break flag bit in the pushed value is set to 0.
  - When P is pulled from the stack into the processor (PLP or RTI), bits 5 and 4 are ignored and the break flag does not persist; thus you cannot reliably distinguish BRK vs. hardware interrupt purely from the pulled P.
  - Bit 5 (unused) is set to 1 whenever the status register is pushed to the stack; bits 5 and 4 are ignored when transferred back from stack to the status register.
- Example (as given in source; push/pull/PHA/PLA semantics):
  - Status bits order (SR): N V - B D I Z C
  - Example values shown in source:
    - Before PHP: SR: 0 0 - - 0 0 1 1
    - PHP pushes: 0 0 1 1 0 0 1 1 = $33
    - PLP pulls: 0 0 - - 0 0 1 1 = $03
    - PLA pulls the pushed byte: 0 0 1 1 0 0 1 1 = $33

**JSR / RTS stack behavior (excerpt)**

- The source includes an ASCII depiction of PC, stack, and memory during JSR/RTS operation to illustrate when return address and processor state are placed on the stack relative to subroutine entry, body, and return. (See Source Code section for the exact diagram and alignment).

## Source Code

```text
                                ADDRESS           MEMORY
                               ADH   ADL   MNEMONIC OP CODE  LOW MEMORY
                              0  1  0   E                       SP AFTER JSR BUT BEFO
                                                                RETURN (RTS)
                              0  1  0   F     PCL       02
                              0  1  1   0     PCH       03      SP BEFORE JSR AND AFT
                                                                RETURN (RTS) FROM
                              0  1  1   1              STACK    SUBROUTINE
               PC             0  3  0   0     JSR       20   JUMP TO SUBROUTINE
                              0  3  0   1     ADL       05
                              0  3  0   2     ADH       04
                              0  3  0   3                    RETURN FROM SUBROUTINE T
                                                             THIS LOCATION
                              0  4  0   5      •             SUBROUTINE MAIN
                                                             BODY
                              0  4  0   6      •
                              0  4  0   7      •
                              0  4  0   8     RTS       60   RETURN FROM SUBROUTINE
                                                             HIGH MEMORY
                                   JSR, RTS OPERATION

(Reset after: MCS6502 Instruction Set Summary, MOS Technology, Inc.)

Curious Interrupt Behavior
If the instruction was a taken branch instruction with 3
cycles execution time (without crossing page boundaries), the
interrupt will trigger only after an extra CPU cycle.
On the NMOS6502, an NMI hardware interrupt occuring at the
start of a BRK intruction will hijack the BRK instruction,
meanining, the BRK instruction will be executed as normal, but
the NMI vector will be used instead of the IRQ vector.
                                                                      6502 Instruction Set
The 65C02 will clear the decimal flag on any interrupts (and
BRK).
The Break Flag and the Stack
Interrupts and stack operations involving the status register (or P register)
are the only instances, the break flag appears (namely on the stack).
It has no representation in the CPU and can't be accessed by any instruction.
   The break flag will be set to on (1), whenever the transfer was caused by
   software (BRK or PHP).
   The break flag will be set to zero (0), whenever the transfer was caused
   by a hardware interrupt.
   The break flag will be masked and cleared (0), whenever transferred from
   the stack to the status register, either by PLP or during a return from
   interrupt (RTI).
Therefore, it's somewhat difficult to inspect the break flag in order to
discern a software interrupt (BRK) from a hardware interrupt (NMI or IRQ) and
the mechanism is seldom used. Accessing a break mark put in the extra byte
following a BRK instruction is even more cumbersome and probably involves
indexed zeropage operations.
Bit 5 (unused) of the status register will be set to 1, whenever the
register is pushed to the stack. Bits 5 and 4 will always be ignored, when
transferred to the status register.
E.g.,
1)
         SR: N V - B D I Z C
             0 0 - - 0 0 1 1
    PHP  ->  0 0 1 1 0 0 1 1   =  $33
    PLP  <-  0 0 - - 0 0 1 1   =  $03
  but:
    PLA  <-  0 0 1 1 0 0 1 1   =  $33
2)
```

## References

- "illegal_opcode_mechanism_and_race_conditions" — expands on why c=3 results in combined or undefined behaviors including race conditions
- "MCS6502 Instruction Set Summary" — JSR/RTS operation diagram and reset-era instruction notes

## Mnemonics
- NOP
- JAM
- SLO
- RLA
- SRE
- RRA
- SAX
- LAX
- DCP
- ISC
- ANE
- LXA
