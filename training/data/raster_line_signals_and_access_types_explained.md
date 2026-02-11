# MOS 6567/6569 (VIC-II) Timing-Diagram Symbols and Line Meanings

**Summary:** This document explains the timing-diagram notation and signals used in MOS 6567/6569 (VIC-II) diagrams, including cycle counts per raster line, bus signals (Φ0, IRQ, BA, AEC), VIC/6510 access-type symbols, CPU markers, and the meanings of the "Graph." and "X coo." projection lines for sprite positioning.

**Diagram Line: "Cycl-#"**

The "Cycl-#" line labels the clock cycle number within a raster line, starting at 1 for each line. The number of cycles per raster line varies by VIC-II variant:

- MOS 6569: 63 cycles/line
- MOS 6567R56A: 64 cycles/line
- MOS 6567R8: 65 cycles/line

Diagrams often include the last cycle of the previous raster line and the first cycle of the next to clarify cross-line timing and phase transitions.

**Bus-Signal Lines: Φ0, IRQ, BA, AEC**

- **Φ0 (phi0):** The two-phase clock marker, low in the first phase and high in the second.
- **IRQ:** Interrupt request line state, shown as high or low per cycle.
- **BA:** Bus Available line; holds low when VIC has control, indicating the CPU must stop.
- **AEC:** Address Enable Control; indicates when VIC drives the address bus for DMA/bus access.

These lines reflect the states of the corresponding external signals across cycles.

**VIC and 6510 Access-Type Symbols**

The VIC and CPU (6510) activity lines use single-letter symbols to denote the access type during each clock phase:

**VIC Access Symbols:**

- **c:** Access to video matrix (screen RAM) and Color RAM.
- **g:** Access to character generator (charset) or bitmap data.
- **0–7:** Reading the sprite data pointer for sprite 0–7.
- **s:** Reading sprite bitmap data.
- **r:** DRAM refresh cycle.
- **i:** Idle access (no memory/device access).

**6510 (CPU) Markers:**

- **x:** CPU read or write access during that phase.
- **X:** CPU may perform write accesses; CPU stops on the first read (BA is driven low and RDY is low), indicating a CPU write window that will be aborted/paused on reads.

For a detailed explanation of VIC access types, refer to section 3.6.2 of the VIC-II documentation.

**"X coo." and "Graph." Projection Notes**

- **"X coo.":** Lists the X (horizontal pixel/column) coordinates at the beginning of each clock phase, often marked with a "\\" to denote phase boundaries.
- **"Graph.":** A projected overlay mapping the 40-column display window and nominal visible border into the X-coordinates shown on the diagram, intended for sprite positioning and aligning 40-column content to clock phases.

**Important Caveats:**

- The "Graph." projection is a coordinate projection for positioning purposes and does not correspond exactly to the raw VIC video output waveform.
- The visible screen border on actual video is generated approximately 8 pixels later than the projection; thus, use the projection for logical positioning but allow an ~8-pixel offset when considering visible output.

**Practical Timing Notes**

- Diagrams frequently include neighboring-line cycles (previous/next) to illustrate how VIC accesses and bus phases cross raster-line boundaries.
- CPU write windows and VIC g-accesses are commonly used in timing techniques to locate safe CPU writes; other timing-diagram documents expand on these techniques.
