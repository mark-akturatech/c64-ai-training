# SID mirror area ($D41D-$D7FF)

**Summary:** The C64 memory range $D41D-$D7FF contains mirror images of the SID registers (SID = $D400 base); these register images repeat every $20 bytes (32 bytes), providing mirrored access to the SID voice and filter/master-volume registers.

**Mirror area details**

This chunk documents the SID mirror region reported on sta.c64.org: addresses in $D41D-$D7FF hold repeated copies (images) of the SID hardware registers. The images are periodic with a period of $20 bytes (hex), i.e., the same set of SID register images appears at 32-byte intervals throughout this range.

The canonical SID register block is at $D400 (see Key Registers below). The mirror area does not define new registers—it provides alias/mirrored addresses that map to the SID register images. For exact filter/master-volume register original locations and bit-level definitions, see the referenced "sid_filter_registers" chunk.

**Address Mapping Examples:**

- Address $D41D maps to $D41D - $20 = $D3FD, which is outside the SID register range.
- Address $D420 maps to $D420 - $20 = $D400, corresponding to the first SID register.
- Address $D43F maps to $D43F - $20 = $D41F, corresponding to the last SID register.

This pattern repeats every $20 bytes up to $D7FF.

**Bit-Level Register Maps:**

The SID registers are defined as follows:

- **Voice 1 Registers:**
  - $D400: Frequency Control Low Byte
  - $D401: Frequency Control High Byte
  - $D402: Pulse Width Low Byte
  - $D403: Pulse Width High Byte
  - $D404: Control Register
    - Bit 7: Noise Waveform Enable
    - Bit 6: Pulse Waveform Enable
    - Bit 5: Sawtooth Waveform Enable
    - Bit 4: Triangle Waveform Enable
    - Bit 3: Test Bit
    - Bit 2: Ring Modulation Enable
    - Bit 1: Synchronization Enable
    - Bit 0: Gate Bit
  - $D405: Attack/Decay
    - Bits 7-4: Attack Duration
    - Bits 3-0: Decay Duration
  - $D406: Sustain/Release
    - Bits 7-4: Sustain Level
    - Bits 3-0: Release Duration

- **Voice 2 Registers:**
  - $D407-$D40D: Same as Voice 1

- **Voice 3 Registers:**
  - $D40E-$D414: Same as Voice 1

- **Filter and Volume Control:**
  - $D415: Filter Cutoff Frequency Low Byte
  - $D416: Filter Cutoff Frequency High Byte
  - $D417: Filter Control
    - Bits 7-4: Filter Resonance
    - Bit 3: External Input Filter Enable
    - Bit 2: Voice 3 Filter Enable
    - Bit 1: Voice 2 Filter Enable
    - Bit 0: Voice 1 Filter Enable
  - $D418: Volume and Filter Mode
    - Bits 7-4: Filter Mode Selection
      - Bit 7: Voice 3 Off
      - Bit 6: High-Pass Filter Enable
      - Bit 5: Band-Pass Filter Enable
      - Bit 4: Low-Pass Filter Enable
    - Bits 3-0: Volume Control (0-15)

**Mirror Range Clarification:**

The entire $D400-$D418 block is mirrored throughout the $D41D-$D7FF range. This includes all voice and filter/master-volume registers. The mirroring occurs every $20 bytes, meaning each 32-byte block within $D41D-$D7FF corresponds directly to the $D400-$D418 range.

## Source Code

```text
SID Register Block Diagram:

+----------------+----------------+----------------+----------------+
| Voice 1        | Voice 2        | Voice 3        | Filter/Volume  |
+----------------+----------------+----------------+----------------+
| $D400-$D406    | $D407-$D40D    | $D40E-$D414    | $D415-$D418    |
+----------------+----------------+----------------+----------------+

SID Register Mirroring:

Base Address: $D400
Mirror Start: $D41D
Mirror End:   $D7FF
Mirror Period: $20 bytes (32 bytes)

Example Mapping:
Mirror Address: $D41D
Base Offset:    $D41D - $D400 = $1D
Mapped Address: $D400 + ($1D % $20) = $D41D

Mirror Address: $D420
Base Offset:    $D420 - $D400 = $20
Mapped Address: $D400 + ($20 % $20) = $D400

Mirror Address: $D43F
Base Offset:    $D43F - $D400 = $3F
Mapped Address: $D400 + ($3F % $20) = $D41F
```

## Key Registers

- $D400-$D418 - SID - Voice and filter/master-volume registers (Voice 1: $D400-$D406, Voice 2: $D407-$D40D, Voice 3: $D40E-$D414, Filter/Master: $D415-$D418)
- $D41D-$D4FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)
- $D500-$D5FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)
- $D600-$D6FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)
- $D700-$D7FF - SID - mirror images of $D400-$D41F (repeated every $20 bytes)

## References

- "sid_filter_registers" — expands on filter/master-volume original locations and register details