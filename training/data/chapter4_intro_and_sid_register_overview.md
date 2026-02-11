# COMMODORE 64 — Introduction to Sound/Music and the 6581 SID

**Summary:** Overview of the 6581 SID capabilities (three voices, ADSR envelope, filtering, ring modulation/synchronization, white noise) and the SID register block at $D400 (decimal 54272) through $D418 (decimal 54296); access via POKE/PEEK from BASIC or by writing to those memory addresses (POKE MEM,NUM).

## Introduction
The Commodore 64's 6581 "SID" chip provides a fully addressable sound synthesizer: three independent voices, per-voice ADSR (Attack/Decay/Sustain/Release) envelope generators, selectable waveforms, a multimode analogue filter, ring modulation/synchronization between voices, and a white-noise generator. All SID functions are controlled by writing and reading the chip's registers in memory.

Access rules and notes:
- SID register block occupies addresses 54272 to 54296 decimal (hex $D400 to $D418), inclusive.
- In BASIC you write values with POKE and read with PEEK. Example form (single-instruction example): POKE MEM,NUM
  - MEM is the target memory location (an integer address between 54272 and 54296).
  - NUM must be an 8-bit value between 0 and 255 inclusive.
- A convenient programming pattern is to set a base address S = 54272 ($D400) and use offsets 0..24 to reach any SID register (i.e. POKE S+offset, value).
- Both BASIC and assembly language can be used; SID registers are memory-mapped and respond to byte writes/reads.

This chapter introduces the SID features and gives worked examples (register-by-register use and program listings appear elsewhere). A complete register map and example programs are referenced in the appendix and example listings.

## Key Registers
- $D400-$D418 - SID - Full SID register block (25 consecutive byte registers, decimal 54272–54296) — write/read to control voices, envelopes, waveform selection, filter parameters, and global SID functions

## References
- "sid_registers_and_examples_index" — full SID register map and appendix reference
- "example_program_1_code_and_explanation" — first SID example showing basic sound programming and line-by-line explanation

## Labels
- SID
