# 6581 SID (Sound Interface Device) — 3-voice synthesizer, waveforms, ADSR, filter, ring mod, sync

**Summary:** 6581/6582 SID — three independent oscillators (voices) with Triangle/Saw/Pulse/Noise waveforms, 12-bit pulse width, per-voice ADSR envelopes, oscillator sync and ring-mod, programmable 11-bit filter (cutoff + resonance), and readable POTX/POTY/OSC3/ENV3 registers at $D400-$D41C.

## Concept
The SID is a single-chip, 3-voice synthesizer intended for 65xx systems. Each voice contains:
- Tone oscillator / waveform generator (frequency control, saw/tri/pulse/noise)
- Pulse-width control (12-bit)
- Envelope generator (exponential ADSR; 16 attack/decay/release settings, 16 sustain levels)
- Amplitude modulator (driven by the envelope)

Voices may be routed through a programmable subtractive filter (LP/BP/HP, 11-bit cutoff, 4-bit resonance) and combined to the final output. Voice 3 and its envelope are readable for modulation purposes; POTX/POTY ADCs are provided for external controls. The chip supports ring modulation and hard synchronization between oscillators.

**[Note: Source may contain an error — the text alternately refers to the device as 6581 and 6582; register map and behavior correspond to the standard SID register set used at $D400.]**

## Voices, waveforms and control bits
- 3 voices, oscillator frequency range roughly 0–4 kHz (frequency controlled by a 16-bit value per voice).
- Waveforms per voice: Triangle, Sawtooth, Variable Pulse (12-bit PW), Noise.
- Waveform selection (bits) are logically ANDed — selecting multiple waveforms produces an AND of outputs (use with care; Noise+other waveforms can "lock up" until TEST reset).
- Control bits (per-voice CONTROL register): GATE (trigger ADSR), SYNC (hard sync to another oscillator), RING MOD (triangle replaced with ring-mod of this voice and the referenced voice), TEST (reset/hold oscillator and noise), plus waveform select bits.
- TEST locks the oscillator and resets Noise and Pulse outputs until cleared (can be used for synchronization).

Frequency formula (voice frequency registers form 16-bit Fn):
- Fout = (Fn * Fclk / 1677726) Hz
- For 1.0 MHz phi2: Fout ≈ Fn * 0.059604645 Hz

Pulse width formula (12-bit PWn):
- PWout = (PWn / 40.95) %

A PW value of 0 or 4095 yields DC; 2048 ($800) yields a square wave.

## Envelope generator (per voice)
- ADSR with exponential response:
  - Attack: 2 ms — 8 s (16 steps)
  - Decay: 6 ms — 24 s (16 steps)
  - Sustain: 16 linear steps (0..15)
  - Release: same steps/rates as Decay
- Envelope cycling can be altered at any point by changing the GATE bit; retriggering during release or other mid-cycle states starts the new phase from current amplitude.

(Full envelope rate values per step are provided in the Source Code table.)

## Filter and routing
- Cutoff (11-bit) formed from FC LOW/FC HIGH registers; approximate range ≈ 30 Hz — 12 kHz.
- Resonance: 4-bit (16 linear settings from 0 to max).
- FLT bits select which voices (and external input) are routed through the filter.
- MODE bits select filter output(s): LP, BP, HP; modes are additive (LP+HP = Notch).
- 3OFF bit disconnects Voice 3 from the direct (non-filtered) audio path — useful when using Voice 3 solely as a modulation source.

## Readable registers and modulation sources
- POTX/POTY: 8-bit ADC readings for pots on pins (updated every 512 phi2 cycles).
- OSC3 (read-only): upper 8 bits of Oscillator 3 output; waveform-dependent sequence (saw = ramp 0..255, tri = up/down, pulse = jumps, noise = random) — usable as modulation or RNG.
- ENV3 (read-only): output of Voice 3 envelope generator; only produces output when Voice 3 is gated — useful to modulate filter or other parameters for wah/phaser effects.

