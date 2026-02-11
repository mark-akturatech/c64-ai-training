# Send LSB of tape write byte to tape (C64 ROM routine $FBA6-$FBC7)

**Summary:** Tests the LSB of the tape write byte ($BD), shifts it into the carry with LSR, sets VIA/CIA1 Timer B low byte to #$60 (bit=0) or #$B0 (bit=1), writes Timer B low/high to $DC06/$DC07, starts Timer B single‑shot via $DC0F=#$19, and toggles the tape output bit on 6510 port $01 (EOR #$08). Search terms: $BD, $9B, $DC06, $DC07, $DC0F, $01, Timer B, LSR, BCC.

## Description
This ROM routine encodes and transmits the least-significant bit of the current tape write byte. It operates on a copy of the byte (the routine reads $BD) and does not shift the original byte here. Behavior:

- LDA $BD; LSR — shifts the LSB into the processor Carry flag. The routine uses Carry to select timing, not the shifted byte itself.
- If Carry = 0 (bit was 0): the routine leaves A = #$60 (low byte of the time constant).
- If Carry = 1 (bit was 1): it loads A = #$B0 (different low byte for a longer pulse).
- The high byte of the 16-bit time constant is set to #$00 (LDX #$00).
- It writes the low byte to CIA1 Timer B low ($DC06) and the high byte to CIA1 Timer B high ($DC07).
- It loads #$19 into CIA1 CRB ($DC0F) to program Timer B for load and single-shot start (value used by ROM to load and start the timer).
- It toggles the tape output by reading the 6510 port at $01, EOR #$08, and writing back to $01 (this flips the tape out bit); then AND #$08 masks the result to leave only the tape bit in A (returned to caller).
- RTS returns to the caller; A contains only the tape out bit after the AND.

Timing constants:
- Bit = 0 → low byte #$60 (total time used $0060 cycles with high byte $00).
- Bit = 1 → low byte #$B0 (total time used $00B0 cycles with high byte $00).

**[Note: Source may contain an error — the header mentions $9B (parity) but the provided assembly does not reference $9B.]**

## Source Code
```asm
                                *** send lsb from tape write byte to tape
                                this routine tests the least significant bit in the tape write byte and sets VIA 2 T2
                                depending on the state of the bit. if the bit is a 1 a time of $00B0 cycles is set, if
                                the bot is a 0 a time of $0060 cycles is set. note that this routine does not shift the
                                bits of the tape write byte but uses a copy of that byte, the byte itself is shifted
                                elsewhere
.,FBA6 A5 BD    LDA $BD         get tape write byte
.,FBA8 4A       LSR             shift lsb into Cb
.,FBA9 A9 60    LDA #$60        set time constant low byte for bit = 0
.,FBAB 90 02    BCC $FBAF       branch if bit was 0
                                set time constant for bit = 1 and toggle tape
.,FBAD A9 B0    LDA #$B0        set time constant low byte for bit = 1
                                write time constant and toggle tape
.,FBAF A2 00    LDX #$00        set time constant high byte
                                write time constant and toggle tape
.,FBB1 8D 06 DC STA $DC06       save VIA 1 timer B low byte
.,FBB4 8E 07 DC STX $DC07       save VIA 1 timer B high byte
.,FBB7 AD 0D DC LDA $DC0D       read VIA 1 ICR
.,FBBA A9 19    LDA #$19        load timer B, timer B single shot, start timer B
.,FBBC 8D 0F DC STA $DC0F       save VIA 1 CRB
.,FBBF A5 01    LDA $01         read the 6510 I/O port
.,FBC1 49 08    EOR #$08        toggle tape out bit
.,FBC3 85 01    STA $01         save the 6510 I/O port
.,FBC5 29 08    AND #$08        mask tape out bit
.,FBC7 60       RTS
```

## Key Registers
- $BD - Zero Page - Tape write byte (source read; LSR shifts LSB into Carry)
- $9B - Zero Page - Parity (mentioned in header but not referenced in assembly)
- $0001 - 6510 I/O port - Tape output bit mask $08 (bit toggled via EOR #$08, stored back to $01)
- $DC06-$DC07 - CIA1 (at $DC00) - Timer B low/high bytes (time constant written here)
- $DC0D - CIA1 - ICR (Interrupt Control Register; read here)
- $DC0F - CIA1 - CRB (Control Register B; written #$19 to load/start Timer B single-shot)

## References
- "write_time_constant_and_toggle_tape" — expands on the suboperation performed via JSR $FBB1
- "tape_write_irq_routine" — expands on the routine called repeatedly by the tape write IRQ sequence