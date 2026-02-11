# VIC-II internal counters: VC, VCBASE, RC, VMLI

**Summary:** Describes the VIC-II internal counters VC (10-bit video counter), VCBASE (10-bit base), RC (3-bit row counter), and VMLI (6-bit video-matrix line index), and the rules (Bad Line, BA, c-access/g-access timing, cycle 14/58 actions) that make VC scan the 1000 video-matrix addresses and RC count 8 pixel rows per text line.

**Counters and sizes**
- **VC** — Video Counter, 10‑bit counter (can be loaded from VCBASE).
- **VCBASE** — Video Counter Base, 10‑bit data register with a reset input (can be loaded from VC).
- **RC** — Row Counter, 3‑bit counter with a reset input (counts 0..7 pixel rows).
- **VMLI** — Video Matrix Line Index, a 6‑bit position counter (keeps track of the position within the internal 40×12 bit video matrix/color line where read character pointers are stored/read).

**Operational rules (cycle/timing oriented)**
1. **VCBASE reset outside Bad Line range**
   - VCBASE is reset to zero once per frame, outside the Bad Line range (raster lines $30–$F7). This reset is presumed to occur during raster line 0, but the exact moment is not critical to the behavior.

2. **Cycle 14 first phase: VC load and VMLI clear (RC reset on Bad Line)**
   - In the first phase of cycle 14 of each raster line:
     - VC is loaded from VCBASE (VCBASE → VC).
     - VMLI is cleared.
     - If a Bad Line Condition is active in this phase, RC is also reset to zero.

3. **Bad Line (cycles 12–54) starts c-accesses and fills video matrix line**
   - If a Bad Line Condition exists within cycles 12–54:
     - BA is asserted low, and c-accesses begin.
     - Once started, one c-access occurs in the second phase of each clock cycle in the range 15–54.
     - Each c-access reads data and stores it into the video matrix/color line at the position indicated by VMLI.
     - The video matrix entries at VMLI are also the source for internal reads performed on each g-access while in display state.

4. **VC and VMLI increment after each g-access in display state**
   - For every g-access performed while the video logic is in display state, VC and VMLI are incremented.

5. **Cycle 58 first phase: RC check, VC → VCBASE transfer, RC increment**
   - In the first phase of cycle 58, the VIC checks RC:
     - If RC = 7, the video logic transitions to idle, and VCBASE is loaded from VC (VC → VCBASE).
     - If the video logic remains in display state afterward (it will if a Bad Line is active), RC is incremented.

**High-level result**
- Following these rules, VC traverses all 1000 addresses of the internal video matrix across the display frame, and RC counts the eight pixel rows per character text line.
- Bad Line conditions (which the CPU can affect via YSCROLL and other registers) largely determine the exact VC/RC behavior and timing within the frame.

## Source Code

## Labels
- VC
- VCBASE
- RC
- VMLI
