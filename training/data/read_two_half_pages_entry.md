# Top-level entry: invoke READIT to read file in two 256-byte halves

**Summary:** This routine reads a file in two 256-byte halves by invoking the `READIT` subroutine twice. It updates the pointer variables `POINT` and `MR+3` to target the second half before the second `READIT` call.

**Description**

This routine performs a two-step read of a file:

- `JSR READIT` — Calls `READIT` to read the first 256-byte half.
- Modifies the pointer to target the second half by storing the high byte of the buffer address into `POINT` and `MR+3`.
- `JSR READIT` — Calls `READIT` again to read the second 256-byte half.
- `RTS` — Returns control to the calling routine.

The `READIT` subroutine is responsible for reading 256 bytes from the file into the buffer pointed to by `POINT`.

## Source Code

```asm
; Top-level entry: call READIT twice to read file in two 256-byte halves

    JSR READIT           ; Read first half

    LDA #>BUFFER         ; Load high byte of BUFFER address
    STA POINT            ; Set POINT to second half
    STA MR+3             ; Set MR+3 to second half

    JSR READIT           ; Read second half

    RTS                  ; Return to caller
```

## Key Registers

- **POINT**: Pointer to the buffer where data is read.
- **MR+3**: High byte of the memory address for the second half of the buffer.

## References

- "readit_subroutine_half_page" — Details the `READIT` routine that performs the half-page transfer.
- "send_to_disk_and_mw_write_entry" — Related disk I/O conventions and M-W write routines.

## Labels
- POINT
- MR+3
