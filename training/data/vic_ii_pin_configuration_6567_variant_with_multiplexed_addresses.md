# VIC-II (6567) Pin Configuration (pins 1–40)

**Summary:** VIC-II 6567 NTSC pinout showing pin numbers 1–40, data lines D0–D11, address lines A0–A11 (with several multiplexed labels in parentheses), and control signals (/IRQ, LP, /CS, R/W, BA, AEC, PH0, /RAS, /CAS, PHIN, PHCL), plus power pins Vcc/Vss and video signals COLOR and S/LUM.

## Pin summary
This chunk is the first VIC-II (6567) pin-configuration diagram (pins 1–40). It lists:
- Data bus pins: D0–D11
- Address pins: A0–A11 (several pins show alternate/multiplexed address labels in parentheses — see diagram)
- Control and timing pins: /IRQ, LP (light-pen), /CS, R/W, BA (bus available), AEC, PH0, PHIN, PHCL, /RAS, /CAS
- Video signals: COLOR, S/LUM
- Power pins: Vdd (logic supply), Vcc (chip supply), Vss (ground)

Note: The diagram explicitly marks multiplexed address labels in parentheses; an alternate pin-labeling diagram exists (see References).

See the full ASCII pin map in the Source Code section for exact pin-to-pin labels and physical orientation.

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
                        D0   7 @|           |@ 34  A10
                                |           |
                      /IRQ   8 @|           |@ 33  A9
                                |           |
                        LP   9 @|           |@ 32  A8
                                |           |
                       /CS  10 @|           |@ 31  A7
                                |    6567   |
                       R/W  11 @|           |@ 30  A6("1")
                                |           |
                        BA  12 @|           |@ 29  A5(A13)
                                |           |
                       Vdd  13 @|           |@ 28  A4(A12)
                                |           |
                     COLOR  14 @|           |@ 27  A3(A11)
                                |           |
                     S/LUM  15 @|           |@ 26  A2(A10)
                                |           |
                       AEC  16 @|           |@ 25  A1(A9)
                                |           |
                       PH0  17 @|           |@ 24  A0(A8)
                                |           |
                      /RAS  18 @|           |@ 23  A11
                                |           |
                      /CAS  19 @|           |@ 22  PHIN
                                |           |
                       Vss  20 @|           |@ 21  PHCL
                                +-----------+

(Multiplexed addresses in parentheses)
```

## References
- "vic-ii_pin_configuration_6567_alternate_address_mapping" — alternate 6567 pinout / second diagram with different address labeling
- "vic-ii_register_map_00_2e" — VIC-II register map ($D000-$D02E) referenced elsewhere in the same appendix
