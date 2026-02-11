# Transmit loop for "M-R" command bytes (MR,X)

**Summary:** 6502 assembly loop that initializes X (LDX #$00), loads bytes from the MR table via indexed addressing (LDA MR,X), and calls the CHROUT routine (JSR $FFD2) to transmit each byte; the MR table contains the "M-R" command bytes, and the loop increments X (INX) and checks for termination by comparing X to the length of the MR table (CPX #n, BNE).

**Description**
This chunk contains the command-transmit loop that walks the MR table (a sequence of bytes labeled MR) using the X index and sends each byte through the CHROUT routine:

- `LDX #$00` initializes X to zero so the table is read from its start.
- The loop label (`LOOP1`) performs `LDA MR,X` to fetch the current command byte from the MR table.
- A `JSR $FFD2` follows to call the CHROUT routine that outputs the loaded byte.
- The loop increments X (`INX`) and checks for termination by comparing X to the length of the MR table (`CPX #n`, `BNE`).

No memory-mapped I/O registers are referenced in this fragment — it is purely a code/data loop referencing the MR table.

## Source Code
```asm
        LDX #$00               ; initialize X = 0
LOOP1   LDA MR,X               ; load next command byte
        JSR $FFD2              ; call CHROUT to send the character
        INX                    ; increment X
        CPX #n                 ; compare X to the length of MR
        BNE LOOP1              ; if not done, repeat loop
; MR: table containing the "M-R" command bytes
MR      .BYTE $4D, $2D, $52, AL, AH, NL
; "M-R" command bytes: 'M', '-', 'R', low byte of address, high byte of address, number of bytes to read
```

## References
- "readit_subroutine_header_and_prepare_output" — expands on READIT setup and CHKOUT to prepare for output
- "prepare_channel_15_for_input" — expands on preparing channel 15 for input (CHIN) to perform the read
