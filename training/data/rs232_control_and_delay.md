# KERNAL serial bit-level helpers ($EE85-$EEBA) — RS232/6551 & IEC low-level I/O (uses $DD00, CIA2)

**Summary:** Low-level KERNAL helpers that manipulate the serial bus via CIA2 port ($DD00): ACPTR-style receive helpers use CIA timer timeouts/handshake, routines to set SERIAL CLOCK ON/OFF and SERIAL OUTPUT 1/0 (outputs are bit-inverted by bus hardware), read serial data+clock into processor flags, and a 1 ms software delay loop (uses X/A as counter).

## Description
This chunk contains a set of tiny KERNAL subroutines used by both RS232 (6551) and IEC serial code for bit-level I/O on the serial bus using CIA2 port $DD00:

- SERIAL CLOCK ON ($EE85-$EE8D): clear bit4 of $DD00 (write 0) so hardware inverts and places CLK line logic high on the bus.
- SERIAL CLOCK OFF ($EE8E-$EE96): set bit4 of $DD00 (write 1) so hardware inverts and places CLK line logic low on the bus.
- SERIAL OUTPUT 1 ($EE97-$EE9F): clear bit5 of $DD00 (write 0) so hardware inverts and places DATA line logic high on the bus.
- SERIAL OUTPUT 0 ($EEA0-$EEA8): set bit5 of $DD00 (write 1) so hardware inverts and places DATA line logic low on the bus.
  - Note: outputs are written inverted because the bus hardware reverses these bits.
- GET SERIAL DATA AND CLOCK IN ($EEA9-$EEB2): read $DD00, wait for a stable read (compare-read loop), then ASL the accumulator so that the serial data and clock can be inspected via processor flags (carry and bit7).
  - The source text states "data is shifted into carry, and CLK into bit 7." Verify mapping when using this result in higher-level code.
  - **[Note: Source may contain an error — ASL sets the carry from bit 7 of A; confirm which input bits contain DATA and CLK before relying on this comment.]**
- DELAY 1 MS ($EEB3-$EEBA): software delay loop that uses X as a temporary counter. On entry X is saved to A (TXA), X is set to $B8 and decremented to zero; result returned with original X restored from A (TAX). A is clobbered.

These primitives are called by higher-level RS232 and IEC routines (timeouts, handshake, bit-banging). The chunk refers to ACPTR-style receive handling (CIA timer-based timeouts, setting ST on timeouts/EOI) but the timer/handshake logic itself is in other routines.

## Source Code
```asm
                                *** SERIAL CLOCK ON
                                This routine sets the clock outline on the serial bus to
                                1. This means writing a 0 to the port. This value is
                                reversed by hardware on the bus.
.,EE85 AD 00 DD LDA $DD00       serial port I/O register
.,EE88 29 EF    AND #$EF        clear bit4, ie. CLK out =1
.,EE8A 8D 00 DD STA $DD00       store
.,EE8D 60       RTS

                                *** SERIAL CLOCK OFF
                                This routine sets the clock outline on the serial bus to
                                0. This means writing a 1 to the port. This value is
                                reversed by hardware on the bus.
.,EE8E AD 00 DD LDA $DD00       serial port I/O register
.,EE91 09 10    ORA #$10        set bit4, ie. CLK out =0
.,EE93 8D 00 DD STA $DD00       store
.,EE96 60       RTS

                                *** SERIAL OUTPUT 1
                                This routine sets the data out line on the serial bus to
                                1. This means writing a 0 to the port. This value is
                                reversed by hardware on the bus.
.,EE97 AD 00 DD LDA $DD00       serial bus I/O register
.,EE9A 29 DF    AND #$DF        clear bit5
.,EE9C 8D 00 DD STA $DD00       store
.,EE9F 60       RTS

                                *** SERIAL OUTPUT 0
                                This routine sets the data out line on the serial bus to
                                0. This means writing a 1 to the port. This value is
                                reversed by hardware on the bus.
.,EEA0 AD 00 DD LDA $DD00       serial bus I/O resister
.,EEA3 09 20    ORA #$20        set bit 5
.,EEA5 8D 00 DD STA $DD00       store
.,EEA8 60       RTS

                                *** GET SERIAL DATA AND CLOCK IN
                                The serial port I/O register is stabilised and read. The
                                data is shifted into carry and CLK into bit 7. This way,
                                both the data and clock can bee determined by flags in the
                                processor status register. Note that the values read are
                                true, and do not need to be reversed in the same way as
                                the output line do.
.,EEA9 AD 00 DD LDA $DD00       serial port I/O register
.,EEAC CD 00 DD CMP $DD00       compare
.,EEAF D0 F8    BNE $EEA9       wait for bus to settle
.,EEB1 0A       ASL             shift data into carry, and CLK into bit 7
.,EEB2 60       RTS

                                *** DELAY 1 MS
                                This routine is a software delay loop where (X) is used as
                                counter, and are decremented for a period of 1
                                millisecond. The original (X) is stored on entry and (A)
                                is messed up.
.,EEB3 8A       TXA             move (X) to (A)
.,EEB4 A2 B8    LDX #$B8        start value
.,EEB6 CA       DEX             decrement
.,EEB7 D0 FD    BNE $EEB6       until zero
.,EEB9 AA       TAX             (A) to (X)
.,EEBA 60       RTS
```

## Key Registers
- $DD00 - CIA 2 - Serial port I/O register (bit4 = CLK output control, bit5 = DATA output control; outputs are inverted by bus hardware; reads return true logic levels used by GET SERIAL DATA AND CLOCK IN)

## References
- "rs232_send_receive_helpers" — expands on RS232 send/receive state machine uses these primitives
- "send_data_serial_bus_continued_and_errors" — expands on CIA timer-based timeouts and handshake usage

## Labels
- CIAPRA
