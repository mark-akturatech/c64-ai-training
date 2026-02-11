# Commodore 64 IEC Serial Bus KERNAL Calls (LISTEN/TALK/SECOND/TKSA/ACPTR/CIOUT)

**Summary:** Low-level C64 KERNAL entry points for IEEE/IEC serial bus device control and byte I/O: LISTEN $FFB1, UNLISTEN $FFAE, TALK $FFB4, UNTALK $FFAB, SECOND $FF93, TKSA $FF96, ACPTR $FFA5 (read byte returns in A), CIOUT $FFA8 (write byte from A). Device number or byte value passed in A as documented; SECOND/TKSA expect A = $60 + secondary_address.

**Description**
This chunk documents the KERNAL entry points used to implement low-level IEC/IEEE-488/serial bus operations on the C64. These routines are the primitives used by higher-level channel I/O (OPEN/CLOSE/CHK/GET/PUT) and by device command sequences:

- **LISTEN ($FFB1)** — Issue the LISTEN command on the bus; device number passed in A.
- **UNLISTEN ($FFAE)** — Issue the UNLISTEN command; follows a listening sequence to drop listening state.
- **TALK ($FFB4)** — Issue the TALK command on the bus; device number passed in A.
- **UNTALK ($FFAB)** — Issue the UNTALK command to stop a device from talking.
- **SECOND ($FF93)** — Send a secondary address after a LISTEN. A must contain $60 + secondary_address (i.e., bit pattern with $60 prefix).
- **TKSA ($FF96)** — Send a secondary address after a TALK. A must contain $60 + secondary_address.
- **ACPTR ($FFA5)** — Read a byte from the serial bus; returned in A on routine exit.
- **CIOUT ($FFA8)** — Write a byte to the serial bus; A must contain the byte to send.

These calls operate at the byte/command level of the IEC bus protocol; higher-level KERNAL channel I/O routines translate file operations and RS-232-like semantics into sequences of these low-level calls. The listed addresses are KERNAL ROM entry points and are used with JSR (or by vectoring through the KERNAL).

## Source Code
```asm
; Low-level IEEE/IEC KERNAL call table (C64)
; Call by placing parameter in A and JSR to address.

JSR $FFB1  ; LISTEN   - A = device number (send LISTEN)
JSR $FFAE  ; UNLISTEN - (drop listening state)
JSR $FFB4  ; TALK     - A = device number (send TALK)
JSR $FFAB  ; UNTALK   - (drop talking state)
JSR $FF93  ; SECOND   - A = $60 + secondary_address (send secondary after LISTEN)
JSR $FF96  ; TKSA     - A = $60 + secondary_address (send secondary after TALK)
JSR $FFA5  ; ACPTR    - Read byte from bus; returned in A
JSR $FFA8  ; CIOUT    - Write byte to bus; A = byte to send

; Note: These calls are the documented low-level primitives. Parameters are passed in A.

; Example: Sending a command to device #8 with secondary address #15
LDA #8
JSR LISTEN
LDA #$6F  ; $60 + 15
JSR SECOND
; Send data bytes here using CIOUT
JSR UNLISTEN

; Example: Receiving data from device #4 with secondary address #7
LDA #4
JSR TALK
LDA #$67  ; $60 + 7
JSR TKSA
; Receive data bytes here using ACPTR
JSR UNTALK
```

## Key Registers
- $FFB1 - KERNAL - LISTEN (send LISTEN command; A = device number)
- $FFAE - KERNAL - UNLISTEN
- $FFB4 - KERNAL - TALK (send TALK command; A = device number)
- $FFAB - KERNAL - UNTALK
- $FF93 - KERNAL - SECOND (A = $60 + secondary address)
- $FF96 - KERNAL - TKSA (A = $60 + secondary address)
- $FFA5 - KERNAL - ACPTR (read byte; returned in A)
- $FFA8 - KERNAL - CIOUT (write byte; A = byte to send)

## References
- "practical_command_sequences" — expands on example sequences that result in these KERNAL calls
- "high_level_channel_io" — explains how high-level I/O maps to these low-level calls

## Labels
- LISTEN
- UNLISTEN
- TALK
- UNTALK
- SECOND
- TKSA
- ACPTR
- CIOUT
