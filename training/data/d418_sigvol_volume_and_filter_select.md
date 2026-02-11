# $D418 SIGVOL — Global Volume & Filter Select (54296)

**Summary:** $D418 (54296) SIGVOL — SID register for global output volume (bits 0-3), filter type select (bits 4-6), and voice output disconnect (bit 7). Searchable terms: $D418, SIGVOL, SID, global volume, low-pass, band-pass, high-pass, voice disconnect.

## Description
$D418 is the SID (Sound Interface Device) Global Volume & Filter Select register.

Bit layout:
- Bits 0-3: Output volume (0..15). Controls the combined volume of all SID outputs; at least one non-zero value is required for any audio to be heard.
- Bit 4: Low-pass filter enable (1 = low-pass on).
- Bit 5: Band-pass filter enable (1 = band-pass on).
- Bit 6: High-pass filter enable (1 = high-pass on).
- Bit 7: Disconnect output of voice (used to mute one voice while allowing its oscillator for modulation). Source text is inconsistent about which voice: see note below.

Behavior and notes:
- Volume (bits 0-3) is a global output level applied to the SID outputs (0 = silent, 15 = max).
- Filter selection (bits 4-6): setting one or more of these bits routes the combined selected voices through the corresponding filter type(s). Filters can be combined (multiple bits set), though there is a single filter cutoff frequency; voice routing into the filter is controlled separately by the Filter Resonance Control register ($D417 / 54295).
- Bit 7 disconnects a voice's audio output so its oscillator can be used for modulation or other purposes without producing audible output.

**[Note: Source may contain an error — the one-line register summary lists "Disconnect output of voice 4, 1=voice 3 off", while the descriptive text says "disconnects the output of voice 3." The intended behavior is to disconnect voice 3's output (commonly documented), but the source is inconsistent.]**

## Key Registers
- $D418 - SID - Global Volume & Filter Select register (bits 0-7: volume, low-/band-/high-pass selects, voice disconnect)

## References
- "d417_resonance_control" — Route voices to filter via D417 then select filter type via D418

## Labels
- SIGVOL
