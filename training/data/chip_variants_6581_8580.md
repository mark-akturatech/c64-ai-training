# SID 6581 vs 8580 — MOS 6581/8580 Comparison (production, process, voltages, filters, digi playback)

**Summary:** Comparison of MOS 6581 vs MOS 8580 SID chips covering production years, fabrication process (NMOS vs HMOS-II), supply voltages (Vdd), external filter capacitor values, tonal/DC differences, the 6581 “volume-register digi” quirk and the 8580 hardware fix (EXT IN resistor mod), and 6581 sub‑revisions (R1/R2/R3/R4AR).

**Comparison (6581 vs 8580)**
- **Production:**
  - MOS 6581: produced ~1982–1987.
  - MOS 8580 (often R5): produced ~1987–1993.
- **Process:**
  - 6581: NMOS process.
  - 8580: HMOS-II process.
- **Supply voltage (Vdd):**
  - 6581: nominal +12 V supply for internal analog sections.
  - 8580: nominal +9 V supply for internal analog sections.
- **External filter capacitors (CAP1A/B, CAP2A/B):**
  - 6581: typically 470 pF.
  - 8580: typically 22 nF (much larger — large effect on filter frequency and Q).
- **Tonal/character differences:**
  - 6581: darker, “grittier” filter response; stronger perceived resonance and coloration.
  - 8580: brighter, cleaner sound with reduced coloration and tighter filter response.
- **DC offset / audio bias:**
  - 6581: noticeable DC offset in audio output (6 V DC bias reported, ~3 Vp‑p max swing referenced).
  - 8580: lower DC offset; minimal DC offset in audio output.
- **Audio output levels:**
  - 6581: audio with ~6 V DC bias and up to ~3 Vp‑p maximum swing (as reported).
  - 8580: lower bias and different output behavior due to process and supply voltage changes.

**Digi playback quirk and hardware mod**
- **6581 unintended quirk:**
  - Rapid writes to the master volume register produced audible clicks proportional to the written value. Programmers exploited this to play 4‑bit digitized samples by repeatedly writing sample values to the volume register (software technique).
  - This behavior is effectively a side effect of the analog volume implementation and the DC shift/click on volume changes.
- **8580 change and hardware workaround:**
  - The 8580 “fixed” the audible click/volume‑write characteristic, so the same rapid volume writes no longer produce usable digitized output (very low audibility).
  - A common hardware modification restores audible digi playback: placing a resistor from the EXT IN pin to ground (user-supplied typical value ≈ 330 kΩ). This resistor creates a path that reintroduces sufficient transient coupling for the volume-write technique to be audible again.
  - The mod is a simple passive alteration and does not restore the 6581’s exact analog behavior — it merely recovers a usable digi playback path.

**6581 sub-revisions**
- 6581 R1 / R2: earliest production (1982–1983).
- 6581 R3: most common revision (1983–1985).
- 6581 R4AR: late revision (1985–1987).
- Note: revision IDs reflect internal MOS/C64 production runs and are commonly referenced in demoscene/hardware discussions about tonal differences and digi capability.

## Source Code
```text
Comparison table (reference)

+------------------+---------------------------+---------------------------+
| Feature          | MOS 6581                  | MOS 8580 (R5)             |
+------------------+---------------------------+---------------------------+
| Production       | 1982-1987                 | 1987-1993                 |
| Process          | NMOS                      | HMOS-II                   |
| Supply Voltage   | +12V (Vdd)                | +9V (Vdd)                 |
| Filter Caps      | 470 pF (CAP1A/B, CAP2A/B) | 22 nF (CAP1A/B, CAP2A/B)  |
| Filter Sound     | Darker, "grittier"        | Brighter, cleaner         |
| DC Offset        | Present in audio output   | Minimal DC offset         |
| Digi Playback    | 4-bit via volume register | "Fixed" - requires HW mod |
|                  | (unintended "bug")        | (resistor on EXT IN pin)  |
| Audio Output     | 6V DC bias, 3Vp-p max     | Lower DC bias             |
+------------------+---------------------------+---------------------------+

6581 sub-revisions:
- R1/R2: Original production (1982-1983)
- R3: Most common revision (1983-1985)
- R4AR: Late revision (1985-1987)

Digi mod:
- Typical resistor value quoted: ~330kΩ between EXT IN and ground
```

## Key Registers
- **$D418**: Volume and filter mode control register.

## References
- "filter_resonance_and_characteristics" — expanded behavior and measurements of filter differences (6581 vs 8580)
- "sample_playback_digi_techniques" — expanded details on 4-bit digi playback techniques and the 8580 resistor mod

## Labels
- $D418
