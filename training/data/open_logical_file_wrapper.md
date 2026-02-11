# OPEN / CLOSE logical file (KERNAL wrappers at $FFC0 / $FFC3)

**Summary:** Describes the KERNAL ROM wrappers for OPEN ($FFC0 → JMP ($031A)) and CLOSE ($FFC3 → JMP ($031C)), the requirement to call SETLFS ($FFBA) and SETNAM ($FFBD) before OPEN, and the use of input-channel setup before CHRIN ($FFCF) / GETIN ($FFE4).

**Description**

**OPEN**

- Wrapper at $FFC0 performs an indirect JMP through the KERNAL vector at $031A to the actual OPEN implementation.
- Purpose: create/initialize a logical file table entry for subsequent I/O. OPEN itself does not require arguments pushed on the stack; the file parameters must be prepared by calling SETLFS and SETNAM first.
- Typical call sequence: SETLFS (device/logical number/path type) → SETNAM (pointer to filename) → OPEN ($FFC0).

**CLOSE**

- Wrapper at $FFC3 performs an indirect JMP through the KERNAL vector at $031C to the actual CLOSE implementation.
- Purpose: close a previously opened logical file. The accumulator must contain the logical file number to be closed (the same number used when the file was opened).

**Open channel for input (CHKIN)**

- Wrapper at $FFC6 performs an indirect JMP through the KERNAL vector at $031E to the actual CHKIN implementation.
- Purpose: designate a previously opened logical file as the current input channel. The X register must contain the logical file number. If the device assigned to the channel is not input-capable, an error will occur.
- If input comes from anywhere other than the keyboard, CHKIN must be called before using CHRIN ($FFCF) or GETIN ($FFE4).
- If input is from the keyboard and no other input channels are open, OPEN and CHKIN are not strictly required.

**Parameter Formats and Error/Return Codes**

- **OPEN ($FFC0):**
  - **Preparatory Calls:**
    - **SETLFS ($FFBA):** Set logical file number, device number, and secondary address.
      - **A:** Logical file number (0–127).
      - **X:** Device number (0–31).
      - **Y:** Secondary address (0–255; 255 if not used).
    - **SETNAM ($FFBD):** Set filename.
      - **A:** Length of filename (0–16).
      - **X:** Low byte of filename address.
      - **Y:** High byte of filename address.
  - **Error Returns:**
    - **Carry Set:** Error occurred.
    - **A:** Error code.
      - **3:** File not open.
      - **5:** Device not present.
      - **6:** File is not an input file.

- **CLOSE ($FFC3):**
  - **Input:**
    - **A:** Logical file number to close.
  - **Error Returns:**
    - **Carry Set:** Error occurred.
    - **A:** Error code.
      - **3:** File not open.
      - **5:** Device not present.

## Source Code

```asm
.,FFC0  6C 1A 03    JMP ($031A)     ; do open a logical file

.,FFC3  6C 1C 03    JMP ($031C)     ; do close a specified logical file

.,FFC6  6C 1E 03    JMP ($031E)     ; open channel for input
```

## Key Registers

- $FFC0 - KERNAL ROM - OPEN wrapper (JMP ($031A))
- $FFC3 - KERNAL ROM - CLOSE wrapper (JMP ($031C))
- $FFC6 - KERNAL ROM - CHKIN wrapper (JMP ($031E))
- $031A - KERNAL vector - pointer to OPEN routine implementation
- $031C - KERNAL vector - pointer to CLOSE routine implementation
- $031E - KERNAL vector - pointer to CHKIN routine implementation
- $FFBA - KERNAL ROM - SETLFS (set logical file parameters; must precede OPEN)
- $FFBD - KERNAL ROM - SETNAM (set filename pointer; must precede OPEN)
- $FFCF - KERNAL ROM - CHRIN (read character from input device)
- $FFE4 - KERNAL ROM - GETIN (read input line / buffered input)

## References

- "kernal_vectors_list" — expands on OPEN vector at $031A and other KERNAL vectors
- Commodore 64 Programmer's Reference Guide: BASIC to Machine Language - Commodore 64 Memory Map
- KERNAL API | Ultimate Commodore 64 Reference
- C64 User Callable KERNAL Routines
- Commodore 64 Programmer's Reference Guide

## Labels
- OPEN
- CLOSE
- CHKIN
- SETLFS
- SETNAM
- CHRIN
- GETIN
