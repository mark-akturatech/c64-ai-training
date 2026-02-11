# MACHINE - 6526 CIA (Complex Interface Adapter) specifications: I/O ports, timers, time-of-day clock, serial shift register, and interrupt control for C64

**Summary:** 6526 CIA register set (PRA/PRB, DDRA/DDRB, Timer A/B, TOD, SDR, ICR, CRA/CRB) and behavior including I/O semantics, handshaking (/PC, /FLAG), 16-bit interval timers, TOD (BCD, AM/PM, 50/60Hz), serial shift register (CNT/SP), and interrupt mask/data semantics. Use addresses $DC00-$DC0F (CIA1) or $DD00-$DD0F (CIA2) on the C64.

## I/O Ports (PRA, PRB, DDRA, DDRB)

Ports A and B:
- Each has an 8-bit Peripheral Data Register (PRA/PRB) and an 8-bit Data Direction Register (DDRA/DDRB). DDR bit = 1 => corresponding PR bit is output; DDR bit = 0 => input.
- Reading PRA/PRB returns the actual pin states for both inputs and outputs (reflects PA0-PA7, PB0-PB7).
- Ports have passive and active pull-ups (CMOS and TTL compatible) and a two-TTL-load drive capability.
- PB6 and PB7 can be used as timer outputs (PB6 = Timer A output, PB7 = Timer B output); these timer-output functions override DDRB and force the pin to an output when enabled.

Handshaking:
- /PC (Peripheral Control) output: goes low for one cycle after any read or write of Port B — can signal data-ready or data-accepted.
- /FLAG input: negative-edge sensitive; any negative transition sets the /FLAG interrupt bit (can be used to receive /PC from another CIA or as general-purpose interrupt input).
- For 16-bit transfers across A and B, read/write Port A first to form consistent handshaking ordering.

## Interval Timers (Timer A, Timer B)

General:
- Each timer implements a 16-bit Timer Counter (read-only) and a 16-bit Timer Latch (write-only). Writes go to the latch; reads return the current counter.
- Timers can be used independently or linked (Timer B can count Timer A underflows in some CRB modes).
- Typical uses: delays, pulse generation, pulse trains, variable frequency waveforms, external pulse counting (via CNT).

Functions controlled by CRA/CRB bits:
- Start/Stop: start or stop timer from software. START bit auto-clears on underflow in one-shot mode.
- PB On/Off: force timer output onto PB6/PB7, overriding DDRB.
- Toggle/Pulse: choose whether underflow toggles the output or generates a single one-cycle positive pulse. Toggle output is set high when timer started and cleared on /RES.
- One-Shot/Continuous: one-shot stops after underflow (reload then stop); continuous reloads and repeats.
- Force Load: strobe forces loading of latch into counter (no persistent storage in the strobe bit).
- Input Mode: select clock source:
  - Timer A INMODE: phi2 (CPU clock) or external CNT transitions.
  - Timer B INMODE (CRB5/CRB6): phi2, CNT, Timer A underflows, or Timer A underflows while CNT is high.
- Loading behavior: the timer latch is loaded into the counter on any timer underflow, on a force load, or following a write to the high byte while the timer is stopped. If running, a write to the high byte loads the latch but does not reload the counter.

Read/write layout:
- Timer read addresses return TA LO/HI (counter) and TB LO/HI (counter).
- Timer write addresses write to the prescaler/timer latch bytes (low then high).

## Time-of-Day Clock (TOD)

Format and inputs:
- 24-hour (AM/PM) clock with 1/10th second resolution. Registers are BCD: 10ths, Seconds, Minutes, Hours (MSB of Hours = AM/PM).
- Requires external 60Hz or 50Hz TTL input on TOD pin; CRA bit selects expected frequency (TODIN bit).
- Alarm registers occupy the same addresses as TOD registers; whether a write targets Alarm or TOD is controlled by CRB7 (ALARM bit). Alarm registers are write-only; reading TOD addresses always returns current time regardless of Alarm access bit.

Access rules:
- Writing Hours stops the TOD clock; clock restarts only after a subsequent write to the 10ths register (ensures deterministic start).
- Reading Hours latches all four TOD registers; they remain latched until a read of 10ths. This prevents inconsistent carries across reads. If only one register is needed and carry risk is acceptable, it can be read "on the fly" (but any read of Hours must be followed by a read of 10ths to clear the latch).

