# MOS 6567/6569 VIC-II — internal sprite hardware

**Summary:** Describes per-sprite internal hardware in the VIC-II: a 24‑bit sprite data shift register (the data sequencer core), a 6‑bit MC (MOB Data Counter) loadable from a 6‑bit MCBASE (MOB Data Counter Base) with reset, and a per‑sprite expansion flip‑flop that controls Y expansion. Terms: VIC-II, sprite, 24-bit shift register, MC, MCBASE, MOB (movable object).

## Internal sprite hardware
Every VIC-II sprite has its own independent data sequencer and small control state. The components and key behaviors listed in the source are:

- 24-bit shift register
  - The core of each sprite's data sequencer.
  - Holds and shifts sprite bitmap data during display (shifts out sprite pixels).

- MC (MOB Data Counter)
  - A 6‑bit counter per sprite.
  - Can be loaded from MCBASE (see below).
  - Used by the data sequencer to control read/advance of sprite data during DMA/display.

- MCBASE (MOB Data Counter Base)
  - A 6‑bit register per sprite with a reset input.
  - Serves as the load/source value for MC.
  - Reset input allows clearing/initializing the base counter (used by vertical timing/state machines).

- Expansion flip‑flop (per sprite)
  - Single flip‑flop controlling Y expansion for the sprite (vertical double-height behavior).
  - Its state affects MCBASE adjustments and/or display enabling (see referenced rules).

Notes:
- Each sprite's sequencer (shift register + MC/MCBASE + expansion flip‑flop) operates independently.
- Detailed timing: when MC/MCBASE are loaded, incremented, how MCBASE is adjusted for Y expansion, and when DMA/display is turned off are covered in the referenced chunks below.

## References
- "sprite_display_timing_and_rules_1_to_6" — When MC/MCBASE are loaded, incremented, and used during display  
- "sprite_display_rules_7_and_8" — How MCBASE is adjusted for Y expansion and when DMA/display is turned off

## Labels
- MC
- MCBASE
