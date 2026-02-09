# Control KERNAL messages (STA $9D / LDA $90 sequence)

**Summary:** Shows a KERNAL routine that sets the message mode flag ($009D) and reads/modifies the serial status byte ($0090) (VIC/SID not involved). The snippet sets a message-mode flag, ORs into the serial status byte, saves it, and returns with RTS.

## Description
This short KERNAL sequence controls whether KERNAL messages (error/control messages) are printed by manipulating two zero-page KERNAL variables:

- STA $009D — writes the message mode flag (message enable/disable) at zero-page address $009D.
- LDA $0090 / ORA $0090 / STA $0090 — reads the serial status byte at $0090, ORs in bits (preserving existing bits), and writes the result back to $0090.

The routine ends with RTS, returning to the caller. Typical use is to set a message-mode flag and ensure required bits are set in the serial status byte so that the KERNAL will print or suppress its messages accordingly.

(Addresses shown are zero-page KERNAL variables.)

## Source Code
```asm
        ; control kernal messages
.,FE18  85 9D       STA $9D         ; set message mode flag
.,FE1A  A5 90       LDA $90         ; read the serial status byte

        ; OR into the serial status byte
.,FE1C  05 90       ORA $90         ; OR with the serial status byte
.,FE1E  85 90       STA $90         ; save the serial status byte
.,FE20  60          RTS             ; return
```

## Key Registers
- $0090 - RAM / KERNAL - serial status byte (read/OR/write)
- $009D - RAM / KERNAL - message mode flag (written to enable/disable messages)

## References
- "control_kernal_messages_wrapper" — expands on wrapper at $FF90