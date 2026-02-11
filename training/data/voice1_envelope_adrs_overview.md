# SID Voice 1 Envelope (ADSR) — $D405-$D406

**Summary:** The SID (6581/8580) Voice 1 envelope (ADSR) is controlled by registers $D405 (Attack/Decay) and $D406 (Sustain/Release). Each of the four parameters—Attack, Decay, Sustain, and Release—is represented by a 4-bit value (0–15). The Gate bit in the voice Control Register (Control bit 0) initiates the attack phase when set and begins the release phase when cleared. Residual noise may persist at the end of the release phase; to ensure silence, clear the waveform, set the frequency to 0, or set the volume to 0.

**Envelope (ADSR) Description**

The SID implements a four-stage amplitude envelope for each voice: Attack → Decay → Sustain → Release.

- **Attack:** Volume rises from 0 to peak over a period specified by the attack nybble (high 4 bits of $D405).
- **Decay:** After reaching peak, volume falls to the sustain level over the time specified by the decay nybble (low 4 bits of $D405).
- **Sustain:** The held intermediate volume level specified by the sustain nybble (high 4 bits of $D406). This level is maintained while the Gate bit remains set.
- **Release:** When Gate is cleared (write 0 to the Gate bit of the voice Control Register while leaving the waveform bit set), volume falls toward 0 over the period specified by the release nybble (low 4 bits of $D406).

Each nybble is a 4-bit value (0–15). Writing a 1 to a waveform bit and to the Gate bit initiates the attack phase. Clearing Gate while the waveform remains set begins the release phase. The envelope may not reach absolute 0 at the end of the release phase; audible residual noise can remain. To fully silence a voice, you can:

- Clear the waveform bit.
- Set the voice frequency to 0.
- Set the global/master volume to 0.

**Envelope Timing**

The timing for each phase of the envelope is determined by the 4-bit values set in the respective nybbles of registers $D405 and $D406. The following table provides the approximate durations for each value:

| Value | Attack Time | Decay Time | Release Time |
|-------|-------------|------------|--------------|
| 0     | 2 ms        | 6 ms       | 6 ms         |
| 1     | 8 ms        | 24 ms      | 24 ms        |
| 2     | 16 ms       | 48 ms      | 48 ms        |
| 3     | 24 ms       | 72 ms      | 72 ms        |
| 4     | 38 ms       | 114 ms     | 114 ms       |
| 5     | 56 ms       | 168 ms     | 168 ms       |
| 6     | 68 ms       | 204 ms     | 204 ms       |
| 7     | 80 ms       | 240 ms     | 240 ms       |
| 8     | 100 ms      | 300 ms     | 300 ms       |
| 9     | 240 ms      | 750 ms     | 750 ms       |
| 10    | 500 ms      | 1.5 s      | 1.5 s        |
| 11    | 800 ms      | 2.4 s      | 2.4 s        |
| 12    | 1 s         | 3 s        | 3 s          |
| 13    | 3 s         | 9 s        | 9 s          |
| 14    | 5 s         | 15 s       | 15 s         |
| 15    | 8 s         | 24 s       | 24 s         |

*Note: Envelope rates are based on a 1.0 MHz Ø2 clock. For other Ø2 frequencies, multiply the given rate by 1 MHz/Ø2. The rates refer to the amount of time per cycle. For example, given an Attack value of 2, the Attack cycle would take 16 ms to rise from zero to peak amplitude. The Decay/Release rates refer to the amount of time these cycles would take to fall from peak amplitude to zero.* ([sidmusic.org](https://www.sidmusic.org/sid/sidtech2.html?utm_source=openai))

## Source Code

```text
SID Voice 1 envelope registers (absolute addresses)

$D405 - Voice 1 Attack/Decay
  bits 7-4 = Attack time (0-15)
  bits 3-0 = Decay time  (0-15)

$D406 - Voice 1 Sustain/Release
  bits 7-4 = Sustain level (0-15)
  bits 3-0 = Release time   (0-15)

Notes:
- "High nybble" = bits 7..4, "Low nybble" = bits 3..0.
- Gate is controlled via the voice Control Register (Control bit 0). Setting Gate=1 while a waveform bit=1 triggers attack. Clearing Gate while waveform remains set triggers release.
- Values are 4-bit quantities; mapping from numeric value to real time depends on SID internal timing (see referenced expansion).
```

## Key Registers

- $D405-$D406 - SID - Voice 1 Attack/Decay (high/low nybbles) and Sustain/Release (high/low nybbles)

## References

- "d405_atdcy1_attack_decay_register" — expands on Attack/Decay durations and numeric → time mapping for $D405
- "d406_surel1_sustain_release_register" — expands on Sustain level and Release timing for $D406

## Labels
- D405
- D406
