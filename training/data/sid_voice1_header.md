# SID REGISTER DESCRIPTION — VOICE 1: FREQ LO / FREQ HI (Registers $D400-$D401)

**Summary:** The SID (Sound Interface Device) chip, models 6581 and 8580, utilizes registers $D400 and $D401 to control the frequency of Voice 1. These registers store the low and high bytes, respectively, of a 16-bit frequency value that determines the pitch of the generated sound.

**Register Description**

The frequency of each voice in the SID is controlled by a 16-bit value split across two registers:

- **$D400 (FREQ LO):** Bits 0–7 (least significant byte)
- **$D401 (FREQ HI):** Bits 8–15 (most significant byte)

The combined 16-bit value sets the frequency of the oscillator for Voice 1.

**Frequency Calculation**

The output frequency (in Hertz) is calculated using the formula:

\[ f = \frac{f_{\text{clk}} \times F}{2^{24}} \]

Where:

- \( f \) is the output frequency in Hz
- \( f_{\text{clk}} \) is the system clock frequency
- \( F \) is the 16-bit frequency value from registers $D400 and $D401

For the Commodore 64:

- NTSC systems: \( f_{\text{clk}} = 1,022,727 \) Hz
- PAL systems: \( f_{\text{clk}} = 985,248 \) Hz

Therefore, the frequency resolution is approximately 0.06 Hz per step.

**Writing to Frequency Registers**

To update the frequency of Voice 1, both the low and high byte registers should be written to. It's important to write to the low byte ($D400) first, followed by the high byte ($D401), to ensure the 16-bit value is updated correctly.

Example in assembly language:


This sequence ensures that the frequency value is updated atomically, preventing glitches in the output sound.

**Hardware Differences Between 6581 and 8580**

The 6581 and 8580 versions of the SID chip have differences in their internal design, particularly in the filter section. However, the handling of frequency registers and the calculation of output frequency remain consistent between the two models.

## Source Code

```assembly
    LDA #<FREQ_VALUE  ; Load low byte of desired frequency
    STA $D400         ; Store in FREQ LO register
    LDA #>FREQ_VALUE  ; Load high byte of desired frequency
    STA $D401         ; Store in FREQ HI register
```


## References

- Commodore 64 Programmer's Reference Guide
- MOS 6581 SID Datasheet

## Labels
- VOICE1_FREQ_LO
- VOICE1_FREQ_HI
