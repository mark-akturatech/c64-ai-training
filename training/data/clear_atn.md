# CLEAR ATN (KERNAL)

**Summary:** Clears the serial-bus ATN (attention) line by manipulating CIA 2 port at $DD00 (LDA $DD00 / AND #$F7 / STA $DD00 / RTS). Searchable terms: $DD00, CIA 2, ATN, serial bus, AND #$F7, LDA/STA, RTS.

## Operation
Loads the CIA 2 serial I/O port at $DD00, masks the register with #$F7 to change the ATN bit state, writes the result back to $DD00, and returns (RTS). As described in the source, this makes the ATN line "1" (false), so subsequent serial transfers are treated as data rather than a bus command.

**[Note: Source may contain an error — AND #$F7 clears bit value 0x08 (bit 3 if numbered 0..7). The comment in the original uses "bit4" which appears to use 1-based bit numbering. The code and mask are preserved as in the source.]**

## Source Code
```asm
                                *** CLEAR ATN
                                The ATN, attention, line on the serial bus is set to 1,
                                ie. ATN is now false and data sent on the serial bus will
                                not be interpreted as a command.
.,EDBE AD 00 DD LDA $DD00       serial bus I/O port
.,EDC1 29 F7    AND #$F7        clear bit4, ie. ATN 1
.,EDC3 8D 00 DD STA $DD00       store to port
.,EDC6 60       RTS
```

## Key Registers
- $DD00-$DD0F - CIA 2 - Serial bus I/O and related CIA 2 registers (Port A at $DD00; source masks $DD00 with #$F7 to change the ATN bit)

## References
- "second_listen_sa" — expands on called after SECOND writes address to buffer
- "untlk_unlisten" — expands on used after UN/TALK/UNLISTEN sequences to restore ATN