# 6526 Complex Interface Adapter (CIA) — device description & 40-pin pinout

**Summary:** 6526 (CIA) device description, feature list, and 40-pin pin configuration with pin assignments (PA0-PA7, PB0-PB7, /PC, /FLAG, /CS, R/W, D0-D7, /IRQ, TOD, CNT, /RES, RS lines, SP). Includes peripheral features (timers, TOD clock, shift register) and the chip pin mapping.

## Device description and features
The 6526 Complex Interface Adapter (CIA) is a 65XX-bus-compatible peripheral interface device providing flexible timing and I/O functions for systems like the Commodore 64.

Features:
- 16 individually programmable I/O lines (PA0–PA7, PB0–PB7)
- 8- or 16-bit handshaking on read or write
- Two independent, linkable 16-bit interval timers
- Time-of-day (TOD) clock with programmable alarm (documented as "24-hour (AM/PM) time of day clock")
- 8-bit shift register for serial I/O
- Two TTL load capability
- CMOS-compatible I/O lines
- Operation at 1 or 2 MHz available

**[Note: Source may contain an error — "24-hour (AM/PM)" is internally contradictory (24-hour vs. AM/PM).]**
**[Note: Source references a block diagram and electrical maximum ratings that are not included here.]**

## Source Code
```text
6526 PIN CONFIGURATION (40-pin DIP)

           +----+ +----+
  Vss   1 @|    +-+    |@ 40  CNT
           |           |
  PA0   2 @|           |@ 39  SP
           |           |
  PA1   3 @|           |@ 38  RS0
           |           |
  PA2   4 @|           |@ 37  RS1
           |           |
  PA3   5 @|           |@ 36  RS2
           |           |
  PA4   6 @|           |@ 35  RS3
           |           |
  PA5   7 @|           |@ 34  /RES
           |           |
  PA6   8 @|           |@ 33  D0
           |           |
  PA7   9 @|           |@ 32  D1
           |           |
  PB0  10 @|           |@ 31  D2
           |    6526   |
  PB1  11 @|           |@ 30  D3
           |           |
  PB2  12 @|           |@ 29  D4
           |           |
  PB3  13 @|           |@ 28  D5
           |           |
  PB4  14 @|           |@ 27  D6
           |           |
  PB5  15 @|           |@ 26  D7
           |           |
  PB6  16 @|           |@ 25  O2
           |           |
  PB7  17 @|           |@ 24  /FLAG
           |           |
  /PC  18 @|           |@ 23  /CS
           |           |
  TOD  19 @|           |@ 22  R/W
           |           |
  Vcc  20 @|           |@ 21  /IRQ
           +-----------+

Pin list (pin number - signal):
1  - Vss      (chip ground)
2  - PA0      (Port A bit 0)
3  - PA1      (Port A bit 1)
4  - PA2      (Port A bit 2)
5  - PA3      (Port A bit 3)
6  - PA4      (Port A bit 4)
7  - PA5      (Port A bit 5)
8  - PA6      (Port A bit 6)
9  - PA7      (Port A bit 7)
10 - PB0      (Port B bit 0)
11 - PB1      (Port B bit 1)
12 - PB2      (Port B bit 2)
13 - PB3      (Port B bit 3)
14 - PB4      (Port B bit 4)
15 - PB5      (Port B bit 5)
16 - PB6      (Port B bit 6)
17 - PB7      (Port B bit 7)
18 - /PC      (Port C strobe / control)
19 - TOD      (Time-of-day input/output)
20 - Vcc      (chip +V supply)
21 - /IRQ     (interrupt request output)
22 - R/W      (bus R/W)
23 - /CS      (chip select)
24 - /FLAG    (flag output)
25 - O2       (labelled "02" in original diagram; likely a named output pin)
26 - D7       (data bus bit 7)
27 - D6       (data bus bit 6)
28 - D5       (data bus bit 5)
29 - D4       (data bus bit 4)
30 - D3       (data bus bit 3)
31 - D2       (data bus bit 2)
32 - D1       (data bus bit 1)
33 - D0       (data bus bit 0)
34 - /RES     (reset input)
35 - RS3      (register select line 3)
36 - RS2      (register select line 2)
37 - RS1      (register select line 1)
38 - RS0      (register select line 0)
39 - SP       (serial port / shift port)
40 - CNT      (counter input)

(Parentheticals added to identify common signal functions; Vss = ground, Vcc = positive supply)
```

## References
- "6526_block_diagram_and_maximum_ratings" — block diagram and electrical maximum ratings / electrical characteristics (not included in this chunk)
- "6510_memory_map_and_application_notes" — context on 6510 page-zero I/O interactions with CIA I/O