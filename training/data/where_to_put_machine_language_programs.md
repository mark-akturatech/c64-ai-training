# Where to Put Your ML Program

**Summary:** Describes two placement options for machine‑language (ML) programs on the C64: the cassette buffer (~190 bytes) and lowering TOM (top‑of‑memory) to allocate permanent RAM until power‑off; mentions memory labels SOB, SOV, SOA, EOA and monitors such as Supermon.

## Placement Options
- Cassette buffer
  - Short, temporary testing area (about 190 characters/bytes).
  - Safe only while no input/output (I/O) activity is performed; I/O can overwrite the buffer.
  - No changes to system pointers required.
  - Volatile: contents may be lost by I/O activity or power cycles (buffer is not a permanent allocation).

- Lowering TOM (move down top‑of‑memory pointer)
  - Move the TOM pointer downward and place the ML program in the newly freed space.
  - Space is effectively unlimited (limited only by available RAM below other system structures).
  - Requires changing the top‑of‑memory pointer(s) in RAM (pointer adjustments are needed to reserve the area).
  - Programs remain resident for the current power session (will be lost on power‑off).
  - Common use: resident monitors (e.g., Supermon) live in this area.

## Source Code
```text
                 SOB        SOV   SOA   EOA   BOS   TOM
                  |          |     |     |     |     |
  -+========+----+----------+-----+-----+-- --+-----+--
   |C.B.====|    | BASIC... | VAR | ARR | ... | STR |
  -+========+----+----------+-----+-----+-- --+-----+--

  Figure 6.2

First, you may put your program in the cassette buffer.  Providing you are
not performing input/output activity, your program will be safe.  Your space
here is limited to 190 characters or so.

Second, move down the top-of-memory pointer and place the program in the
space that has been freed.  Your space here is unlimited.  Programs placed
here will take up permanent residence until the power is turned off.  Many
monitors, such as Supermon, live here.
```

## References
- "basic_memory_layout_overview" — expands on relationship of SOB, SOV, SOA, EOA, TOM
