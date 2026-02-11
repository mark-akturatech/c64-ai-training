# SID filter types — low-pass, band-pass, high-pass (spectral effects)

**Summary:** Describes SID filter modes (low-pass, band-pass, high-pass), their spectral effect as cutoff frequency is moved, and the stated attenuation slopes (12 dB/Octave or 6 dB/Octave). Searchable terms: SID, filter cutoff, low-pass, band-pass, high-pass, dB/Octave, frequency amplitude.

**Filter behavior and spectral effects**

- **Low-pass filter:** Frequencies above the cutoff frequency are attenuated at 12 dB/Octave. This mode produces a "full sound." Lowering the cutoff frequency reduces high-frequency content, resulting in progressively darker or more muffled timbres.

- **Band-pass filter:** Frequencies above and below the cutoff frequency are attenuated at 6 dB/Octave. This mode produces "thin sounds." Adjusting the cutoff frequency shifts the band of frequencies that remain present; narrowing the band reduces perceived body.

- **High-pass filter:** Frequencies below the cutoff frequency are attenuated at 12 dB/Octave. This mode produces "tinny" sounds when emphasized. Raising the cutoff frequency removes bass and low-mid content, emphasizing higher frequencies.

- **Filter response illustrations:** The following figures illustrate the frequency amplitude versus frequency for each filter mode as the cutoff frequency is varied.

## Source Code

```text
Low-pass filter. When the low-pass filter is selected, all frequencies above the cutoff frequency are attenuated at the rate of 12 dB/Octave. This filtering mode will generate a full sound.

Band-pass filter. The band-pass filter will attenuate all of the frequencies above and below the cutoff frequency at the rate of 6 dB/Octave. A band-pass filter produces thin sounds.

High-pass filter. All of the frequencies below the cutoff frequency will be attenuated at the rate of 12 dB/Octave when the high-pass filter is selected. Tinny sounds can be generated when using this mode.

Figures 8-5 through 8-7 show graphical representations of frequency amplitude versus frequency for each filter mode as the cutoff frequency is varied.

```

```text
Figure 8-5. Low-pass filter response:

    Amplitude
    |
    |        ________
    |       /
    |      /
    |     /
    |    /
    |   /
    |  /
    | /
    |/
    +------------------> Frequency

    As the cutoff frequency decreases, the transition point moves left, attenuating more high frequencies.

```

```text
Figure 8-6. Band-pass filter response:

    Amplitude
    |
    |        /\  
    |       /  \  
    |      /    \  
    |     /      \  
    |    /        \  
    |   /          \  
    |  /            \  
    | /              \  
    |/                \  
    +------------------> Frequency

    The center frequency shifts with the cutoff setting, allowing a band of frequencies to pass while attenuating others.

```

```text
Figure 8-7. High-pass filter response:

    Amplitude
    |
    |        ________
    |               \
    |                \
    |                 \
    |                  \
    |                   \
    |                    \
    |                     \
    |                      \
    +-----------------------> Frequency

    Increasing the cutoff frequency moves the transition point right, attenuating more low frequencies.

```

## References

- "sid_filters_and_subtractive_synthesis" — expands on graphical depiction of filter responses and related SID filter material.