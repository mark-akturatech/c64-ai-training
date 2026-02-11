# $FFD2 — CHROUT (Output character to channel)

**Summary:** KERNAL entry $FFD2 (CHROUT) sends the byte in A to the currently selected output channel (set by OPEN $FFC0 and CHKOUT $FFC9); if CHKOUT is omitted the default device is 3 (screen). Data is transmitted to all open output channels on the IEC serial bus, so close unwanted channels first.

## Description
JSR $FFD2 outputs one character (the value in the accumulator) to an already-open output channel. Typical setup:
- OPEN ($FFC0) to open a device and logical file,
- CHKOUT ($FFC9) to select the output channel/device.

If these setup calls are omitted, CHROUT sends to device 3 (the screen) by default. The KERNAL leaves the channel open after CHROUT returns. Because the IEC serial bus broadcasts to all open output channels, CHROUT will send the byte to every open output channel on the bus; close any channels that should not receive the data by calling the KERNAL close-channel routine before using CHROUT.

Calling convention (minimal):
- Input: A = byte to output
- Calling: JSR $FFD2
- Result: Byte sent to selected output channel(s); channel remains open

Example (assembly, brief):
- LDA #'A' ; load ASCII 'A' into A
- JSR $FFD2 ; output 'A' to selected channel(s)

## Key Registers
- $FFC0 - KERNAL - OPEN (open a device/logical file)
- $FFC9 - KERNAL - CHKOUT (select output channel/device)
- $FFD2 - KERNAL - CHROUT (output character to channel)

## References
- "ffc9_open_channel_for_output" — expands on selecting the output channel before CHROUT
- "ffcc_close_input_and_output_channels" — expands on closing channels when done

## Labels
- CHROUT
