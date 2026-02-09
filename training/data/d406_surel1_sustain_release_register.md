# $D406 — SUREL1 (Voice 1 Sustain/Release Control Register)

**Summary:** $D406 (SID) SUREL1 — voice 1 sustain volume (bits 4–7) and release duration (bits 0–3). Controls sustain level held after decay and release time when the gate bit is cleared; release timings use the same mapping as the decay register.

## Description
SUREL1 sets two fields for SID voice 1: a 4-bit sustain volume (0–15) and a 4-bit release duration index (0–15). After the decay phase, the output level of voice 1 is held at the sustain level while the gate bit in the voice control register remains set (1). When the gate bit is cleared (0), the release phase begins and the output fades from the sustain level to near silence; the release duration is selected by the low 4 bits using the same timing table as the decay values.

## Source Code
```text
$D406        SUREL1       Voice 1 Sustain/Release Control Register

Bit layout:
  7 6 5 4 | 3 2 1 0
 [Sustain] | [Release]

  Bits 4-7: Select sustain volume level (0-15).
            0 = no volume; 15 = peak volume reached during attack.

  Bits 0-3: Select release cycle duration (0-15). Release begins when the
            gate bit of the voice control register is cleared. Timing mapping
            is identical to the decay timing table.

Release/Decay timing table (index => duration):
  0   => 6 milliseconds
  1   => 24 milliseconds
  2   => 48 milliseconds
  3   => 72 milliseconds
  4   => 114 milliseconds
  5   => 168 milliseconds
  6   => 204 milliseconds
  7   => 240 milliseconds
  8   => 300 milliseconds
  9   => 750 milliseconds
  10  => 1.5 seconds
  11  => 2.4 seconds
  12  => 3 seconds
  13  => 9 seconds
  14  => 15 seconds
  15  => 24 seconds
```

## Key Registers
- $D406 - SID - Voice 1 Sustain/Release Control Register

## References
- "d405_atdcy1_attack_decay_register" — Attack/decay mapping for complementary phases