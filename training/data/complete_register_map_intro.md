# SID 6581/8580 Register Map ($D400-$D41C)

**Summary:** SID register base $D400 (54272), mirror range $D400-$D7FF (32-byte mirror), voice register offsets Voice1 $D400-$D406, Voice2 $D407-$D40D, Voice3 $D40E-$D414; registers $D400-$D418 are write-only except read-only registers $D419-$D41C.

## Register map overview
Base address: $D400 (54272 decimal). The SID is mirrored every 32 bytes through $D400-$D7FF.

Each voice uses the same 7-register layout (frequency, pulse width, control, envelopes). Voice register blocks:
- Voice 1: $D400-$D406
- Voice 2: $D407-$D40D
- Voice 3: $D40E-$D414

Global/filter/master registers follow the three voices. By convention SID control and envelope registers are write-only; only the final output/readback registers are readable: $D419-$D41C.

This chunk preserves the SID register addresses and concise functional names for each register group (no bit-level layouts are expanded here).

## Source Code
```text
SID Register Map ($D400-$D41C) -- addresses and functional names

$D400 (54272) - Voice 1: Frequency low byte (FREQ LO)
$D401 (54273) - Voice 1: Frequency high byte (FREQ HI)
$D402 (54274) - Voice 1: Pulse width low byte (PW LO)
$D403 (54275) - Voice 1: Pulse width high (upper bits of PW)
$D404 (54276) - Voice 1: Control register (Gate/Sync/Ring/Test/Waveform bits)
$D405 (54277) - Voice 1: Attack / Decay (AD)
$D406 (54278) - Voice 1: Sustain / Release (SR)

$D407 (54279) - Voice 2: Frequency low byte (FREQ LO)
$D408 (54280) - Voice 2: Frequency high byte (FREQ HI)
$D409 (54281) - Voice 2: Pulse width low byte (PW LO)
$D40A (54282) - Voice 2: Pulse width high (upper bits of PW)
$D40B (54283) - Voice 2: Control register (Gate/Sync/Ring/Test/Waveform bits)
$D40C (54284) - Voice 2: Attack / Decay (AD)
$D40D (54285) - Voice 2: Sustain / Release (SR)

$D40E (54286) - Voice 3: Frequency low byte (FREQ LO)
$D40F (54287) - Voice 3: Frequency high byte (FREQ HI)
$D410 (54288) - Voice 3: Pulse width low byte (PW LO)
$D411 (54289) - Voice 3: Pulse width high (upper bits of PW)
$D412 (54290) - Voice 3: Control register (Gate/Sync/Ring/Test/Waveform bits)
$D413 (54291) - Voice 3: Attack / Decay (AD)
$D414 (54292) - Voice 3: Sustain / Release (SR)

$D415 (54293) - Filter: Cutoff frequency low byte (FC LO)
$D416 (54294) - Filter: Cutoff frequency high byte / MSBs (FC HI)
$D417 (54295) - Filter: Resonance and mode/voice-routing bits (RES / mode)
$D418 (54296) - Filter/Global: Filter routing enable bits and master volume (mode / volume)

Read-only output/readback registers:
$D419 (54297) - Read-only: Voice 1 output / oscillator output (readback)
$D41A (54298) - Read-only: Voice 2 output / oscillator output (readback)
$D41B (54299) - Read-only: Voice 3 output / oscillator output (readback)
$D41C (54300) - Read-only: Combined/mixer/filter output (readback)

Mirror range:
SID registers repeat every 32 bytes in the range $D400-$D7FF (useful when addressing via mirrored addresses).

Notes:
- The 7-register-per-voice layout is identical for all three voices.
- All SID write registers ($D400-$D418) are typically write-only on the C64; only $D419-$D41C return readable output values.
```

## Key Registers
- $D400-$D41C - SID - Complete register block (voice registers, filter, master; write-only except $D419-$D41C)
- $D400-$D406 - SID - Voice 1 registers (Freq/PW/Control/AD/SR)
- $D407-$D40D - SID - Voice 2 registers (Freq/PW/Control/AD/SR)
- $D40E-$D414 - SID - Voice 3 registers (Freq/PW/Control/AD/SR)
- $D415-$D418 - SID - Filter and global/mixer/volume registers
- $D419-$D41C - SID - Read-only oscillator/filter output registers

## References
- "voice1_registers" — expands on Voice register layout and addresses
- "read_only_registers" — expands on which registers are readable ($D419-$D41C)