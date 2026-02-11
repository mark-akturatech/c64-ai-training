# RS-232 transmit setup (KERNAL)

**Summary:** Checks the RS-232 interrupt-enable byte at $02A1 by shifting its low bit into the carry (LSR) and branching (BCS) if interrupts are already enabled; otherwise loads A with the Timer A start mask (#$10) to begin Timer A–based RS-232 bit-bang transmit timing.

## Operation
This short routine prepares the RS-232 transmit machinery:

- LDA $02A1 — read the RS-232 interrupt-enable byte (KERNAL workspace).
- LSR — logical shift right the accumulator; bit 0 of $02A1 is moved into the CPU Carry flag.
- BCS $F04C — branch if Carry set (i.e., the interrupt-enable bit was 1); if taken, no further transmit-start action is required.
- LDA #$10 — if branch not taken, load A with the Timer A start mask ($10) to start the Timer A-based bit-bang transmit timing (subsequent instructions — not included here — perform the actual Timer A start/write).

Notes:
- The test uses LSR + BCS to sample bit 0 of $02A1 (bit shifted into Carry) and make a branch decision without affecting other flags beyond the shift operation.
- This chunk only prepares the start value; the actual start (writing to VIA or enabling the timer) continues in the following code (see referenced chunks).

## Source Code
```asm
.,F028 AD A1 02    LDA $02A1       ; get the RS-232 interrupt enable byte
.,F02B 4A          LSR             ; shift the enable bit to C
.,F02C B0 1E       BCS $F04C       ; if interrupts are enabled just exit
.,F02E A9 10       LDA #$10        ; start timer A
```

## References
- "rs232_disable_timerA_set_via2_icr" — counterpart that disables or programs VIA2 ICR when interrupts are cleared  
- "rs232_send_byte_to_tx_buffer" — called before queuing a byte to ensure the transmitter is running
