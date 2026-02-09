# Commodore cassette pulse symbols and ROM loader IRQ decoding

**Summary:** Defines Commodore cassette pulse symbol types A/B/C/D with typical cycle-time ranges (microseconds) and explains the ROM loader's IRQ-driven decoding strategy (timer vs. tape-edge IRQ → short/long bit detection).

## Pulse symbols (A, B, C, D)
On Commodore cassette streams the low→high→low transitions are grouped into four symbol classes:

- A — break: a communication break or a pulse with a very long cycle time.
- B — short pulse: typical cycle time ≈ 296–424 microseconds (model-dependent).
- C — medium pulse: typical cycle time ≈ 440–576 microseconds (model-dependent).
- D — long pulse: typical cycle time ≈ 600–744 microseconds (model-dependent).

These numeric ranges are the practical timing windows used by ROM loaders and turbo loaders to distinguish pulses produced by different recording densities and by different machine revisions.

## ROM loader IRQ-driven decoding strategy
The ROM tape loader decodes serial bits by using a countdown timer plus IRQs:

- The loader initializes a timer with a chosen value and starts it counting down.
- Two events can trigger an IRQ: the tape input signal changes (an edge), or the timer reaches zero.
- The loader's IRQ handler determines which event occurred first.
  - If the tape signal changed before the timer expired → a short pulse was detected → interpreted as a logical 0.
  - If the timer expired before a signal change → a long pulse was detected → interpreted as a logical 1.
- This check is repeated continuously to decode the entire file stream.

The ROM code typically separates the IRQ handler that detects timer vs. edge (low-level timing comparison) from higher-level pulse classification and character assembly code that maps measured cycle times into the B/C/D classes and then into bytes.

## Source Code
(omitted — no assembly listings or tables were provided in this chunk)

## Key Registers
- (none) — This chunk describes timing and IRQ strategy but does not list specific hardware registers.

## References
- "irq_routine_read_t2c_and_compute_difference" — expands on the IRQ routine that implements the timer-vs-edge decoding comparison  
- "pulse_classification_and_store_character_calls" — expands on the subsequent code that classifies measured pulses into B/C/D and performs character assembly and storage