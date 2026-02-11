# SOUND GENERATOR DEMO (Appendix C)

**Summary:** Demonstrates SID chip capabilities (waveforms, envelopes) using three machine-language files and a DATA table; load with LOAD "SOUND DEMO",8,1 and start with SYS 4096. Plays tunes by reading note/time tables until a $00 note sentinel is encountered.

**Description**
This appendix entry describes a machine-language sound demo for the Commodore 64 that illustrates many SID features: waveform selection, envelope parameters (attack/decay/sustain/release), and tune playback routines. The demo consists of three machine-language files plus a DATA table (referenced as Listing C-9). Listings C-5 and C-6 are referenced as the source and assembled code respectively.

Playback is driven by routines that read note/time tables and continue until a $00 note value is found (note $00 is used as the end-of-table sentinel). The program is intended to show a variety of SID-produced sounds; examples with long attack and decay times will take noticeably longer to hear.

**How to run**
- Ensure Commodore 64 disk drive and monitor volume are set appropriately.
- From BASIC, load the prepared disk image or files:
  - LOAD "SOUND DEMO",8,1
- Start the demo:
  - SYS 4096

## References
- "sound_editor_description_and_controls" — expands on sound editor values usable by the demo
