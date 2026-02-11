# TKSA: SEND TALK SECONDARY ADDRESS (KERNAL $FF96)

**Summary:** TKSA ($FF96) is the KERNAL vector for "Send Talk Secondary Address". On entry A contains the secondary address; it is stored to the serial buffer BSOUR ($0095) and sent on the IEC serial bus via a JSR to $ED36 (handshake/send). The routine then falls through to the wait-for-clock and clear-ATN handlers.

## Operation
On entry to the TKSA vectored routine (KERNAL $FF96) the accumulator (A) holds the IEC secondary address to be transmitted. The routine stores A into the serial buffer BSOUR ($0095) then calls the handshake/send subroutine at $ED36 to perform the byte transfer on the serial bus while the bus is under ATN. After returning from the handshake/send, execution continues into the subsequent KERNAL code paths which wait for the CLK line and clear ATN as required (see cross-references "wait_for_clock" and "clear_atn").

Behavioral details preserved from the source:
- A -> BSOUR ($0095): the secondary address is written into the serial buffer.
- JSR $ED36: performs the IEC handshake and sends the byte to the bus.
- The routine does not explicitly RTI/RTS here but falls through to following KERNAL routines that handle clock synchronization and ATN clearing.

## Source Code
```asm
.; TKSA: SEND TALK SA
.; The KERNAL routine TKSA ($FF96) is vectored here.
.; On entry, A holds the secondary address. This is placed in
.; the serial buffer and sent out to the serial bus "under
.; attention". The routine drops through to the next routine
.; to wait for CLK and clear ATN.

.,EDC7  85 95       STA $95         ; BSOUR, the serial bus buffer
.,EDC9  20 36 ED    JSR $ED36       ; handshake and send byte to the bus
```

## Key Registers
- $0095 - BSOUR - Serial bus buffer (secondary address stored here)
- $ED36 - KERNAL ROM - Handshake/send byte routine (JSR target)
- $FF96 - KERNAL vector - TKSA (Send Talk Secondary Address) entry

## References
- "wait_for_clock" — synchronizes and waits for CLK
- "clear_atn" — clears ATN once talk/listen command completed

## Labels
- TKSA
- BSOUR
