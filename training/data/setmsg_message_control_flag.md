# SETMSG ($FE18) — Set the Message Control Flag

**Summary:** SETMSG is a KERNAL routine at $FE18 (entered via vector $FF90) that sets the Message Control Flag located at memory address $9D (decimal 157). Bit 7 (value $80 / 128) enables/disables general KERNAL control messages (e.g., SEARCHING FOR, LOADING), and Bit 6 (value $40 / 64) enables/disables KERNAL error messages (e.g., I/O ERROR #nn).

**Description**

This documented KERNAL routine (vector entry at $FF90 / decimal 65424) controls which system messages the KERNAL will print:

- **Entry**
  - Routine address: $FE18 (decimal 65048).
  - Vector: $FF90 points to the SETMSG routine.

- **Message Control Flag ($9D)**
  - Located at memory address $9D (decimal 157).
  - **Bit definitions:**
    - **Bit 7** (value $80 / 128):
      - Set to 1: Enables general KERNAL control messages (e.g., SEARCHING FOR, LOADING).
      - Set to 0: Suppresses these messages.
    - **Bit 6** (value $40 / 64):
      - Set to 1: Enables KERNAL error messages (e.g., I/O ERROR #nn).
      - Set to 0: Suppresses these error messages.
  - **Exception:** Setting or clearing Bit 7 does not affect the "PRESS PLAY ON TAPE" or "PRESS PLAY & RECORD" prompts; these remain unaffected by Bit 7.

- **Interaction with BASIC**
  - BASIC has its own error-message handling and will display its messages (e.g., FILE NOT FOUND ERROR) in preference to the KERNAL's error messages where applicable.
  - BASIC typically clears Bit 7 while running to prevent KERNAL control messages during program I/O.

## Key Registers

- $FE18 - KERNAL ROM - SETMSG routine (Set the Message Control Flag)
- $FF90 - KERNAL ROM Vector - entry vector that JMPs to SETMSG
- $9D - Message Control Flag

## References

- "power_on_reset_routine" — expands on message control flag behavior during system initialization and BASIC operation
- "readst_read_io_status_word" — expands on how I/O errors relate to messages controlled by SETMSG

## Labels
- SETMSG
