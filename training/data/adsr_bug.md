# SID ADSR Bug (6581 / 8580)

**Summary:** Describes the SID ADSR bug where the internal LFSR-based rate counter can delay the Attack phase when GATE is set during Release; mentions common workarounds (GATE toggle, hard restart) and refers to voice control / ADSR registers ($D400-$D414, $D415-$D418).

## Description
The SID contains an internal rate counter (implemented with an LFSR) that governs envelope timing. If the envelope is in the Release phase and the GATE bit is set to start a new note, the Attack phase can be delayed briefly because the rate counter must finish its current LFSR cycle before responding to the new GATE state. This causes an audible latency between setting GATE and the start of Attack.

Commonly used workarounds:
- Toggle GATE: write GATE=0 then GATE=1 in successive frames to ensure the rate counter sees a clear start.
- Hard restart: pre-set the envelope/rate state to a known condition before retriggering so the SID responds immediately (see "programming_initialization" for player techniques).

(Parenthetical: GATE refers to the voice control register's gate/loop/attack trigger bit.)

## Key Registers
- $D400-$D406 - SID - Voice 1 (frequency, pulse width, control/GATE, attack/decay)
- $D407-$D40D - SID - Voice 2 (frequency, pulse width, control/GATE, attack/decay)
- $D40E-$D414 - SID - Voice 3 (frequency, pulse width, control/GATE, attack/decay)
- $D415-$D418 - SID - Filter and filter control

## References
- "adsr_overview" — ADSR operation and timing table
- "programming_initialization" — initialization and hard restart techniques in player code