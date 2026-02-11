# MOS 6567/6569 (VIC-II) — Idle state and display state

**Summary:** Describes VIC-II internal display state vs idle state, including which bus accesses occur (c- and g-accesses vs only g-access), the idle g-access target addresses ($3FFF or $39FF depending on ECM in $D016), and the state transitions triggered by Bad Line and by RC=7 on cycle 58. Mentions $D011 behavior and the distinction between "idle access" and g-accesses occurring while the VIC is in idle state.

## Idle / display states
The VIC-II graphics sequencer operates in one of two internal states:

- Display state
  - Both c- and g-accesses occur (c-access = character/colour fetch; g-access = graphics/bitmap fetch).
  - Addresses and interpretation of fetched data depend on the active graphics/text mode.

- Idle state
  - Only g-accesses occur; these accesses are always to address $3FFF (or $39FF when the ECM bit in $D016 is set).
  - The sequencer renders video the same way as in display state, but treats the video matrix data as all zero bits (i.e., as if the matrix provided zeros).

State transitions:
- Idle -> Display: occurs immediately when a Bad Line Condition is met (see "bad_lines").
- Display -> Idle: occurs in cycle 58 of a raster line if RC = 7 (RC = row counter, character row index 0–7) and there is no Bad Line Condition for that line.

Behavioral notes:
- If $D011 is not modified mid-frame, the sequencer is in display state for lines inside the display window and in idle state outside it.
- If you run a 25-line display with YSCROLL ≠ 3 and place a nonzero value at $3FFF, the sequencer’s idle-state read pattern can produce visible stripes above or below the display window (demonstrates that the sequencer still performs fixed-address g-accesses while idle).
- Terminology: some sources call both the special idle "i" accesses and the normal g-accesses performed during idle "idle bus cycles"; this document distinguishes them (see below).

## Distinction: "idle access" vs g-access in idle state
- "Idle access" (marked "i" in referenced diagrams) refers to a specific, categorized bus cycle pattern in the VIC documentation/diagrams.
- g-accesses that happen while the VIC is in idle state are normal g-accesses (marked "+" in some diagrams) but directed to the fixed idle address ($3FFF / $39FF) and the returned video-matrix data is treated as zeros.
- This article uses "idle access" only for the accesses explicitly marked "i" in the diagrams referenced in section 3.6.3, and uses "g-access in idle state" to describe the fixed-address graphics fetches the sequencer performs while idle.

## Key Registers
- $D011 - VIC-II - Vertical display control / fine vertical scroll & display window enable (affects whether sequencer is in display state inside window)
- $D016 - VIC-II - Memory control / ECM (Extended Color Mode) bit (when ECM=1, idle g-accesses target $39FF instead of $3FFF)
- $3FFF - Memory - Video matrix idle g-access target when ECM=0; data from this address is treated as zeros in idle state
- $39FF - Memory - Video matrix idle g-access target when ECM=1; data from this address is treated as zeros in idle state

## References
- "bad_lines" — Bad Line trigger and behavior (causes idle -> display transition)
- "graphics_modes_overview" — How g-access interpretation varies by graphics/text mode (affects display-state fetch behavior)

## Labels
- D011
- D016
