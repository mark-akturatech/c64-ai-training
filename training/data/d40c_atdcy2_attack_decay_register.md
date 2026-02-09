# SID Voice 2 Attack/Decay & Sustain/Release — $D40C / $D40D

**Summary:** SID registers $D40C (ATDCY2) and $D40D (SUREL2) control Voice 2 envelope rates and sustain level on the MOS 6581/8580 SID chip. Bits 0-3 select decay/release (0–15), bits 4-7 select attack/sustain (0–15); timing uses the same rate-to-time mapping as Voice 1.

**Register description**
- $D40C — ATDCY2 (Voice 2 Attack/Decay Register)
  - Bits 0-3: Decay cycle duration index (0–15)
  - Bits 4-7: Attack cycle duration index (0–15)
  - The numeric indices map to the SID attack/decay timing table (same mapping as Voice 1).

- $D40D — SUREL2 (Voice 2 Sustain/Release Control Register)
  - Bits 0-3: Release cycle duration index (0–15)
  - Bits 4-7: Sustain volume level index (0–15)
  - Sustain level is a 4-bit volume (0=0..15=max). Release uses the same timing mapping as the other envelope stages.

Behavioral notes:
- Indices 0–15 select discrete envelope-rate steps; the exact milliseconds for each index follow the SID envelope timing table (not duplicated here).
- These registers only affect Voice 2; envelope progression also depends on gate/ADSR control bits in the Voice 2 control register (voice control/registers are covered elsewhere).

## Source Code
```text
$D40C        ATDCY2       Voice 2 Attack/Decay Register

                     0-3  Select decay cycle duration (0-15)
                     4-7  Select attack cycle duration (0-15)

$D40D        SUREL2       Voice 2 Sustain/Release Control Register

                     0-3  Select release cycle duration (0-15)
                     4-7  Select sustain volume level (0-15)

Note: Attack/Decay/Release indices use the same timing mappings as Voice 1.
```

## Key Registers
- $D40C - SID - Voice 2 Attack/Decay Register
- $D40D - SID - Voice 2 Sustain/Release Control Register

## References
- "voice2_registers_list_and_vcreg2" — expands on Voice 2 frequency and control context

**SID Envelope Timing Table**

The following table provides the timing values for the attack, decay, and release phases of the SID envelope generator, corresponding to the index values 0–15. These timings are based on a 1.0 MHz system clock. For systems with different clock frequencies, adjust the times proportionally.

| Index | Attack Time | Decay/Release Time |
|-------|-------------|--------------------|
| 0     | 2 ms        | 6 ms               |
| 1     | 8 ms        | 24 ms              |
| 2     | 16 ms       | 48 ms              |
| 3     | 24 ms       | 72 ms              |
| 4     | 38 ms       | 114 ms             |
| 5     | 56 ms       | 168 ms             |
| 6     | 68 ms       | 204 ms             |
| 7     | 80 ms       | 240 ms             |
| 8     | 100 ms      | 300 ms             |
| 9     | 250 ms      | 750 ms             |
| 10    | 500 ms      | 1.5 s              |
| 11    | 800 ms      | 2.4 s              |
| 12    | 1 s         | 3 s                |
| 13    | 3 s         | 9 s                |
| 14    | 5 s         | 15 s               |
| 15    | 8 s         | 24 s               |

*Note:* The decay and release phases share the same timing values. The sustain phase is not time-dependent; it maintains the volume level set by the sustain parameter until the gate is released.

*Source:* [Technical SID Information/Software Stuff](https://www.sidmusic.org/sid/sidtech2.html)