# 6526 CRA / CRB — Timer A and Timer B Control Registers

**Summary:** Bit-by-bit definitions for the 6526 CIA Timer control registers CRA (Timer A) and CRB (Timer B), including START, PBON, OUTMODE, RUNMODE, LOAD (strobe), INMODE (PHI2 / CNT / TA sources), SPMODE (serial port direction), TODIN (50/60 Hz TOD input), CRB INMODE encodings, and ALARM selection (CRB7).

## Control register bit definitions

CRA (Timer A Control)
- Bit 0 — START: 1 = start Timer A; 0 = stop Timer A. In one-shot mode (RUNMODE=1) this bit is automatically cleared when the timer underflows.
- Bit 1 — PBON: 1 = Timer A output is routed to PB6; 0 = PB6 normal I/O operation.
- Bit 2 — OUTMODE: 1 = toggle output on underflow; 0 = generate a pulse on underflow.
- Bit 3 — RUNMODE: 1 = one-shot (O.S.) mode; 0 = continuous mode.
- Bit 4 — LOAD: write-1 = force load (strobe) of the timer latch from the timer low/high registers; this bit is a strobe input (no data stored). Bit 4 always reads back as 0; writing 0 has no effect.
- Bit 5 — INMODE: select Timer A count source: 1 = count positive CNT transitions; 0 = count PHI2 (ϕ2) pulses (system clock).
- Bit 6 — SPMODE: serial port mode and CNT relationship: 1 = serial port output (CNT generates shift clock); 0 = serial port input (external shift clock required on CNT).
- Bit 7 — TODIN: select Time-of-Day (TOD) external input frequency for correct TOD clocking: 1 = TOD pin expects 50 Hz; 0 = TOD pin expects 60 Hz.

CRB (Timer B Control)
- Bits 0–4 — CRB0–CRB4: mirror CRA bits 0–4 for Timer B operation. Note: CRB bit 1 (PBON) controls Timer B output on PB7 (not PB6).
- Bits 5–6 — INMODE (two-bit select): select Timer B input source:
  - CRB6=0, CRB5=0: Timer B counts PHI2 (ϕ2) pulses.
  - CRB6=0, CRB5=1: Timer B counts positive CNT transitions.
  - CRB6=1, CRB5=0: Timer B counts Timer A underflow pulses.
  - CRB6=1, CRB5=1: Timer B counts Timer A underflow pulses while CNT is high (gated by CNT).
- Bit 7 — ALARM: when set, writes to the TOD registers will set the ALARM registers; when clear, writes set the TOD clock.

Common/behavioral notes
- LOAD is a strobe: writing LOAD=1 forces the timer latch to be loaded from the timer registers; LOAD always reads back as zero.
- START with RUNMODE=1 (one-shot) auto-clears on underflow; with RUNMODE=0 (continuous), START remains set across underflows.
- OUTMODE selects whether the timer's external output toggles on each underflow (toggle) or produces a single pulse per underflow (pulse).
- SPMODE ties the serial shift clock relationship to CNT: when SPMODE=1 CNT is an output shift clock; when SPMODE=0 external device must supply clock on CNT for serial input.
- CRB’s INMODE has four encodings (see above) — CRB5 and CRB6 form a 2-bit field.
- Unused/undefined bits: All unused register bits are unaffected by writes and read back as zero.

## Source Code
```text
CRA:
Bit  Name    Function
 0  START    1=START TIMER A, 0=STOP TIMER A. This bit is automatically
              reset when underflow occurs during one-shot mode.
 1  PBON     1=TIMER A output appears on PB6, 0=PB6 normal operation.
 2  OUTMODE  1=TOGGLE, 0=PULSE
 3  RUNMODE  1=ONE-SHOT, 0=CONTINUOUS
 4  LOAD     1=FORCE LOAD (this is a STROBE input, there is no data
              storage, bit 4 will always read back a zero and writing a
              zero has no effect).
 5  INMODE   1=TIMER A counts positive CNT transitions, 0=TIMER A counts
              PHI2 (ϕ2) pulses.
 6  SPMODE   1=SERIAL PORT output (CNT sources shift clock),
              0=SERIAL PORT input (external shift clock required).
 7  TODIN    1=50 Hz clock required on TOD pin for accurate time,
              0=60 Hz clock required on TOD pin for accurate time.

CRB:
Bit  Name    Function
      (Bits CRB0-CRB4 are identical to CRA0-CRA4 for TIMER B with
       the exception that bit 1 controls the output of TIMER B on
       PB7).
 5,6 INMODE   Bits CRB5 and CRB6 select one of four input modes for
               TIMER B as:
               CRB6 CRB5
                0    0    TIMER B counts PHI2 (ϕ2) pulses.
                0    1    TIMER B counts positive CNT transitions.
                1    0    TIMER B counts TIMER A underflow pulses.
                1    1    TIMER B counts TIMER A underflow pulses
                          while CNT is high.
 7   ALARM     1=writing to TOD registers sets ALARM, 0=writing to TOD
               registers sets TOD clock.

Compact bit-mapping tables (original formatting preserved):

REGNAME TODIN SP MODE IN MODE   LOAD  RUN MODE OUT MODE   PB ON   START
+-+---+------+-------+-------+--------+-------+--------+--------+-------+
|E|CRA|0=60Hz|0=INPUT| 0=PHI2|1=FORCE |0=CONT.|0=PULSE |0=PB6OFF|0=STOP |
| |   |      |       |       |  LOAD  |       |        |        |       |
| |   |1=50Hz|1=OUTP.| 1=CNT |(STROBE)|1=O.S. |1=TOGGLE|1=PB6ON |1=START|
+-+---+------+-------+-------+--------+-------+--------+--------+-------+
                       +------------------ TA ----------------------------+

REGNAME ALARM    IN MODE        LOAD  RUN MODE OUT MODE   PB ON   START
+-+---+------+------+--------+--------+-------+--------+--------+-------+
|E|CRB|0=TOD |   0  |0=PHI2  |1=FORCE |0=CONT.|0=PULSE |0=PB7OFF|0=STOP |
| |   |      |   1  |1=CNT   |LOAD    |       |        |        |       |
| |   |1=    |   1  |0=TA    |        |       |        |        |       |
| |   | ALARM|   1  |1=CNT&TA|(STROBE)|1=O.S. |1=TOGGLE|1=PB7ON |1=START|
+-+---+------+------+--------+--------+-------+--------+--------+-------+
               +-------------------------- TB ----------------------------+
```

## Key Registers
- (omitted — source defines CRA/CRB conceptually by name only; no absolute CIA addresses provided in this chunk)

## References
- "time_of_day_tod_clock" — TOD/ALARM and TODIN behavior
- "serial_port_sdr" — CRA SPMODE and CNT/serial shift clock relationship
- "interrupt_control_icr" — Timer underflow interrupts and ICR behavior