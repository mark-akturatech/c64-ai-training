# CIA (6526) Timer latch / prescaler load behavior and TA/TB register formats

**Summary:** Describes CIA timer latch load behavior and the TA/TB read (timer latch) and write (prescaler) register bit layouts. Contains register names and bit fields (TALx/TAHx, TBLx/TBHx for reads; PALx/PAHx, PBLx/PBHx for prescaler writes) and maps to C64 addresses $DC04-$DC07 and $DD04-$DD07.

## Timer latch / counter load behavior
- The timer latch is transferred into the timer counter on any timer underflow, on a force load, or following a write to the high byte of the prescaler while the timer is stopped.
- If the timer is running, writing the high byte of the prescaler will load the timer latch but will NOT reload the counter.

(Registers 4–7 contain the timer latch when read; writing those registers sets the prescaler bytes. See Source Code for bit layouts.)

## Source Code
```text
READ (TIMER)
 REG    NAME   Bits
 +-----+---------+------+------+------+------+------+------+------+------+
 |  4  |  TA LO  | TAL7 | TAL6 | TAL5 | TAL4 | TAL3 | TAL2 | TAL1 | TAL0 |
 |  5  |  TA HI  | TAH7 | TAH6 | TAH5 | TAH4 | TAH3 | TAH2 | TAH1 | TAH0 |
 |  6  |  TB LO  | TBL7 | TBL6 | TBL5 | TBL4 | TBL3 | TBL2 | TBL1 | TBL0 |
 |  7  |  TB HI  | TBH7 | TBH6 | TBH5 | TBH4 | TBH3 | TBH2 | TBH1 | TBH0 |
 +-----+---------+------+------+------+------+------+------+------+------+

WRITE (PRESCALER)
 REG    NAME   Bits
 +-----+---------+------+------+------+------+------+------+------+------+
 |  4  |  TA LO  | PAL7 | PAL6 | PAL5 | PAL4 | PAL3 | PAL2 | PAL1 | PAL0 |
 |  5  |  TA HI  | PAH7 | PAH6 | PAH5 | PAH4 | PAH3 | PAH2 | PAH1 | PAH0 |
 |  6  |  TB LO  | PBL7 | PBL6 | PBL5 | PBL4 | PBL3 | PBL2 | PBL1 | PBL0 |
 |  7  |  TB HI  | PBH7 | PBH6 | PBH5 | PBH4 | PBH3 | PBH2 | PBH1 | PBH0 |
 +-----+---------+------+------+------+------+------+------+------+------+
```

## Key Registers
- $DC04-$DC07 - CIA1 - Timer A/B latch (read) and prescaler write registers (TA LO/HI, TB LO/HI)
- $DD04-$DD07 - CIA2 - Timer A/B latch (read) and prescaler write registers (TA LO/HI, TB LO/HI)

## References
- "6526_timers_overview" — purpose of the timer counter and latch and general behavior
- "6526_timer_control_functions" — control bits that affect load and operation (Force Load, Input Mode, etc.)