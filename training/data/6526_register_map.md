# 6526 (CIA) Register Map — RS3-RS0 addressing (PRA/PRB/DDRA/DDRB/Timers/TOD/SDR/ICR/CRA/CRB)

**Summary:** 6526 (CIA) register select via RS3-RS0 selects registers $00-$0F (offsets 0–15); use base $DC00 for CIA1 or $DD00 for CIA2 to access PRA, PRB, DDRA, DDRB, Timer A/B low/high, TOD (10ths, seconds, minutes, hours), SDR, ICR, CRA, and CRB.

## Register addressing and usage
RS3-RS0 form the 4-bit register-select index (0x0–0xF). On a C64 the CIA chips are memory-mapped at base addresses:
- CIA1 base $DC00 — registers $DC00–$DC0F
- CIA2 base $DD00 — registers $DD00–$DD0F

Use base + offset (RS value) to access the register. Typical offsets of note:
- Timer A low/high: offsets $04/$05
- Timer B low/high: offsets $06/$07
- Time-of-Day: offsets $08 (10ths), $09 (seconds), $0A (minutes), $0B (hours, AM/PM)
- SDR (serial data): $0C
- ICR (interrupt control): $0D
- CRA: $0E
- CRB: $0F

Detailed register map (RS3-RS0 → register) is in Source Code below.

## Source Code
```text
                                REGISTER MAP
  +---+---+---+---+---+----------+----------------------------------------+
  |RS3|RS2|RS1|RS0|REG|   NAME   |                                        |
  +---+---+---+---+---+----------+----------------------------------------+
  | 0 | 0 | 0 | 0 | 0 | PRA      |  PERIPHERAL DATA REG A                 |
  | 0 | 0 | 0 | 1 | 1 | PRB      |  PERIPHERAL DATA REG B                 |
  | 0 | 0 | 1 | 0 | 2 | DDRA     |  DATA DIRECTION REG A                  |
  | 0 | 0 | 1 | 1 | 3 | DDRB     |  DATA DIRECTION REG B                  |
  | 0 | 1 | 0 | 0 | 4 | TA LO    |  TIMER A LOW REGISTER                  |
  | 0 | 1 | 0 | 1 | 5 | TA HI    |  TIMER A HIGH REGISTER                 |
  | 0 | 1 | 1 | 0 | 6 | TB LO    |  TIMER B LOW REGISTER                  |
  | 0 | 1 | 1 | 1 | 7 | TB HI    |  TIMER B HIGH REGISTER                 |
  | 1 | 0 | 0 | 0 | 8 | TOD 10THS|  10THS OF SECONDS REGISTER             |
  | 1 | 0 | 0 | 1 | 9 | TOD SEC  |  SECONDS REGISTER                      |
  | 1 | 0 | 1 | 0 | A | TOD MIN  |  MINUTES REGISTER                      |
  | 1 | 0 | 1 | 1 | B | TOD HR   |  HOURS-AM/PM REGISTER                  |
  | 1 | 1 | 0 | 0 | C | SDR      |  SERIAL DATA REGISTER                  |
  | 1 | 1 | 0 | 1 | 0 | ICR      |  INTERRUPT CONTROL REGISTER            |
  | 1 | 1 | 1 | 0 | E | CRA      |  CONTROL REG A                         |
  | 1 | 1 | 1 | 1 | F | CRB      |  CONTROL REG B                         |
  +---+---+---+---+---+----------+----------------------------------------+
```

## Key Registers
- $DC00-$DC0F - CIA 1 - PRA, PRB, DDRA, DDRB, TA LO/HI, TB LO/HI, TOD 10ths/Seconds/Minutes/Hours, SDR, ICR, CRA, CRB
- $DD00-$DD0F - CIA 2 - PRA, PRB, DDRA, DDRB, TA LO/HI, TB LO/HI, TOD 10ths/Seconds/Minutes/Hours, SDR, ICR, CRA, CRB

## References
- "6526_io_ports_overview" — Functional descriptions of the I/O registers (PRA/PRB/DDRA/DDRB)
- "6526_timers_overview" — Timer register addresses (TA/TB LO/HI) and behavior

## Labels
- PRA
- PRB
- DDRA
- DDRB
