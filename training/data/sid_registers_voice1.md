# SID Voice 1 Registers ($D400-$D406)

**Summary:** SID (Sound Interface Device) Voice 1 register map for addresses $D400-$D406: two-byte frequency ($D400-$D401) and pulse width ($D402-$D403) registers (write-only), plus control ($D404), attack/decay ($D405) and sustain/release ($D406) envelope registers.

## Description
This chunk documents the SID (MOS6581/8580) Voice 1 register assignments in the C64 I/O space. All listed registers are write-only SID registers used to program the oscillator, pulse width, waveform/control, and ADSR envelope for voice 1.

- $D400-$D401 — Voice 1 frequency register (two bytes, low/high): set the oscillator frequency for voice 1 (write-only).
- $D402-$D403 — Voice 1 pulse width register (two bytes, low/high): set the pulse waveform duty/pulse width for voice 1 (write-only).
- $D404 — Voice 1 control register: controls waveform selection and modulation/gate-type functions for voice 1 (write-only).
- $D405 — Voice 1 Attack/Decay envelope register (write-only).
- $D406 — Voice 1 Sustain/Release envelope register (write-only).

No bit-level layouts are included here; consult SID register references for waveform/control bit definitions and exact envelope bit fields.

## Source Code
```text
Source: sta.c64.org - "Commodore 64 Complete Memory Map"

SID: Sound Interface Device ($D400-$D7FF)

Voice 1 ($D400-$D406):

$D400-$D401  Voice 1 Freq       Frequency register (write-only)
$D402-$D403  Voice 1 Pulse      Pulse width (write-only)
$D404        Voice 1 Control    Waveform and modulation control (write-only)
$D405        Voice 1 A/D        Attack and Decay length (write-only)
$D406        Voice 1 S/R        Sustain volume and Release length (write-only)

Additional information can be found by searching:
- "sid_filter_registers" which expands on SID filter and master volume at $D415-$D418
```

## Key Registers
- $D400-$D406 - SID - Voice 1 registers: frequency (two-byte), pulse width (two-byte), control, attack/decay, sustain/release

## References
- "sid_filter_registers" — SID filter and master volume registers at $D415-$D418

## Labels
- SID_VOICE1_FREQ
- SID_VOICE1_PULSE
- SID_VOICE1_CONTROL
- SID_VOICE1_AD
- SID_VOICE1_SR
