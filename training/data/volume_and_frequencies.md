# SID: Volume (register 24) and frequency high/low bytes

**Summary:** The SID chip's overall volume is controlled by register 24, where the lower 4 bits set the master volume level (0–15). Each voice's frequency is specified using two registers: a low byte and a high byte. To compute the 16-bit frequency value (Fn) for a desired output frequency (Fout in Hz), use the formula:

Fn = Fout / 0.06097

Then, split Fn into high and low bytes:

Fhi = INT(Fn / 256)

Flo = Fn - (256 * Fhi)

Write Flo to the voice's frequency-low register and Fhi to the frequency-high register.

**Volume control**

Register 24 (SID master-volume register) controls the overall volume. The lower 4 bits (bits 0–3) set the volume level from 0 (off) to 15 (maximum). The upper 4 bits (bits 4–7) are used for filter mode selection and voice 3 output control:

- **Bit 7 (CH3OFF):** When set to 1, disables the audio output of voice 3.
- **Bit 6 (HP):** High-pass filter enable (1 = on, 0 = off).
- **Bit 5 (BP):** Band-pass filter enable (1 = on, 0 = off).
- **Bit 4 (LP):** Low-pass filter enable (1 = on, 0 = off).

These bits allow for dynamic control of the SID's filtering capabilities and voice 3 output.

**Frequency calculation and splitting into high/low bytes**

- The SID sound generator expects a 16-bit frequency value per voice, composed of a low byte and a high byte.
- To generate an arbitrary audible frequency (Fout, in Hz), compute the SID frequency word Fn using:
  - Fn = Fout / 0.06097
- Round Fn down to an integer (discard the fractional part).
- Split that integer into high and low bytes:
  - Fhi = INT(Fn / 256)
  - Flo = Fn - (256 * Fhi)
- Write Flo to the voice's frequency-low register and Fhi to the frequency-high register for that voice.

For reference, here is a table of frequency values (Fn) for notes across eight octaves:

| Note | Octave 1 | Octave 2 | Octave 3 | Octave 4 | Octave 5 | Octave 6 | Octave 7 | Octave 8 |
|------|----------|----------|----------|----------|----------|----------|----------|----------|
| C    | 268      | 537      | 1074     | 2148     | 4295     | 8590     | 17180    | 34360    |
| C#   | 284      | 568      | 1136     | 2273     | 4546     | 9093     | 18186    | 36373    |
| D    | 301      | 603      | 1206     | 2412     | 4824     | 9648     | 19296    | 38592    |
| D#   | 318      | 637      | 1275     | 2550     | 5101     | 10202    | 20404    | 40808    |
| E    | 337      | 675      | 1350     | 2701     | 5402     | 10804    | 21608    | 43216    |
| F    | 358      | 716      | 1433     | 2867     | 5734     | 11468    | 22936    | 45872    |
| F#   | 379      | 758      | 1517     | 3034     | 6068     | 12136    | 24272    | 48544    |
| G    | 401      | 802      | 1604     | 3208     | 6417     | 12834    | 25668    | 51336    |
| G#   | 425      | 850      | 1700     | 3400     | 6800     | 13600    | 27200    | 54400    |
| A    | 450      | 900      | 1800     | 3600     | 7200     | 14400    | 28800    | 57600    |
| A#   | 477      | 954      | 1908     | 3817     | 7634     | 15268    | 30536    | 61072    |
| B    | 506      | 1012     | 2024     | 4048     | 8097     | 16194    | 32388    | 64776    |

These values are derived from the formula Fn = Fout / 0.06097 and are rounded to the nearest integer.

## Key Registers

- $D400-$D401 - SID - Voice 1 frequency low/high (16-bit frequency word)
- $D407-$D408 - SID - Voice 2 frequency low/high (16-bit frequency word)
- $D40E-$D40F - SID - Voice 3 frequency low/high (16-bit frequency word)
- $D418 - SID - Master volume and filter mode selection
  - Bits 0–3: Volume control (0–15)
  - Bit 4: Low-pass filter enable (1 = on, 0 = off)
  - Bit 5: Band-pass filter enable (1 = on, 0 = off)
  - Bit 6: High-pass filter enable (1 = on, 0 = off)
  - Bit 7: Voice 3 output disable (1 = off, 0 = on)

## References

- "example_program_1_code_and_explanation" — expands on example that sets volume and writes high/low frequency bytes per note
- Commodore 64 Programmer's Reference Guide, Appendix E: Equal-Tempered Musical Scale Values
- Commodore 64 Programmer's Reference Guide, Chapter 4: Programming Sound and Music
