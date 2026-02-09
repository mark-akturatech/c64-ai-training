# MOS 6581 (SID) — Read-cycle timing parameters

**Summary:** Read-cycle timing for the MOS 6581 SID: Tcyc (clock cycle, 1–20 µs), Tc (clock high, 450–10000 ns typ 500 ns), Tr/Tf (rise/fall, max 25 ns), Trs (read set-up, min 0 ns), Trh (read hold, min 0 ns), Tacc (access time, max 300 ns), Tah (address hold, min 10 ns), Tch (chip-select hold, min 0 ns), Tdh (data hold, min 20 ns). Specified at VDD=12V, VCC=5V, Ta=0–70°C.

## Read-cycle timing parameters
This node lists the standard read-cycle timing parameters used when accessing the MOS 6581 (SID) chip. Each symbol is a timing interval related to the SID clock, address and data signals during a read access. All values specified at VDD = 12 V, VCC = 5 V, Ta = 0–70 °C.

- Tcyc — Clock cycle time (period of the SID clock). Min 1 µs, max 20 µs. The SID operates at the system clock frequency (~1 MHz on the C64).
- Tc — Clock high pulse width (time clock is asserted high). Min 450 ns, typ 500 ns, max 10,000 ns.
- Tr / Tf — Clock rise time / fall time (transition times). Max 25 ns.
- Trs — Read setup time (address/controls stable before the read sampling edge). Min 0 ns.
- Trh — Read hold time (address/controls stable after the read sampling edge). Min 0 ns.
- Tacc — Access time (time from valid address/chip-select to valid data on the bus). Max 300 ns.
- Tah — Address hold time (minimum time address must remain valid after the read edge). Min 10 ns.
- Tch — Chip select hold time (minimum time CS must remain asserted after the read edge). Min 0 ns.
- Tdh — Data hold time (minimum time data must remain valid on the bus after read). Min 20 ns.

Note: The original 6581 datasheet includes a timing diagram illustrating these signal relationships. The Tcyc units appear as "uA" in some source transcriptions — this is an OCR error; the correct unit is µs (microseconds).

## Source Code
```text
6581 SID READ CYCLE TIMING (VDD=12V, VCC=5V, Ta=0-70°C)

+----------+----------------------------+-------+-------+-------+-------+
|  SYMBOL  |           NAME             |  MIN  |  TYP  |  MAX  | UNITS |
+----------+----------------------------+-------+-------+-------+-------+
|   Tcyc   |   Clock Cycle Time         |    1  |   -   |    20 |   µs  |
|   Tc     |   Clock High Pulse Width   |  450  |  500  |10,000 |   ns  |
|   Tr,Tf  |   Clock Rise/Fall Time     |   -   |   -   |    25 |   ns  |
|   Trs    |   Read Set-Up Time         |    0  |   -   |   -   |   ns  |
|   Trh    |   Read Hold Time           |    0  |   -   |   -   |   ns  |
|   Tacc   |   Access Time              |   -   |   -   |   300 |   ns  |
|   Tah    |   Address Hold Time        |   10  |   -   |   -   |   ns  |
|   Tch    |   Chip Select Hold Time    |    0  |   -   |   -   |   ns  |
|   Tdh    |   Data Hold Time           |   20  |   -   |   -   |   ns  |
+----------+----------------------------+-------+-------+-------+-------+
```

## Key Registers
- $D400-$D418 - SID (6581) - register block (voice registers, filter, control/status)
- $D419-$D41C - SID (6581) - read-only registers (paddle X/Y, oscillator, envelope output)

## References
- "6581_timing_write_cycle" — write-cycle timing parameters
- "6581_electrical_characteristics" — electrical conditions under which timing is specified
- "6581_sid_timing_and_read_cycle" — alternate source of the same read-cycle timing table
