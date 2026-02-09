# CIA #1 Interrupts — TIMA/TIMB ($DC04-$DC07) and ICR ($DC0D)

**Summary:** Lists CIA #1 timer registers $DC04-$DC07 (TIMALO/TIMAHI/TIMBLO/TIMBHI) and the Interrupt Control Register $DC0D (CIAICR). Describes read semantics (clear-on-read interrupt latches), write semantics (bit 7 = set/clear control), and which bits enable/indicate Timer A/B, TOD alarm, Serial, and FLAG interrupts.

## Overview
The 6526 (CIA) in the C64 provides five interrupt sources for CIA #1: Timer A, Timer B, the Time-of-Day (TOD) alarm, the serial shift register, and the FLAG input (on CIA #1 this is connected to the Cassette Read line). The timers are programmed via TIMALO/TIMAHI and TIMBLO/TIMBHI at $DC04–$DC07. The Interrupt Control Register (ICR) at $DC0D contains the interrupt status bits (read) and the interrupt enable/disable control (write).

- Read semantics: Reading $DC0D returns the interrupt latch/status bits for the five sources. Reading the ICR is used to observe which sources caused an interrupt; the status bits are clear-on-read (the latched flags are cleared when read).
- Write semantics: Writing to $DC0D modifies the interrupt enable bits. The behavior depends on bit 7 of the value written:
  - If bit 7 = 1, any bit written as 1 will be set (enable the corresponding interrupt).
  - If bit 7 = 0, any bit written as 1 will be cleared (disable the corresponding interrupt).
  - Bits written as 0 are not affected by the write operation.
- Bit 7 on read: indicates if any CIA #1 source caused an interrupt (summary flag).

Use the ICR inside an ISR to read/clear the source latches and to enable/disable particular interrupt sources. Typical practice: read $DC0D in the IRQ handler to determine and clear the source, then write to $DC0D (with bit 7 set or clear as needed) to enable or disable sources.

## Source Code
```text
56324 $DC04 TIMALO
Timer A (low byte)

56325 $DC05 TIMAHI
Timer A (high byte)

56326 $DC06 TIMBLO
Timer B (low byte)

56327 $DC07 TIMBHI
Timer B (high byte)

56333 $DC0D CIAICR
Interrupt Control Register
```

```text
Bit 0: Read / did Timer A count down to 0? (1=yes)
Write/ enable or disable Timer A interrupt (1=enable, 0=disable)
Bit 1: Read / did Timer B count down to 0? (1=yes)
Write/ enable or disable Timer B interrupt (1=enable, 0=disable)
Bit 2: Read / did Time of Day Clock reach the alarm time? (1=yes)
Write/ enable or disable TOD clock alarm interrupt (1=enable, 0=disable)
Bit 3: Read / did the serial shift register finish a byte? (1=yes)
Write/ enable or disable serial shift register interrupt (1=enable, 0=disable)
Bit 4: Read / was a signal sent on the flag line? (1=yes)
Write/ enable or disable FLAG line interrupt (1=enable, 0=disable)
Bit 5: Not used
Bit 6: Not used
Bit 7: Read / did any CIA #1 source cause an interrupt? (1=yes)
Write/ set or clear bits of this register (1=bits written with 1 will be set, 0=bits written with 1 will be cleared)
```

## Key Registers
- $DC04-$DC07 - CIA #1 - Timer A low/high and Timer B low/high (TIMALO, TIMAHI, TIMBLO, TIMBHI)
- $DC0D - CIA #1 - Interrupt Control Register (ICR / CIAICR): status bits (clear-on-read) and enable/disable via bit7 set/clear semantics

## References
- "cia1_timers_and_usage" — expands on Timer registers referenced here
- "irq_isr" — expands on Interrupt latch clearing via reading $DC0D within ISR