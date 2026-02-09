# CLRCHN — Restore default I/O (KERNAL $FFCC)

**Summary:** CLRCHN (vectored at $FFCC) closes any serial-bus default devices by sending UNLISTEN/UNTALK when the default output/input device numbers ($009A/$0099) are > 3, then restores defaults: output = screen ($009A = 3) and input = keyboard ($0099 = 0). Uses CPX/BCS/JSR/STA to test device numbers and call KERNAL serial routines at $EDFE/$EDEF.

## Behavior
This KERNAL entry (CLRCHN) is vectored at $FFCC. Operation:

- Load X with #$03 and compare (CPX) with DFLTO ($009A). The CPX sets Carry when X >= DFLTO:
  - If DFLTO <= 3 (screen or lower-numbered device), BCS is taken and no UNLISTEN is sent.
  - If DFLTO > 3 (serial-bus devices are 4,5,...), BCS is not taken and JSR $EDFE is executed to send UNLISTEN to the serial bus.
- Repeat the same test for DFLTI ($0099) with CPX #$03:
  - If DFLTI > 3, JSR $EDEF is executed to send UNTALK to the serial bus.
- After handling possible serial devices, store X (which still contains #$03) into DFLTO ($009A) to set the screen as default output.
- Store #$00 into DFLTI ($0099) to set keyboard as default input.
- RTS to return.

JSR targets:
- $EDFE — KERNAL UNLISTEN routine (serial bus)
- $EDEF — KERNAL UNTALK routine (serial bus)

This routine is typically invoked by error-handling paths that need to close/restore I/O channels before returning to the user or BASIC.

## Source Code
```asm
                                *** CLRCHN: RESTORE TO DEFAULT I/O
                                The KERNAL routine CLRCHN ($ffcc) is vectored here. The
                                default output device is UNLISTENed, if it is on the
                                serial bus, and the default output is set to the screen.
                                The default input device is UNTALKed, if it is on the
                                serial bus, and the default input device is set to
                                keyboard.
.,F333 A2 03    LDX #$03        check if device > 3 (serial bus is 4,5...)
.,F335 E4 9A    CPX $9A         test DFLTO, default output device
.,F337 B0 03    BCS $F33C       nope, no serial device
.,F339 20 FE ED JSR $EDFE       send UNLISTEN to serial bus
.,F33C E4 99    CPX $99         test DFLTI, default input device
.,F33E B0 03    BCS $F343       nope, no serial device
.,F340 20 EF ED JSR $EDEF       send UNTALK to serial bus
.,F343 86 9A    STX $9A         store screen as DFLTO
.,F345 A9 00    LDA #$00
.,F347 85 99    STA $99         store keyboard as DFLTI
.,F349 60       RTS
```

## Key Registers
- $FFCC - KERNAL vector entry point for CLRCHN (this chunk is the vectored implementation)
- $EDFE - KERNAL routine: UNLISTEN (serial bus)
- $EDEF - KERNAL routine: UNTALK (serial bus)
- $009A - DFLTO - Default output device number (0..255); value > 3 indicates serial-bus device
- $0099 - DFLTI - Default input device number (0..255); value > 3 indicates serial-bus device

## References
- "output_kernal_error_messages" — expands on CLRCHN being called by error handling to close I/O channels