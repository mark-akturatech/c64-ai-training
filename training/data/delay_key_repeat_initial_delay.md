# DELAY ($028C) — Initial key-repeat delay counter

**Summary:** $028C (decimal 652) is the software delay counter that times how long a key must be held before automatic repeat begins. Default = 16, decremented every 1/60 second; when 0 it hands off to KOUNT ($028B) to schedule the first repeat (total ~22/60 s).

## Description
- Purpose: Tracks the initial delay before the first automatic repeat of a held key.
- Default value: 16 (stored at $028C). This value is decremented once per 1/60 second while the same key remains pressed.
- First-repeat sequence: When $028C reaches 0, location $028B (KOUNT) is decremented from 6; the key is repeated when KOUNT reaches 0. Therefore the first repeat occurs after 16 + 6 = 22 timer ticks ≈ 22/60 s (≈ 0.367 s).
- Post-first-repeat behavior: After the first repeat, $028C remains at 0 so that subsequent repeats use the faster interval governed by KOUNT alone.
- Condition: Countdown occurs only while the same key remains pressed.

## Key Registers
- $028C - C64 RAM - initial delay counter for key-repeat (counts down every 1/60 s, default 16)

## References
- "kount_key_repeat_delay_counter" — expands on KOUNT used for repeat interval once initial DELAY expires

## Labels
- DELAY
- KOUNT
