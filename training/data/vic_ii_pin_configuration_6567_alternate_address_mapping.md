# VIC-II (6567) Pin Configuration — Alternate Address Labeling (Pins 1–40)

**Summary:** Pinout for the Second VIC‑II (6567) showing signal assignments for pins 1–40 with alternate/multiplexed address labeling (A0..A13 on right-side pins). Searchable terms: 6567, pinout, A0..A13, D0..D11, /IRQ, AEC, PH0, Vcc, Vss.

## Pinout Overview
This diagram is a complete 40‑pin DIP pin configuration for the 6567 (VIC‑II) with the address lines arranged on the right side. Key facts preserved from the source:

- Right-side pins 21–34 are the address lines A0..A13 (A0 = pin 21, A13 = pin 34).
- Right-side pins 35–39 carry higher data bits D11..D7 (D11 = pin 35, D7 = pin 39). Pin 40 is Vcc.
- Left-side pins 1–7 carry lower data bits D6..D0 (D6 = pin 1, D0 = pin 7).
- Left-side pins 8–20 carry control and timing signals: /IRQ, LP, /CS, R/W, BA, Vdd, COLOR, S/LUM, AEC, PH0, PHIN, PHCOL, Vss.
- Power pins: Vss = pin 20, Vdd = pin 13, Vcc = pin 40 (as shown).
- This is an alternate layout variant compared with the other 6567 pinout diagram where address lines are labeled/arranged differently (multiplexed-address annotation).

No register maps are included here — this is a physical pin assignment diagram only.

## Source Code
```text
                              PIN CONFIGURATION

                                +----+ +----+
                        D6   1 @|    +-+    |@ 40  Vcc
                                |           |
                        D5   2 @|           |@ 39  D7
                                |           |
                        D4   3 @|           |@ 38  D8
                                |           |
                        D3   4 @|           |@ 37  D9
                                |           |
                        D2   5 @|           |@ 36  D10
                                |           |
                        D1   6 @|           |@ 35  D11
                                |           |
                        D0   7 @|           |@ 34  A13
                                |           |
                      /IRQ   8 @|           |@ 33  A12
                                |           |
                        LP   9 @|           |@ 32  A11
                                |           |
                       /CS  10 @|           |@ 31  A10
                                |    6567   |
                       R/W  11 @|           |@ 30  A9
                                |           |
                        BA  12 @|           |@ 29  A8
                                |           |
                       Vdd  13 @|           |@ 28  A7
                                |           |
                     COLOR  14 @|           |@ 27  A6
                                |           |
                     S/LUM  15 @|           |@ 26  A5
                                |           |
                       AEC  16 @|           |@ 25  A4
                                |           |
                       PH0  17 @|           |@ 24  A3
                                |           |
                      PHIN  18 @|           |@ 23  A2
                                |           |
                     PHCOL  19 @|           |@ 22  A1
                                |           |
                       Vss  20 @|           |@ 21  A0
                                +-----------+
                                                           APPENDIX N   453
```

## References
- "vic-ii_pin_configuration_6567_variant_with_multiplexed_addresses" — expands on first 6567 pinout variant (multiplexed-address annotation)
- "vic-ii_register_map_00_2e" — VIC‑II register map (useful when mapping signals to registers)