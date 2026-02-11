# NMI RS-232 Handler ($FE72)

**Summary:** NMI handler fragment at $FE72 (decimal 65138) that checks the RS-232 bit timer and, when a bit-period has elapsed, dispatches to the transmit or receive RS-232 bit routines. Searchable terms: NMI, RS-232, $FE72, bit timer, baud prescaler.

**Operation**

This chunk is a continuation of the NMI handler responsible for polling the RS-232 timing source and acting when the RS-232 timer indicates that a bit period has completed. Upon timer expiry, it performs one of two actions:

- **Receive Mode:** Transfers control to the RS-232 receive-next-bit routine.
- **Transmit Mode:** Calls the transmit-bit routine to handle the next transmit bit.

The RS-232 timing is managed using CIA #2's Timer B. The timer's prescaler value, determining the bit period, is stored in the zero-page variable `BAUDOF` at addresses $0299-$029A. This value is calculated based on the desired baud rate and system clock frequency using the formula:


Where `CLOCK` is the system clock frequency (1,022,730 Hz for NTSC systems and 985,250 Hz for PAL systems). ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))

## Source Code

```
PRESCALER = ((CLOCK / BAUDRATE) / 2) - 100
```


```assembly
; NMI RS-232 Handler at $FE72
FE72  LDA $DD0D       ; Load CIA #2 Interrupt Control Register
FE75  AND #$02        ; Mask Timer B interrupt flag
FE77  BEQ $FE8A       ; Branch if Timer B interrupt not set
FE79  LDA $0298       ; Load BITNUM (number of bits left to send/receive)
FE7C  BEQ $FE84       ; If zero, all bits processed
FE7E  DEC $0298       ; Decrement BITNUM
FE81  JMP $FE9C       ; Jump to transmit/receive next bit routine
FE84  LDA $0297       ; Load RS-232 status register
FE87  AND #$01        ; Mask transmit/receive mode flag
FE89  BEQ $FEA8       ; Branch to receive routine if in receive mode
FE8B  JMP $FE94       ; Jump to transmit routine
```

## Key Registers

- **$DD0D (CIA #2 Interrupt Control Register):** Used to check and manage Timer B interrupts.
- **$0298 (BITNUM):** Zero-page variable indicating the number of bits left to send or receive.
- **$0297 (RSSTAT):** RS-232 status register; bit 0 indicates transmit (1) or receive (0) mode.

## References

- "rs232_baud_rate_tables_ntsc" — expands on baud-rate prescaler values and timing formulas used to decide interrupt/timer timing.
- "rs232_receive_next_bit_nmi" — details the subroutine called to receive the next RS-232 bit.

## Labels
- BITNUM
- RSSTAT
- BAUDOF
