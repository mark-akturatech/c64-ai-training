# NMOS 6510 — Unstable store opcodes that AND the stored value with the high byte of the target address + 1

**Summary:** Unofficial/unstable 6510 opcodes SHA/TAS/SHY/SHX (opcodes $93, $9B, $9C, $9E, $9F) perform store-like writes where the value placed on the bus is ANDed with the high byte of the computed target address plus one (&{H+1}); behavior depends on page-cross, cycle timing, and the RDY line (DMA/ready handshake).

**Description and cause**
- **Background (how LDA/STA ABX work):** LDA ABX reads take 4 cycles unless the effective address (address + X) crosses a page boundary; on a page-cross, the read performed in cycle 4 (using the original high byte) is discarded, and a fifth cycle reads from the corrected address after the CPU increments the high address byte during cycle 4. The read data is buffered and copied into A during the next opcode fetch.
- **STA ABX fix-up:** Store instructions that write to memory must present the value on the internal bus while the CPU is also computing addresses. To avoid bus collisions, STA ABX was made to always take 5 cycles (the actual write occurs in the 5th cycle, after the high byte fix-up performed in cycle 4).
- **Missing fix for other stores:** MOS implemented the STA fix-up but did not apply the same timing fix to several unofficial/unstable store-like opcodes (the SH*/TAS group). Because they lack the extra-cycle/address-fix-up hardware, these instructions can exhibit a collision between the value driven on the bus and the high-byte computation — producing a stored value that is effectively ANDed with the computed high byte + 1 (the &{H+1} effect).
- **RDY interaction (DMA):** The value that ends up being written is ANDed with &{H+1} except when the RDY line is pulled low at specific cycles (which freezes CPU timing and can suppress the high-byte increment/AND effect). For SHA:
  - For opcode $9F (abs,Y), an RDY low in the 4th cycle disables the &{H+1} ANDing.
  - For opcode $93 ((zp),Y), an RDY low in the 5th cycle disables the &{H+1} ANDing.
  (RDY here = the processor ready/DMA hold line.)

**Specific opcodes**
- **SHA (AXA / AHX / TEA):**
  - **Opcodes:**
    - $93 — SHA (zp),Y — size 2, cycles 6
    - $9F — SHA abs,Y — size 3, cycles 5
  - **Operation:** Stores A AND X AND (high byte of target address + 1) into memory.
  - **Instability note:** The value written is ANDed with &{H+1}, except when RDY goes low in the 4th (opcode $9F) or 5th (opcode $93) cycle.

- **TAS (XAS / SHS):**
  - **Opcode:**
    - $9B — TAS abs,Y — size 3, cycles 5
  - **Operation:** ANDs A and X, transfers the result to the stack pointer, then stores SP AND (high byte of target address + 1) into memory.
  - **Instability note:** The value written is ANDed with &{H+1}, except when RDY goes low in the 4th cycle.

- **SHY (SYA / SAY):**
  - **Opcode:**
    - $9C — SHY abs,X — size 3, cycles 5
  - **Operation:** Stores Y AND (high byte of target address + 1) into memory.
  - **Instability note:** The value written is ANDed with &{H+1}, except when RDY goes low in the 4th cycle.

- **SHX (SXA / XAS):**
  - **Opcode:**
    - $9E — SHX abs,Y — size 3, cycles 5
  - **Operation:** Stores X AND (high byte of target address + 1) into memory.
  - **Instability note:** The value written is ANDed with &{H+1}, except when RDY goes low in the 4th cycle.

## Source Code
```text
Cycle-by-Cycle Bus Behavior for Unstable Store Opcodes

Opcode $93 (SHA (zp),Y) — 6 cycles:
Cycle 1: Fetch opcode
Cycle 2: Fetch zero-page address
Cycle 3: Read from zero-page address
Cycle 4: Add Y to zero-page address
Cycle 5: Read from effective address
Cycle 6: Write A & X & (H+1) to effective address

Opcode $9B (TAS abs,Y) — 5 cycles:
Cycle 1: Fetch opcode
Cycle 2: Fetch low byte of address
Cycle 3: Fetch high byte of address
Cycle 4: Add Y to address
Cycle 5: Write (A & X) & (H+1) to effective address

Opcode $9C (SHY abs,X) — 5 cycles:
Cycle 1: Fetch opcode
Cycle 2: Fetch low byte of address
Cycle 3: Fetch high byte of address
Cycle 4: Add X to address
Cycle 5: Write Y & (H+1) to effective address

Opcode $9E (SHX abs,Y) — 5 cycles:
Cycle 1: Fetch opcode
Cycle 2: Fetch low byte of address
Cycle 3: Fetch high byte of address
Cycle 4: Add Y to address
Cycle 5: Write X & (H+1) to effective address

Opcode $9F (SHA abs,Y) — 5 cycles:
Cycle 1: Fetch opcode
Cycle 2: Fetch low byte of address
Cycle 3: Fetch high byte of address
Cycle 4: Add Y to address
Cycle 5: Write A & X & (H+1) to effective address
```

## References
- "NMOS 6510 Unintended Opcodes — No More Secrets" by Groepaz
- "6502/6510/8500/8502 Opcodes" by Oxyron
- "C64 Studio — CPU 6510 Opcodes" by Georg Rottensteiner

## Mnemonics
- SHA
- AXA
- AHX
- TEA
- TAS
- XAS
- SHS
- SHY
- SYA
- SAY
- SHX
- SXA
