# Setup next RS232 Tx byte (ROM $EF06)

**Summary:** Reads the 6551 pseudo command register ($0294), uses its handshake bit to choose 3-line vs. 2-line behavior, tests VIA2 DRB ($DD01) for modem signals (DSR/CTS), clears RS-232 parity/next-bit state, loads the RS-232 bit count from $0298, checks the Tx buffer indices ($029D/$029E) and — if bytes remain — fetches the next transmit byte (indirect via $F9), stores it to the RS232 output byte buffer ($B6), increments the Tx start index, and returns. Branches to a handler at $EF39 to disable Timer A when the queue is empty.

**Description**
This ROM routine prepares the next byte for transmission over the RS-232 ACIA interface used by the C64 ROM.

Step-by-step behavior in this snippet:
- LDA $0294; LSR — reads the 6551 "pseudo command" byte at $0294 and logical-shifts it right once. The LSR moves bit0 from A into Carry; that bit functions as the handshake-mode indicator used by the routine.
- BCC $EF13 — if Carry = 0 (handshake bit clear) the routine skips modem-signal checks and continues as the 3-line interface variant.
- If Carry = 1 the code checks modem signals on VIA2 DRB ($DD01):
  - BIT $DD01 sets processor flags from the byte read at $DD01. BIT sets N from bit7 and V from bit6 of $DD01 (and Z from A & M).
  - BPL $EF2E branches if N = 0 (bit7 clear) — interpreted here as DSR = 0, so the routine takes the path that treats DSR as not present.
  - BVC $EF31 branches if V = 0 (bit6 clear) — interpreted here as CTS = 0, so the routine treats CTS as not present.
- In the common path the routine:
  - Clears A and stores zero to $BD (RS232 parity byte) and $B5 (RS232 next-bit register).
  - Loads the bit-count from $0298 into X and stores it to zero page $B4 (RS232 bit count).
  - Loads the current Tx-buffer start index (Y <- $029D) and compares it with the Tx-buffer end index ($029E).
  - If start == end the routine branches to $EF39 to disable Timer A and return.
  - Otherwise it loads the next byte from the transmit FIFO using indirect-indexed addressing LDA ($F9),Y, stores that byte to $B6 (RS232 output byte buffer), increments the start index at $029D, and returns (RTS).

Flags usage and tests:
- BIT on $DD01 is used to sample modem-status bits into processor flags rather than masking manually:
  - N (bit7 of $DD01) => tested by BPL to detect DSR presence (branch when bit7=0).
  - V (bit6 of $DD01) => tested by BVC to detect CTS presence (branch when bit6=0).
- The LSR result's Carry controls whether the VIA2 modem-status checks are performed (handshake mode selection).

Notes:
- The branch target at $EF39 (taken when Tx buffer is empty) is responsible for disabling Timer A and any VIA2 ICR programming required; that code is included below.
- Zero page locations $BD, $B5, $B4, $B6 and the $F9/$FA pointer are used as the runtime RS-232 state and buffer accessors.

## Source Code
```asm
.; $EF06 - setup next RS232 Tx byte
.,EF06 AD 94 02    LDA $0294       ; read the 6551 pseudo command register
.,EF09 4A          LSR             ; handshake bit into Carry
.,EF0A 90 07       BCC $EF13       ; if Carry=0 (3-line interface) skip modem checks
.,EF0C 2C 01 DD    BIT $DD01       ; test VIA2 DRB (RS232 port)
.,EF0F 10 1D       BPL $EF2E       ; if DSR(bit7)=0 -> branch (DSR not present)
.,EF11 50 1E       BVC $EF31       ; if CTS(bit6)=0 -> branch (CTS not present)
.; was 3-line interface
.,EF13 A9 00       LDA #$00        ; clear A
.,EF15 85 BD       STA $BD         ; clear the RS232 parity byte
.,EF17 85 B5       STA $B5         ; clear the RS232 next bit to send
.,EF19 AE 98 02    LDX $0298       ; get the number of bits to be sent/received
.,EF1C 86 B4       STX $B4         ; set the RS232 bit count
.,EF1E AC 9D 02    LDY $029D       ; get the index to the Tx buffer start
.,EF21 CC 9E 02    CPY $029E       ; compare with the index to the Tx buffer end
.,EF24 F0 13       BEQ $EF39       ; if all done branch to disable Timer A and return
.,EF26 B1 F9       LDA ($F9),Y     ; else get a byte from the Tx buffer (indirect,Y)
.,EF28 85 B6       STA $B6         ; save it to the RS232 output byte buffer
.,EF2A EE 9D 02    INC $029D       ; increment the index to the Tx buffer start
.,EF2D 60          RTS

.; $EF39 - disable Timer A and update VIA2 ICR
.,EF39 A9 01       LDA #$01        ; load value to disable Timer A
.,EF3B 8D 0D DD    STA $DD0D       ; write to VIA2 ICR to disable Timer A interrupt
.,EF3E 4D A1 02    EOR $02A1       ; EOR with RS232 control register
.,EF41 09 80       ORA #$80        ; set bit 7
.,EF43 8D A1 02    STA $02A1       ; update RS232 control register
.,EF46 8D 0D DD    STA $DD0D       ; write back to VIA2 ICR
.,EF49 60          RTS
```

## Key Registers
- $0294 - 6551 pseudo command register (handshake-mode and ACIA command bits)
- $0298 - ROM variable - number of RS232 bits to send/receive (bit-count source)
- $029D - ROM variable - Tx buffer start index
- $029E - ROM variable - Tx buffer end index
- $F9 - Zero page pointer (word at $F9/$FA) - base pointer to RS232 Tx buffer (used with ,Y)
- $BD - Zero page - RS232 parity byte (cleared here)
- $B5 - Zero page - RS232 next-bit register (cleared here)
- $B4 - Zero page - RS232 bit count (written from $0298)
- $B6 - Zero page - RS232 output byte buffer (holds next byte to be shifted out)
- $DD01 - CIA 2 ($DD00-$DD0F) - Data Register B (VIA2 DRB / RS232 modem/status lines: DSR=bit7, CTS=bit6)
- $DD0D - CIA 2 Interrupt Control Register (ICR) - controls and indicates interrupt sources
- $02A1 - RS232 control register

## References
- "rs232_transmit_parity_and_stop_bits" — expands on parity/stop-bit decisions applied to the byte being transmitted
- "rs232_disable_timerA_set_via2_icr" — expands on disabling Timer A interrupt and programming VIA2 ICR when transmit queue empty
- "rs232_send_byte_to_tx_buffer" — expands on how bytes are placed into the Tx buffer consumed by this routine