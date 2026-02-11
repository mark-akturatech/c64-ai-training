# SID Filter Registers ($D415-$D418)

**Summary:** SID filter registers at $D415-$D418 (SID chip, base $D400) control the 11-bit filter cutoff (bits 0-10), filter routing/resonance, and master volume/filter mode; all four registers are write-only.

**Register Overview**

The SID filter cutoff is an 11-bit value split across two write-only registers:
- $D415 contains cutoff bits 0-2 (low 3 bits).
- $D416 contains cutoff bits 3-10 (high 8 bits).
Together, these form the full 11-bit cutoff frequency (bit 0 = LSB, bit 10 = MSB).

$D417 is the Filter Control register — it selects which voices are routed to the filter and sets resonance/related filter controls (write-only).  
$D418 is the Master Volume / Filter Mode register (write-only) — controls global output level and filter modes/routing modes.

Practical write pattern (11-bit cutoff value):
- cutoff_low = cutoff_value & %00000111  ; write to $D415
- cutoff_high = (cutoff_value >> 3) & %11111111 ; write to $D416

**Bit-Level Layout**

**$D417 - Filter Control Register:**

- **Bits 0-2:** Voice filter routing
  - Bit 0: Voice 1 filter enable (1 = routed through filter)
  - Bit 1: Voice 2 filter enable (1 = routed through filter)
  - Bit 2: Voice 3 filter enable (1 = routed through filter)
- **Bits 3-6:** Unused (read as 0)
- **Bits 4-7:** Filter resonance control
  - Bits 4-7: Resonance control (0000 = minimum, 1111 = maximum)

**$D418 - Master Volume / Filter Mode Register:**

- **Bits 0-3:** Master volume control
  - Bits 0-3: Volume level (0000 = minimum, 1111 = maximum)
- **Bit 4:** Low-pass filter enable (1 = enabled)
- **Bit 5:** Band-pass filter enable (1 = enabled)
- **Bit 6:** High-pass filter enable (1 = enabled)
- **Bit 7:** Voice 3 off (1 = disable voice 3 output)

**Read Behavior and Side Effects**

All four registers ($D415-$D418) are write-only. Reading from these registers does not return meaningful data and should be avoided. Writing to these registers directly affects the SID's filter and volume settings without any read-back capability.

## Source Code

```text
Filter ($D415-$D418):

$D415   Filter Cutoff L         Filter frequency bits 0-2 (write-only)
$D416   Filter Cutoff H         Filter frequency bits 3-10 (write-only)
$D417   Filter Control          Voice routing and resonance (write-only)
$D418   Volume/Filter           Master volume and filter modes (write-only)
```

## Key Registers

- $D415-$D418 - SID - Filter cutoff (11-bit), filter control (voice routing/resonance), master volume/filter mode (write-only)

## References

- "sid_registers_voice1" — expands on voices routed to filter via $D417
- Commodore 64 Programmer's Reference Guide
- MOS 6581 SID Datasheet