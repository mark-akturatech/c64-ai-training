# $DC0D CIAICR — Interrupt Control Register (CIA #1)

**Summary:** $DC0D (CIAICR) on the 6526 CIA controls and reports interrupts for Timer A/B, the Time‑Of‑Day alarm, the serial shift register, and the FLAG line; bit 7 selects set/clear behavior on writes and indicates if any CIA#1 source caused an interrupt. Reading the register returns pending-source bits and clears the register.

## Description
- Bits 0–4 correspond to five interrupt sources:
  - Bit 0: Timer A (read = did Timer A reach 0; write = enable/disable Timer A interrupt)
  - Bit 1: Timer B (read/write as above)
  - Bit 2: Time‑Of‑Day (TOD) alarm (read/write)
  - Bit 3: Serial shift register complete (read/write)
  - Bit 4: FLAG line (external input) (read/write). On CIA#1 the FLAG line is connected to the cassette read line.
- Bits 5–6: not used.
- Bit 7:
  - On read: set if any CIA#1 source that is both pending and enabled caused an interrupt (i.e., any sourced IRQ from CIA#1).
  - On write: controls whether mask bits written with 1 are set or cleared:
    - If bit 7 = 1, any bit written as 1 will be set (enable those interrupts).
    - If bit 7 = 0, any bit written as 1 will be cleared (disable those interrupts).
  - Bits written with 0 leave their enable state unchanged.
- Reading the register:
  - Returns which sources have triggered (their bits set to 1).
  - Reading clears the register — preserve its value in RAM if you need to test multiple bits.
- Caveats:
  - Even if a source bit (0–4) is set (condition satisfied), an IRQ will only be signaled if that source's enable bit is set.
  - Disabling Timer A from BASIC will disable the IRQ used by keyboard scanning; avoid doing this from immediate BASIC prompt.

## Source Code
```text
$DC0D        CIAICR       Interrupt Control Register

                     Bit 0  Read/Did Timer A count down to 0?  (1=yes).
                            Write/enable or disable Timer A interrupt (1=enable, 0=disable)
                     Bit 1  Read/Did Timer B count down to 0?  (1=yes).
                            Write/enable or disable Timer B interrupt (1=enable, 0=disable)
                     Bit 2  Read/Did TOD clock reach the alarm time?  (1=yes).
                            Write/enable or disable TOD alarm interrupt (1=enable, 0=disable)
                     Bit 3  Read/Did the serial shift register finish a byte? (1=yes).
                            Write/enable or disable serial interrupt (1=enable, 0=disable)
                     Bit 4  Read/Was a signal sent on the FLAG line? (1=yes).
                            Write/enable or disable FLAG line interrupt (1=enable, 0=disable)
                     Bit 5  Not used
                     Bit 6  Not used
                     Bit 7  Read/Did any CIA#1 source cause an interrupt? (1=yes).
                            Write/ set/clear mask bits: bit7=1 => set bits written as 1;
                            bit7=0 => clear bits written as 1.
```

```basic
REM Examples (BASIC)
POKE 56333,129    : REM enable Timer A interrupt (129 = %10000001 = $81)
POKE 56333,127    : REM disable all interrupts (127 = %01111111 = $7F)
```

## Key Registers
- $DC0D - CIA (6526) - Interrupt Control Register for CIA #1 (Timer A/B, TOD alarm, Serial, FLAG; write bit7 selects set/clear; read clears register)

## References
- "dc04_dc07_timers" — Timer A/B cause bits (bits 0/1) expanded
- "dc08_dc0b_time_of_day_clock_tod" — Time‑Of‑Day clock and alarm (bit 2)

## Labels
- CIAICR
