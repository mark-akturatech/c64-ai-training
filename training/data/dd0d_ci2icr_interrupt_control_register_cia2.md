# CIA #2 Interrupt Control Register ($DD0D)

**Summary:** CI2ICR at $DD0D is the CIA #2 Interrupt Control Register on the 6526 (CIA) chip; it reports interrupt sources (Timer A, Timer B, TOD alarm, serial shift, FLAG) in bits 0–4, has bits 5–6 unused, and uses bit 7 as the global interrupt indicator and as the set/clear control when writing. On CIA #2 the FLAG input is wired to the User Port (Pin B).

## Description
This register controls and reports the five standard 6526 interrupt sources for CIA #2. Read semantics report which events have occurred; write semantics change the interrupt mask bits using bit 7 as the set/clear selector.

- Bits 0–4: Interrupt source bits
  - Bit 0 — Timer A: read = did Timer A count down to 0? (1 = yes). Write = enable/disable Timer A interrupt (1 = enable, 0 = disable; actual set/clear controlled by bit 7 as described below).
  - Bit 1 — Timer B: read = did Timer B count down to 0? (1 = yes). Write = enable/disable Timer B interrupt.
  - Bit 2 — TOD alarm: read = did the Time-of-Day clock reach the alarm time? (1 = yes). Write = enable/disable TOD alarm interrupt.
  - Bit 3 — Serial: read = did the serial shift register finish a byte? (1 = yes). Write = enable/disable serial shift interrupt.
  - Bit 4 — FLAG: read = was a signal sent on the FLAG line? (1 = yes). Write = enable/disable FLAG line interrupt. (On CIA #2 this FLAG line is tied to User Port Pin B and available for user handshaking.)
- Bits 5–6: Not used.
- Bit 7: Global indicator / write control
  - Read: bit 7 = 1 if any CIA #2 source caused an interrupt (global I flag).
  - Write: bit 7 acts as the set/clear selector for bits 0–4. When writing the ICR, bit 7 determines whether the mask bits specified by bits 0–4 are set or cleared (see exact behavior in CIA#1 $DC0D documentation for full semantics).

This register is functionally identical to CIA #1's ICR at $DC0D; the main hardware difference is the physical routing of the FLAG line for CIA #2 to the User Port (Pin B), enabling user-handshaking interrupt use.

## Source Code
```text
Register: $DD0D  CI2ICR  Interrupt Control Register (CIA #2)

Bit 7   Read: Any CIA #2 source caused an interrupt? (1 = yes)
        Write: Set/Clear control for bits 0-4 (see below)

Bits 6-5 Not used

Bit 4   Read: FLAG line signaled? (1 = yes)
        Write: Enable/disable FLAG line interrupt (1 = enable, 0 = disable)
        (On CIA #2 FLAG is connected to User Port Pin B)

Bit 3   Read: Serial shift register finished a byte? (1 = yes)
        Write: Enable/disable serial interrupt (1 = enable, 0 = disable)

Bit 2   Read: TOD clock reached alarm? (1 = yes)
        Write: Enable/disable Time-of-Day alarm interrupt (1 = enable, 0 = disable)

Bit 1   Read: Timer B counted down to 0? (1 = yes)
        Write: Enable/disable Timer B interrupt (1 = enable, 0 = disable)

Bit 0   Read: Timer A counted down to 0? (1 = yes)
        Write: Enable/disable Timer A interrupt (1 = enable, 0 = disable)

Write semantics summary:
- Bit 7 selects set vs clear when writing bits 0-4:
  - If bit 7 = 1 in the written value, bits set to 1 in bits 0-4 will be set (enabled).
  - If bit 7 = 0 in the written value, bits set to 1 in bits 0-4 will be cleared (disabled).

Note: For full operational details and edge cases see CIA #1 ICR documentation ($DC0D).
```

## Key Registers
- $DD0D - CIA-II - Interrupt Control Register (CI2ICR)

## References
- "dc0d_cia1_interrupt_control_register" — General behavior and write semantics (CIA #1 $DC0D)
- "user_port_pinout" — Which User Port pin carries CIA #2 FLAG line (User Port Pin B)

## Labels
- CI2ICR
