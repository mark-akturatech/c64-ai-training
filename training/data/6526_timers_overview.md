# 6526 (CIA) Interval Timers — Timer A & Timer B

**Summary:** 6526 (CIA) Timer A and Timer B are 16-bit timers with a write-only 16-bit Timer Latch and a read-only 16-bit Timer Counter; use CNT external input, CRA/CRB control registers, and CIA ICR interrupts. Relevant C64 addresses: CIA1 $DC04-$DC07 / $DC0E-$DC0F and CIA2 $DD04-$DD07 / $DD0E-$DD0F.

## Operation
Each CIA timer is implemented as a 16-bit Timer Counter (read returns current count) and a 16-bit Timer Latch (writes store into the latch). Data written to the timer registers are latched; data read from the timer registers reflect the present contents of the Timer Counter. Timers may operate independently or be linked/cascaded for extended-range or coordinated timing operations.

The timers support:
- Internal counting (CIA clock source) for delays, variable-width pulses, pulse trains and waveform timing.
- External counting via the CNT input (counts external pulses; can be used to measure frequency, pulse width, and delay of external signals).
- Generation of interrupts on underflow (handled through the CIA ICR).

Each timer is configured by its associated control register (CRA for Timer A; CRB for Timer B). Control functions include start/stop, selecting clock source (internal vs. CNT), gating/one-shot vs. continuous operation, and interrupt enable. The ICR provides interrupt flag/enable operations associated with timer underflow.

## Source Code
```text
6526 (CIA) register map (offsets $00-$0F). For C64: CIA1 base $DC00, CIA2 base $DD00.

Offset  Name        Notes
$00     PRA         Port A data
$01     PRB         Port B data
$02     DDRA        Data Direction Register A
$03     DDRB        Data Direction Register B
$04     TALO        Timer A low byte (write -> latch low; read -> counter low)
$05     TAHI        Timer A high byte (write -> latch high; read -> counter high)
$06     TBLO        Timer B low byte (write -> latch low; read -> counter low)
$07     TBHI        Timer B high byte (write -> latch high; read -> counter high)
$08     TOD_10TH    Time-of-day 1/10s
$09     TOD_SEC     Time-of-day seconds
$0A     TOD_MIN     Time-of-day minutes
$0B     TOD_HOUR    Time-of-day hours
$0C     SDR         Serial data register
$0D     ICR         Interrupt control register (flags/read, enable/write)
$0E     CRA         Control register A (Timer A control)
$0F     CRB         Control register B (Timer B control)

Absolute examples (CIA1):
$DC00 PRA
$DC01 PRB
$DC02 DDRA
$DC03 DDRB
$DC04 TALO (Timer A low)
$DC05 TAHI (Timer A high)
$DC06 TBLO (Timer B low)
$DC07 TBHI (Timer B high)
$DC0D ICR
$DC0E CRA
$DC0F CRB

Absolute examples (CIA2):
$DD00 PRA
$DD01 PRB
$DD02 DDRA
$DD03 DDRB
$DD04 TALO (Timer A low)
$DD05 TAHI (Timer A high)
$DD06 TBLO (Timer B low)
$DD07 TBHI (Timer B high)
$DD0D ICR
$DD0E CRA
$DD0F CRB
```

## Key Registers
- $DC04-$DC07 - CIA1 - Timer A/B low/high (Timer Latch writes / Timer Counter reads)
- $DC0E-$DC0F - CIA1 - CRA/CRB (Timer A/B control registers)
- $DD04-$DD07 - CIA2 - Timer A/B low/high (Timer Latch writes / Timer Counter reads)
- $DD0E-$DD0F - CIA2 - CRA/CRB (Timer A/B control registers)

## References
- "6526_register_map" — full CIA register map and offsets
- "6526_timer_control_functions" — detailed CRA/CRB bit meanings and modes
- "6526_timer_registers_and_load_behavior" — detailed latch/counter transfer and byte-order behavior

## Labels
- TALO
- TAHI
- TBLO
- TBHI
- CRA
- CRB
- ICR
