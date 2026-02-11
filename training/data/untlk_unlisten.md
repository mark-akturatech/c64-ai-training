# KERNAL: UNTALK / UNLISTEN sequence (vectored handlers)

**Summary:** KERNAL handlers (vectored at $FFAB and $FFAE) perform the IEC serial-bus sequence to terminate talk/listen sessions by toggling CIA port bits at $DD00 (CIA‑2 Port A). The routine disables interrupts (SEI), performs serial I/O setup, drives ATN and CLK low, sends the command byte (#$5F = UNTALK, #$3F = UNLISTEN) via the send-command routine, clears ATN, delays, then restores CLK and DATA high.

**Operation**
This KERNAL chunk implements the final bus-level handshake for UNTALK and UNLISTEN. Sequence of actions:

- Disable interrupts with SEI to make the bus transaction atomic.
- JSR $EE8E — common serial-bus I/O entry (prepares/locks the bus).
- Read CIA‑2 Port A ($DD00), OR in bit mask #$08 and write back to $DD00 to drive ATN low (set ATN=0) and simultaneously ensure CLK is driven low (bus-level wiring means writing the port drives the lines).
- Load the command byte into A:
  - #$5F for UNTALK
  - #$3F for UNLISTEN
  (the listing contains both forms; the chosen entry point is vectored from $FFAB/$FFAE)
- JSR $ED11 — send the command byte onto the serial bus (the "send TALK/LISTEN" routine).
- JSR $EDBE — clear ATN (release/raise ATN).
- Short wait loop: TXA; LDX #$0A; DEX/BNE to delay a few cycles.
- JSR $EE85 — set CLK high (release/raise CLK).
- JMP $EE97 — set DATA high and finish (data line released).

These steps implement the IEC handshake required to terminate an active TALK or LISTEN: assert ATN, send the special command byte, clear ATN, delay to allow devices to sample, then release CLK and DATA.

## Source Code
```asm
.,EDEF 78       SEI             ; disable interrupts
.,EDF0 20 8E EE JSR $EE8E       ; serial bus I/O
.,EDF3 AD 00 DD LDA $DD00       ; set bit4
.,EDF6 09 08    ORA #$08        ; and store, set ATN 0
.,EDF8 8D 00 DD STA $DD00       ; set CLK 0
.,EDFB A9 5F    LDA #$5F        ; flag UNTALK
.,EDFD 2C       .BYTE $2C       ; BIT instruction to skip next LDA
.,EDFE A9 3F    LDA #$3F        ; flag UNLISTEN
.,EE00 20 11 ED JSR $ED11       ; send command to serial bus
.,EE03 20 BE ED JSR $EDBE       ; clear ATN
.,EE06 8A       TXA
.,EE07 A2 0A    LDX #$0A        ; init delay
.,EE09 CA       DEX             ; decrement counter
.,EE0A D0 FD    BNE $EE09       ; till ready
.,EE0C AA       TAX
.,EE0D 20 85 EE JSR $EE85       ; set CLK 1
.,EE10 4C 97 EE JMP $EE97       ; set data 1
```

## Key Registers
- $DD00 - CIA‑2 - Port A (used here to drive IEC ATN/CLK/DATA lines; bit mask #$08 used to manipulate ATN/CLK)
- $FFAB - KERNAL - UNTALK vectored entry
- $FFAE - KERNAL - UNLISTEN vectored entry

## References
- "clear_atn" — expands on uses of clearing ATN after sending UNTALK/UNLISTEN
- "ciout_send_serial_deferred" — shares serial bus I/O primitives and handshake patterns

## Labels
- UNTALK
- UNLISTEN
