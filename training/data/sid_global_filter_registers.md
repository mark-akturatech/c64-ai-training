# SID Global Filter Registers (FLCNLO, FLCNHI, MODVOL, RESFLT)

**Summary:** The SID filter registers at addresses $D415–$D418 control the 11-bit filter cutoff frequency (low and high parts), global filter mode and master volume (MODVOL), and resonance plus per-voice filter enables (RESFLT) for all three SID voices.

**Description**

These four SID registers affect all three voice channels, serving as the global voltage-controlled filter (VCF) controls:

- **FLCNLO (Filter Cutoff Low) – $D415:** Contains the least-significant 3 bits of the 11-bit filter cutoff value. Only bits 0–2 are used; the remaining bits in the byte are ignored. The full 11-bit cutoff is formed by concatenating FLCNHI (high 8 bits) with FLCNLO (low 3 bits): `cutoff = (FLCNHI << 3) | (FLCNLO & 7)`.

- **FLCNHI (Filter Cutoff High) – $D416:** Contains the high-order 8 bits of the 11-bit filter cutoff frequency value. Combined with FLCNLO, this selects the filter cutoff point used by the SID VCF.

- **RESFLT (Resonance and Filter Enables) – $D417:** Contains the resonance setting for the VCF and the per-voice filter-enable flags, which route each voice into the filter.

  - **Bit 7–4:** Resonance control (4 bits).

    - Bit 7 is the most significant bit (MSB), and bit 4 is the least significant bit (LSB).

    - Resonance value range: 0 (minimum) to 15 (maximum).

  - **Bit 3:** Filter enable for Voice 3.

  - **Bit 2:** Filter enable for Voice 2.

  - **Bit 1:** Filter enable for Voice 1.

  - **Bit 0:** Filter enable for external input.

- **MODVOL (Mode/Volume) – $D418:** Holds the filter mode bits and the master (global) output volume.

  - **Bit 7:** Filter mode: High-pass enable.

  - **Bit 6:** Filter mode: Band-pass enable.

  - **Bit 5:** Filter mode: Low-pass enable.

  - **Bit 4:** Not used.

  - **Bit 3–0:** Master volume control (4 bits).

    - Volume value range: 0 (minimum) to 15 (maximum).

These registers are global to the SID chip; they are not repeated per voice. Changing them alters the filter cutoff, mode, volume, or resonance for all voices simultaneously.

**Example Usage:**

- **Cutoff Frequency:** The 11-bit cutoff value ranges from 0 to 2047. This corresponds to a frequency range of approximately 30 Hz to 12 kHz. For example, setting FLCNHI to $10 and FLCNLO to $4 would result in a cutoff value of `(0x10 << 3) | (0x04 & 7) = 0x80 | 0x04 = 0x84`, which corresponds to a specific cutoff frequency within the filter's range.

- **Resonance:** Setting the resonance bits in RESFLT to higher values increases the emphasis around the cutoff frequency, making the filter effect more pronounced. For instance, setting bits 7–4 to 1111 (binary) or $F (hex) maximizes resonance.

- **Filter Modes:** To enable a low-pass filter with maximum volume, set MODVOL to %00010000 (binary) or $10 (hex). To enable both low-pass and high-pass filters simultaneously (resulting in a notch filter effect) with a volume of 10, set MODVOL to %10110010 (binary) or $B2 (hex).

**Differences Between 6581 and 8580:**

- **Filter Characteristics:** The 6581 and 8580 SID chips have different filter implementations. The 6581's filter is known for its variability and non-linearity, leading to a distinctive, sometimes unpredictable sound. The 8580 features a more accurate and stable filter design, closely matching the intended specifications.

- **Resonance Handling:** The 6581's resonance control is less pronounced and can vary between chips due to manufacturing inconsistencies. The 8580 provides a more consistent and stronger resonance effect.

These differences mean that music and sound effects may sound different when played on a 6581 versus an 8580, especially those relying heavily on filter effects.

## Key Registers

- **$D415 – SID – Filter Cutoff Low (FLCNLO):** Low 3 bits of the 11-bit cutoff frequency.

- **$D416 – SID – Filter Cutoff High (FLCNHI):** High 8 bits of the 11-bit cutoff frequency.

- **$D417 – SID – Resonance and Filter Enables (RESFLT):** Resonance control and per-voice filter enables.

- **$D418 – SID – Filter Mode and Volume (MODVOL):** Filter mode selection and master volume control.

## References

- "Commodore 64 Programmer's Reference Guide"

- "MOS 6581 SID Datasheet"

## Labels
- FLCNLO
- FLCNHI
- RESFLT
- MODVOL
