# 6581 SID — WRITE CYCLE TIMING

**Summary:** 6581 (SID) write-cycle timing parameters: Tw, Twh, Taws, Tah, Tch, Tvd, Tdh (times in ns). Related to writes to the SID register block at $D400-$D418.

## Write-cycle timing parameters
This chunk lists the signaling/timing parameters required for a valid write to the 6581 SID (write pulse and address/data timing). Each symbol name is shown; numeric limits are in the Source Code table.

- Tw — Write pulse width (minimum pulse duration on the write strobe).
- Twh — Write hold time (data/write hold after clock edge).
- Taws — Address set-up time (address valid before write).
- Tah — Address hold time (address valid after write).
- Tch — Chip-select hold time.
- Tvd — Valid data time (data valid before being sampled).
- Tdh — Data hold time (data valid after sampling).

**[The original timing diagram is missing from the source.]**

## Source Code
```text
[THE PICTURE IS MISSING!]

WRITE CYCLE

+----------+----------------------------+-------+-------+-------+-------+
|  SYMBOL  |           NAME             |  MIN  |  TYP  |  MAX  | UNITS |
+----------+----------------------------+-------+-------+-------+-------+
|   Tw     |   Write Pulse Width        |  300  |   -   |   -   |   ns  |
|   Twh    |   Write Hold Time          |    0  |   -   |   -   |   ns  |
|   Taws   |   Address Set-up Time      |    0  |   -   |   -   |   ns  |
|   Tah    |   Address Hold Time        |   10  |   -   |   -   |   ns  |
|   Tch    |   Chip Select Hold Time    |    0  |   -   |   -   |   ns  |
|   Tvd    |   Valid Data               |   80  |   -   |   -   |   ns  |
|   Tdh    |   Data Hold Time           |   10  |   -   |   -   |   ns  |
+----------+----------------------------+-------+-------+-------+-------+
```

## Key Registers
- $D400-$D418 - SID (6581) - register block (voice registers, filter, control/status)

## References
- "6581_timing_read_cycle" — read-cycle timing parameters