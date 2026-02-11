# Sprite Priority / Multicolor (VIC-II) and SID Voice Registers (Voice 2/3 + Filter) — $D01B,$D01C,$D025-$D02E; $D409-$D418

**Summary:** VIC-II sprite priority and multicolor control registers ($D01B, $D01C, $D025-$D02E) control per-sprite foreground/background priority and multicolor mode (global multicolor registers vs per-sprite color). SID voice registers for Voice 2 and Voice 3 ($D409-$D414) and filter controls ($D415-$D418) define frequency, pulse width, waveform selection (VCREG), ADSR timings, and an 11-bit filter cutoff.

**Sprite priority and multicolor (VIC-II)**
- **$D01B** is the Sprite-to-Foreground Priority register: it contains one bit per sprite to select whether that sprite is rendered in front of or behind the foreground character/bitmap graphics. A bit value of 0 means the sprite appears in front of the background; a bit value of 1 means the sprite appears behind the background. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_144.html?utm_source=openai))
- **$D01C** is the Sprite Multicolor Control register: it contains one bit per sprite to enable that sprite's multicolor mode. When multicolor mode is enabled, a sprite's screen pixels are interpreted as 2-bit pairs (two pixels per source bit) rather than single bits.
- **Color source mapping in multicolor mode:** The 2-bit pixel values select among background/transparent, the two global sprite multicolor registers ($D025-$D026), and the sprite's own color register ($D027-$D02E). The mapping is as follows:
  - 00: Transparent (background)
  - 01: Color from Sprite Multicolor Register #1 ($D025)
  - 10: Color from the sprite's own color register ($D027-$D02E)
  - 11: Color from Sprite Multicolor Register #2 ($D026) ([commodore.ca](https://www.commodore.ca/manuals/c64_programmers_reference/c64-programmers_reference_guide-03-programming_graphics.pdf?utm_source=openai))
- **Sprite priority among sprites is fixed:** Lower-numbered sprites have higher priority (sprite 0 highest, sprite 7 lowest) when sprites overlap.
- **Related VIC-II sprite registers:** Sprite multicolor globals ($D025-$D026) and per-sprite color registers ($D027-$D02E).

**SID — Voice 2, Voice 3 and Filter controls**
- **Voice register groups:** Each voice has Frequency (low/high), Pulse width (low/high nybble), Control register (VCREG), Attack/Decay (ATDCY), Sustain/Release (SUREL).
- **VCREG (Control Register) bits (per voice):**
  - Bit 0: Gate — 1 = start attack/decay/sustain; 0 = start release
  - Bit 1: Sync — 1 = synchronize this oscillator to previous oscillator
  - Bit 2: Ring Modulation — 1 = ring-modulate this oscillator with previous
  - Bit 3: Test — 1 = disable oscillator (test)
  - Bit 4: Select triangle waveform
  - Bit 5: Select sawtooth waveform
  - Bit 6: Select pulse waveform
  - Bit 7: Select noise waveform
