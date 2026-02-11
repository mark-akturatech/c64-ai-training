# Datassette: Read vs Write Signal and C64 Sensing Behavior

**Summary:** The cassette read signal is the logical inverse of the write signal; pulse-width measurements use rising edges for write pulses and falling edges for read pulses. The C64 monitors zero-crossings (high→low transitions) on the cassette read line wired to CIA #1 FLAG, and each such transition generates an interrupt request.

## Read vs Write Signal
The cassette read output is the inverse of the write (output) waveform. When measuring pulse widths for encoded data:
- Write pulses are measured using rising edges.
- Read pulses are measured using falling edges.

This inversion means edge polarity for timing detection differs between playback (read) and recording (write).

## How the C64 senses tape pulses
The cassette read line from the cassette port is connected to the physical FLAG pin of Complex Interface Adapter (CIA) #1 (CIA #1 FLAG). The C64 detects zero-crossings as high-to-low transitions on that line; each detected transition on CIA #1 FLAG generates an interrupt request. These transitions are the events used to time and decode pulse widths for tape data.

## References
- "byte_encoding_and_parity" — expands on pulse edge timing relevant to measuring encoded byte pulses
