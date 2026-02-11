# SID Paddle and Voice 3 Readback ($D419-$D41C)

**Summary:** Read-only SID readback registers at $D419-$D41C provide paddle X/Y analog values (paddle port readback updated every 512 cycles) and Voice 3 waveform/ADSR output readback (voice 3 status). Addresses $D419-$D41C are part of the SID register area ($D400 base).

## SID readback registers (overview)
These four read-only registers return sampled/readback values from the SID hardware:

- $D419 — Paddle X: Paddle X-axis analog readback (read-only). The value is updated every 512 cycles.
- $D41A — Paddle Y: Paddle Y-axis analog readback (read-only). The value is updated every 512 cycles.
- $D41B — Voice 3 Wave: Read-only readback of Voice 3 waveform output/state.
- $D41C — Voice 3 ADSR: Read-only readback of Voice 3 ADSR output/state.

No write functionality is provided at these addresses; they are for software polling/debugging of paddle positions and voice-3 output/ADSR status. (See "sid_registers_voice3" for comparison between voice 3 write registers and these readback registers.)

## Source Code
```text
$D419   Paddle X                Paddle X-axis value (read-only, updates every 512 cycles)
$D41A   Paddle Y                Paddle Y-axis value (read-only, updates every 512 cycles)
$D41B   Voice 3 Wave            Voice 3 waveform output (read-only)
$D41C   Voice 3 ADSR            Voice 3 ADSR output (read-only)
```

## Key Registers
- $D419-$D41C - SID - Paddle X/Y readback and Voice 3 waveform/ADSR readback (read-only)

## References
- "sid_registers_voice3" — expands on voice 3 write registers vs readback

## Labels
- PADDLE_X
- PADDLE_Y
- VOICE3_WAVE
- VOICE3_ADSR
