# Datassette Encoding — PAL/NTSC Compatibility Note

**Summary:** Despite the ~3.8% difference between PAL (985,248 Hz) and NTSC (1,022,727 Hz) clock frequencies, datassette tapes can be swapped between systems because the cassette synchronization algorithm plus variable motor-speed compensation (using the tape leader/preamble to measure speed) correct for the timing difference.

## PAL/NTSC Compatibility
The PAL vs NTSC clock difference is approximately 3.8% (985,248 Hz vs 1,022,727 Hz). This small frequency mismatch is handled by two mechanisms in the datassette format:
- A synchronization algorithm that locks to the recorded pulse timing rather than assuming an exact clock rate.
- Variable motor-speed compensation, where the leader (the tape preamble) is used to compute a speed correction factor so playback timing matches the original recording.

Together these allow tapes recorded on PAL machines to be read on NTSC machines and vice versa without compatibility issues.

## References
- "pulse_types" — expands on PAL vs NTSC pulse duration differences
- "data_block_structure" — expands on leader used to compute speed correction for motor/tape speed differences