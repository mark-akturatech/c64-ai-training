# C64 IEC serial bit-bang helpers (CIA2 Port A $DD00)

**Summary:** Low-level 6502 routines manipulating the IEC serial clock and data lines via CIA 2 Port A ($DD00). Provides: set serial clock high/low, set serial data high/low, sample serial data into the processor Carry (stable-read), and a 1 ms X-loop delay (preserves X).

## Description
This chunk contains compact routines that bit-bang the IEC serial bus by reading and writing CIA 2 Port A (DRA) at $DD00.

- Routines
  - Set serial clock out high: read $DD00, AND #$EF (clear bit $10), STA $DD00.
  - Set serial clock out low: read $DD00, ORA #$10 (set bit $10), STA $DD00.
  - Set serial data out high: read $DD00, AND #$DF (clear bit $20), STA $DD00.
  - Set serial data out low: read $DD00, ORA #$20 (set bit $20), STA $DD00.
  - Sample serial data into Carry: read $DD00, re-read and CMP to ensure a stable value, then ASL A to shift the port byte so bit7 is moved into the processor Carry.
  - 1 ms delay loop: saves X into A (TXA), loads X with #$B8, loops DEX/BNE, restores X from A (TAX), then RTS. Only X is preserved across the call; A is overwritten with the original X value.

- Port/bit mapping used by these routines (as implemented)
  - Bit $10 (mask 0x10) — serial clock output (code clears this bit to drive high, sets it to drive low; i.e. treated as active-low output).
  - Bit $20 (mask 0x20) — serial data output (same active-low behavior).
  - Serial data input is sampled from a port bit whose value ends up in bit7 of the loaded A; ASL shifts it into the processor Carry.

- Stable-read for sampling
  - The sampling routine reads $DD00 into A, immediately reads $DD00 again via CMP $DD00; if the second read differs (BNE), it reloops until two consecutive identical reads are obtained. This prevents sampling the bus during a transient. After stability is confirmed, ASL A places the sampled input bit into Carry.

- Read-modify-write behavior
  - Each set/clear routine reads the full port byte, applies an AND/ORA mask to change only the clock/data bit, then STA back to $DD00 so other port bits (including the video address bits mentioned in the original comments) are preserved.

- Delay timing
  - The delay uses X as a loop counter (#$B8) and returns with the original X restored. The routine is intended as ~1 ms delay (implementation-dependent on CPU clock).

## Source Code
```asm
                                *** set the serial clock out high
.,EE85 AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EE88 29 EF    AND #$EF        mask xxx0 xxxx, set serial clock out high
.,EE8A 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,EE8D 60       RTS             

                                *** set the serial clock out low
.,EE8E AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EE91 09 10    ORA #$10        mask xxx1 xxxx, set serial clock out low
.,EE93 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,EE96 60       RTS             

                                *** set the serial data out high
.,EE97 AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EE9A 29 DF    AND #$DF        mask xx0x xxxx, set serial data out high
.,EE9C 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,EE9F 60       RTS             

                                *** set the serial data out low
.,EEA0 AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EEA3 09 20    ORA #$20        mask xx1x xxxx, set serial data out low
.,EEA5 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,EEA8 60       RTS             

                                *** get the serial data status in Cb
.,EEA9 AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,EEAC CD 00 DD CMP $DD00       compare it with itself
.,EEAF D0 F8    BNE $EEA9       if changing got try again
.,EEB1 0A       ASL             shift the serial data into Cb
.,EEB2 60       RTS             

                                *** 1ms delay
.,EEB3 8A       TXA             save X
.,EEB4 A2 B8    LDX #$B8        set the loop count
.,EEB6 CA       DEX             decrement the loop count
.,EEB7 D0 FD    BNE $EEB6       loop if more to do
.,EEB9 AA       TAX             restore X
.,EEBA 60       RTS             
```

## Key Registers
- $DD00-$DD0F - CIA 2 - Port A (DRA) and adjacent CIA2 registers; $DD00 is read/written to control/sample IEC serial clock/data lines

## References
- "send_secondary_address_after_listen_and_talk_set_atn" — control ATN and transmit secondary addresses
- "wait_for_serial_bus_end_after_send" — manage final clock/data states on bus end
- "input_byte_from_serial_bus" — routines that sample clock/data extensively during input