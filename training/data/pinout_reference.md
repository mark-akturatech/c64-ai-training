# SID 6581/8580 - Pinout Reference

**Summary:** Pinout and signal descriptions for the MOS 6581/8580 SID (28-pin DIP). Includes filter capacitor pins (CAP1A/B, CAP2A/B), paddle inputs (POT X/Y), control/address/data pins (PHI2, /RES, R/W, /CS, A0-A4, D0-D7), audio I/O (EXT IN, AUDIO OUT), and supply pins (Vcc, Vdd). Notes on CAP1A value differences between 6581 and 8580 are included.

**Pin descriptions**
- **CAP1A / CAP1B / CAP2A / CAP2B** — External filter capacitor connections used by the SID's internal analog filters. CAP1A is known to differ between chip variants (see table below); CAP values affect filter behavior and are revision-dependent.
- **/RES (Reset, active low)** — Hardware reset input.
- **PHI2** — System clock input (master clock).
- **R/W** — Read/Write control line for CPU data transfers.
- **/CS (Chip Select, active low)** — Enables SID on the bus when low.
- **A0–A4** — Address bus bits (select internal SID registers via A0..A4).
- **D0–D7** — 8-bit bidirectional data bus for register read/write.
- **GND** — Ground reference.
- **POT X / POT Y** — Analog paddle (potentiometer) inputs; used for paddle/joystick analog sensing.
- **Vcc** — +5V logic supply.
- **EXT IN** — External audio input (mixes into SID audio path / filters per internal routing).
- **AUDIO OUT** — Analog audio output; on 6581 specified with ~6VDC bias and up to 3 Vp-p max (subject to revision).
- **Vdd** — Additional supply for analog sections: +12V for 6581, +9V for 8580 (important for proper analog/filter operation).

## Source Code
```text
MOS 6581/8580 - 28-pin DIP package:

Pin  Name       Description
---  ---------  -----------------------------------------------
 1   CAP1A      Filter capacitor 1A (6581: 470pF, 8580: 22nF)
 2   CAP1B      Filter capacitor 1B (6581: 470pF, 8580: 22nF)
 3   CAP2A      Filter capacitor 2A (6581: 470pF, 8580: 22nF)
 4   CAP2B      Filter capacitor 2B (6581: 470pF, 8580: 22nF)
 5   /RES       Reset (active low)
 6   PHI2       System clock input
 7   R/W        Read/Write control
 8   /CS        Chip Select (active low)
 9   A0         Address bus bit 0
10   A1         Address bus bit 1
11   A2         Address bus bit 2
12   A3         Address bus bit 3
13   A4         Address bus bit 4
14   GND        Ground
15   D0         Data bus bit 0
16   D1         Data bus bit 1
17   D2         Data bus bit 2
18   D3         Data bus bit 3
19   D4         Data bus bit 4
20   D5         Data bus bit 5
21   D6         Data bus bit 6
22   D7         Data bus bit 7
23   POT Y      Paddle Y analog input
24   POT X      Paddle X analog input
25   Vcc        +5V supply
26   EXT IN     External audio input
27   AUDIO OUT  Audio output (6VDC bias, 3Vp-p max on 6581)
28   Vdd        +12V (6581) or +9V (8580)
```

```text
Internal Functional Diagram of SID 6581/8580:

          +-------------------+
          |                   |
          |   Oscillator 1     |
          |                   |
          +-------------------+
                    |
                    v
          +-------------------+
          |                   |
          |   Oscillator 2     |
          |                   |
          +-------------------+
                    |
                    v
          +-------------------+
          |                   |
          |   Oscillator 3     |
          |                   |
          +-------------------+
                    |
                    v
          +-------------------+
          |                   |
          |   Mixer           |
          |                   |
          +-------------------+
                    |
                    v
          +-------------------+
          |                   |
          |   Filter           |
          |                   |
          +-------------------+
                    |
                    v
          +-------------------+
          |                   |
          |   Amplifier        |
          |                   |
          +-------------------+
                    |
                    v
          +-------------------+
          |                   |
          |   AUDIO OUT        |
          |                   |
          +-------------------+
```

## References
- "filter_registers_and_modes_overview" — expands on EXT IN and filtering
- "chip_variants_6581_8580" — expands on CAP values used by different revisions