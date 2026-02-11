# $D417 — RESON (Filter Resonance Control Register)

**Summary:** $D417 (54295) — SID filter routing and resonance control. Bits 0-3 route voice1/voice2/voice3/external input through the SID filter; bits 4-7 set filter resonance 0–15 (0 = none, 15 = max).

## Description
Bits 0–3 select which audio sources are processed by the SID filter: set a bit to 1 to route that source through the filter, clear it to bypass the filter and send the voice directly to the audio output. Bit assignments:
- Bit 0 — voice 1 through filter if set.
- Bit 1 — voice 2 through filter if set.
- Bit 2 — voice 3 through filter if set.
- Bit 3 — external audio input (Audio/Video port pin 5) through filter if set.

Bits 4–7 contain a 4-bit resonance value (0–15). Increasing these bits raises the resonance (peaking) near the filter cutoff frequency, creating a sharper filtering effect; 0 disables resonance, 15 sets maximum resonance.

This register is part of the SID filter control set and works in conjunction with other filter selection and volume registers (see $D418 for global volume/filter select).

## Source Code
```text
$D417        RESON        Filter Resonance Control Register

                     0    Filter the output of voice 1?  1=yes
                     1    Filter the output of voice 2?  1=yes
                     2    Filter the output of voice 3?  1=yes
                     3    Filter the output from the external input?  1=yes
                     4-7  Select filter resonance 0-15

                          Bits 0-3 are used to control which of the voices will be altered by
                          the filters.  If one of these bits is set to 1, the corresponding
                          voice will be processed through the filter, and its harmonic content
                          will be changed accordingly.  If the bit is set to 0, the voice will
                          pass directly to the audio output.  Note that there is also a
                          provision for processing an external audio signal which is brought
                          through pin 5 of the Audio/Video Port.

                          Bits 4-7 control the resonance of the filter.  By placing a number
                          from 0 to 15 in these four bits, you may peak the volume of those
                          frequencies nearest the cutoff.  This creates an even sharper
                          filtering effect.  A setting of 0 causes no resonance, while a setting
                          of 15 gives maximum resonance.
```

## Key Registers
- $D417 - SID - Filter Resonance Control Register (route voices/external through filter; resonance 0–15)

## References
- "sid_filter_controls_overview" — expands on filter routing and resonance relationships
- "d418_sigvol_volume_and_filter_select" — expands on global volume and filter selection

## Labels
- RESON
