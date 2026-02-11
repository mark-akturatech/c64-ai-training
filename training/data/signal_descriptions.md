# 6510 / Commodore 64 — Signal descriptions (clocks, buses, reset, IRQ, AEC, I/O port, R/W)

**Summary:** Signal-level descriptions for the MOS 6510 as used in the C64: clocking (two-phase φ1/φ2), Address Bus (A0–A15 TTL outputs, loading 130 pF), Data Bus (D0–D7 bidirectional, tri-stated), Reset behavior and power-up requirements including vectors ($FFFC/$FFFD), IRQ behavior and vector fetch ($FFFE/$FFFF), Address Enable Control (AEC) for DMA, I/O port registers ($0000/$0001), and R/W semantics.

**Clocks (φ1, φ2)**
The 6510 requires a two-phase, non-overlapping clock (φ1, φ2) running at VCC level. Clock signals must meet the chip's AC timing requirements:

- **Cycle Time (tCYC):** Minimum 1000 ns
- **Clock Pulse Width φ1 (PWHφ1):** Minimum 430 ns
- **Clock Pulse Width φ2 (PWHφ2):** Minimum 470 ns
- **Rise/Fall Time (tR, tF):** Maximum 25 ns

These parameters are critical for proper CPU operation and must be adhered to in system design.

**Address Bus (A0–A15)**
- Outputs are TTL compatible.
- Drive capability: one standard TTL load and up to 130 pF.
- These are unidirectional outputs from the CPU; when AEC is low, the address bus is tri-stated (high-impedance) to allow DMA or multiprocessor bus masters.

**Data Bus (D0–D7)**
- Eight bidirectional pins forming the data bus.
- Microprocessor drives or samples this bus per the R/W signal.
- Outputs are tri-statable and capable of driving one standard TTL load and 130 pF.
- Direction is governed by the R/W line and internal bus timing.

**Reset**
- Reset is an active-low input. While held low, reads/writes with the microprocessor are inhibited.
- On the positive-going edge of Reset, the CPU begins the reset sequence.
- After a system initialization time of six clock cycles (post-detect), the interrupt mask flag is set, and the Program Counter is loaded from vectors at $FFFC/$FFFD (start address).
- Power-up requirement: after VCC reaches 4.75 V, Reset must be held low for at least two clock cycles; at that point, the R/W signal becomes valid. When Reset is released following those two cycles, the CPU proceeds with the normal reset procedure described above.

**Interrupt Request (/IRQ)**
- /IRQ is a TTL-level input requesting an interrupt sequence.
- The CPU completes the current instruction before recognizing an asserted /IRQ.
- After instruction completion, the interrupt mask bit (I flag) in the Status Register is checked. If the mask is clear, the CPU:
  - Pushes the Program Counter (PCH, PCL) and Processor Status Register onto the stack,
  - Sets the interrupt mask flag,
  - Loads the Program Counter low from $FFFE and high from $FFFF (vector fetch), transferring control to the interrupt handler.
- If the interrupt mask is set, /IRQ is ignored until cleared.

**Address Enable Control (AEC)**
- AEC controls whether the address bus drivers are active.
- When AEC = HIGH, the CPU drives the address bus (addresses valid).
- When AEC = LOW, the address bus is placed in high-impedance, allowing external DMA or another bus master to drive addresses (used by VIC-II DMA, cartridge, or co-processor schemes).

**I/O Port (P0–P5) and Port Registers**
- The peripheral port lines (P0–P5) are usable for simple I/O.
- The Output Register is at address $0001, and the Data Direction Register is at $0000.
- Outputs drive one standard TTL load and 130 pF.

**Note:** While the 6510's I/O port is 8 bits wide, only six lines (P0–P5) are externally available in the most common version used in the Commodore 64. This discrepancy arises because two of the I/O lines are internally connected and not brought out to external pins.

**Read/Write (R/W)**
- R/W is an output from the microprocessor indicating the direction of data transfers on the data bus.
- R/W = HIGH indicates a read (CPU reading from memory/peripheral); R/W = LOW indicates a write (CPU writing to memory/peripheral).
- The R/W line becomes valid after the Reset power-up condition described above.

## Source Code
```text
Reference signal and register facts extracted from source:

Drive capability:
- Address bus (A0–A15): TTL output, 1 TTL load, 130 pF
- Data bus (D0–D7): tri-state outputs, 1 TTL load, 130 pF
- I/O port outputs: 1 TTL load, 130 pF

Reset and power-up:
- Reset active low. While low, bus access inhibited.
- On positive edge of Reset: begin reset sequence.
- System initialization time mentioned: 6 clock cycles (then I flag set, PC loaded from $FFFC/$FFFD).
- Power-up: after VCC ≥ 4.75 V, Reset must be held low ≥ 2 clock cycles; R/W becomes valid after this.

Vectors:
- Reset vector (PC start): $FFFC (low), $FFFD (high)
- IRQ vector: $FFFE (low), $FFFF (high)

I/O port registers:
- $0000 — Data Direction Register (peripheral port)
- $0001 — Output Register (peripheral port)
```

## Key Registers
- $0000 - CPU - Data Direction Register for peripheral port (P0–P5)
- $0001 - CPU - Output Register for peripheral port (P0–P5)
- $FFFC-$FFFD - CPU - Reset vector (PC load on reset)
- $FFFE-$FFFF - CPU - IRQ/BRK vector (PC load on interrupt)

## References
- MOS Technology 6510 Datasheet, 1982
- Commodore 64 Programmer's Reference Guide

**Note:** The above information is sourced from the MOS Technology 6510 datasheet and the Commodore 64 Programmer's Reference Guide.