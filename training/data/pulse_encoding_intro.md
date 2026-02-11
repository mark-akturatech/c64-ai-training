# Minimal C64 Datasette Program Loader — Introduction to the Commodore Datasette Recording Format

**Summary:** Overview of the Commodore Datasette tape format: data encoded as pulse durations (not raw samples) to tolerate speed errors, wow/flutter, and tape dropouts; format is more complex and less space-efficient than Turbo Tape. Searchable terms: Datasette, pulse durations, wow/flutter, dropouts, tape encoding.

**Pulse Encoding**

The Datasette format represents encoded bytes as sequences of pulse durations instead of storing raw audio samples or a fixed-bitstream. This design trades storage efficiency for robustness: decoding measures pulse lengths and interprets information from those durations, allowing the loader to compensate for incorrect tape speed, variable speed over time (wow/flutter), and transient dropouts.

Key points:

- **Pulse Types and Durations:** The format utilizes three distinct pulse types, each corresponding to a specific duration:
  - **Short Pulse:** Approximately 352 microseconds (2840 Hz)
  - **Medium Pulse:** Approximately 512 microseconds (1953 Hz)
  - **Long Pulse:** Approximately 672 microseconds (1488 Hz)
  Each pulse consists of a full cycle with a 50% duty cycle, meaning equal high and low phases. ([sidpreservation.6581.org](https://sidpreservation.6581.org/tape-format/?utm_source=openai))

- **Bit Encoding:** Data bits are encoded using pairs of these pulses:
  - **Bit '0':** Short pulse followed by Medium pulse
  - **Bit '1':** Medium pulse followed by Short pulse
  - **Byte Marker:** Long pulse followed by Medium pulse
  - **End-of-Data Marker:** Long pulse followed by Short pulse
  ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))

- **Measurement of Pulse Durations:** During a SAVE operation, pulse length is measured as the time between two consecutive low-to-high transitions on the WRITE line. During a LOAD operation, pulse length is measured between two consecutive high-to-low transitions on the READ line, as the 6526 CIA READ line triggers on negative edges. ([luigidifraia.wordpress.com](https://luigidifraia.wordpress.com/articles/?utm_source=openai))

- **Decoding State Machine:** The decoding process involves a state machine that interprets the sequence of pulse pairs to reconstruct bytes. Each byte consists of a byte marker, eight data bits, and a parity bit. The state machine transitions through states corresponding to detecting the byte marker, reading each bit pair, and verifying the parity bit to ensure data integrity. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))

- **Error Handling and Synchronization:** The format includes synchronization leaders—sequences of pulses that help the decoder align with the data stream. In the event of long dropouts or errors, the decoder can resynchronize by detecting these leaders and reestablishing the correct timing and data alignment. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))

- **Example Pulse Sequence:** An example of encoding the byte 'A' (ASCII 65, binary 01000001) would be:
  - **Byte Marker:** Long pulse + Medium pulse
  - **Bit 7 (0):** Short pulse + Medium pulse
  - **Bit 6 (1):** Medium pulse + Short pulse
  - **Bit 5 (0):** Short pulse + Medium pulse
  - **Bit 4 (0):** Short pulse + Medium pulse
  - **Bit 3 (0):** Short pulse + Medium pulse
  - **Bit 2 (0):** Short pulse + Medium pulse
  - **Bit 1 (0):** Short pulse + Medium pulse
  - **Bit 0 (1):** Medium pulse + Short pulse
  - **Parity Bit (even parity for 2 ones):** Short pulse + Medium pulse
  This sequence ensures that each byte is accurately reconstructed from the pulse durations. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))

This encoding scheme prioritizes data integrity and robustness over storage efficiency, making it well-suited for the variable conditions of cassette tape storage.

## References

- ([sidpreservation.6581.org](https://sidpreservation.6581.org/tape-format/?utm_source=openai))
- ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))
- ([luigidifraia.wordpress.com](https://luigidifraia.wordpress.com/articles/?utm_source=openai))