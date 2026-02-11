# SID filter control (cutoff and volume / filter-enable bits)

**Summary:** SID filter registers $D415-$D418 control cutoff (11-bit Lcf/Hcf), resonance/mode, and master volume/filter-enable bits (high-pass, band-pass, low-pass). Includes bit positions, cutoff value composition (Hcf << 3 | Lcf), and notes on combining filters (notch) and dynamic filtering during ADSR.

## Description
- The SID's filter cutoff is an 11-bit value split across two registers:
  - Low 3 bits (Lcf) in the low filter register (Lcf = 0..7).
  - High 8 bits (Hcf) in the high filter register (Hcf = 0..255).
  - Combined cutoff value (0..2047) = (Hcf << 3) | Lcf (or Hcf * 8 + Lcf).
- Register used as the master volume and filter-enable control contains explicit filter-enable bits:
  - Bit 6 = high-pass (0 = off, 1 = on)
  - Bit 5 = band-pass
  - Bit 4 = low-pass
  - The remaining low bits are the master volume field (numeric range 0–15).
- Enabling multiple filter bits simultaneously combines filter responses (e.g., high-pass + low-pass produces a notch/reject filter).
- Changing filter cutoff and filter-enable bits over time (for example, driven during a voice's ADSR phases) alters harmonic content and can create evolving timbres.
- Practical note from source: using a high-pass filter can make tones sound "tinny" by attenuating low-frequency content.

## Source Code
```text
    Try RUNning the program now. Notice the lower tones have had their
  volume cut down. It makes the overall quality of the note sound tinny.
  This is because you are using a high-pass filter which attenuates (cuts
  down the level of) frequencies below the specified cutoff frequency.
    There are three types of filters in your Commodore computer's SID chip.
  We have been using the high-pass filter. It will pass all the frequencies
  at or above the cutoff, while attenuating the frequencies below the
  cutoff.

                             |
                      AMOUNT |      +-----
                      PASSED |     /
                             |    /
                             |   /
                             +------|-------
                                FREQUENCY

    The SID chip also has a low-pass filter. As its name implies, this
  filter will pass the frequencies below cutoff and attenuate those above.


                             |
                      AMOUNT | -----+
                      PASSED |       \
                             |        \
                             |         \
                             +------|-------
                                FREQUENCY


    Finally, the chip is equipped with a bandpass filter, which passes a
  narrow band of frequencies around the cutoff, and attenuates all others.


                             |
                      AMOUNT |      +
                      PASSED |     / \
                             |    /   \
                             |   /     \
                             +------|-------
                                FREQUENCY



    The high- and low-pass filters can be combined to form a notch reject
  filter which passes frequencies away from the cutoff while attenuating
  at the cutoff frequency.


                             |
                      AMOUNT | --+     +---
                      PASSED |    \   /
                             |     \ /
                             |      +
                             +------|-------
                                FREQUENCY

    Register 24 determines which type filter you want to use. This is in
  addition to register 24's function as the overall volume control. Bit 6
  controls the high-pass filter (0 = off, 1 = on), bit 5 is the bandpass
  filter, and bit 4 is the low-pass filter. The low 3 bits of the cutoff
  frequency are determined by register 21 (Lcf) (Lcf = 0 through 7). While
  the 8 bits of the high cutoff frequency are determined by register 22
  (Hcf) (Hcf = 0 through 255).
    Through careful use of filtering, you can change the harmonic structure
  of any waveform to get just the sound you want. In addition, changing the
  filtering of a sound as it goes through the ADSR phases of its life can
  produce interesting effects.
```

```text
Cutoff composition (reference):
  Cutoff11 = (Hcf << 3) | Lcf   ; Hcf = 0..255, Lcf = 0..7 => Cutoff11 = 0..2047
```

## Key Registers
- $D415-$D418 - SID - Filter control: cutoff low (Lcf, low 3 bits) and cutoff high (Hcf, high 8 bits), resonance/mode, master volume & filter-enable bits (bit6=HP, bit5=BP, bit4=LP)

## References
- "filtering_and_example_program_5" — expands example demonstrating use of registers 21,22,23 and 24 for filter effects