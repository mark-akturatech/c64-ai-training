# CIA (6526) Timer Control — functions: Start/Stop, PB On/Off, Toggle/Pulse, One‑Shot/Continuous, Force Load, Input Mode

**Summary:** Describes the CIA (6526) timer control register functions used to control Timer A and Timer B: Start/Stop, PB On/Off (force PB6/PB7), Toggle vs Pulse output behavior, One‑Shot vs Continuous modes, Force Load strobe, and Input Mode (ϕ2 / CNT / Timer A underflow options). Mentions CIA timer registers ($DC04-$DC07, $DC0E-$DC0F for CIA1; $DD04-$DD07, $DD0E-$DD0F for CIA2).

## Timer control overview
This documents the functional behavior implemented by the CIA timer control registers (CRA / CRB) for Timer A and Timer B. It covers how the control bits affect timer start/stop, output routing to PORT B, output waveform selection, counting modes, immediate latch loading, and selectable clock/count sources.

**[Note: Source text used "02 clock" — interpreted here as ϕ2 (phase‑2) system clock.]**

## Start / Stop
A control bit in the timer control register allows the CPU to start or stop the timer at any time. When cleared the timer halts; when set the timer runs (counts down) using the selected input source.

## PB On / Off (force timer output to PORT B)
A control bit enables the timer output to be driven onto a PORT B pin:
- Timer A → PB6
- Timer B → PB7
When this bit is set the CIA forces the corresponding PB line to an output regardless of the DDRB setting (overrides DDRB).

## Toggle / Pulse (output shape on underflow)
A control bit selects the form of the timer output applied to the PB pin:
- Toggle mode: on every timer underflow the output toggles state. The toggle output is explicitly set high when the timer is started and is cleared low by /RES (RESET).
- Pulse mode: on every timer underflow the CIA generates a single positive pulse one cycle long.

## One‑Shot / Continuous (counting behavior)
A control bit selects one of two counting modes:
- One‑Shot: the timer counts down from the latched value to zero, generates an interrupt, reloads the latch into the counter, then stops (does not continue counting).
- Continuous: the timer counts to zero, generates an interrupt, reloads the latched value into the counter, and repeats the sequence continuously.

## Force Load (immediate latch → counter)
A strobe bit forces the timer latch to be loaded into the counter immediately when set, regardless of whether the timer is running. This allows synchronous immediate updates to the active countdown value.

## Input Mode (clock / count source selection)
Control bits in the timer control register select which clock or pulses decrement the timer:

- Timer A input options:
  - ϕ2 (phase‑2 system clock)
  - External CNT pin pulses (CNT = external count input)

- Timer B input options:
  - ϕ2 (phase‑2 system clock)
  - External CNT pin pulses
  - Timer A underflow pulses (i.e., Timer B counts Timer A underflows)
  - Timer A underflow pulses gated by CNT held high (Timer B counts Timer A underflows only while CNT is asserted)

These selection bits determine whether the timer decrements on internal system clock ticks, external pulses, or events from Timer A.

## Source Code
(omitted — no assembly/BASIC/code listings or register bit tables were supplied)

## Key Registers
- $DC04-$DC07 - CIA 1 - Timer A low/high ($DC04/$DC05) and Timer B low/high ($DC06/$DC07)
- $DC0E-$DC0F - CIA 1 - Timer A/B control registers (CRA/CRB: Start/Stop, PB On/Off, Toggle/Pulse, One‑Shot/Continuous, Force Load, Input Mode)
- $DD04-$DD07 - CIA 2 - Timer A low/high and Timer B low/high
- $DD0E-$DD0F - CIA 2 - Timer A/B control registers (CRA/CRB)

## References
- "6526_timers_overview" — general purpose and capabilities of the timers
- "6526_timer_registers_and_load_behavior" — latch/load timing and register formats