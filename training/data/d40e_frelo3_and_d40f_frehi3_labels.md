# SID Voice 3 Frequency Control — $D40E / $D40F

**Summary:** SID (MOS6581/8580) Voice 3 16-bit frequency registers at $D40E (FRELO3, low byte) and $D40F (FREHI3, high byte). Little-endian 16-bit frequency value used by the voice oscillator; frequency in Hz = FREQ * CLOCK / 2^24 (clock depends on PAL/NTSC SID crystal).

## Description
$D40E (FRELO3) and $D40F (FREHI3) together form the 16-bit frequency control value for SID voice 3. The register pair is little-endian: the low byte is written to $D40E and the high byte to $D40F to form the full 16-bit word (0x0000–0xFFFF). The 16-bit value is used by the SID’s phase-accumulator oscillator (24-bit internal accumulator), so the audible frequency is proportional to the 16-bit register value scaled by the SID master clock divided by 2^24.

Formula:
Frequency (Hz) = FREQ_register * Clock / 2^24

Typical clock constants:
- PAL SID clock ≈ 985248 Hz (use for PAL machines)
- NTSC SID clock ≈ 1022727 Hz (use for NTSC machines)

Examples:
- FREQ = 0 produces 0 Hz (no oscillator increment).
- For a given FREQ value, compute Hz with the formula above (e.g., FREQ = 0x8800 → decimal 34816; on PAL: f ≈ 34816 * 985248 / 16777216 ≈ 2046 Hz).

Behavior notes:
- The register pair is treated as a single 16-bit control; writing only the low or high byte will temporarily change the value until both bytes are set.
- The SID’s oscillator uses a 24-bit phase accumulator; therefore the 16-bit register is effectively shifted within that accumulator — this is why the denominator is 2^24 in the frequency formula.

## Source Code
```text
Register map excerpt:
$D40E        FRELO3       Voice 3 Frequency Control (low byte)
$D40F        FREHI3       Voice 3 Frequency Control (high byte)
```

```asm
; Example: set Voice 3 frequency to $1234 (little-endian)
LDA #$34
STA $D40E      ; FRELO3 = low byte
LDA #$12
STA $D40F      ; FREHI3 = high byte
```

```text
Formula reference:
Frequency(Hz) = (FREQ_16bit) * SID_Clock / 16777216   ; 16777216 = 2^24
Typical SID_Clock values:
  PAL  = 985248 Hz
  NTSC = 1022727 Hz
```

## Key Registers
- $D40E-$D40F - SID - Voice 3 frequency low byte / high byte (16-bit little-endian)

## References
- "voice3_registers_list" — expands on Voice 3 other registers & control