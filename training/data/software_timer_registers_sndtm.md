# Sound Editor 16-bit Timer — SNDTM1 / SNDTM1+1

**Summary:** SNDTM1 (low byte) and SNDTM1+1 (high byte) are RAM-based 16-bit countdown timer registers used by the Sound Editor; the 16-bit value is decremented every 1/60 second and, when it reaches $0000, the release sequence is initiated for all three channels.

**Description**
- SNDTM1 is the low-order 8 bits of a 16-bit countdown timer value (LSB).
- SNDTM1+1 is the high-order 8 bits of that 16-bit countdown timer value (MSB).
- The combined 16-bit value represents a number of 1/60-second intervals. The timer is decremented once per 1/60 second.
- When the 16-bit timer value is decremented to $0000, the Sound Editor initiates the release sequence for all three channels simultaneously.
- These two locations are RAM addresses used by the editor routine — they are not SID chip registers and do not map to the SID I/O area.

## Key Registers
- **SNDTM1**: Low byte of the 16-bit countdown timer.
- **SNDTM1+1**: High byte of the 16-bit countdown timer.

## References
- "sid_global_filter_registers" — expands on Global SID registers; these are separate RAM-based timer registers used by the editor
- "sound_editor_tuning_tips" — practical advice on experimenting with registers and timing to refine sounds

## Labels
- SNDTM1
- SNDTM1+1
