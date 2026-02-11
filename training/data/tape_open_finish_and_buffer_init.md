# KERNAL: Finish cassette open — set buffer size / force-read flag and initialize tape buffer pointers ($F3C2-$F3D4)

**Summary:** Handles finalizing a tape device OPEN in the KERNAL: sets the BUFSZ/force-read flag (LDA #$BF), tests SA ($B9) for an OPEN-for-READ ($60), initializes the tape buffer first byte and buffer pointer (STA (TAPE1),Y and STA $A6), clears the carry to signal success (CLC) and returns (RTS). Searchable terms: $F3C2, $F3D1, BUFSZ, TAPE1 ($B2), SA ($B9), BUFPT ($A6), force-read, tape buffer.

## Description
This small KERNAL routine finalizes the OPEN process for the cassette device by preparing the in-memory tape buffer and the buffer pointer, and by setting the flags that indicate a successful open.

Behavior summary:
- A holds the BUFSZ-1 value combined with the force-read bit (LDA #$BF). This value is used when the device is opened for read.
- SA (disassembly name for zero-page $B9) is compared to #$60. If equal, the device was opened for read (OPEN type = read) and the routine skips buffer initialization and stores the BUFSZ/force flag into BUFPT.
- If SA != #$60 (not opened for read), the routine initializes the start of the tape buffer: it writes the TYPE flag #$02 into the first byte of the buffer pointed to by TAPE1 (indirect zero page pointer at $B2) and then sets BUFPT to 0 to point to the data area.
- After setting BUFPT, CLC is executed to indicate a successful open (carry clear per KERNAL convention), and RTS returns to the caller.

Notes on zero-page names used in the disassembly:
- SA — zero page $B9 (OPEN type/status)
- TAPE1 — zero page pointer at $B2 used as (TAPE1),Y addressing into the tape buffer
- BUFPT — zero page $A6 (buffer pointer/index)
- BUFSZ-1 + force-read flag — immediate #$BF loaded into A at entry

Step-by-step flow:
1. LDA #$BF — prepare BUFSZ-1 + force-read flag in A.
2. LDY $B9 / CPY #$60 — compare SA to the read-open code ($60).
3. BEQ branch if read-open: skip buffer initialization and proceed to store A into BUFPT.
4. If not read-open:
   - LDY #$00 — set Y=0 (buffer offset).
   - LDA #$02 — prepare TYPE flag for first buffer byte.
   - STA (TAPE1),Y — store TYPE flag at the start of the tape buffer.
   - TYA — transfer Y (0) into A.
5. STA BUFPT ($A6) — store A into BUFPT; A is $BF in the read-open path, or 0 in the non-read-open path.
6. CLC — signal successful open (carry clear).
7. RTS — return.

This routine is the tail-end of the cassette OPEN sequence; other parts of the OPEN process (device selection, header/search, serial presence checks) are handled by other KERNAL subroutines (see References).

## Source Code
```asm
        ; .,F3C2
F3C2    A9 BF       LDA #$BF        ; OP171  LDA #BUFSZ-1    ; ASSUME FORCE READ
F3C4    A4 B9       LDY $B9         ;        LDY    SA
F3C6    C0 60       CPY #$60        ;        CPY    #$60            ; OPEN FOR READ?
F3C8    F0 07       BEQ $F3D1       ;        BEQ    OP172
        ; SET POINTERS FOR BUFFERING DATA
F3CA    A0 00       LDY #$00        ;        LDY    #0
F3CC    A9 02       LDA #$02        ;        LDA    #BDF            ; TYPE FLAG FOR BLOCK
F3CE    91 B2       STA ($B2),Y     ;        STA    (TAPE1),Y     ; TO BEGIN OF BUFFER
F3D0    98          TYA             ;        TYA
F3D1    85 A6       STA $A6         ; OP172  STA BUFPT           ; POINT TO DATA
F3D3    18          CLC             ; OP175  CLC                ; FLAG GOOD OPEN
F3D4    60          RTS             ; OP180  RTS                ; EXIT IN PEACE
```

## References
- "tape_read_decision_and_search" — expands on searching and header handling before finalizing the open
- "openi_serial_listen_and_presence_check" — expands on OPENI and tape open handling for other device types (serial/RS-232)

## Labels
- SA
- TAPE1
- BUFPT
- BUFSZ
