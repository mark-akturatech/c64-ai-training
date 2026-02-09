# BAUDOF — CIA#2 RS-232 prescaler (665-666, $299-$29A)

**Summary:** BAUDOF (locations 665-666, $299-$29A) stores the prescaler used by CIA #2 timers A/B to time RS-232 bit send/receive. Prescaler is written to CIA #2 registers $DD04-$DD07 (low/high bytes for timers A and B); tables of preset prescalers live at $FEC2 (NTSC) and $E4EC (PAL). Formula: PRESCALER = ((CLOCK / BAUDRATE) / 2) - 100.

**Description**
This entry documents the BAUDOF prescaler used to drive RS-232 transmit/receive timing via CIA #2 timers A and B.

- **BAUDOF label and locations:**
  - Decimal 665–666, hex $0299–$029A — the memory location holding the prescaler value (label BAUDOF).
- **Function:**
  - CIA #2 timers A and B repeatedly trigger an NMI which runs the RS-232 receive and transmit service routines.
  - The effective NMI rate is CLOCK / PRESCALER times per second (the text expresses it as CLOCK/PRESCALER; timers fire at that derived rate and the RS-232 logic uses this to time bits).
- **CLOCK values:**
  - NTSC system clock: 1,022,730 Hz
  - PAL system clock: 985,250 Hz
- **Prescaler storage:**
  - The prescaler value(s) are written into CIA #2 timer registers at $DD04-$DD07 in low-byte/high-byte order:
    - $DD04-$DD05 — Timer A (low, high)
    - $DD06-$DD07 — Timer B (low, high)
  - Decimal equivalents noted in original source: $DD04 = 56580, etc.
- **Formula to calculate required prescaler for a target RS-232 baud rate:**
  - PRESCALER = ((CLOCK / BAUDRATE) / 2) - 100
- **Preset tables:**
  - NTSC preset prescalers for standard RS-232 baud rates (starting with 50 baud two-byte value) are at $FEC2 (decimal 65218).
  - PAL preset prescalers are at $E4EC (decimal 58604).
- **Control register association:**
  - The control register that selects the standard RS-232 baud rates is at decimal 659 ($0293) — referenced by the source as register 659 ($293).

## Source Code
```text
Original excerpt (reference):

665-666       $299-$29A      BAUDOF
Time Required to Send a Bit

This location holds the prescaler value used by CIA #2 timers A and B.

These timers cause an NMI interrupt to drive the RS-232 receive and
transmit routines CLOCK/PRESCALER times per second each, where CLOCK
is the system 02 frequency of 1,022,730 Hz (985,250 if you are using
the European PAL television standard rather than the American NTSC
standard), and PRESCALER is the value stored at 56580-1 ($DD04-5) and
56582-3 ($DD06-7), in low-byte, high-byte order.  You can use the
following formula to figure the correct prescaler value for a
particular RS-232 baud rate:

PRESCALER=((CLOCK/BAUDRATE)/2)-100

The American (NTSC standard) prescaler values for the standard RS-232
baud rates which the control register at 659 ($293) makes available
are stored in a table at 65218 ($FEC2), starting with the two-byte
value used for 50 baud.  The European (PAL standard) version of that
table is located at 58604 ($E4EC).
```

```text
Useful numeric references (for clarity):

- CLOCK (NTSC) = 1,022,730 Hz
- CLOCK (PAL)  =   985,250 Hz

- BAUDOF memory:   $0299-$029A  (decimal 665-666)
- Control reg:     $0293        (decimal 659)
- CIA#2 timers:    $DD04-$DD07  (decimal 56580-56583)  ; $DD04/$DD05 = timer A low/high, $DD06/$DD07 = timer B low/high
- NTSC table base: $FEC2        (decimal 65218)  ; two-byte values starting at 50 baud
- PAL table base:  $E4EC        (decimal 58604)
```

```text
NTSC Prescaler Table at $FEC2:

Address  | Baud Rate | Prescaler Value
---------|-----------|----------------
$FEC2    | 50        | $27C1
$FEC4    | 75        | $1A3E
$FEC6    | 110       | $11C5
$FEC8    | 134.5     | $0E74
$FECA    | 150       | $0CED
$FECC    | 300       | $0645
$FECE    | 600       | $02F0
$FED0    | 1200      | $0146
$FED2    | 1800      | $00B8
$FED4    | 2400      | $0071
```

```text
PAL Prescaler Table at $E4EC:

Address  | Baud Rate | Prescaler Value
---------|-----------|----------------
$E4EC    | 50        | $2619
$E4EE    | 75        | $1944
$E4F0    | 110       | $111A
$E4F2    | 134.5     | $0DE8
$E4F4    | 150       | $0C70
$E4F6    | 300       | $0606
$E4F8    | 600       | $02D1
$E4FA    | 1200      | $0137
$E4FC    | 1800      | $00AE
$E4FE    | 2400      | $0069
```