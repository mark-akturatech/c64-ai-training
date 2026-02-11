# SAVE (KERNAL $FFD8)

**Summary:** KERNAL SAVE routine at $FFD8 saves a memory block (pointer on page zero) to a logical file/device; requires SETLFS and SETNAM (except device 1 cassette without filename). Communication registers: A, X, Y. Error returns: 5, 8, 9 and READST.

**Description**
SAVE ($FFD8) writes a block of memory to the currently selected logical file on the selected device. The routine reads the start address indirectly from page zero: the accumulator contains the page-zero offset of a two-byte pointer (low byte, high byte), and the X and Y registers contain the low and high bytes of the end address respectively. The memory range from the start pointer up to the end address is transmitted to the logical file.

Preconditions
- SETLFS must be called to set device/logical file/secondary address.
- SETNAM must be called to set the filename, except when saving to device 1 (Datassette) with no filename.

Restrictions and notes
- Device 0 (keyboard), device 2 (RS-232), and device 3 (screen) cannot be targets for SAVE; attempts produce an error and abort the operation.
- Errors returned by the routine include error codes 5, 8, 9 and the device READST status.
- Stack requirements: none.
- Registers used/affected: A (holds page-zero offset), X (end low), Y (end high). The routine may modify A, X, and Y.

How it works (summary)
1. Place a two-byte pointer (low, high) in page zero; the accumulator selects the byte-offset of that pointer.
2. Load X and Y with the end address (low, high).
3. Ensure SETLFS and SETNAM have been called as needed.
4. JSR $FFD8 to perform SAVE.

Example usage follows the above calling convention and demonstrates saving to device 1 (cassette) with no filename.

## Source Code
```asm
; Example: SAVE to cassette (device 1) with no filename
    LDA #1              ; DEVICE = 1 (Datassette)
    LDX #1              ; LOGICAL FILE NUMBER = 1
    LDY #0              ; SECONDARY ADDRESS = 0
    JSR SETLFS          ; Set logical file parameters

    LDA #0              ; NO FILE NAME
    LDX #0              ; FILE NAME ADDRESS LOW BYTE (irrelevant)
    LDY #0              ; FILE NAME ADDRESS HIGH BYTE (irrelevant)
    JSR SETNAM          ; Set file name parameters

    ; Store start address pointer (low/high) into page zero
    LDA PROG            ; LOAD START ADDRESS LOW BYTE
    STA TXTTAB          ; (page zero location: low byte)
    LDA PROG+1
    STA TXTTAB+1        ; (page zero location: high byte)

    ; Load end address into X/Y (low/high)
    LDX VARTAB          ; LOAD X WITH LOW BYTE OF END OF SAVE
    LDY VARTAB+1        ; LOAD Y WITH HIGH BYTE OF END OF SAVE

    ; Load accumulator with page-zero offset of pointer and call SAVE
    LDA #<TXTTAB        ; LOAD ACCUMULATOR WITH PAGE 0 OFFSET (low byte of address)
    JSR SAVE            ; JSR $FFD8
```

```text
Notes:
- The assembler pseudo-op "<label" denotes the low byte (page-zero offset) used in the accumulator.
- Replace SETLFS, SETNAM, SAVE labels with their KERNAL entry labels or addresses as your assembler requires.
```

## Key Registers
- $FFD8 - KERNAL - SAVE entry point (save memory block to logical file/device)

## References
- "setlfs_kernal_routine" — SETLFS: select device/logical file/secondary address
- "setnam_kernal_routine" — SETNAM: set filename for subsequent file operations
- "readst_kernal_routine" — READST: check device status after SAVE

## Labels
- SAVE
