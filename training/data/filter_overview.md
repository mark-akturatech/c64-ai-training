# SID Filter (Overview)

**Summary:** SID (6581/8580) contains a single multi-mode resonant filter shared by all three voices and the external audio input; per-voice routing is controlled by bits 0–2 of $D417 and voices not routed bypass the filter and go straight to the mixer. Searchable terms: SID, filter, $D417, $D415-$D418, voice routing, mixer.

## Filter Overview
The SID implements one multi-mode resonant filter that can operate on any combination of the three internal voices plus the external audio input. Routing is done per-voice using the low three bits of the filter control/register at $D417: each voice may be enabled to pass through the filter or left to bypass it. Audio from voices not routed through the filter is mixed directly into the SID output mixer.

The filter is shared (single instance) — multiple voices enabled into the filter are summed and processed together (including the external input when enabled). Mode selection, cutoff frequency, and resonance are controlled by the filter register block ($D415–$D418), with $D417 specifically containing the per-voice routing bits (bits 0–2).

## Key Registers
- $D415-$D418 - SID - Filter registers (mode, cutoff, resonance, and routing; $D417 bits 0-2 enable per-voice routing through the filter)

## References
- "filter_modes" — expands on LP/BP/HP and combinations
- "filter_registers_and_modes_overview" — expands on register locations $D415-$D418
