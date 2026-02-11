# CHROUT (KERNAL)

**Summary:** Outputs a single character from A to an already-open output channel. Call address $FFD2 (65490). Preparatory routines: OPEN and CHKOUT; close unwanted serial channels with CLRCHN. Error status available via READST.

## Description
CHROUT is a KERNAL routine that sends the byte in the accumulator (A) to the selected output channel. The output channel must already be opened (typically via OPEN and CHKOUT). If no channel is opened, CHROUT sends to the default output device (device number 3 — the screen). The channel remains open after the call.

- Call address: $FFD2 (65490)
- Communication register: A (holds the byte to send)
- Preparatory routines: OPEN, CHKOUT
- Error returns/status: 0 (see READST for status reporting)
- Stack requirement: 8+ bytes free
- Registers affected: A

Important: when using serial devices the C64 will send the byte to every open output channel on the serial bus. To ensure only the intended device receives the data, close other output channels with the KERNAL CLRCHN routine before calling CHROUT.

## How to Use
0) Open the destination with OPEN and/or use CHKOUT to select the output channel.  
1) Load the byte to send into A.  
2) JSR $FFD2 (JSR CHROUT).

## Source Code
```asm
; DUPLICATE THE BASIC INSTRUCTION CMD 4,"A";
    LDX #4          ; logical file #4
    JSR CHKOUT      ; open channel out
    LDA #'A'        ; load ASCII 'A' into A
    JSR CHROUT      ; send character (CHROUT = $FFD2)
```

## Key Registers
- $FFD2 - KERNAL - CHROUT: output a character (A contains byte), leaves channel open

## References
- "chkout_open_output_channel" — OPEN+CHKOUT usage to set up destination for CHROUT  
- "clrchn_clear_io_channels" — CLRCHN usage to close other open serial output channels

## Labels
- CHROUT
