# SID Filter Cutoff Frequency (6581 / 8580)

**Summary:** Cutoff is an 11-bit value (0–2047) split across SID registers $D415 (low 3 bits) and $D416 (high 8 bits). CutoffValue = (HighByte << 3) | (LowByte & 0x07). Mapping to Hz differs between 6581 (non-linear, temperature dependent) and 8580 (more linear).

## Filter Cutoff Frequency
The filter cutoff is stored as an 11-bit integer spanning two SID registers:

- $D415 bits 2-0 — low 3 bits of cutoff
- $D416 bits 7-0 — high 8 bits of cutoff

Combine the bytes as:
CutoffValue = (HighByte << 3) | (LowByte & 0x07)

CutoffValue range: 0..2047.

Mapping to audible frequency (Hz) differs by SID revision:
- 6581:
  - Highly non-linear mapping and strong temperature dependence.
  - Approximate audible range: ~200 Hz (low register values) to ~12 kHz (high values).
  - The lowest ~256 register values produce almost no perceptible change.
  - Output frequency can drift with chip temperature (detuning).
- 8580:
  - Much more linear response across the register range.
  - Approximate audible range: ~30 Hz (low values) to ~12 kHz (high values).
  - Less sensitive to temperature; more stable tuning.

Because the mapping is revision-dependent, the same CutoffValue yields different cutoff frequencies on 6581 vs 8580. When precise frequency is required, calibrate empirically per-chip.

## Key Registers
- $D415-$D416 - SID - Filter cutoff low 3 bits ($D415 bits 2-0) and high 8 bits ($D416 bits 7-0), 11-bit cutoff value (0–2047)

## References
- "filter_overview" — routing voices through the filter
- "chip_variants_6581_8580" — differences in cutoff mapping between revisions