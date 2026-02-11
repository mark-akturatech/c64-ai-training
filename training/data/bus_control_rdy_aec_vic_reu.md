# NMOS 6510: /RDY, /AEC and VIC/REU bus-takeover interactions (RDY pauses, AEC disconnects, REU /DMA)

**Summary:** This document details the interactions between the NMOS 6510 microprocessor's /RDY and AEC signals, and how the VIC-II and REU utilize these signals for bus control. It includes precise timing diagrams illustrating the phases of the 6510 clock during which /RDY is sampled, the exact cycle boundaries for AEC assertion and de-assertion, active-level details and timing for BA/AEC signals, the REU /DMA handshake sequence, and the implications for read-modify-write (R‑M‑W) instructions.

**Overview: /RDY and AEC Semantics**

- **/RDY (Ready Input):**
  - When /RDY is asserted low, the 6510 pauses during memory-read cycles by inserting wait states, allowing slower peripherals to complete data reads.
  - /RDY affects only memory-read cycles; write cycles are not extended by /RDY.
  - **Timing Diagram:**
    In this diagram, /RDY is sampled during the high phase of CLK2. When /RDY is low during this phase, the CPU inserts a wait state before proceeding with the next read cycle.

- **AEC (Address Enable Control):**
  - AEC is an output from the 6510 indicating CPU control over the system buses. When de-asserted (low), the CPU tri-states its address and data buses, allowing other devices to take control.
  - **Timing Diagram:**
    AEC is de-asserted during the low phase of CLK2, signaling the CPU to release the bus.

**VIC-II Utilization of BA and AEC**

- **BA (Bus Available):**
  - BA is an output from the VIC-II indicating when it requires bus access. BA goes low three cycles before the VIC-II takes over the bus and remains low during its access.
  - **Timing Diagram:**
    BA and AEC are de-asserted simultaneously, allowing the VIC-II to access the bus.

**REU /DMA Handshake Sequence**

- **/DMA (Direct Memory Access):**
  - The REU asserts /DMA low to request bus control. This causes the CPU to tri-state its buses by de-asserting AEC.
  - **Timing Diagram:**
    The REU asserts /DMA during the low phase of CLK2, leading to the de-assertion of AEC and CPU bus release.

**Consequences for R‑M‑W Instructions**

- **Read-Modify-Write (R‑M‑W) Instructions:**
  - R‑M‑W instructions involve a read, modify, and write sequence. If an external device asserts /DMA between the read and write phases, it can disrupt the atomicity of the instruction.
  - **Timing Diagram:**
    If /DMA is asserted during the modify phase, the write phase may be disrupted, leading to data corruption.

**Summary Guidance**

- **/RDY:** Stretches read cycles only.
- **AEC:** Controls CPU bus tri-state; external devices must coordinate with it to drive address/data lines.
- **VIC-II:** Uses BA/AEC to take buses for video fetches, halting the CPU during these periods.
- **REU:** Asserts /DMA to take the bus; DMA during R‑M‑W can break atomicity and corrupt data if not carefully synchronized.

## Source Code

    ```text
    CLK2:  ────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐
               ││    ││    ││    ││    ││    ││    ││    ││    │
               └┘    └┘    └┘    └┘    └┘    └┘    └┘    └┘    └
    /RDY:  ────────────────────────┐┌──────────────────────────
                                   ││
                                   └┘
    CPU:   ────────[Read Cycle]──────[Wait State]──────[Read Cycle]──────
    ```

    ```text
    CLK2:  ────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐
               ││    ││    ││    ││    ││    ││    ││    ││    │
               └┘    └┘    └┘    └┘    └┘    └┘    └┘    └┘    └
    AEC:   ────┐┌───────────────────────────────┐┌──────────────
               ││                               ││
               └┘                               └┘
    CPU:   ────[CPU Active]──────[Bus Released]──────[CPU Active]──────
    ```

    ```text
    CLK2:  ────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐
               ││    ││    ││    ││    ││    ││    ││    ││    │
               └┘    └┘    └┘    └┘    └┘    └┘    └┘    └┘    └
    BA:    ────────────────┐┌───────────────────────────────┐┌──
                           ││                               ││
                           └┘                               └┘
    AEC:   ────────────────┐┌───────────────────────────────┐┌──
                           ││                               ││
                           └┘                               └┘
    CPU:   ────[CPU Active]──────[Bus Released]──────[CPU Active]──────
    ```

    ```text
    CLK2:  ────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐
               ││    ││    ││    ││    ││    ││    ││    ││    │
               └┘    └┘    └┘    └┘    └┘    └┘    └┘    └┘    └
    /DMA:  ────────────────┐┌───────────────────────────────┐┌──
                           ││                               ││
                           └┘                               └┘
    AEC:   ────────────────┐┌───────────────────────────────┐┌──
                           ││                               ││
                           └┘                               └┘
    CPU:   ────[CPU Active]──────[Bus Released]──────[CPU Active]──────
    ```

    ```text
    CLK2:  ────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐┌────┐
               ││    ││    ││    ││    ││    ││    ││    ││    │
               └┘    └┘    └┘    └┘    └┘    └┘    └┘    └┘    └
    /DMA:  ────────────────┐┌───────────────────────────────┐┌──
                           ││                               ││
                           └┘                               └┘
    CPU:   ────[Read]──────[Modify]──────[Write]──────
    ```

```text
; Reference list: R-M-W instruction families and paired undocumented opcodes (addressing shown as 'abs,x')
ASL abs, x
RRA abs, x

DEC abs, x
RLA abs, x

INC abs, x
SLO abs, x

LSR abs, x
SRE abs, x

ROL abs, x

ROR abs, x

DCP abs, x
```

## References
- "Commodore 64 Programmer's Reference Guide"
- "MOS Technology 6510 Datasheet"
- "Commodore 64 Service Manual"
- "Commodore 64 RAM Expansion Unit User's Guide"

## Mnemonics
- ASL
- RRA
- DEC
- RLA
- INC
- SLO
- LSR
- SRE
- ROL
- ROR
- DCP
