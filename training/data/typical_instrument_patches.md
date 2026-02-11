# SID 6581/8580 — Typical Instrument Patches (ADSR + Waveform)

**Summary:** Starting-point ADSR and waveform patch table for the SID 6581/8580 showing wave choices (Pulse/Saw/Tri/Noise), ADSR nibble values (0–15), and brief notes on PWM and filter usage; relevant to SID registers at $D400 (voice 1)/$D407 (voice 2)/$D40E (voice 3).  

## Typical Instrument Patches
This table lists recommended starting ADSR and waveform settings for common instrument timbres. ADSR numbers are 0–15 per field and are stored on the SID as two bytes per voice (Attack/Decay and Sustain/Release packed as nibbles). Use these as starting points to tweak timbre, PWM movement, and filter settings.

Key points from the table:
- Wave = SID waveform selection (Pulse, Saw, Triangle, Noise).
- ADSR values are given as decimal nibbles (0–15). (ADSR bytes: Attack/Decay and Sustain/Release packed as two bytes.)
- PWM and filter notes indicate suggested pulse-width register values or filter usage (e.g., PWM around $0400, PW = $0800 for 50%).
- Percussive sounds often use Noise or short decay settings; sustained sounds use higher sustain nibbles.

## Source Code
```text
Instrument    | Wave  | Attack | Decay | Sustain | Release | Notes
--------------+-------+--------+-------+---------+---------+------------------
Piano         | Pulse |   0    |   9   |    0    |    0    | PWM at ~$0400
Organ         | Pulse |   0    |   0   |   15    |    0    | PW = $0800 (50%)
Violin/String | Saw   |   5    |   8   |    5    |    9    | Slow attack
Flute         | Tri   |   3    |   5   |    8    |    6    | Soft tone
Brass         | Saw   |   2    |   6   |   10    |    4    | Bright attack
Xylophone     | Tri   |   0    |   9   |    0    |    9    | Percussive
Bass          | Saw   |   0    |   9   |    0    |    0    | Short, punchy
Synth Lead    | Pulse |   0    |   0   |   15    |    3    | PWM for movement
Snare Drum    | Noise |   0    |   5   |    0    |    5    | Filtered
Hi-Hat Closed | Noise |   0    |   0   |    0    |    0    | Very short
Hi-Hat Open   | Noise |   0    |   9   |    0    |    9    | Longer decay
Kick Drum     | Tri   |   0    |   4   |    0    |    0    | Pitch sweep down
```

## Key Registers
- $D400-$D406 - SID (Voice 1) - Frequency (2), Pulse Width (2), Control/Sync/Ring/Filter, AD, SR
- $D407-$D40D - SID (Voice 2) - Frequency (2), Pulse Width (2), Control/Sync/Ring/Filter, AD, SR
- $D40E-$D414 - SID (Voice 3) - Frequency (2), Pulse Width (2), Control/Sync/Sync/Ring/Filter, AD, SR
- $D415-$D418 - SID (Filter/Control) - Filter cutoff, resonance, mode, output control

## References
- "pwm_technique" — expands on PWM usage in Piano and Synth Lead examples
- "filter_modes" — expands on filter usage for snare and hand clap