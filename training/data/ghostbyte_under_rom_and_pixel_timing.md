# NMOS 6510: "Ghostbyte under ROM" and R-M-W / REU interactions

**Summary:** This document details the behavior of the 6502/6510 microprocessor during read-modify-write (R-M-W) operations, particularly when reads access ROM while writes target the underlying RAM ("ghostbyte" phenomenon). It also explores interactions with the RAM Expansion Unit (REU) and the VIC-II's bus signals (BA/AEC). The document includes examples of how R-M-W instructions (e.g., `INC $FF00`) can trigger REU transfers or result in two writes one cycle apart, along with discussions on limitations and timing constraints.

**Ghostbyte / R-M-W Overview**

During an R-M-W operation (e.g., `INC zp`, `ROL addr`), the 6502 microprocessor performs the following sequence:

1. Read the target memory location.
2. Perform a dummy write of the original data.
3. Write the modified data back to the memory location.

In systems where ROM is mapped for read operations but the underlying RAM remains writable (as in the Commodore 64), the read cycle retrieves data from the ROM, while write cycles affect the RAM beneath. This results in the dummy write storing the ROM byte into RAM, creating a "ghostbyte" effect with two distinct bus writes occurring one cycle apart.

**Key Constraints:**

- The data written during the dummy write is the value read from the ROM.
- Programmers cannot arbitrarily set the first write's data; it is determined by the ROM content at the read address.
- External devices (e.g., REU) asserting /DMA (and thus AEC) can intervene between the dummy and final writes, potentially preventing one of the writes from reaching memory.

**Practical Applications:**

- Triggering REU transfers by writing to the REU's start register (commonly $FF00) using store or R-M-W instructions.
- Creating double-writes one cycle apart, useful for precise pixel/character rendering techniques where transient memory changes are visible to the VIC-II.
- Exploiting VIC-II sprite/font fetch timings and CPU AEC/BA behavior for half-cycle effects, requiring careful timing.

**Limitations and Considerations:**

- The first write's value is constrained by the ROM content at the read address.
- Devices like the REU, which monitor BA and assert /DMA, may suppress writes unpredictably if they assume transfers occur at the end of an instruction.
- Behavior can vary between different C64 revisions and configurations due to hardware mapping and PLA logic differences.

**REU Trigger Example**

To initiate an REU transfer, the cartridge monitors writes to its start address (e.g., $FF00).

**Common Safe Sequence:**

To avoid altering the byte at $FF00:


**Alternative Using R-M-W Instruction:**

An R-M-W instruction can trigger the REU via the dummy write:


In this case, the dummy write initiates the REU transfer. The REU asserts /DMA, taking control of the bus, which may prevent the CPU's final write from reaching memory. This method saves cycles compared to a separate `STA` instruction.

**Hardware Signal Details:**

- **/RDY:** Pauses CPU execution; observed only during read cycles.
- **/AEC (Address Enable Control):** When asserted, disconnects the CPU from address/data/RW buses immediately.
- **VIC-II Signals:**
  - **BA (Bus Available):** Indicates bus availability.
  - **AEC:** Used by the VIC-II to access the bus during specific cycles.
- **Expansion Port /DMA Input:** Connected to CPU /RDY and /AEC; pauses the CPU and disconnects buses immediately when asserted.

## Source Code

```assembly
LDA $FF00
STA $FF00
```

```assembly
INC $FF00
```


```assembly
; Simple examples demonstrating REU triggering sequences

; Safe sequence to trigger REU without altering $FF00
LDA $FF00
STA $FF00

; Using an R-M-W instruction to trigger REU via dummy write
INC $FF00
```

```text
; R-M-W Cycle Summary for Zero-Page and Absolute Addressing Modes

; Common R-M-W Instructions:
; ASL, DCP, DEC, INC, ISC, LSR, RLA, ROL, ROR, RRA, SLO, SRE

Cycle    Address Bus    Data Bus    Read/Write
1        PC            Opcode       Read
2        PC+1          Operand      Read
3        Address       Old Data     Read
4        Address       Old Data     Write (Dummy Write)
5        Address       New Data     Write (Final Write)
```

## Mnemonics
- ASL
- DCP
- DCM
- DEC
- INC
- ISC
- ISB
- INS
- LSR
- RLA
- ROL
- ROR
- RRA
- SLO
- ASO
- SRE
- LSE
