# CIA #1 Time-of-Day and Interrupt Registers ($DC08-$DC0D)

**Summary:** CIA1 registers $DC08-$DC0D provide the Time‑Of‑Day clock (1/10 seconds, seconds, minutes, hours+AM/PM), the synchronous serial I/O data buffer, and the Interrupt Control Register (ICR) for reading IRQ status and writing the interrupt mask. Searchable terms: $DC08, $DC09, $DC0A, $DC0B, $DC0C, $DC0D, TOD, CIA‑1, ICR, serial buffer.

## Time‑Of‑Day (TOD) and Serial buffer — functional overview
- $DC08-$DC0B are the four TOD registers:
  - $DC08 — 1/10 seconds (tenths)
  - $DC09 — seconds
  - $DC0A — minutes
  - $DC0B — hours + AM/PM flag (bit 7)
- The TOD registers hold time values in BCD (each field is a BCD digit/byte representation). Hours includes an AM/PM indicator in bit 7.
- $DC0C is the synchronous serial I/O data buffer (shift register data buffer used by the CIA serial port / cassette interface).
- $DC0D is the CIA Interrupt Control Register (ICR). Reading returns IRQ status bits; writing modifies the interrupt mask.

Notes:
- TOD fields are discrete registers (tenths, seconds, minutes, hours) rather than a single multi‑byte integer.
- The serial data buffer is the byte interface to the CIA internal shift register used for synchronous serial transfers.

## Interrupt Control Register (ICR) — behaviour and bit meanings
- $DC0D is used both to read which CIA interrupts are pending and to enable/disable (mask) interrupts on write.
- Bit definitions (bit numbers 7..0):
  - 7 — IRQ flag / set‑clear control bit
    - On read: global IRQ flag (1 indicates an IRQ has occurred; reflects any pending interrupt)
    - On write: used as the set/clear selector for the mask operation (see below)
  - 4 — FLAG1 IRQ (external FLAG1, cassette read / serial bus SRQ input)
  - 3 — Serial Port Interrupt
  - 2 — Time‑Of‑Day (TOD) Alarm Interrupt
  - 1 — Timer B Interrupt
  - 0 — Timer A Interrupt
- Typical 6526/6522 CIA ICR write semantics (mask manipulation):
  - Writing with bit 7 = 1: bits set in the written value set (enable) the corresponding interrupt mask bits.
  - Writing with bit 7 = 0: bits set in the written value clear (disable) the corresponding interrupt mask bits.
  - Reading the ICR returns which interrupts are pending; bit 7 is set if any enabled interrupt condition is pending.
  **[Note: consult the CIA datasheet for precise read/write timing and edge cases.]**

## Source Code
```text
Register map (CIA1)
$DC08 (56328)   Time‑Of‑Day: 1/10 seconds (BCD)
$DC09 (56329)   Time‑Of‑Day: seconds (BCD)
$DC0A (56330)   Time‑Of‑Day: minutes (BCD)
$DC0B (56331)   Time‑Of‑Day: hours + AM/PM flag (BCD; Bit 7 = AM/PM)
$DC0C (56332)   Synchronous Serial I/O Data Buffer (shift register interface)
$DC0D (56333)   CIA Interrupt Control Register (ICR) — Read: IRQs, Write: mask

ICR bit layout ($DC0D):
Bit 7 : IRQ Flag (read: 1 = IRQ occurred) / Write: set/clear selector
Bit 6 : unused/reserved
Bit 5 : unused/reserved
Bit 4 : FLAG1 IRQ (cassette read / serial bus SRQ input)
Bit 3 : Serial Port Interrupt
Bit 2 : Time‑Of‑Day Alarm Interrupt
Bit 1 : Timer B Interrupt
Bit 0 : Timer A Interrupt

Decimal addresses included above for cross‑reference with some listings:
$DC08 = 56328
$DC09 = 56329
$DC0A = 56330
$DC0B = 56331
$DC0C = 56332
$DC0D = 56333
```

## Key Registers
- $DC08-$DC0B - CIA1 - Time‑Of‑Day clock registers (1/10s, seconds, minutes, hours+AM/PM)
- $DC0C - CIA1 - Synchronous Serial I/O data buffer (shift register data)
- $DC0D - CIA1 - Interrupt Control Register (ICR) — read IRQ status / write interrupt mask

## References
- "cia1_dc01_ddr_timers_table" — expands on Timer A/B and DDR usages described earlier
- "cia1_control_registers_dc0e_dc0f" — expands on control registers that start/stop timers and select modes

## Labels
- DC08
- DC09
- DC0A
- DC0B
- DC0C
- DC0D
