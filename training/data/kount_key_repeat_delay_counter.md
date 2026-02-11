# KOUNT ($028B) - Key repeat delay counter

**Summary:** Memory location $028B (decimal 651) is the KERNAL keyboard repeat counter (KOUNT). It times the delay between key repeats and interacts with DELAY ($028C) and the repeat flag ($028A).

## Description
KOUNT is a delay counter used by the C64 keyboard handler to determine how long to wait while a key is held down before producing the next repeated character.

- Initial value: 6.
- Behavior: If DELAY at $028C (decimal 652) equals 0, KOUNT is decremented once per 1/60 second while the same key remains held.
- When KOUNT reaches 0:
  - If the repeat flag at $028A (decimal 650) permits repeating that key, the key's ASCII code is reinserted into the keyboard buffer.
  - KOUNT is then set to 4, causing subsequent repeats to occur faster (4 ticks at 60 Hz → ~15 repeats per second).

This location is part of the KERNAL keyboard timing mechanism and is checked/updated while processing held keys.

## Key Registers
- $028A-$028C - KERNAL - keyboard repeat flag/counters: $028A = repeat-allow flag (650), $028B = KOUNT (651) delay counter, $028C = DELAY (652) initial-delay control

## References
- "delay_key_repeat_initial_delay" — expands on DELAY (652 / $028C), which provides the initial longer delay before the first repeat

## Labels
- KOUNT
- DELAY
