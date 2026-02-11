# PTR2 ($9F) - Tape Pass 2 Error Log Correction Index

**Summary:** PTR2 at $9F is a zero-page index used by the KERNAL tape routines to correct bytes that were transmitted incorrectly on the first pass of tape data; related to first-pass error log index PTR1 ($9E) and parity detection PRTY ($9B).

## Description
PTR2 ($9F) holds an index value used during the second pass of tape reading to locate and correct bytes that failed validation on the first pass. The tape subsystem records errors detected (for example via parity checks) during the initial read; on pass 2 the routines consult PTR2 to step through the error log and apply corrective reads or retries for those specific byte positions. PTR2 is used in conjunction with PTR1 ($9E) (first-pass error log index) and the parity/character-check location PRTY ($9B) which indicate which bytes failed validation.

## Key Registers
- $009F - Zero Page (KERNAL tape subsystem) - Tape Pass 2 Error Log Correction Index

## References
- "ptr1_tape_pass1_error_log_index_0x9e" — first-pass error logging index
- "prty_tape_character_parity_0x9b" — parity used to detect tape transmission errors

## Labels
- PTR2
