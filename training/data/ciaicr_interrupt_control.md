# CIA Interrupt Control Register (CIAICR) — $DC0D / 56333

**Summary:** CIA #1 Interrupt Control Register at $DC0D (56333) controls/queries CIA 6526 interrupt sources (Timer A/B, TOD alarm, Serial, FLAG). Bit 7 is the global flag on read and the set/clear selector on write; reading the register clears it.

## Description
This register masks and reports the five CIA interrupt sources: Timer A, Timer B, Time-of-Day (TOD) alarm, Serial shift register completion, and the external FLAG line (on CIA #1 the FLAG is tied to the Cassette Read line). Timers generate an interrupt when they count down to zero; the TOD alarm when the clock matches the alarm; the serial shift register when 8 bits have been shifted; the FLAG when an external line is asserted.

Write semantics
- Bit 7 selects set/clear mode for bits written with 1:
  - If bit 7 = 1, any bit written as 1 will be set (enable that interrupt).
  - If bit 7 = 0, any bit written as 1 will be cleared (disable that interrupt).
- Bits written as 0 are left unchanged.
- Example: POKE 56333,129 (POKE $DC0D,#$81) sets Bit 7 and Bit 0, enabling Timer A interrupt.
- Example: POKE 56333,127 (POKE $DC0D,#$7F) clears Bits 0–6 (because Bit 7=0), disabling all listed interrupts. (Do not execute from BASIC immediate mode — disabling Timer A also disables the IRQ used for keyboard scanning.)

Read semantics
- Reading $DC0D returns which interrupt conditions are currently set (bits 0–4) and sets Bit 7 if any CIA #1 source caused an interrupt.
- Reading the register clears it; preserve the value in RAM if you need to test multiple bits.

Notes
- Bits 5 and 6 are unused.
- The C64 does not use the CIA serial data register for cassette/serial I/O; it uses the regular user port data lines for serial communication.
- Keep the register semantics (read-as-status + read-clears, write with Bit 7 as set/clear selector) in mind when enabling/disabling interrupts from BASIC or machine code.

## Source Code
```text
56333         $DC0D          CIAICR
Interrupt Control Register (CIA #1)

Bit 0:  Read: Timer A underflow flag (1 = underflow occurred)
        Write: enable/disable Timer A interrupt (1 = enable, 0 = disable)
Bit 1:  Read: Timer B underflow flag (1 = underflow occurred)
        Write: enable/disable Timer B interrupt (1 = enable, 0 = disable)
Bit 2:  Read: Time-of-Day (TOD) alarm flag (1 = alarm matched)
        Write: enable/disable TOD alarm interrupt (1 = enable, 0 = disable)
Bit 3:  Read: Serial shift register complete flag (1 = 8 bits shifted)
        Write: enable/disable serial interrupt (1 = enable, 0 = disable)
Bit 4:  Read: FLAG line asserted flag (1 = FLAG asserted)
        Write: enable/disable FLAG line interrupt (1 = enable, 0 = disable)
Bit 5:  Not used
Bit 6:  Not used
Bit 7:  Read: any CIA #1 source caused an interrupt? (1 = yes)
        Write: set/clear control — if 1 then bits written as 1 are set; if 0 then bits written as 1 are cleared

Behavior:
- Reading $DC0D returns status and clears the register.
- Writing $DC0D uses Bit 7 to determine whether 1-bits in the written value set or clear the corresponding interrupt-enable bits.
```

```basic
' BASIC examples (reference)
POKE 56333,127  ' $DC0D <- 0x7F : Bit7=0, clears bits 0-6 -> disable all interrupts
POKE 56333,129  ' $DC0D <- 0x81 : Bit7=1, sets Bit0 -> enable Timer A interrupt
```

## Key Registers
- $DC0D - CIA (6526, CIA #1) - Interrupt Control Register (CIAICR): mask/status for Timer A/B, TOD alarm, Serial, FLAG; Bit 7 = global set/clear selector on write, global IRQ indicator on read

## References
- "ciacra_control_register_a" — expands on control of Timer A behavior
- "ciacrb_control_register_b" — expands on control of Timer B behavior