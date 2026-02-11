# SID 6581/8580 Quick Reference: $D400-$D41C

**Summary:** Concise SID 6581/8580 register quick-reference for addresses $D400-$D41C, listing write-only voice registers (frequency, pulse width, Control NPSTWRSG, Attack/Decay AAAADDDD, Sustain/Release SSSSRRRR), filter registers (Cutoff, Resonance/Route RRRREFFF, Mode/Volume MHBL VVVV) and read-only registers ($D419-$D41C).

## Overview
This packet is a compact register card for the SID sound chip (6581/8580) covering addresses $D400-$D41C. It lists each register address (hex and decimal), register name, bit-field mnemonic/layout and R/W direction. Use this for quick lookup of frequency, pulse width, control, envelope, filter and read-only monitoring registers. Control bits use the NPSTWRSG mnemonic; filter mode/route bits use MHBL and R/E/F/V bit fields.

## Source Code
```text
================================================================================
16. SID REGISTER QUICK REFERENCE CARD
================================================================================

Addr   Dec    Register Name             Bits        R/W
-----  -----  ------------------------  ----------  ---
$D400  54272  Voice 1 Freq Lo           FFFFFFFF    W
$D401  54273  Voice 1 Freq Hi           FFFFFFFF    W
$D402  54274  Voice 1 Pulse Width Lo    PPPPPPPP    W
$D403  54275  Voice 1 Pulse Width Hi    ----PPPP    W
$D404  54276  Voice 1 Control           NPSTWRSG    W
$D405  54277  Voice 1 Attack/Decay      AAAADDDD    W
$D406  54278  Voice 1 Sustain/Release   SSSSRRRR    W
$D407  54279  Voice 2 Freq Lo           FFFFFFFF    W
$D408  54280  Voice 2 Freq Hi           FFFFFFFF    W
$D409  54281  Voice 2 Pulse Width Lo    PPPPPPPP    W
$D40A  54282  Voice 2 Pulse Width Hi    ----PPPP    W
$D40B  54283  Voice 2 Control           NPSTWRSG    W
$D40C  54284  Voice 2 Attack/Decay      AAAADDDD    W
$D40D  54285  Voice 2 Sustain/Release   SSSSRRRR    W
$D40E  54286  Voice 3 Freq Lo           FFFFFFFF    W
$D40F  54287  Voice 3 Freq Hi           FFFFFFFF    W
$D410  54288  Voice 3 Pulse Width Lo    PPPPPPPP    W
$D411  54289  Voice 3 Pulse Width Hi    ----PPPP    W
$D412  54290  Voice 3 Control           NPSTWRSG    W
$D413  54291  Voice 3 Attack/Decay      AAAADDDD    W
$D414  54292  Voice 3 Sustain/Release   SSSSRRRR    W
$D415  54293  Filter Cutoff Lo          -----FFF    W
$D416  54294  Filter Cutoff Hi          FFFFFFFF    W
$D417  54295  Filter Resonance/Route    RRRREFFF    W
$D418  54296  Filter Mode/Volume        MHBL VVVV   W
$D419  54297  Paddle X                  XXXXXXXX    R
$D41A  54298  Paddle Y                  YYYYYYYY    R
$D41B  54299  Voice 3 Oscillator        OOOOOOOO    R
$D41C  54300  Voice 3 Envelope          EEEEEEEE    R

Control Register Bits:
  N = Noise    P = Pulse    S = Sawtooth  T = Triangle
  W = Test     R = Ring Mod  S = Sync      G = Gate

Filter Mode Bits ($D418):
  M = Mute Voice 3   H = High-pass   B = Band-pass   L = Low-pass
  V = Volume (4 bits)

Filter Routing Bits ($D417):
  R = Resonance (4 bits)  E = External input  F = Filter voice flags (3/2/1)
```

## Key Registers
- $D400-$D406 - SID - Voice 1: Freq Lo/Hi, PW Lo/Hi, Control (NPSTWRSG), Attack/Decay, Sustain/Release
- $D407-$D40D - SID - Voice 2: Freq Lo/Hi, PW Lo/Hi, Control (NPSTWRSG), Attack/Decay, Sustain/Release
- $D40E-$D414 - SID - Voice 3: Freq Lo/Hi, PW Lo/Hi, Control (NPSTWRSG), Attack/Decay, Sustain/Release
- $D415-$D416 - SID - Filter Cutoff Lo/Hi (lower 3 bits in Lo, remaining bits in Hi)
- $D417 - SID - Filter Resonance/Route (RRRREFFF)
- $D418 - SID - Filter Mode/Volume (MHBL VVVV)
- $D419-$D41C - SID - Read-only registers: Paddle X/Y, Voice 3 Oscillator, Voice 3 Envelope

## References
- "complete_register_map_intro" — expands on full register map and mirror range
- "voice1_registers" — expands on control register bit meanings (NPSTWRSG)
- "read_only_registers" — expands on readable registers $D419-$D41C