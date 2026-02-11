# LOAD entry (start) — save flags, clear serial status, check device number

**Summary:** KERNAL LOAD entry starts at $F4A5: saves the load/verify flag ($93), clears the serial status byte ($90), fetches the device number from zero page $BA, rejects device #$03 (keyboard) as illegal for LOAD (JMP $F713), and then continues to device-specific LOAD dispatch (see load_ram_from_device_vector). Contains mnemonics STA/LDA/CMP/BNE/JMP and addresses $F4A5-$F4B2.

## Description
This routine is the start of the ROM's LOAD implementation (entry point at $F4A5). Steps performed:

- STA $93 — save the incoming load/verify flag in zero page $93 so later code knows whether this was a VERIFY or LOAD.
- LDA #$00 / STA $90 — clear A and store to $90, which is used as the serial status byte (clears any previous serial status).
- LDA $BA — load the device number (zero page $BA holds the current device ID used by serial routines).
- CMP #$03 / BNE $F4B2 — if the device number is not $03 (the keyboard device number), execution continues past the keyboard check.
- JMP $F713 (when device == $03) — if device #$03 (keyboard) is detected, jump to the "illegal device number" error handler at $F713 and return.
- Execution then continues to device-specific LOAD behavior (dispatch target reached after $F4B2). The device-vectored LOAD path is documented further under "load_ram_from_device_vector".

This snippet is the canonical guard that prevents LOAD from targeting the keyboard device and initializes serial-state bookkeeping prior to device dispatch.

## Source Code
```asm
.,F4A5 85 93    STA $93         ; save load/verify flag
.,F4A7 A9 00    LDA #$00        ; clear A
.,F4A9 85 90    STA $90         ; clear the serial status byte
.,F4AB A5 BA    LDA $BA         ; get the device number
.,F4AD D0 03    BNE $F4B2       ; if not the keyboard continue
                                ; do 'illegal device number'
.,F4AF 4C 13 F7 JMP $F713       ; else do 'illegal device number' and return
.,F4B2 C9 03    CMP #$03
```

## Key Registers
- $93 - KERNAL zero page - saved load/verify flag
- $90 - KERNAL zero page - serial status byte (cleared here)
- $BA - KERNAL zero page - current device number for serial operations

## References
- "load_ram_from_device_vector" — expands on the device-specific LOAD vector and dispatch target invoked after this initialization step

## Labels
- LOAD
