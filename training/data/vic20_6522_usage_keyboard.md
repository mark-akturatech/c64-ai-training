# VIC-20 6522 VIA usage ($9120-$912F) — keyboard, tape, serial/userport

**Summary:** 6522 VIA at $9120-$912F on the VIC‑20 implements keyboard row select ($9120), keyboard column input ($9121), Data Direction Registers for those ports ($9122/$9123), Timer 1 (and its latch) and Timer 2 (and its latch), the shift register (unused here), Auxiliary/Peripheral control bits (T1/T2/Shift/Latch controls), CB/CA control functions (serial bus, SRQ, serial clock, tape in/out), and IRQ status/enable registers. Addresses and roles: $9120-$912F, Timer1/Timer2, ACR/PCR, IFR/IER.

## Register overview and usage

- Address range: $9120-$912F — 6522 VIA mapped for VIC‑20 keyboard, user/tape/serial functions.
- Ports:
  - $9120 (Port B): used for keyboard row selection and joystick select; also contains a TapeOut function on one bit (see map).
  - $9121 (Port A): read-only keyboard column inputs (keyboard matrix columns).
  - $9122/$9123: Data Direction Registers for Port B and Port A respectively (control which bits are inputs/outputs for keyboard/select lines).
- Timers:
  - Timer 1 ($9124) and Timer 1 latch ($9126/$9127): used for cassette/tape read timing or for keyboard & clock interrupt generation depending on VIC‑20 usage. Timer 1 generates an IRQ when it underflows if enabled.
  - Timer 2 ($9128) and its latch ($9129): used for serial bus timing or tape read/write timing (machine-dependent usage on the VIC‑20). Timer 2 can be read as a 16‑bit counter.
- Shift register ($912A): present in the 6522 but marked unused for VIC‑20 functions in this mapping.
- Auxiliary Control Register / Peripheral Control:
  - $912B (ACR): controls Timer1 mode, Timer2 control, shift register mode, and latch control for PB/PA. (Labelled in the map as "T1 Control | T2 Control | Shift Control | Latch Controls PB PA".)
  - $912C (PCR): configures CA/CB lines (CA1/CA2/CB1/CB2). The mapping shows CA/CB functions used for serial bus data out, SRQ in, serial clock out, and tape in/out depending on the bit settings.
    - CB2 mapped as serial bus data out.
    - CB1 used as SRQ input.
    - CA2 used as serial clock out.
    - CA1 used as Tape In.
- Interrupts:
  - $912D (IFR / IRQ Status): bits indicate pending interrupts — Timer1, Timer2, CB1 (SRQ), CA1 (Tape In) among others as shown in the map.
  - $912E (IER / IRQ Enable): corresponding enable bits to mask/unmask interrupts for Timer1, Timer2, CB1, CA1, etc.
- $912F: marked unused (documentation notes "see $9121").

Note: the exact bit positions for each named function are given in the reference map (Source Code below). Do not assume bit numbers from other 6522 mappings without consulting the map here.

## Source Code
```text
VIC-20 6522 Usage

      +-------+-------+-------+-------+-------+-------+-------+-------+
$9120 |Joy Sel|       |       |       |TapeOut|       |       |       | 37152
      |                      Keyboard Row Select                      |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9121 |                     Keyboard Column Input                     | 37153
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9122 |             Data Direction Register B (for $9120)             | 37154
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9123 |             Data Direction Register A (for $9121)             | 37155
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9124 |                                                               | 37156
      |                           Timer 1:                            |
      +- - - -                                                 - - - -+
$9125 |       Cassette Tape Read or Keyboard & Clock Interrupt        | 37157
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9126 |                                                               | 37158
      |                                                               |
      +- - - - - - - - - - - -  Timer 1 Latch  - - - - - - - - - - - -+
$9127 |                                                               | 37159
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$9128 |                                                               | 37160
      |                           Timer 2:                            |
      +- - - - - - - - - - - -  (Serial/Tape timing)  - - - - - - - -+
$9129 |                 Serial Bus or Tape R/W Timing                 | 37161
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$912A |                   Shift Register (*unused)                    | 37162
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$912B |  T1 Control   |  T2   |    Shift Register     |Latch Controls | 37163
      |               |Control|        Control        |  PB      PA   |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$912C |   CB2:  Serial Bus    |CB1 Ctl|      CA2 Control      |CA1 Ctl| 37164
      |       Data Out        |SRQ In |   Serial Clock Out    |Tape In|
      +-------+-------+-------+-------+-------+-------+-------+-------+
$912D |  IRQ  |Timer 1|Timer 2|CB1 Int|       |       |CA1 Int|       | 37165
      |Status:|  Int  |  Int  |SRQ In |       |       |Tape In|       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$912E |  IRQ  |Timer 1|Timer 2|CB1 Int|       |       |CA1 Int|       | 37166
      |Enable:|  Int  |  Int  |SRQ In |       |       |Tape In|       |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$912F |                      *Unused:  see $9121                      | 37167
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
```

## Key Registers
- $9120-$912F - 6522 VIA - Port B (keyboard row/Joy/TapeOut), Port A (keyboard column input), DDRB/DDRA ($9122/$9123), Timer1 ($9124/$9127), Timer2 ($9128/$9129), Shift Register ($912A unused), ACR ($912B), PCR ($912C), IFR ($912D), IER ($912E), $912F unused.

## References
- "vic20_6522_usage_rs232_userport" — expands on 6522 registers used for RS-232 / user port ($9110-$911F)

## Labels
- PORTB
- PORTA
- DDRB
- DDRA
- ACR
- PCR
- IFR
- IER
