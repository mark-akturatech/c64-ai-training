# SECOND: SEND LISTEN SECONDARY ADDRESS (KERNAL $FF93)

**Summary:** Implements the KERNAL SECOND ($FF93) vector: on entry A = secondary address; it stores A into the serial buffer BSOUT ($0095) and calls the handshake/send-byte routine at $ED36, then drops through to CLEAR ATN to release the ATN line.

## Description
Entry: A contains the IEEE-488/C64 serial secondary address to send while the bus is "under attention" (LISTEN secondary address). The routine performs two actions:
- STA $0095 — store A into BSOUT (serial output buffer).
- JSR $ED36 — call the KERNAL handshake/send-byte routine which transmits the byte on the serial bus.

This code is the KERNAL SECOND ($FF93) vectored implementation and falls through to the CLEAR ATN routine afterwards (see "clear_atn" reference).

## Source Code
```asm
                                *** SECOND: SEND LISTEN SA
                                The KERNAL routine SECOND ($ff93) is vectored here. On
                                entry, (A) holds the secondary address. This is placed in
                                the serial buffer and sent to the serial bus "under
                                attention". Finally the routine drops through to the next
                                routine to set ATN false.
.,EDB9 85 95    STA $95         store (A) in BSOUT, buffer for the serial bus
.,EDBB 20 36 ED JSR $ED36       handshake and send byte.
```

## Key Registers
- $0095 - KERNAL zero page - BSOUT (serial output buffer; holds byte to send on bus)
- $ED36 - KERNAL ROM - Handshake / send-byte routine (transmits BSOUT)
- $EDB9-$EDBB - KERNAL ROM - Implementation bytes for SECOND (store and JSR)
- $FF93 - KERNAL vector entry - SECOND (SEND LISTEN secondary address)

## References
- "clear_atn" — releases ATN (CLEAR ATN routine)
- "tksa_send_talk_sa" — similar handling for sending TALK secondary address

## Labels
- SECOND
- BSOUT
