# C2N READ Pin Waveform & Pulse Detection (C64 tape loaders)

**Summary:** Describes the C2N READ-pin waveform during CBM file reading, how the C64/6526 detects pulse lengths on falling (negative) edges, a short/medium/short pulse example with timings (≈352 µs / 512 µs), and why SAVE and LOAD signals are inverted (common‑emitter BJT inverter note).

## Waveform and pulse classification
The C2N (Datasette) READ pin presents a square-like waveform composed of pulses whose durations encode data. The C64 measures pulse length by sampling the time between successive negative (falling) edges — i.e., the point where the line transitions high→low.

Example sequence (visualized as the raw C2N waveform) produces three pulses as seen by the C64 when detection is triggered on falling edges:
- First pulse: short — ~352 µs
- Second pulse: medium — ~512 µs
- Third pulse: short — ~352 µs

Because detection occurs on falling edges, the C64 effectively measures the time between consecutive high→low transitions; the sequence above therefore decodes as short, medium, short.

## Save vs Load polarity (why signals are inverted)
- During a SAVE operation (the C64 writing to the Datasette), "pulse length" is intended as the time between two consecutive low→high transitions on the WRITE line.
- During a LOAD operation (the Datasette output read by the C64), the 6526 READ line triggers on negative edges (high→low). Therefore, pulse length is measured between consecutive high→low transitions.
- Practically this means the physical signal present at the C2N READ pin (for LOAD) is the logical inverse of the signal the C64 generates for WRITE during SAVE. To duplicate tape data between two C2N units, the LOAD output must be inverted before feeding it into a C2N expecting the WRITE polarity.
- Tape-duplicator hardware commonly uses a single BJT plus two resistors in a common-emitter inverter configuration to flip the polarity (input to base via resistor, collector resistor to +V, output taken from collector, emitter to ground).

## Source Code
```text
ASCII waveform from C2N READ pin (CBM file reading):

..      ____        ______      ____
  |    |    |      |      |    |    |
  |    |    |      |      |    |    |
  |____|    |______|      |____|    |..

Since C64 detects on falling (negative) edges, the following sequence is produced:

   <-352 us-><-  512 us  -><-352 us->
  |         |             |         |
  |         |             |         |
     short       medium      short

Fig 1.1
```

```text
Notes on polarity:
- SAVE (C64 WRITE): pulse length defined between consecutive low->high transitions.
- LOAD  (C2N -> C64 READ): pulse length defined between consecutive high->low transitions (6526 READ triggers on falling edges).
- Duplication: LOAD output must be inverted to drive another C2N's SAVE input (common-emitter BJT + 2 resistors).
```

## References
- "data_encoding_pulses" — Pulse types and their durations (short/medium/long), encoding details
