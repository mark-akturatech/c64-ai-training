# CIA 6526 — Control Register B (CRB) $0F

**Summary:** Control Register B (CRB) at offset $0F in the 6526 CIA controls Timer B start/stop, PB7 routing and output shape, load strobe, input source selection (INMODE), RUNMODE, and TOD alarm write mode (ALARM). Relevant terms: Timer B, PB7, INMODE, ALARM, LOAD strobe, one-shot/continuous.

## Description
CRB is a read/write control register that configures Timer B operation and related I/O behaviour:

- START (bit 0): start/stop Timer B. Writing 1 starts the timer; writing 0 stops it.
- PBON (bit 1): when set, Timer B output is routed to port B bit PB7; when clear PB7 remains normal I/O.
- OUTMODE (bit 2): selects the PB7 output waveform when PBON is enabled — Toggle on each underflow (1) or a single-cycle pulse on underflow (0).
- RUNMODE (bit 3): selects one-shot (1) or continuous/reload (0) behavior. One-shot stops Timer B after its next underflow; continuous reloads the latch value and continues.
- LOAD (bit 4): a strobe that forces the Timer B latch value to be loaded into the counter. This is a write strobe — the bit always reads back as 0.
- INMODE (bits 5-6): selects Timer B count source:
  - %00 — count PHI2 clock pulses (system clock)
  - %01 — count positive CNT edges (external CNT pin)
  - %10 — count Timer A underflow pulses
  - %11 — count Timer A underflows only when coincident with a positive CNT edge
- ALARM (bit 7): when set, writes to the TOD (Time-of-Day) registers update the ALARM time instead of the running clock; when clear, writes set the TOD clock time.

Behavioral notes preserved from source:
- LOAD is a strobe; reading CRB will always show LOAD = 0.
- OUTMODE=1 toggles PB7 each Timer B underflow; OUTMODE=0 produces a one-cycle pulse on underflow.
- INMODE allows Timer B to be synchronized to Timer A underflows and/or external CNT transitions.

## Source Code
```text
CRB (Offset $0F) - Bit assignments (bit7 .. bit0)

  bit 7   |  bit 6  bit 5  | bit 4 | bit 3 | bit 2  | bit 1 | bit 0
  ALARM   |      INMODE   | LOAD  | RUNMODE| OUTMODE| PBON  | START
  ---------------------------------------------------------------
  1 = TOD writes set ALARM time
  0 = TOD writes set TOD clock time

  INMODE (bits 6-5):
    %00 = Timer B counts PHI2 clock pulses
    %01 = Timer B counts positive CNT edges
    %10 = Timer B counts Timer A underflow pulses
    %11 = Timer B counts Timer A underflows coincident with positive CNT edge

  LOAD (bit 4):
    Write 1 = strobe: force latch -> counter load
    Reads as 0 (strobe only)

  RUNMODE (bit 3):
    1 = One-shot: timer stops after underflow
    0 = Continuous: timer reloads and continues

  OUTMODE (bit 2):
    1 = Toggle PB7 on each underflow
    0 = Pulse PB7 for one system cycle on underflow

  PBON (bit 1):
    1 = Route Timer B output to PB7
    0 = PB7 normal I/O

  START (bit 0):
    1 = Start Timer B
    0 = Stop Timer B

Examples (binary -> brief meaning):
  %10010001 = ALARM=1, INMODE=%00 (PHI2), LOAD=0, RUNMODE=1 (one-shot), OUTMODE=0, PBON=0, START=1
  %00000001 = Start Timer B counting PHI2 (continuous, no PB7 routing)
```

## Key Registers
- $DC0F - CIA 1 - Control Register B (CRB) (offset $0F)
- $DD0F - CIA 2 - Control Register B (CRB) (offset $0F)

## References
- "timer_b_16bit" — expands on CRB bits selecting Timer B input source and start/mode/pulse behavior
- "time_of_day_clock" — expands on CRB bit 7 (ALARM) selecting alarm write mode for TOD