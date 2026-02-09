# Commodore 64 SID (6581) — register usage (voice, pulse, waveform, ADSR, filter, I/O)

**Summary:** SID 6581 register map and usage for voices (frequency, pulse width, waveform/control, ADSR), filter & volume, and read-only sense registers at $D400-$D41C (SID I/O region). Includes write-only voice registers, filter controls, and paddle/voice-envelope sense registers.

**Registers overview**
This chunk documents which SID registers control each voice (frequency low/high, pulse width low/high bits), waveform & control, ADSR envelope parameters, filter frequency/controls, master volume, and the read-only sense registers. Addresses are in the $D400-$D41C I/O range (SID 6581).

High-level groups:
- Voices: each voice has frequency (low/high), pulse width (low/high bits), waveform & control, Attack/Decay, Sustain/Release.
- Filter & Volume: low/high filter frequency, resonance & voice routing, master volume, and filter shape.
- Sense (read-only): paddle X/Y, voice 3 output, envelope 3.

ADSR numeric ranges are preserved from the source: Attack 2 ms–8 s, Decay 6 ms–24 s, Sustain level (0–15 typically), Release 6 ms–24 s. The source lists waveform names (Noise, Pulse, Saw, Triangle) and control flags (Test, Ring, Sync, Gate/On, Mod).

Bit-position maps for control bits (waveform/control) and high bits fields are detailed below.

**Per-voice registers (summary)**
- **Frequency low/high:** voice frequency (coarse + fine) — write-only.
- **Pulse width low + high bits:** 16-bit pulse width (low byte at one address, high partial bits at the next).
- **Waveform & control:** waveform selection (Noise, Pulse, Saw, Triangle) plus Test, Ring, Sync, Gate/On, Modulator enable; write-only.
- **ADSR envelopes:**
  - **Attack/Decay register:** Attack time, Decay time — write-only.
  - **Sustain/Release register:** Sustain level, Release time — write-only.

The source groups these per voice and shows the three voice register addresses: Voice1 $D400/$D401/$D402/$D403/$D404/$D405/$D406; Voice2 $D407-$D40D; Voice3 $D40E-$D414.

**Filter, volume, and sense registers**
- **Filter low bits / filter frequency high byte:** filter cutoff frequency is set across $D415 (low bits) and $D416 (high byte).
- **Resonance and voice routing:** $D417 selects resonance and which voices are routed through the filter (external/ext, voice1, voice2, voice3).
- **Master volume / filter shape / voice 3 off:** $D418 contains master volume and filter shape selection bits, and a V3 Off flag.
- **Read-only sense registers:**
  - **Paddle X:** $D419
  - **Paddle Y:** $D41A
  - **Voice 3 output:** $D41B
  - **Envelope 3:** $D41C

## Source Code
```text
Commodore 64 6581 Usage (SID)
-----------------------------

                             Voices (write only)
 Voice1 Voice2 Voice3                                   Voice1 Voice2 Voice3
                      +---+---+---+---+---+---+---+---+
 $D400  $D407  $D40E  |                       Low Byte|  54272  54279  54286
                      +- Frequency - - - - - - - - - -+
 $D401  $D408  $D40F  |                      High Byte|  54273  54280  54287
                      +---+---+---+---+---+---+---+---+
 $D402  $D409  $D410  | Pulse Width           Low Byte|  54274  54281  54288
                      +---+---+---+---+- - - - - - - -+
 $D403  $D40A  $D411  | 0 | 0 | 0 | 0 |      High Bits|  54275  54282  54289
                      +---+---+---+---+---+---+---+---+
 $D404  $D40B  $D412  |   Waveform    |Tst|Rng|Syn|On/|  54276  54283  54290
                      |Noi|Pul|Saw|Tri|   |Mod|   |Off|
                      +---+---+---+---+---+---+---+---+
 $D405  $D40C  $D413  |     Attack    |     Decay     |  54277  54284  54291
                      | 2 ms - 8 sec  | 6 ms - 24 sec |
                      +---+---+---+---+---+---+---+---+
 $D406  $D40D  $D414  |    Sustain    |    Release    |  54278  54285  54292
                      |     Level     | 6 ms - 24 sec |
                      +---+---+---+---+---+---+---+---+



                        Filter & Volume (write only)

                      +---+---+---+---+---+---+---+---+
               $D415  | 0 | 0 | 0 | 0 |       Low Bits|  54293
                      +---+---+---+---+- - - - - - - -+
               $D416  | Filter Frequency     High Byte|  54294
                      +---+---+---+---+---+---+---+---+
               $D417  |   Resonance   | Filter Voices |  54295
                      |               |ext| 1 | 2 | 3 |
                      +---+---+---+---+---+---+---+---+
               $D418  |V3 |FilterShape|    Master     |  54296
                      |Off|Hi |BP |Low|    Volume     |
                      +---+---+---+---+---+---+---+---+


                            Sense (read only)

                      +---+---+---+---+---+---+---+---+
               $D419  |           Paddle X            |  54297
                      +---+---+---+---+---+---+---+---+
               $D41A  |           Paddle Y            |  54298
                      +---+---+---+---+---+---+---+---+
               $D41B  |        Voice 3 Output         |  54299
                      +---+---+---+---+---+---+---+---+
               $D41C  |          Envelope 3           |  54300
                      +---+---+---+---+---+---+---+---+
```

## Key Registers
- **$D400-$D414** - SID (6581) - Voice registers (frequency low/high, pulse width low/high bits, waveform/control, Attack/Decay, Sustain/Release) for Voice 1, 2, 3 (write-only).
- **$D415-$D418** - SID (6581) - Filter frequency low bits ($D415), filter frequency high byte ($D416), resonance & voice routing ($D417), filter shape / master volume / V3 Off ($D418) (write-only).
- **$D419-$D41C** - SID (6581) - Sense (read-only): Paddle X ($D419), Paddle Y ($D41A), Voice 3 output ($D41B), Envelope 3 ($D41C).

## References
- "c64_memory_map_high_memory" — expands on SID I/O region in $D400 area