Register format: TOD registers read out in BCD; Hours contains PM flag in bit 7.

## Serial Port (SDR)

Operation:
- Buffered 8-bit synchronous shift register. SDR holds the buffered byte.
- Mode select (CRA SPMODE): input or output.
- Input mode: data on SP is shifted into the shift register on rising edge of CNT. After 8 CNT pulses, shift register is transferred to SDR and an interrupt is generated.
- Output mode: Timer A provides baud clock; data shifts out on SP at half the Timer A underflow rate. Transmission starts on a write to SDR (if Timer A is running and continuous). The CNT signal is provided as an output (clock) derived from Timer A.
- Data timing: data valid on falling edge of CNT, remains valid until next falling edge. Shifting is MSB first.
- After 8 CNT pulses an interrupt signals ability to send/receive next byte. If SDR is reloaded before that interrupt, transmission continues seamlessly.
- CNT and SP outputs are open-drain to permit multi-master/multi-slave serial bus configurations (one CIA can act as master providing clock; others can be slaves).

Limitations:
- Maximum theoretical baud = phi2 / 4; usable maximum depends on line loading and receiver speed.

## Interrupt Control (ICR)

Sources:
- Timer A underflow (TA)
- Timer B underflow (TB)
- TOD Alarm (ALRM)
- Serial Port full/empty (SP)
- /FLAG input (FLG)

ICR organization:
- Write: Mask register (set/clear operation with bit 7 as SET/CLEAR control).
  - When writing, if bit7 = 0 (CLEAR mode), any mask bit set to 1 will be cleared; bits written as 0 are unaffected.
  - If bit7 = 1 (SET mode), any mask bit set to 1 will be set; bits written as 0 are unaffected.
- Read: Data register (interrupt flags). The Data register contains an IR bit (MSB) that is set if any enabled interrupt is pending; reading the Data register clears it and releases /IRQ. Each interrupt source sets its flag even if masked; the mask only prevents assertion of the processor IRQ.

Behavioral notes:
- Polling the IR bit clears the Data register; if polled interrupts are used, software must preserve Data register contents if needed.

## Control Registers (CRA, CRB)

- CRA controls Timer A and serial mode bits (start/load/inmode/spmode/todin etc).
- CRB controls Timer B and TOD/Alarm select (start/load/inmode/alarm etc).
- Common bits:
  - START: start/stop timer (auto-clear in one-shot on underflow)
  - PBON: route timer output to PBx
  - OUTMODE: toggle vs pulse output
  - RUNMODE: one-shot vs continuous
  - LOAD: force load (strobe; reads back zero, write zero no effect)
  - INMODE: select clock source (phi2/CNT or other Timer A underflow modes for TB)
  - CRA bit SPMODE selects serial port direction (output/input)
  - CRA TODIN selects 50Hz vs 60Hz TOD input expectation
  - CRB ALARM selects whether writes to TOD addresses write Alarm registers or TOD clock

(All unused bits are unaffected by writes and read as zero.)

## Source Code

