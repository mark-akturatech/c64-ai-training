# DPSW ($009C) - Tape Byte Received Flag

**Summary:** DPSW at $009C is a zero-page RAM flag indicating whether a complete tape data byte has been received or only partially received; searchable terms: $009C, DPSW, tape byte, tape data flag.

## Description
DPSW ($009C) is used as a flag to indicate whether a complete byte of tape data has been received, or whether it has only been partially received. The location is named "DPSW" and labeled "Tape Byte Received" in the source.

## Key Registers
- $009C - Zero Page RAM - Tape byte received flag (DPSW) — indicates whether a full tape data byte has been received

## References
- "prty_tape_character_parity_0x9b" — expands on parity checks used to detect transmission errors  
- "ptr1_tape_pass1_error_log_index_0x9e" — expands on error logging indices used for tape pass corrections

## Labels
- DPSW
