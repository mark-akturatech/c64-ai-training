# Harmonic content of common waveforms (triangle, sawtooth, square, pulse width)

**Summary:** Describes harmonic content for triangle, sawtooth, and square (rectangular) waveforms: triangle — odd harmonics, amplitude ∝ 1/(harmonic²); sawtooth — all harmonics, amplitude ∝ 1/harmonic; square — odd harmonics, amplitude ∝ 1/harmonic. Also notes how pulse width (rectangular duty cycle) alters harmonic content and recommends choosing waveform to approximate timbre before filtering.

**Understanding waveforms**
When a note is sounded, it contains a fundamental frequency (the overall pitch) plus harmonics—sine components whose frequencies are integer multiples of the fundamental. The relative amplitudes of these harmonics determine timbre. Choose a waveform whose harmonic distribution approximates the target timbre, then refine with filtering.

**Harmonic content by waveform**
- **Triangle wave**
  - Contains only odd harmonics (1, 3, 5, ...).
  - Amplitude of harmonic n ∝ 1 / n² (so harmonic 3 is 1/9 the amplitude of harmonic 1).
  - Result: much closer in shape to a sine at the fundamental (fewer and much weaker higher harmonics).

- **Sawtooth wave**
  - Contains all harmonics (1, 2, 3, 4, ...).
  - Amplitude of harmonic n ∝ 1 / n (so harmonic 2 is 1/2 the amplitude of harmonic 1).
  - Result: bright, rich in high-frequency content.

- **Square (rectangular) wave**
  - Contains only odd harmonics (1, 3, 5, ...).
  - Amplitude of harmonic n ∝ 1 / n.
  - Result: hollow or nasal timbre compared with sawtooth (missing even harmonics).

**Pulse width and rectangular waves**
- Rectangular/pulse waves with duty cycles other than 50% produce varying harmonic spectra; changing pulse width changes the relative amplitudes of harmonics and thus timbre.
- (Symmetry and duty affect which harmonics are present—see pulse_width_and_pulse_wave for expanded detail.)
- Practical workflow: pick the waveform/pulse width that approximates the desired harmonic balance, then use filtering to shape remaining spectral content.

## Source Code
```text
Illustration of harmonic series and waveform shapes:

Time-domain representations of common waveforms:

Sine Wave:
   ┌───┐     ┌───┐     ┌───┐
   │   │     │   │     │   │
───┘   └─────┘   └─────┘   └───

Triangle Wave:
   /\    /\    /\    /\
  /  \  /  \  /  \  /  \
 /    \/    \/    \/    \

Sawtooth Wave:
   /|  /|  /|  /|  /|  /|
  / | / | / | / | / | / |
 /  |/  |/  |/  |/  |/  |

Square Wave:
   ┌─┐   ┌─┐   ┌─┐   ┌─┐
   │ │   │ │   │ │   │ │
───┘ └───┘ └───┘ └───┘ └───

Frequency-domain representations (harmonic series):

Sine Wave:
  Fundamental only

Triangle Wave:
  Fundamental + 1/9 3rd harmonic + 1/25 5th harmonic + ...

Sawtooth Wave:
  Fundamental + 1/2 2nd harmonic + 1/3 3rd harmonic + ...

Square Wave:
  Fundamental + 1/3 3rd harmonic + 1/5 5th harmonic + ...
```

## References
- "filtering_and_example5"—expands on filter usage to further shape harmonic content
- "pulse_width_and_pulse_wave"—expands on how rectangular/pulse waves vary timbre