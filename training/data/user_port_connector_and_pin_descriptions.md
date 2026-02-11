# USER PORT — Pinout and Signal Descriptions (top-side 1–12, bottom-side A–N)

**Summary:** Complete USER port pin descriptions for Commodore 64: top-side pins 1–12 (GND, +5V, RESET, CNT1/SP1, CNT2/SP2, PC2, SERIAL ATN, 9VAC phases) and bottom-side pins A–N (GND, FLAG2, PB0–PB7, PA2). Notes include RESET cold-start behavior, CIA serial/handshaking signals, and PORT B register at 56577 ($DD01) with direction controlled by the CIA Data Direction Register.

## Port pin description
This chunk documents the USER port physical pins and the signals they carry. Top-side pins (numbered 1–12) include power, reset, CIA serial/handshaking lines, the serial bus ATN line, and the two 9 VAC transformer phases. Bottom-side pins (labeled A–N) expose ground, FLAG2, the eight Port B lines (PB0–PB7) from a CIA, and PA2.

- RESET (Top-side pin 3): Grounding this pin causes a COLD START of the C64 — pointers to a BASIC program are reset but RAM is not cleared. This pin also serves as a RESET output to external devices.
- CNT1 / SP1 (Top-side pins 4–5): Serial counter and serial data lines from CIA #1 (see 6526 CIA specs for timing/usage).
- CNT2 / SP2 (Top-side pins 6–7): Serial counter and serial data lines from CIA #2 (see CIA specs).
- PC2 (Top-side pin 8): A handshaking/control line from CIA #2.
- SERIAL ATN (Top-side pin 9): Connected internally to the serial bus ATN line for peripheral attention signaling.
- 9 VAC phases (Top-side pins 10–11): Direct connection to the C64 transformer; rated at 50 mA max per source note in original.
- POWER / GND: Top-side pins 1 and 12 are ground; pin 2 is +5V (100 mA max per source note).
- Bottom-side GND (pins A and N): additional ground connections.
- FLAG2 (Bottom-side pin B): FLAG2 line available (used for handshaking/status).
- PORT B (Bottom-side pins C–L): PB0–PB7 are the eight lines of PORT B from the CIA. These lines may be inputs or outputs depending on the CIA Data Direction Register (DDR). The source lists the PORT B register address as 56577 ($DD01) for accessing PB0–PB7 (PEEK to read inputs, POKE to set outputs).
- PA2 (Bottom-side pin M): Additional handshaking/control line (PA2).

**[Note: Source may contain an error — the document lists PORT B at 56577 ($DD01). Standard C64 memory maps place CIA chip bases at $DC00 and $DD00 and assignments can vary by documentation; verify against your machine’s CIA mapping if exact CIA/register selection is critical.]**

(Short parenthetical: "DDR" = Data Direction Register, controls each PB line as input or output.)

## Source Code
```text
ASCII connector diagram and pin table (original layout)

                                             1 1 1
                           1 2 3 4 5 6 7 8 9 0 1 2
                        +--@-@-@-@-@-@-@-@-@-@-@-@--+
                        |                           |
                        +--@-@-@-@-@-@-@-@-@-@-@-@--+
                           A B C D E F H J K L M N

                            PORT PIN DESCRIPTION
  +-----------+-----------+-----------------------------------------------+
  |    PIN    |           |                                               |
  +-----------+DESCRIPTION|                     NOTES                     |
  | TOP SIDE  |           |                                               |
  +-----------+-----------+-----------------------------------------------+
  |     1     |  GROUND   |                                               |
  |     2     |   +5V     |  (100 mA MAX.)                                |
  |     3     |  RESET    |  By grounding this pin, the Commodore 64 will |
  |           |           |  do a COLD START, resetting completely. The   |
  |           |           |  pointers to a BASIC program will be reset,   |
  |           |           |  but memory will not be cleared. This is also |
  |           |           |  a RESET output for the external devices.     |
  |     4     |    CNT1   |  Serial port counter from CIA#1(SEE CIA SPECS)|
  |     5     |    SP1    |  Serial port from CIA #l (SEE 6526 CIA SPECS) |
  |     6     |    CNT2   |  Serial port counter from CIA#2(SEE CIA SPECS)|
  |     7     |    SP2    |  Serial port from CIA #l (SEE 6526 CIA SPECS) |
  |     8     |    PC2    |  Handshaking line from CIA #2 (SEE CIA SPECS) |
  |     9     |SERIAL ATN |  This pin is connected to the ATN line of the |
  |           |           |  serial bus.                                  |
  |    10     |9 VAC+phase|  Connected directly to the Commodore          |
  |    11     |9 VAC-phase|  64 transformer (50 mA MAX.).                 |
  |    12     |    GND    |                                               |
  |           |           |                                               |
  |BOTTOM SIDE|           |                                               |
  |           |           |                                               |
  |     A     |    GND    |  The Commodore 64 gives you control over      |
  |     B     |   FLAG2   |  PORT B on CIA chip #1. Eight lines for input |
  |     C     |    PB0    |  or output are available, as well as 2 lines  |
  |     D     |    PB1    |  for handshaking with an outside device. The  |
  |     E     |    PB2    |  I/O lines for PORT B are controlled by two   |
  |     F     |    PB3    |  locations. One is the PORT itself, and is    |
  |     H     |    PB4    |  located at 56577 ($DD01 HEX). Naturally you  |
  |     I     |    PB5    |  PEEK it to read an INPUT, or POKE it to set  |
  |     K     |    PB6    |  an OUTPUT. Each of the eight I/O lines can   |
  |     L     |    PB7    |  be set up as either an INPUT or an OUTPUT by |
  |     M     |    PA2    |  by setting the DATA DIRECTION REGISTER       |
  |     N     |    GND    |  properly.                                    |
  +-----------+-----------+-----------------------------------------------+
```

## Key Registers
- $DD01 - CIA - PORT B (PB0–PB7) — read/write port for PB lines (source lists as 56577 / $DD01; DDR controls direction)

## References
- "user_port_overview" — general purpose and CIA connection
- "user_port_data_direction_register_ddr_usage" — how to set PB lines as input or output via the DDR
- "user_port_flag1_and_pa2_handshaking" — special handling of FLAG1/FLAG2 and PA2 signals

## Labels
- PORT B
- $DD01
