# Check RS-232 Bus Idle and Clear Serial Interrupt Enables

**Summary:** Polls the RS-232 interrupt-enable byte ($02A1) for enabled or error bits, loops until error bits clear, disables the serial FLAG interrupt via CIA 2 ICR ($DD0D), clears the RS-232 interrupt-enable byte, and preserves A with PHA/PLA. Uses $02A1 (RS-232 enable byte) and $DD0D (CIA 2 ICR).

## Description
This routine ensures the RS-232 (serial) bus is idle and that serial-related interrupts are disabled before continuing. Sequence:

- Push A to the stack (PHA) to preserve the accumulator across polling and writes.
- Read $02A1 (the KERNAL variable used as the RS-232 interrupt-enable byte). If it is zero, no serial interrupts are enabled and the routine exits immediately (BEQ).
- If nonzero, repeatedly read $02A1 and AND with #$03 (masking the two low bits used here as error flags). If either error bit is set, loop until both clear.
- Once error bits are clear, load #$10 into A and store to $DD0D (CIA 2 Interrupt Control Register) to disable the serial/FLAG interrupt (write to the ICR).
- Clear $02A1 by storing #$00 there, removing RS-232 interrupt enables.
- Pull A (PLA) to restore the original accumulator and RTS to return.

This guarantees interrupts related to the RS-232 channel are disabled and any error-condition bits are cleared before resuming normal operation.

## Source Code
```asm
.,F0A4 48       PHA             save A
.,F0A5 AD A1 02 LDA $02A1       get the RS-232 interrupt enable byte
.,F0A8 F0 11    BEQ $F0BB       if no interrupts enabled just exit
.,F0AA AD A1 02 LDA $02A1       get the RS-232 interrupt enable byte
.,F0AD 29 03    AND #$03        mask 0000 00xx, the error bits
.,F0AF D0 F9    BNE $F0AA       if there are errors loop
.,F0B1 A9 10    LDA #$10        disable FLAG interrupt
.,F0B3 8D 0D DD STA $DD0D       save VIA 2 ICR
.,F0B6 A9 00    LDA #$00        clear A
.,F0B8 8D A1 02 STA $02A1       clear the RS-232 interrupt enable byte
.,F0BB 68       PLA             restore A
.,F0BC 60       RTS             
```

## Key Registers
- $02A1 - RAM - RS-232 interrupt-enable byte (KERNAL variable used to track/enabled serial interrupts)
- $DD0D - CIA 2 - Interrupt Control Register (ICR) (write used here to disable the serial/FLAG interrupt)

## References
- "rs232_input_highlevel_handshake_and_interrupt_control" — expands on managing FLAG/ICR when bus idle or errors present
- "rs232_get_byte_from_rx_buffer" — expands on status bits updated when reading Rx buffer