## Source Code
```text
SID Register Map (29 bytes at $D400-$D41C)

Address  Reg#  Bits7..0                Name                Type
$D400     00   F07 F06 F05 F04 F03 F02 F01 F00   FREQ LO         W
$D401     01   F15 F14 F13 F12 F11 F10 F09 F08   FREQ HI         W
$D402     02   PW07 PW06 PW05 PW04 PW03 PW02 PW01 PW00   PW LO  W
$D403     03   -   -   -   -  PW11 PW10 PW09 PW08   PW HI     W
$D404     04   NOISE PULSE SAW TRI TEST RING SYNC GATE  CONTROL  W
$D405     05   ATK3 ATK2 ATK1 ATK0 DCY3 DCY2 DCY1 DCY0  ATT/DEC  W
$D406     06   STN3 STN2 STN1 STN0 RLS3 RLS2 RLS1 RLS0  SUS/REL  W

$D407     07   F07 F06 F05 F04 F03 F02 F01 F00   FREQ LO (V2)    W
$D408     08   F15 F14 F13 F12 F11 F10 F09 F08   FREQ HI (V2)    W
$D409     09   PW07 PW06 PW05 PW04 PW03 PW02 PW01 PW00   PW LO (V2) W
$D40A     0A   -   -   -   -  PW11 PW10 PW09 PW08   PW HI (V2)    W
$D40B     0B   NOISE PULSE SAW TRI TEST RING SYNC GATE  CONTROL (V2) W
$D40C     0C   ATK3 ATK2 ATK1 ATK0 DCY3 DCY2 DCY1 DCY0  ATT/DEC (V2) W
$D40D     0D   STN3 STN2 STN1 STN0 RLS3 RLS2 RLS1 RLS0  SUS/REL (V2) W

$D40E     0E   F07 F06 F05 F04 F03 F02 F01 F00   FREQ LO (V3)    W
$D40F     0F   F15 F14 F13 F12 F11 F10 F09 F08   FREQ HI (V3)    W
$D410     10   PW07 PW06 PW05 PW04 PW03 PW02 PW01 PW00   PW LO (V3) W
$D411     11   -   -   -   -  PW11 PW10 PW09 PW08   PW HI (V3)    W
$D412     12   NOISE PULSE SAW TRI TEST RING SYNC GATE  CONTROL (V3) W
$D413     13   ATK3 ATK2 ATK1 ATK0 DCY3 DCY2 DCY1 DCY0  ATT/DEC (V3) W
$D414     14   STN3 STN2 STN1 STN0 RLS3 RLS2 RLS1 RLS0  SUS/REL (V3) W

$D415     15   -   -   -   -   -   FC02 FC01 FC00   FC LOW         W
$D416     16   FC10 FC09 FC08 FC07 FC06 FC05 FC04 FC03   FC HIGH    W
$D417     17   RES3 RES2 RES1 RES0 FLTEX FLT3 FLT2 FLT1   RES/FILT  W
$D418     18   3OFF HP BP LP VOL3 VOL2 VOL1 VOL0   MODE/VOL      W

$D419     19   PX7 PX6 PX5 PX4 PX3 PX2 PX1 PX0   POT X           R
$D41A     1A   PY7 PY6 PY5 PY4 PY3 PY2 PY1 PY0   POT Y           R
$D41B     1B   O7 O6 O5 O4 O3 O2 O1 O0             OSC3/RANDOM    R
$D41C     1C   E7 E6 E5 E4 E3 E2 E1 E0             ENV3           R

Notes:
- FREQ registers are 16-bit unsigned (FREQ HI contains the high byte).
- PW registers form a 12-bit unsigned value (PW HI uses only bits 0-3 for PW11..PW8).
- FC registers provide 11-bit cutoff control (FC HIGH + lower bits in FC LOW).
- MODE/VOL: bits 4-6 = LP/BP/HP outputs; bit 7 = 3OFF; bits 0-3 = global volume (0..15).

Envelope Rates (Table — times are per cycle; based on 1.0 MHz phi2; scale by 1MHz/phi2):
VALUE (hex)   ATTACK (time/cycle)   DECAY/RELEASE (time/cycle)
0 (0)         2 ms                  6 ms
1 (1)         8 ms                  24 ms
2 (2)        16 ms                  48 ms
3 (3)        24 ms                  72 ms
4 (4)        38 ms                 114 ms
5 (5)        56 ms                 168 ms
6 (6)        68 ms                 204 ms
7 (7)        80 ms                 240 ms
8 (8)       100 ms                 300 ms
9 (9)       250 ms                 750 ms
A (10)      500 ms                 1.5 s
B (11)      800 ms                 2.4 s
C (12)        1 s                   3 s
D (13)        3 s                   9 s
E (14)        5 s                  15 s
F (15)        8 s                  24 s
```

## Key Registers
- $D400-$D406 - SID - Voice 1: FREQ LO/HI, PW LO/HI, CONTROL, ATTACK/DECAY, SUSTAIN/RELEASE
- $D407-$D40D - SID - Voice 2: FREQ LO/HI, PW LO/HI, CONTROL, ATTACK/DECAY, SUSTAIN/RELEASE
- $D40E-$D414 - SID - Voice 3: FREQ LO/HI, PW LO/HI, CONTROL, ATTACK/DECAY, SUSTAIN/RELEASE
- $D415-$D416 - SID - Filter Cutoff (FC LOW, FC HIGH)
- $D417-$D418 - SID - Filter RES/FILT, MODE/VOL (resonance, routing, LP/BP/HP, 3OFF, global volume)
- $D419-$D41C - SID - POTX, POTY, OSC3/RANDOM, ENV3 (read-only modulation inputs)

## References
- (none)