- **Attack/Decay register (ATDCY):** Bits 0-3 = decay cycle 0-15; bits 4-7 = attack cycle 0-15.
- **Sustain/Release register (SUREL):** Bits 0-3 = release cycle 0-15; bits 4-7 = sustain volume level 0-15.
- **Filter controls ($D415-$D418):** The filter cutoff frequency is represented as an 11-bit value (0–2047). The cutoff uses a low byte and three high bits (split between the low and high cutoff registers). The first two registers are used to select the filter cutoff frequency; their combined 11-bit value is used to determine low-pass/high-pass/band-pass/notch behavior as described in the source (12 dB/octave or 6 dB/octave attenuation rules).
  - **$D417 (Filter Resonance and Routing):**
    - Bits 0-2: Select which voices are routed through the filter:
      - Bit 0: 1 = Voice 1 filtered
      - Bit 1: 1 = Voice 2 filtered
      - Bit 2: 1 = Voice 3 filtered
    - Bit 3: 1 = External input filtered
    - Bits 4-7: Filter resonance control (4-bit value)
  - **$D418 (Filter Mode and Volume):**
    - Bits 0-3: Master volume control (0-15)
    - Bit 4: 1 = Low-pass filter enabled
    - Bit 5: 1 = Band-pass filter enabled
    - Bit 6: 1 = High-pass filter enabled
    - Bit 7: 1 = Voice 3 output disabled ([c64-wiki.com](https://www.c64-wiki.com/wiki/SID?utm_source=openai))
- **Filter cutoff frequency computation:** The 11-bit cutoff frequency value is calculated by combining the low byte ($D415) and the high byte ($D416). The formula to compute the actual frequency is:
  - Frequency = (Cutoff Value * 5.8) + 30 Hz
  - Where Cutoff Value is the combined 11-bit value from $D415 and $D416. ([cbmitapages.it](https://www.cbmitapages.it/c64/sid1eng.htm?utm_source=openai))

## Source Code
```text
VIC-II sprite registers (addresses of interest):
$D01B - Sprite-to-Foreground Priority register (1 bit per sprite)
$D01C - Sprite Multicolor Control register (1 bit per sprite)
$D025-$D026 - Sprite Multicolor Registers (global multicolor colors)
$D027-$D02E - Sprite Color Registers (one byte per sprite, sprite 0..7)

SID register listing (addresses and labels):
$D400  FRELO1    Voice 1 Frequency Control (low byte)
$D401  FREHI1    Voice 1 Frequency Control (high byte)
$D402  PWLO1     Voice 1 Pulse Waveform Width (low byte)
$D403  PWHI1     Voice 1 Pulse Waveform Width (high nybble)
$D404  VCREG1    Voice 1 Control Register
$D405  ATDCY1    Voice 1 Attack/Decay Register
$D406  SUREL1    Voice 1 Sustain/Release Control Register

$D407  FRELO2    Voice 2 Frequency Control (low byte)
$D408  FREHI2    Voice 2 Frequency Control (high byte)
$D409  PWLO2     Voice 2 Pulse Waveform Width (low byte)
$D40A  PWHI2     Voice 2 Pulse Waveform Width (high nybble)
$D40B  VCREG2    Voice 2 Control Register
         Bit 0: Gate (1=start attack/decay/sustain, 0=release)
         Bit 1: Sync  (sync oscillator with oscillator 1)
         Bit 2: Ring Modulation (ring mod with osc 1)
         Bit 3: Test (disable oscillator)
         Bit 4: Triangle waveform select
         Bit 5: Sawtooth waveform select
         Bit 6: Pulse waveform select
         Bit 7: Noise waveform select
$D40C  ATDCY2    Voice 2 Attack/Decay Register (bits 0-3 decay, 4-7 attack)
$D40D  SUREL2    Voice 2 Sustain/Release Register (bits 0-3 release, 4-7 sustain)

$D40E  FRELO3    Voice 3 Frequency Control (low byte)
$D40F  FREHI3    Voice 3 Frequency Control (high byte)
$D410  PWLO3     Voice 3 Pulse Waveform Width (low byte)
$D411  PWHI3     Voice 3 Pulse Waveform Width (high nybble)
$D412  VCREG3    Voice 3 Control Register
         Bit 0: Gate (1=start attack/decay/sustain, 0=release)
         Bit 1: Sync  (sync oscillator with oscillator 2)
         Bit 2: Ring Modulation (ring mod with osc 2)
         Bit 3: Test (disable oscillator)
         Bit 4: Triangle waveform select
         Bit 5: Sawtooth waveform select
         Bit 6: Pulse waveform select
         Bit 7: Noise waveform select
$D413  ATDCY3    Voice 3 Attack/Decay Register (bits 0-3 decay, 4-7 attack)
$D414  SUREL3    Voice 3 Sustain/Release Register (bits 0-3 release, 4-7 sustain)

$D415  FILTER_LO   Filter cutoff low byte (bits 0-7 = cutoff bits 0-7)
$D416  FILTER_HI   Filter cutoff high bits (bits 0-2 = cutoff bits 8-10)
$D417  FILTER_RES  Filter resonance / routing
         Bit 0: 1 = Voice 1 filtered
         Bit 1: 1 = Voice 2 filtered
         Bit 2: 1 = Voice 3 filtered
         Bit 3: 1 = External input filtered
         Bits 4-7: Filter resonance control (4-bit value)
$D418  FILTER_MODE Volume / filter enable / output control
         Bits 0-3: Master volume control (0-15)
         Bit 4: 1 = Low-pass filter enabled
         Bit 5: 1 = Band-pass filter enabled
         Bit 6: 1 = High-pass filter enabled
         Bit 7: 1 = Voice 3 output disabled

Notes:
- Cutoff frequency has 11-bit range (0..2047) made up of a high-byte and three low bits.
- Filter modes: low-pass, high-pass, band-pass, and combinations to form notch reject.
- Attenuation behavior: high/low-pass reduce by 12 dB per octave away; band-pass attenuates by 6 dB per octave.
```

## Key Registers
- $D000-$D02E - VIC-II - general VIC-II register range (sprite registers within)
- $D01B - VIC-II - Sprite-to-Foreground Priority (per-sprite bit)
- $D01C - VIC-II - Sprite Multicolor Control (per-sprite multicolor enable)
- $D025-$D026 - VIC-II - Sprite Multicolor Registers (global colors used by multicolor sprites)

## Labels
- D01B
- D01C
- D025
- D026
- VCREG2
- VCREG3
- FILTER_RES
- FILTER_MODE
