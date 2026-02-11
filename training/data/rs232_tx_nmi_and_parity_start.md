# RS232 Tx NMI handler (C64 ROM disassembly)

**Summary:** NMI routine that transmits RS232 bits using zero-page variables $B4 (bit count), $B6 (output byte buffer), $BD (parity accumulator), and $B5 (next data bit); tests a pseudo 6551 command register at $0294 for parity enable. Contains branches for stop-bit handling ($EF00) and next-byte setup/return ($EF06).

**RS232 Tx NMI routine — behavior and flow**

This NMI handler implements RS232 transmit bit timing and parity accumulation. Flow (entry -> decision -> actions):

- **LDA $B4 / BEQ $EF06**
  - If bit count ($B4) = 0, branch to $EF06 to set up the next transmit byte and return.
- **BMI $EF00**
  - If bit count is negative, branch to $EF00 to handle stop bit(s).
- **Otherwise (bit count is positive):**
  - **LSR $B6**
    - Shift the RS232 output byte buffer right once (LSB-first transmission).
  - **LDX #$00 / BCC $EEC8 / DEX**
    - Set X to 0; if the shifted-out bit was 1, decrement X to $FF.
  - **TXA / EOR $BD / STA $BD**
    - Transfer X to A, EOR with $BD to update the running parity accumulator, and store back to $BD.
  - **DEC $B4**
    - Decrement RS232 bit count; if it becomes zero, branch to parity handling at $EED7.
  - **If bit count still > 0:**
    - **TXA / AND #$04 / STA $B5**
      - Mask A with #$04 and store into $B5 to save the next data bit to send (only bit 2 is used as per mask).
    - **RTS**
      - Return from the NMI handler.

- **Parity processing entry ($EED7):**
  - **LDA #$20 / BIT $0294**
    - Load the parity-enable mask (#$20) and test it against the pseudo 6551 command/status register at $0294.
  - **BNE $EEDF**
    - If parity is enabled (bit 5 of $0294 is set), branch to $EEDF to handle parity bit transmission.
  - **Otherwise:**
    - **LDA #$04 / STA $B5**
      - Load #$04 (marking the stop bit) and store it into $B5.
    - **DEC $B4**
      - Decrement $B4 to set up for stop bit handling.
    - **RTS**
      - Return from the NMI handler.

- **Parity bit handling ($EEDF):**
  - **LDA $BD / AND #$04 / STA $B5**
    - Load the parity accumulator ($BD), mask with #$04, and store the result into $B5 to set the parity bit.
  - **DEC $B4**
    - Decrement $B4 to set up for stop bit handling.
  - **RTS**
    - Return from the NMI handler.

- **Stop bit handling ($EF00):**
  - **LDA #$04 / STA $B5**
    - Load #$04 (marking the stop bit) and store it into $B5.
  - **DEC $B4**
    - Decrement $B4; if it becomes negative, continue sending stop bits.
  - **RTS**
    - Return from the NMI handler.

- **Setup next RS232 Tx byte and return ($EF06):**
  - **JSR $F1A7**
    - Call routine to fetch the next byte to transmit.
  - **STA $B6**
    - Store the fetched byte into the output buffer ($B6).
  - **LDA #$09 / STA $B4**
    - Load #$09 (8 data bits + 1 parity bit) and store into $B4.
  - **RTS**
    - Return from the NMI handler.

Notes:

- Bit extraction is LSB-first (LSR on $B6).
- Parity accumulator is kept in zero page $BD and updated via EOR with the transmitted bit representation.
- The routine saves the masked next data bit into $B5 for later use.

## Source Code

```asm
.,EEBB A5 B4    LDA $B4         ; get RS232 bit count
.,EEBD F0 47    BEQ $EF06       ; if zero, go setup next RS232 Tx byte and return
.,EEBF 30 3F    BMI $EF00       ; if negative, go do stop bit(s)
                                ; else bit count is non-zero and positive
.,EEC1 46 B6    LSR $B6         ; shift RS232 output byte buffer
.,EEC3 A2 00    LDX #$00        ; set X to 0 for bit = 0
.,EEC5 90 01    BCC $EEC8       ; branch if bit was 0
.,EEC7 CA       DEX             ; set X to $FF for bit = 1
.,EEC8 8A       TXA             ; copy bit to A
.,EEC9 45 BD    EOR $BD         ; EOR with RS232 parity byte
.,EECB 85 BD    STA $BD         ; save RS232 parity byte
.,EECD C6 B4    DEC $B4         ; decrement RS232 bit count
.,EECF F0 06    BEQ $EED7       ; if RS232 bit count now zero, go do parity bit
                                ; save bit and exit
.,EED1 8A       TXA             ; copy bit to A
.,EED2 29 04    AND #$04        ; mask 0000 0x00, RS232 Tx DATA bit
.,EED4 85 B5    STA $B5         ; save the next RS232 data bit to send
.,EED6 60       RTS             ; return

                                ; *** do RS232 parity bit, enters with RS232 bit count = 0
.,EED7 A9 20    LDA #$20        ; mask 00x0 0000, parity enable bit
.,EED9 2C 94 02 BIT $0294       ; test the pseudo 6551 command register
.,EEDC D0 05    BNE $EEDF       ; if parity enabled, go set parity bit
.,EEDE 60       RTS             ; else return

                                ; *** set parity bit
.,EEDF A5 BD    LDA $BD         ; load RS232 parity byte
.,EEE1 29 04    AND #$04        ; mask 0000 0x00, RS232 Tx DATA bit
.,EEE3 85 B5    STA $B5         ; save the parity bit to send
.,EEE5 C6 B4    DEC $B4         ; decrement RS232 bit count
.,EEE7 60       RTS             ; return

                                ; *** handle stop bit(s)
.,EF00 A9 04    LDA #$04        ; load stop bit pattern
.,EF02 85 B5    STA $B5         ; save stop bit to send
.,EF04 C6 B4    DEC $B4         ; decrement RS232 bit count
.,EF06 60       RTS             ; return

                                ; *** setup next RS232 Tx byte and return
.,EF06 20 A7 F1 JSR $F1A7       ; fetch next byte to transmit
.,EF09 85 B6    STA $B6         ; store byte in output buffer
.,EF0B A9 09    LDA #$09        ; load bit count (8 data bits + 1 parity bit)
.,EF0D 85 B4    STA $B4         ; store bit count
.,EF0F 60       RTS             ; return
```

## Key Registers

- **$B4** - Zero Page - RS232 bit count (signed test used for stop-bit handling)
- **$B5** - Zero Page - Saved next RS232 data bit (masked with #$04)
- **$B6** - Zero Page - RS232 output byte buffer (shifted LSR for LSB-first transmit)
- **$BD** - Zero Page - RS232 parity accumulator (updated via EOR)
- **$0294** - Memory - Pseudo 6551 command register (BIT tested for parity-enable bit #$20)

## References

- "serial_pin_control_and_1ms_delay" — timing and line manipulation helpers (related to serial I/O)

## Labels
- $B4
- $B5
- $B6
- $BD
- $0294
