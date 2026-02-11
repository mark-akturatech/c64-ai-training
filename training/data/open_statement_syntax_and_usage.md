# OPEN statement — 1541 disk drive communication

**Summary:** Describes the BASIC OPEN statement syntax for establishing communication with a Commodore 1541 disk drive (device 8). Covers logical file number (1–127), device number (8 typical), channel/secondary address ranges (0–15) and meanings (2–14 data, 15 command).

## Establishing communications using OPEN

Use the BASIC OPEN statement to establish a communication channel between the C64 and a 1541 disk drive.

Syntax:
- OPEN file#, device, channel

Example:
- OPEN 15,8,15

Fields:
- file# = logical file number (1–127)
- device = device number (8 for a stock 1541)
- channel = channel number / secondary address
  - 0 & 1 — reserved for DOS use
  - 2–14 — data channels
  - 15 — command channel

The OPEN statement may be executed in immediate mode (typed at the keyboard) or within a program (under program control).

In the example OPEN 15,8,15, logical file 15 on device 8 is opened using channel 15 (the command channel).

## Source Code
```basic
REM Syntax and example for OPEN with 1541
OPEN file#, device, channel
OPEN 15,8,15
```

## References
- "using_command_channel_steps" — expands on overall steps to use command channel