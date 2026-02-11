# SID Frequency Calculation (6581/8580)

**Summary:** Frequency formula and inverse for the SID 16-bit frequency register (Fn) using system clock Fclk (PAL 985248 Hz, NTSC 1022727 Hz). Includes formulas for Fout and Fn and example minimum/maximum frequencies; related register bytes at $D400/$D401 (Voice 1).

## Frequency calculation
The SID oscillator output frequency Fout is proportional to the 16-bit frequency register value Fn and the system clock Fclk:

Fout = (Fn * Fclk) / 16777216

Where:
- Fn = 16-bit frequency register value (0–65535)
- Fclk = System clock frequency
  - PAL:  985248 Hz
  - NTSC: 1022727 Hz
- Fout = Output frequency in Hz

Solving for Fn (to compute the register value needed for a desired output frequency):

Fn = (Fout * 16777216) / Fclk

Numeric conversion forms from the source constants:
- PAL:  Fn = Fout / 0.058725  = Fout * 17.028
- NTSC: Fn = Fout / 0.060959  = Fout * 16.404

Examples from the source (using Fn extremes):
- Minimum frequency (Fn = 1)
  - PAL:  0.0587 Hz
  - NTSC: 0.0610 Hz
- Maximum frequency (Fn = 65535)
  - PAL:  3848.4 Hz  (approximately; audible harmonics extend higher)
  - NTSC: 3995.2 Hz

Notes:
- Fn is a 16-bit value written as low/high bytes to the SID voice frequency registers (see $D400/$D401 for Voice 1).
- The formulas above use integer 24-bit scale factor 16777216 = 2^24 (SID internal phase-accumulator scaling).

## Key Registers
- $D400-$D401 - SID - Voice 1 frequency low / frequency high (16-bit Fn)

## References
- "note_frequency_table_pal" — PAL Fn table and A4=440Hz example
- "voice1_registers" — writing frequency low/high bytes ($D400/$D401)