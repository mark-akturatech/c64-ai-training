# 6581 SID Read-cycle timing and parameters

**Summary:** Read-cycle timing for the 6581 SID (symbols: Tcyc, Tc, Tr/Tf, Trs, Trh, Tacc, Tah, Tch, Tdh) listing min/typ/max values and units. Tcyc: 1–20 µs; Tc: 450/500/10000 ns; Tr/Tf: max 25 ns; Trs: min 0 ns; Trh: min 0 ns; Tacc: max 300 ns; Tah: min 10 ns; Tch: min 0 ns; Tdh: min 20 ns. Specified at VDD=12V, VCC=5V, Ta=0–70°C.

## Read-cycle timing (overview)
This chunk reproduces the 6581 SID read-cycle timing table and symbol definitions as given in the datasheet. All values specified at VDD = 12 V, VCC = 5 V, Ta = 0–70 °C.

Symbol brief meanings:
- Tcyc — Clock Cycle Time (overall period). Min 1 µs, max 20 µs. The C64 system clock runs at ~1.0227 MHz (NTSC) or ~0.9852 MHz (PAL), giving a Tcyc of ~978 ns or ~1015 ns respectively.
- Tc — Clock High Pulse Width (clock high duration). Min 450 ns, typ 500 ns, max 10,000 ns.
- Tr, Tf — Clock Rise / Fall Time. Max 25 ns.
- Trs — Read Set-Up Time (address stable before read). Min 0 ns.
- Trh — Read Hold Time (address/data hold after read). Min 0 ns.
- Tacc — Access Time (data valid after read). Max 300 ns.
- Tah — Address Hold Time. Min 10 ns.
- Tch — Chip Select Hold Time. Min 0 ns.
- Tdh — Data Hold Time. Min 20 ns.

Note: The Tcyc units appear as "uA" in the original OCR'd source transcription — this is an error. The correct unit is **µs** (microseconds), not µA (microamps). At the C64's ~1 MHz clock, Tcyc ≈ 1 µs, which is consistent with the Min=1, Max=20 range.

## Source Code
```text
  6581 SID TIMING (VDD=12V, VCC=5V, Ta=0-70°C)

  READ CYCLE

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

  Note: Original source shows "uA" for Tcyc units — corrected to µs (microseconds).
```

## Key Registers
- $D400-$D418 - SID (6581) - register block (voice registers, filter, control/status)
- $D419-$D41C - SID (6581) - read-only registers (paddle X/Y, oscillator, envelope output)

## References
- "6581_sid_characteristics_and_electrical_tables" — electrical specs that complement timing specs
- "6581_timing_write_cycle" — write-cycle timing parameters for the SID
