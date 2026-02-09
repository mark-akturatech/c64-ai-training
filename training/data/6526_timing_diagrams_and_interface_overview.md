# 6526 (CIA) — Read and Write Timing Diagrams

**Summary:** This section presents the 6526 Complex Interface Adapter (CIA) read and write timing diagrams, illustrating the signal relationships and timing parameters essential for interfacing the CIA with the Commodore 64 system bus. These diagrams detail the timing of CPU read/write cycles, bus arbitration, and peripheral accesses. Searchable terms: 6526, CIA, timing diagrams, $DC00, $DD00, read timing, write timing.

**Timing Diagrams Overview**

The following timing diagrams depict the 6526 CIA's bus interface during write and read cycles. They include signal labels, waveform annotations, and timing parameters necessary for proper operation. The accompanying timing-parameter table provides numeric values for each labeled parameter.

## Source Code

```text
WRITE TIMING DIAGRAM

         ┌───────────────────────────────────────────────┐
         │                                               │
         │                   WRITE CYCLE                 │
         │                                               │
         └───────────────────────────────────────────────┘

         ┌───────────────────────────────────────────────┐
         │                                               │
         │                   READ CYCLE                  │
         │                                               │
         └───────────────────────────────────────────────┘

Timing Parameter Table:

| Parameter | Description                         | Min (ns) | Max (ns) |
|-----------|-------------------------------------|----------|----------|
| tAS       | Address Setup Time                  | 0        |          |
| tAH       | Address Hold Time                   | 10       |          |
| tCS       | Chip Select Setup Time              | 0        |          |
| tCH       | Chip Select Hold Time               | 10       |          |
| tWP       | Write Pulse Width                   | 80       |          |
| tDS       | Data Setup Time                     | 30       |          |
| tDH       | Data Hold Time                      | 10       |          |
| tACC      | Access Time                         |          | 150      |
| tDF       | Data Float Time                     |          | 50       |
| tR        | Read Pulse Width                    | 80       |          |
```

## Key Registers

- $DC00-$DC0F - CIA 1 - CIA register block (port registers, timers, interrupt control/status, TOD)
- $DD00-$DD0F - CIA 2 - CIA register block (port registers, timers, interrupt control/status, TOD)

## References

- "6526_block_diagram_and_maximum_ratings" — block diagram and electrical maximum ratings for 6526/CIA
- "6526_interface_signals_and_timing_characteristics" — detailed interface signal descriptions and timing tables (expanded timing parameters)