# Commodore 64 CIA 1 (6526) Register Usage ($DC00-$DC0F)

**Summary:** CIA 1 (6526) registers at $DC00-$DC0F — Port A/Port B usage for paddles, joysticks, and keyboard scanning; Data Direction Registers $DC02/$DC03; Timer A/B ($DC04-$DC07); Time-of-Day clock ($DC08-$DC0B); Shift register ($DC0C); Interrupt control/status and control registers ($DC0D-$DC0F) including tape input, TOD alarm, PB6/PB7 modes, serial clock, and one-shot modes.

**Overview**

This chunk documents how the Commodore 64 maps user I/O and CIA functions to CIA 1 ($DC00-$DC0F). Port A ($DC00) and Port B ($DC01) are multiplexed between paddles, joystick inputs, and the keyboard matrix (row select/column read). DDRA/DDRB ($DC02/$DC03) control direction for these ports (defaults noted). Timers A and B are 16-bit counters split into two bytes each and are used for cassette timing, keyboard/timer interrupts, and general timing. The Time-of-Day (TOD) clock uses four BCD registers (1/10s, seconds, minutes, hours). The shift register is unused on C64 by default. Interrupt Control and CIA control registers configure IRQ sources, TOD alarm, tape input behavior, PB6/PB7 output modes, serial clock, and one-shot timer modes.

- Port A is used for paddle select lines and the keyboard row select (inverted).
- Port B is used to read keyboard columns and joystick 1, and can control PB6/PB7 outputs for cassette motor, serial signals, or other functions.
- Timer A/B each occupy two registers (low/high) and can generate IRQs; also used by tape I/O and one-shot modes.
- TOD registers are BCD formatted across $DC08-$DC0B.
- $DC0D-$DC0F are Interrupt Control and Control registers — source flags and PB6/PB7 behavior are controlled here.

## Source Code

```text
Commodore 64 6526 Usage (CIA 1)
-------------------------------

      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC00 |Paddle |Paddle |               |          Joystick 0           | 56320
      |SelectA|SelectB|               | Right | Left  | Down  |  Up   |
      |                Keyboard Row Select (inverted)                 |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC01 |                               |          Joystick 1           | 56321
      |                     Keyboard Column Read                      |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC02 |             Data Direction Register A (for $DC00)             | 56322
      |                   Default $FF = All Output                    |                       
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC03 |             Data Direction Register B (for $DC01)             | 56323
      |                    Default $00 = All Input                    |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC04 |                                                               | 56324
      |                           Timer A:                            |
      +- - - -                                                 - - - -+
$DC05 |        Cassette Tape I/O or Keyboard & Clock Interrupt        | 56325
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC06 |                                                               | 56326
      |                           Timer B:                            |
      +- - - - - - - - - -                         - - - - - - - - - -+
$DC07 |                   Cassette Tape I/O Timing                    | 56327
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC08 |                               |       Time-of-Day Clock       | 56328
      |                               |        1/10th Seconds         |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC09 |       |   Time-of-Day Clock   |       Time-of-Day Clock       | 56329
      |       |Seconds, BCD High Digit|    Seconds, BCD Low Digit     |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC0A |       |   Time-of-Day Clock   |       Time-of-Day Clock       | 56330
      |       |Minutes, BCD High Digit|    Minutes, BCD Low Digit     |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC0B |       |   Time-of-Day Clock   |       Time-of-Day Clock       | 56331
      |       | Hours, BCD High Digit |     Hours, BCD Low Digit      |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC0C |                   Shift Register (*unused)                    | 56332
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC0D |  IRQ  |       |       | Tape  |       |  TOD  |Timer B|Timer A| 56333
      |Control|       |       | Input |       | Alarm |       |       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC0E |       |       |       |       |Timer A|PB6 Out|Timer A|Timer A| 56334
      |       |       |       |       |OneShot| Mode  |PB6 Out| Start |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$DC0F |       |       |       |       |Timer B|PB7 Out|Timer B|Serial | 56335
      |       |       |       |       |OneShot| Mode  |PB7 Out|Clk In |
      +-------+-------+-------+-------+-------+-------+-------+-------+

Notes:
- $DC04/$DC05 = Timer A low/high (16-bit)
- $DC06/$DC07 = Timer B low/high (16-bit)
- $DC08 = TOD 1/10s
- $DC09 = TOD seconds (BCD low/high nibble)
- $DC0A = TOD minutes (BCD low/high nibble)
- $DC0B = TOD hours   (BCD low/high nibble)
- $DC0C = Shift register (not used on C64)
- $DC0D = Interrupt control / flags
- $DC0E = CRA (control register A) — Timer A control, PB6 mode, one-shot start, etc.
- $DC0F = CRB (control register B) — Timer B control, PB7 mode, serial clk in/out, etc.
```

## Key Registers

- $DC00-$DC01 - CIA 1 - Port A (paddle selects, joystick 0, keyboard row select inverted) and Port B (keyboard column read, joystick 1)
- $DC02-$DC03 - CIA 1 - DDRA / DDRB (data direction registers for $DC00/$DC01); defaults: DDRA $FF (all output), DDRB $00 (all input)
- $DC04-$DC07 - CIA 1 - Timer A (low/high), Timer B (low/high) — 16-bit timers, used for cassette timing, interrupts, and one-shot modes
- $DC08-$DC0B - CIA 1 - TOD clock registers (1/10s, seconds, minutes, hours) in BCD
- $DC0C - CIA 1 - Shift register (unused on C64)
- $DC0D-$DC0F - CIA 1 - Interrupt control/status (ICR) and Control Registers A/B (CRA/CRB): tape input, TOD alarm, Timer A/B IRQs, PB6/PB7 output modes, serial clock, one-shot modes

## References

- "c64_cia2_registers" — CIA 2 register usage and differences (NMI behavior, serial lines, user port differences)