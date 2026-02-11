# SID & CIA #1 (partial) — ADSR, Filter, Paddle, Color RAM, CIA Data Direction Registers

**Summary:** This section details the SID register group from $D405 to $D41C, covering Voice 1 ADSR ($D405-$D406), Voice 2/3 mirrors ($D407-$D414), Filter and volume/select ($D415-$D418), and paddle/random/ENV3 registers ($D419-$D41C). It also introduces Color RAM at $D800 and provides a focused description of CIA #1 Data Direction Registers A/B at $DC02-$DC03 (CIDDRA/CIDDRB).

**SID Registers Overview**

This section outlines the SID register regions and their functions:

- **Voice 1 ADSR Registers:** $D405-$D406
  - **Attack/Decay ($D405):** 
    - Bits 4-7: Attack duration (0-15)
    - Bits 0-3: Decay duration (0-15)
  - **Sustain/Release ($D406):**
    - Bits 4-7: Sustain level (0-15)
    - Bits 0-3: Release duration (0-15)

  The ADSR envelope controls the amplitude characteristics of the sound. The following table provides the approximate times for each setting:

  | Value | Attack Time | Decay Time | Release Time |
  |-------|-------------|------------|--------------|
  | 0     | 2 ms        | 6 ms       | 6 ms         |
  | 1     | 8 ms        | 24 ms      | 24 ms        |
  | 2     | 16 ms       | 48 ms      | 48 ms        |
  | 3     | 24 ms       | 72 ms      | 72 ms        |
  | 4     | 38 ms       | 114 ms     | 114 ms       |
  | 5     | 56 ms       | 168 ms     | 168 ms       |
  | 6     | 68 ms       | 204 ms     | 204 ms       |
  | 7     | 80 ms       | 240 ms     | 240 ms       |
  | 8     | 100 ms      | 0.3 s      | 0.3 s        |
  | 9     | 0.25 s      | 0.75 s     | 0.75 s       |
  | 10    | 0.5 s       | 1.5 s      | 1.5 s        |
  | 11    | 0.8 s       | 2.4 s      | 2.4 s        |
  | 12    | 1 s         | 3 s        | 3 s          |
  | 13    | 3 s         | 9 s        | 9 s          |
  | 14    | 5 s         | 15 s       | 15 s         |
  | 15    | 8 s         | 24 s       | 24 s         |

  *Note: These times are approximate and can vary based on system clock variations.* ([c64-wiki.com](https://www.c64-wiki.com/wiki/ADSR?utm_source=openai))

- **Voices 2 and 3:** Mirror Voice 1 controls at $D407-$D414.

- **Filter Controls:** $D415-$D418
  - **Cutoff Frequency Low Byte ($D415):** Bits 0-7 of the 11-bit cutoff frequency.
  - **Cutoff Frequency High Byte ($D416):** Bits 0-2 of the 11-bit cutoff frequency.
  - **Filter Resonance and Routing ($D417):**
    - Bits 4-7: Filter resonance (0-15)
    - Bit 3: External input filter enable (1 = on)
    - Bit 2: Voice 3 filter enable (1 = on)
    - Bit 1: Voice 2 filter enable (1 = on)
    - Bit 0: Voice 1 filter enable (1 = on)
  - **Filter Mode and Volume ($D418):**
    - Bits 4-6: Filter mode selection
      - Bit 4: Low-pass filter enable (1 = on)
      - Bit 5: Band-pass filter enable (1 = on)
      - Bit 6: High-pass filter enable (1 = on)
    - Bit 7: Voice 3 output disable (1 = off)
    - Bits 0-3: Master volume (0-15)

  *Note: The cutoff frequency is determined by combining the 11 bits from $D415 and $D416, allowing a range from 0 to 2047.* ([sidmusic.org](https://www.sidmusic.org/sid/sidtech2.html?utm_source=openai))

- **Paddle Inputs and Random/ENV3 Registers:** $D419-$D41C
  - **Paddle X ($D419):** Read-only; returns the position of paddle 1.
  - **Paddle Y ($D41A):** Read-only; returns the position of paddle 2.
  - **Voice 3 Oscillator Output ($D41B):** Read-only; provides the current output of oscillator 3.
  - **Voice 3 Envelope Output ($D41C):** Read-only; provides the current envelope output of voice 3.

  *Note: Paddle inputs return values between 0 and 255, corresponding to the position of the paddle controllers.* ([sidmusic.org](https://www.sidmusic.org/sid/sidtech2.html?utm_source=openai))

- **Color RAM:** Starting at $D800
  - **Size:** 1 KB
  - **Function:** Stores color information for screen characters.
  - **Addressing:** Each byte corresponds to a character position on the screen, determining its color.

  *Note: The Color RAM allows for individual color assignment to each character cell on the screen.* ([c64-wiki.com](https://www.c64-wiki.com/wiki/Standard_Bitmap_Mode?utm_source=openai))

**CIA #1 Data Direction Registers (CIDDRA / CIDDRB)**

- **Location:** $DC02-$DC03 (decimal 56322-56323)
- **Purpose:** Each Data Direction Register controls the direction (input or output) of the corresponding Data Port (A/B). A bit value of 1 configures the corresponding port bit as output; a value of 0 configures it as input.
- **Typical Use on the C64:** Data Port A outputs the keyboard column strobe, while Data Port B reads the keyboard row. The default settings are:
  - **CIDDRA ($DC02):** %11111111 (255, all outputs)
  - **CIDDRB ($DC03):** %00000000 (0, all inputs)
- **Example:** If bit 7 of CIDDRA is 0, bit 7 of Data Port A is set as input; if set to 1, bit 7 of Data Port A is set as output.

## Source Code

```text
56322         $DC02          CIDDRA
Data Direction Register A

Bit 0:  Select Bit 0 of Data Port A for input or output (0=input, 1=output)
Bit 1:  Select Bit 1 of Data Port A for input or output (0=input, 1=output)
Bit 2:  Select Bit 2 of Data Port A for input or output (0=input, 1=output)
Bit 3:  Select Bit 3 of Data Port A for input or output (0=input, 1=output)
Bit 4:  Select Bit 4 of Data Port A for input or output (0=input, 1=output)
Bit 5:  Select Bit 5 of Data Port A for input or output (0=input, 1=output)
Bit 6:  Select Bit 6 of Data Port A for input or output (0=input, 1=output)
Bit 7:  Select Bit 7 of Data Port A for input or output (0=input, 1=output)

Defaults:
- Data Direction Register A (CIDDRA, $DC02) default = 255 (all outputs)
- Data Direction Register B (CIDDRB, $DC03) default = 0   (all inputs)

Notes:
- The Data Direction Register bits correspond one-to-one with the bits of their respective Data Ports (Port A / Port B).
- Typical keyboard scanning: write keyboard column to Data Port A (configured as outputs via CIDDRA), read rows from Data Port B (configured as inputs via CIDDRB).
```

## Key Registers

- **$D400-$D41C:** SID - Voice 1-3 frequency/pulse/control, ADSR ($D405-$D406), Voice 2/3 mirror ($D407-$D414), Filter and volume ($D415-$D418), paddle/random/ENV3 ($D419-$D41C)
- **$D800-$DBFF:** Color RAM - Screen character color bytes (1 KB color RAM region starting at $D800)
- **$DC00-$DC0F:** CIA 1 - Keyboard/joystick I/O, timers, data ports (including Data Direction Registers $DC02-$DC03)

## References

- "sid_voice1_frequency_pulse_and_control_$D400-$D404" — Expands on Voice controls and ADSR interaction
- "color_ram_and_color_mapping" — Expands on Color RAM follows SID block in memory map
- "cia_1_registers_and_keyboard_matrix" — Expands on CIA #1 at $DC00 handles keyboard/joystick I/O

## Labels
- CIDDRA
- CIDDRB
