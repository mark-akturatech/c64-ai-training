# NMOS 6510 — Indexed‑Indirect (zp,X) Timing and Dummy Fetch Behavior

**Summary:** This document details the NMOS 6510 (6502-family) indexed‑indirect addressing mode "(zp,X)" behavior. The CPU performs a dummy read from the zero‑page operand before adding X and reading the two pointer bytes, then performs the final data access. A per‑cycle sequence and example instructions (ORA (zp,X), ADC (zp,X), SBC (zp,X), AND (zp,X), EOR (zp,X), CMP (zp,X), etc.) are listed.

**Behavior**

Indexed‑indirect addressing "(zp,X)" (also written (zero‑page,X)) uses a zero‑page operand as a pointer to a 16‑bit effective address stored in zero page. The NMOS 6510 performs a dummy read from the zero‑page operand before adding the X index and reading the two pointer bytes. This dummy fetch is observable on the data bus but does not affect the computed pointer.

**Sequence Summary (Conceptual):**

1. **Cycle 1:** Opcode fetch from PC (read).
2. **Cycle 2:** Fetch zero‑page operand (the direct offset) from PC+1 (read).
3. **Cycle 3:** Dummy read from the zero‑page operand address (the byte at DO). This is a dummy fetch (read) and occurs before adding X for the pointer lookup.
4. **Cycle 4:** Read low pointer byte from (DO + X) & $FF (zero‑page wrap) — forms effective address low.
5. **Cycle 5:** Read high pointer byte from (DO + X + 1) & $FF — forms effective address high.
6. **Cycle 6:** Final data access at the formed absolute address (read for ORA/ADC/SBC/AND/EOR/CMP etc.; write for store instructions using this mode if applicable).

**Important Details:**

- The dummy fetch (cycle 3) reads the byte at the unindexed zero‑page operand (DO) and is used only as a bus cycle; the pointer index addition (DO + X) happens for subsequent pointer reads.
- Zero‑page wrap is used when adding X to the operand for the pointer fetches (i.e., (DO + X) & $FF). The low and high pointer bytes are fetched from zero page addresses and combined into a 16‑bit effective address.
- The final cycle is a memory read (for most arithmetic/logic/comparison operations that use (zp,X)) or a write (for store instructions). The R/W action depends on the specific opcode.
- Observing the dummy fetch is useful for cycle-accurate emulation, hardware debugging, and timing-sensitive raster/code that relies on bus activity.
- Example instructions that use this addressing mode include ORA (zp,X), ADC (zp,X), SBC (zp,X), AND (zp,X), EOR (zp,X), CMP (zp,X), etc.

## Source Code

```text
(Address/Data/Read-Write per machine cycle for (zp,X) indexed-indirect)

Instruction examples: ORA (zp,X)    SBC (zp,X)    ADC (zp,X)    AND (zp,X)    EOR (zp,X)    CMP (zp,X)  etc.

Cycle | Address Bus    | Data Bus / Description         | R/W
------+----------------+--------------------------------+---
1     | PC             | Opcode fetch                   | R
2     | PC + 1         | Direct Offset (operand)        | R
3 (*) | DO             | Byte at direct offset (dummy)  | R
4     | DO + X         | Pointer low (zero-page)        | R
5     | DO + X + 1     | Pointer high (zero-page)       | R
6     | AA             | Data at formed absolute address| R/W

(*) Dummy fetch from direct offset (this read is a bus cycle only; index addition occurs for cycles 4–5)

Stack:
Some instructions that use the stack perform dummy fetches from the stack (observed as extra read cycles).

Absolute (JSR)
Cycle | Address Bus | Data Bus | Read/Write
------+-------------+----------+----------
1     | PC          | Opcode   | R
2     | PC+1        | Low byte of subroutine address | R
3     | PC+2        | High byte of subroutine address | R
4     | SP          | PCH (high byte of return address) | W
5     | SP-1        | PCL (low byte of return address) | W
6     | Subroutine address | Next opcode | R
```

**Explanation:**

- **Cycle 1:** Fetch the JSR opcode from the program counter (PC).
- **Cycle 2:** Fetch the low byte of the subroutine address from PC+1.
- **Cycle 3:** Fetch the high byte of the subroutine address from PC+2.
- **Cycle 4:** Push the high byte of the return address (PC+2) onto the stack.
- **Cycle 5:** Push the low byte of the return address (PC+1) onto the stack.
- **Cycle 6:** Fetch the next opcode from the subroutine address.

**Note:** The return address pushed onto the stack is PC+2, which is the address of the instruction following the JSR.

## References

- "zeropage_x_indexed_indirect_legal" — expands on zp,X indexed‑indirect vs zero‑page,X direct differences (referenced by source)

## Mnemonics
- ORA
- ADC
- SBC
- AND
- EOR
- CMP
- JSR
