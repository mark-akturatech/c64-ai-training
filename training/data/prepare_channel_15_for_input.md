# Prepare disk/controller channel 15 for input (LDX #$0F; JSR CHKIN)

**Summary:** Sets X = $0F (selects channel 15 / device command channel) and calls the KERNAL CHKIN routine (JSR CHKIN) to switch that channel into input mode. Searchable terms: LDX, #$0F, $0F, channel 15, CHKIN, JSR, KERNAL, command channel.

**Description**
This snippet prepares the Commodore device command channel (channel number $0F, i.e., 15) for input after a command has been transmitted to the device (for example, a disk drive). The code places the channel number in X (LDX #$0F) then calls the KERNAL entry CHKIN (JSR CHKIN), which sets the selected channel into input mode so subsequent reads (e.g., via CHRIN or buffered read loops) will receive data from that device.

Typical usage context:
- It follows a transmit loop that sent an M-R (memory read) command to the drive (see "send_m-r_command_loop").
- It precedes a read loop that performs the half-page input from channel 15 (see "read_half_page_input_loop").

Notes:
- Channel $0F is the command channel used to issue secondary/command bytes to disk drives and other devices; after sending the command, the channel is switched to input so the drive can return data.
- CHKIN is a KERNAL routine located at address $FFC6. This snippet calls the routine symbolically; the actual KERNAL vector/address is not included in this chunk.

## Source Code
```asm
; Prepare channel 15 (device command channel) for input
    LDX #$0F      ; select channel 15
    JSR CHKIN     ; switch channel into input mode
```

## Key Registers
- **X Register**: Set to $0F to select channel 15.

## References
- "send_m-r_command_loop" — expands on the preceding command transmit loop that sent the M-R command
- "read_half_page_input_loop" — expands on the following read loop that performs the half-page input from channel 15

## Labels
- CHKIN
