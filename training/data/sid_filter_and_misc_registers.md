# SID: Filter, A/D converters, RNG and Envelope (Registers $D415–$D41C)

**Summary:** SID registers $D415–$D41C control the filter cutoff (low nybble and high byte), resonance and voice/input routing ($D417), filter mode and output volume ($D418), two analog-to-digital paddle converters ($D419/$D41A), Oscillator 3 random number generator ($D41B) and Envelope Generator 3 output ($D41C). Contains bit assignments and register descriptions for SID filter and miscellaneous outputs.

## Description
This chunk documents the SID (6581/8580) registers from $D415 through $D41C.

- Filter cutoff is formed by a low nybble in $D415 (bits 2–0) combined with the high byte in $D416 to produce the full cutoff value (standard SID implementation: an 11-bit cutoff value, 0–2047).
- $D417 holds the 4-bit filter resonance (bits 7–4, value 0–15) and routing/input enable bits:
  - Bit 3 enables the external filter input.
  - Bits 2–0 gate each voice into the filter: bit 2 = Voice 3, bit 1 = Voice 2, bit 0 = Voice 1.
- $D418 selects filter mode and output volume:
  - Bit 6 = High-pass enable, bit 5 = Band-pass enable, bit 4 = Low-pass enable (modes may be combined depending on hardware behavior).
  - Bit 7 can disable Voice 3 output to the cutoff (document lists as "Cut-Off Voice 3 Output: 1 = Off, 0 = On").
  - Bits 3–0 select output volume (0–15).
- $D419 and $D41A are the analog-to-digital converter results for game paddle 1 and 2 respectively (0–255).
- $D41B reads the Oscillator 3 Random Number Generator output (typically an 8-bit value).
- $D41C supplies the Envelope Generator 3 output (typically an 8-bit value, 0–255).

**[Note: Source may contain an error — the decimal value shown for $D41C is incorrect in the original table (listed as 54230). The correct decimal for $D41C is 54300.]**

## Source Code
```text
HEX      DECIMAL        BITS                 DESCRIPTION
-------------------------------------------------------------------------

D415       54293                 Filter Cutoff Frequency: Low-Nybble
                                    (Bits 2-0)

D416       54294                 Filter Cutoff Frequency: High-Byte

D417       54295                 Filter Resonance Control / Voice Input
                                    Control
                          7-4    Select Filter Resonance: 0-15
                          3      Filter External Input: 1 = Yes, 0 = No
                          2      Filter Voice 3 Output: 1 = Yes, 0 = No
                          1      Filter Voice 2 Output: 1 = Yes, 0 = No
                          0      Filter Voice 1 Output: 1 = Yes, 0 = No

D418       54296                 Select Filter Mode and Volume
                          7      Cut-Off Voice 3 Output: 1 = Off, 0 = On
                          6      Select Filter High-Pass Mode: 1 = On
                          5      Select Filter Band-Pass Mode: 1 = On
                          4      Select Filter Low-Pass Mode: 1 = On
                          3-0    Select Output Volume: 0-15

D419       54297                 Analog/Digital Converter: Game Paddle 1
                                    (0-255)

D41A       54298                 Analog/Digital Converter: Game Paddle 2
                                    (0-255)

D41B       54299                 Oscillator 3 Random Number Generator

D41C       54230                 Envelope Generator 3 Output
```
**[Original table note: the decimal value for D41C above appears incorrect; expected decimal for $D41C is 54300.]**

## Key Registers
- $D415-$D41C - SID - Filter cutoff (low nybble + high byte), resonance/router, filter mode & volume, A/D converters for paddles, Osc 3 RNG, Env 3 output

## References
- "sid_overview_and_voice1_registers" — SID device overview and Voice 1 registers (D400–D406)
- "voice2_registers_and_envelopes" — Voice 2 registers and envelopes (D407–D40D)
- "voice3_registers_and_envelopes" — Voice 3 registers and envelopes (D40E–D414)

## Labels
- D415
- D416
- D417
- D418
- D419
- D41A
- D41B
- D41C
