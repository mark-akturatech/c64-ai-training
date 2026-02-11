# CIA #1 Serial and Interrupt Registers ($DC0C, $DC0D)

**Summary:** Describes the CIA1 serial shift register ($DC0C / SDR) and the CIA interrupt control/status register ($DC0D / ICR). Covers serial bit shifting on the CNT edge and the interrupt sources (Timer A/B/TOD, serial, FLAG) and basic ICR read/write semantics.

**Description**

- **$DC0C — Serial Data Register (SDR):**
  - 8-bit read/write shift register used for the CIA serial port. Data written to $DC0C is loaded into the internal shift register for transmission; data read returns the last-shifted/received byte. Shifting of the bits occurs in hardware on CNT pin edges when the serial port is enabled and driven by the CIA's timers or external clock.
  - The actual serial clocking source and enabling are controlled by CIA control registers (CRA/CRB) and the CNT pin; those control bits and connections determine whether shifting is triggered by timer underflow, TOD, or external edges on CNT.

- **$DC0D — Interrupt Control Register (ICR):**
  - Holds interrupt flags for the CIA and provides the mechanism to enable/disable interrupt sources.
  - The CIA reports interrupts for timer underflows (Timer A, Timer B), the TOD alarm, the serial shift port, and the external FLAG line. Reading ICR returns which interrupt sources have pending flags; if any pending interrupt is signaled, the top bit of the read value is set.
  - Writing to ICR is used to set or clear interrupt-enable bits: the value written selects which interrupts to operate on; one control bit in the write determines whether the selected bits are being set or cleared (set mode vs clear mode).

## Source Code

```text
Register: $DC0C  - CIA1 Serial Data Register (SDR)
  - 8 bits: read/write  (Serial shift register)
  - Write: load byte for transmission (shifted out on CNT edges)
  - Read: last received/shifted byte
  - Shift clock: CNT pin edges (and can be gated by timer/TOD and CRA/CRB control bits)

Register: $DC0D  - CIA1 Interrupt Control Register (ICR)
  - Read: returns interrupt status flags; bit7 set if any enabled interrupt is pending.
  - Write: bit7 selects set/clear mode for the interrupt enable bits specified in bits0-4.
  - Bit layout (bit7..bit0):
      bit7 - IRQ flag summary (1 = at least one enabled interrupt pending)
      bit6 - (unused / reserved)
      bit5 - (unused / reserved)
      bit4 - FLAG interrupt (external FLAG pin)
      bit3 - Serial interrupt (SDR / serial transfer)
      bit2 - TOD alarm interrupt
      bit1 - Timer B underflow interrupt
      bit0 - Timer A underflow interrupt

  - Typical usage:
      Read ICR -> get which interrupts are pending; bit7 indicates presence of any enabled pending interrupt.
      Write ICR with bit7=1 and mask in bits0-4 -> set enable bits for those sources.
      Write ICR with bit7=0 and mask in bits0-4 -> clear enable bits for those sources.
```

## Key Registers

- $DC0C - CIA 1 - Serial Data Register (SDR), read/write 8-bit shift register clocked on CNT edges
- $DC0D - CIA 1 - Interrupt Control Register (ICR), Timer A/B, TOD, Serial, FLAG interrupt status and enable control

## References

- "serial_and_rs232_zero_page" — expands on serial bit handling in zero page and CIA usage

## Labels
- SDR
- ICR