```text
Register Map (RS3..RS0 selecting registers)
 RS3 RS2 RS1 RS0  REG  NAME
  0   0   0   0    0    PRA       Peripheral Data Register A
  0   0   0   1    1    PRB       Peripheral Data Register B
  0   0   1   0    2    DDRA      Data Direction Register A
  0   0   1   1    3    DDRB      Data Direction Register B
  0   1   0   0    4    TA LO     Timer A Low Register
  0   1   0   1    5    TA HI     Timer A High Register
  0   1   1   0    6    TB LO     Timer B Low Register
  0   1   1   1    7    TB HI     Timer B High Register
  1   0   0   0    8    TOD 10ths 10ths of Seconds Register
  1   0   0   1    9    TOD SEC   Seconds Register
  1   0   1   0    A    TOD MIN   Minutes Register
  1   0   1   1    B    TOD HR    Hours--AM/PM Register
  1   1   0   0    C    SDR       Serial Data Register
  1   1   0   1    D    ICR       Interrupt Control Register
  1   1   1   0    E    CRA       Control Register A
  1   1   1   1    F    CRB       Control Register B

I/O Ports bit mapping
 Reg  Name  D7   D6   D5   D4   D3   D2   D1   D0
  0   PRA   PA7  PA6  PA5  PA4  PA3  PA2  PA1  PA0
  1   PRB   PB7  PB6  PB5  PB4  PB3  PB2  PB1  PB0
  2   DDRA  DPA7 DPA6 DPA5 DPA4 DPA3 DPA2 DPA1 DPA0
  3   DDRB  DPB7 DPB6 DPB5 DPB4 DPB3 DPB2 DPB1 DPB0

Timer Read layout
 Reg  Name   Bits
 4    TA LO  TAL7..TAL0
 5    TA HI  TAH7..TAH0
 6    TB LO  TBL7..TBL0
 7    TB HI  TBH7..TBH0

Timer Write (prescaler/latch) layout
 Reg  Name   Bits
 4    TA LO  PAL7..PAL0
 5    TA HI  PAH7..PAH0
 6    TB LO  PBL7..PBL0
 7    TB HI  PBH7..PBH0

TOD Read layout (BCD)
 Reg  Name       Bits
 8    TOD 10ths  0 0 0 0  T8 T4 T2 T1
 9    TOD SEC    0 SH4 SH2 SH1 SL8 SL4 SL2 SL1
 A    TOD MIN    0 MH4 MH2 MH1 ML8 ML4 ML2 ML1
 B    TOD HR     PM 0 0 HH HL8 HL4 HL2 HL1

TOD Write:
 CRB7 = 0 writes TOD
 CRB7 = 1 writes Alarm
 (Same BCD format as Read)

Serial Data Register (SDR)
 Reg Name  Bits
 C   SDR   S7 S6 S5 S4 S3 S2 S1 S0

Interrupt Control Register
 Read (Data):
 Reg D ICR bits:
  IR  0 0  FLG SP ALRM TB TA
 Write (Mask):
  S,/C  //// //// FLG SP ALRM TB TA
 (bit7 of written data = set/clear selector)

CRA bit definitions (register E)
 Bit  Name    Function
 0    START   1=start Timer A, 0=stop (auto-reset in one-shot on underflow)
 1    PBON    1=Timer A output appears on PB6
 2    OUTMODE 1=Toggle, 0=Pulse
 3    RUNMODE 1=One-shot, 0=Continuous
 4    LOAD    1=Force load (strobe; reads back zero)
 5    INMODE  1=Timer A counts positive CNT transitions, 0=phi2
 6    SPMODE  1=Serial Port output (CNT sources shift clock), 0=input
 7    TODIN   1=50Hz required on TOD pin, 0=60Hz required

CRB bit definitions (register F)
 Bit  Name    Function
 0    START   1=start Timer B, 0=stop (auto-reset in one-shot on underflow)
 1    PBON    1=Timer B output appears on PB7
 2    OUTMODE 1=Toggle, 0=Pulse
 3    RUNMODE 1=One-shot, 0=Continuous
 4    LOAD    1=Force load (strobe; reads back zero)
5-6  INMODE   CRB5 CRB6:
             0 0 -> Timer B counts phi2 pulses
             0 1 -> Timer B counts positive CNT transitions
             1 0 -> Timer B counts Timer A underflow pulses
             1 1 -> Timer B counts Timer A underflow pulses while CNT is high
 7    ALARM   1=writes to TOD registers set Alarm, 0=writes set TOD clock
```

## Key Registers
- $DC00-$DC0F - 6526 CIA (CIA1) - PRA, PRB, DDRA, DDRB, Timer A/B (TA Lo/Hi, TB Lo/Hi), TOD (10ths, Sec, Min, Hr), SDR, ICR, CRA, CRB
- $DD00-$DD0F - 6526 CIA (CIA2) - PRA, PRB, DDRA, DDRB, Timer A/B (TA Lo/Hi, TB Lo/Hi), TOD (10ths, Sec, Min, Hr), SDR, ICR, CRA, CRB

## References
- "6556/6567 (VIC-II) Chip Specifications" — VIC-II details (next section in original source)

## Labels
- PRA
- PRB
- DDRA
- DDRB
- TA
- TB
- SDR
- ICR
