# 6510 Pin Configuration (40-pin DIP)

**Summary:** 40-pin 6510 CPU pinout listing pin numbers and signal names: RDY, /IRQ, /NMI, AEC, VCC, A0–A15, D0–D7, P0–P5 (P6/P7 absent in this listing), /RES, R/W, GND. Includes ASCII-art pin diagram and textual pin map as in the source.

**Pinout Overview**

The ASCII diagram below illustrates the 6510 DIP with pins 1–20 on the left side and 21–40 on the right side (right side printed top-to-bottom as 40→21). Address bus lines A0–A15 occupy pins on the left column (A0..A13 shown explicitly, with A14/A15 on the right column); the data bus D0–D7 are on the right column (pins 37–30). CPU control and system signals present: RDY, /IRQ, /NMI, AEC, /RES, R/W, VCC, and GND. The I/O port lines (P0–P5 shown) appear on pins 29–24.

Note: The original printed diagram included a graphical image which is missing in the source.

## Source Code

```text
                              PIN CONFIGURATION

                                +----+ +----+
                     Φ1 IN   1 @|    +-+    |@ 40  /RES
                                |           |
                       RDY   2 @|           |@ 39  Φ2 OUT
                                |           |
                      /IRQ   3 @|           |@ 38  R/W
                                |           |
                      /NMI   4 @|           |@ 37  D0
                                |           |
                       AEC   5 @|           |@ 36  D1
                                |           |
                       VCC   6 @|           |@ 35  D2
                                |           |
                        A0   7 @|           |@ 34  D3
                                |           |
                        A1   8 @|           |@ 33  D4
                                |           |
                        A2   9 @|           |@ 32  D5
                                |           |
                        A3  10 @|           |@ 31  D6
                                |    6510   |
                        A4  11 @|           |@ 30  D7
                                |           |
                        A5  12 @|           |@ 29  P0
                                |           |
                        A6  13 @|           |@ 28  P1
                                |           |
                        A7  14 @|           |@ 27  P2
                                |           |
                        A8  15 @|           |@ 26  P3
                                |           |
                        A9  16 @|           |@ 25  P4
                                |           |
                       A10  17 @|           |@ 24  P5
                                |           |
                       A11  18 @|           |@ 23  A15
                                |           |
                       A12  19 @|           |@ 22  A14
                                |           |
                       A13  20 @|           |@ 21  GND
                                +-----------+
```

Clean textual pin map parsed from the diagram (pin → signal):

```text
Pin  1  - Φ1 IN
Pin  2  - RDY
Pin  3  - /IRQ
Pin  4  - /NMI
Pin  5  - AEC
Pin  6  - VCC
Pin  7  - A0
Pin  8  - A1
Pin  9  - A2
Pin 10  - A3
Pin 11  - A4
Pin 12  - A5
Pin 13  - A6
Pin 14  - A7
Pin 15  - A8
Pin 16  - A9
Pin 17  - A10
Pin 18  - A11
Pin 19  - A12
Pin 20  - A13
Pin 21  - GND
Pin 22  - A14
Pin 23  - A15
Pin 24  - P5
Pin 25  - P4
Pin 26  - P3
Pin 27  - P2
Pin 28  - P1
Pin 29  - P0
Pin 30  - D7
Pin 31  - D6
Pin 32  - D5
Pin 33  - D4
Pin 34  - D3
Pin 35  - D2
Pin 36  - D1
Pin 37  - D0
Pin 38  - R/W
Pin 39  - Φ2 OUT
Pin 40  - /RES
```

## References

- "6510_block_diagram_placeholder" — expands on Block diagram header and missing image that complements the pinout
- "6510_description_and_features" — expands on Functional features summarized in the description (I/O port, address bus, compatibility)
