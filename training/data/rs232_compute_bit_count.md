# compute bit count (6551 pseudo-control)

**Summary:** Computes total bits per transmitted character (data bits + stop bit) by testing the pseudo 6551 control register at $0293 using BIT/BEQ/BVC logic and returns with X = bit count. Relevant terms: $0293, 6551, BIT instruction, X register, RTS.

## Description
Starts with X = 9 (default 8 data bits + 1 stop bit). The routine tests bits in the pseudo-6551 control register at $0293 using A = #%00100000 ($20) with BIT, then uses BEQ and BVC to conditionally decrement X one or more times. The BIT instruction sets Z if (A & M) == 0 and copies bit6 of M into V; the code relies on BEQ (Z) and BVC (V clear) to select the number of decrements.

Behavior summary (final X is total bits transmitted = data bits + 1 stop bit):

- $0293 bit6 ($40) = 0, bit5 ($20) = 0 -> X = 9  -> 8 data bits + 1 stop
- $0293 bit6 ($40) = 0, bit5 ($20) = 1 -> X = 8  -> 7 data bits + 1 stop
- $0293 bit6 ($40) = 1, bit5 ($20) = 0 -> X = 7  -> 6 data bits + 1 stop
- $0293 bit6 ($40) = 1, bit5 ($20) = 1 -> X = 6  -> 5 data bits + 1 stop

Thus the two control bits ($20 and $40) encode 8/7/6/5 data-bit formats; the routine decrements X accordingly and returns via RTS with X containing the computed bit count for per-bit transmission.

**[Note: Source may contain an error — original high-level comment mentions only 7- or 5-bit formats but the code also yields a 6-data-bit option (X=7).]**

## Source Code
```asm
.,EF4A A2 09    LDX #$09        set bit count to 9, 8 data + 1 stop bit
.,EF4C A9 20    LDA #$20        mask for 8/7 data bits
.,EF4E 2C 93 02 BIT $0293       test pseudo 6551 control register
.,EF51 F0 01    BEQ $EF54       branch if 8 bits
.,EF53 CA       DEX             else decrement count for 7 data bits
.,EF54 50 02    BVC $EF58       branch if 7 bits
.,EF56 CA       DEX             else decrement count ..
.,EF57 CA       DEX             .. for 5 data bits
.,EF58 60       RTS             
```

## Key Registers
- $0293 - pseudo 6551 control register - bits $20 and $40 select data length (controls decrements resulting in 8/7/6/5 data-bit formats)

## References
- "rs232_transmit_parity_and_stop_bits" — uses the computed bit count when adjusting parity/stop-bit behavior
- "rs232_setup_next_tx_byte" — expands on value stored to $B4 and used for per-bit transmission

## Mnemonics
- BIT
