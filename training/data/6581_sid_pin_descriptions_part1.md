# SID (6581) Pin Descriptions — CAP1/CAP2, RES, 02, R/W, CS, A0–A4, GND

**Summary:** CAP1/CAP2 (CAP1A/CAP1B, CAP2A/CAP2B) are the filter integrator capacitor pins (recommended 2200 pF, polystyrene, matched for multiple SIDs) with FCmax = 2.6E-5/C; RES (Pin 5), 02 (Pin 6), R/W (Pin 7) and CS (Pin 8) control reset, master clock and gated data transfers; A0–A4 (Pins 9–13) select one of 29 SID registers; GND (Pin 14) grounding recommendations.

## Filter capacitors: CAP1 / CAP2 (CAP1A/CAP1B, CAP2A/CAP2B)
Recommended capacitor value: 2200 pF for C1 and C2 to cover roughly 30 Hz–12 kHz audio range. Polystyrene capacitors are preferred; when multiple SID chips must track each other in polyphonic systems, matched capacitors are recommended.

Cutoff frequency relationship:
FCmax = 2.6E-5 / C
(where C is the capacitor value in Farads). The filter range extends approximately 9 octaves below FCmax.

## RES (Pin 5)
TTL-level active-low reset input. If asserted low for at least ten 02 cycles (02 = master clock), all internal SID registers are reset to zero and audio output is silenced. Normally tied to the system reset line or a power-on-clear circuit.

## 02 (Pin 6)
TTL-level master clock input. All oscillator frequencies and envelope rates are referenced to this clock. Nominal operating frequency: 1.0 MHz. 02 also gates data transfers: data can only be transferred between SID and the CPU when 02 is high (02 functions as a high-active transfer gate).

## R/W (Pin 7)
TTL-level input that selects data-transfer direction when chip-select conditions are met:
- R/W = High → CPU reads from the selected SID register.
- R/W = Low → CPU writes to the selected SID register.
Normally connected to the system R/W line.

## CS (Pin 8)
TTL-level active-low chip select that enables transfers. CS must be low for any transfer. Transfer conditions:
- Read allowed only if CS = Low, 02 = High, and R/W = High.
- Write allowed only if CS = Low, 02 = High, and R/W = Low.
Normally driven by address decoding so SID occupies a memory-mapped location.

## A0–A4 (Pins 9–13)
Five TTL-level address inputs selecting one of the 29 SID registers. Although 32 address values are possible, three locations are unused — writes to those locations are ignored and reads return invalid data. These pins are normally tied to the corresponding CPU address lines.

## GND (Pin 14)
Use a dedicated ground run from SID to the power supply, kept separate from ground runs to other digital circuitry, to minimize digital noise on the audio output.

## References
- "6581_sid_mode_volume_misc_and_io" — expands on POTX/POTY and EXT IN interactions  
- "6581_sid_pin_descriptions_part2" — continuation: data bus, POT interface, EXT IN and AUDIO OUT pin details