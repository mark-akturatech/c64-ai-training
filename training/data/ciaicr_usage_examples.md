# CIA Interrupt Control Register ($DC0D) — reading clears, writes set/clear masks, BASIC POKE/PEEK examples

**Summary:** Notes for CIA1 Interrupt Control Register $DC0D (decimal 56333): reading returns pending interrupt-source bits (bits 0–6) and the IRQ flag (bit 7) and clears the register; writing uses bit 7 as set/clear selector for the mask bits (enable/disable specific CIA interrupts). Includes BASIC POKE/PEEK examples for disabling/enabling interrupts and preserving the register value.

**Behavior and usage**
- $DC0D (CIA #1 Interrupt Control Register, ICR) reports which CIA interrupt sources have occurred (low bits) and whether the CIA asserted its IRQ line (bit 7). Reading the register returns these bits and clears the ICR, so a read is destructive — if you need to test multiple bits, read once and save the value in RAM (or a BASIC variable) before testing.
- Writing to $DC0D does not directly acknowledge pending events; instead, it modifies the interrupt mask. The written byte uses bit 7 as the set/clear control:
  - If bit 7 of the value written is 1, then any low bits set in the written value are SET in the mask (enable those interrupt sources).
  - If bit 7 of the value written is 0, then any low bits set in the written value are CLEARED in the mask (disable those sources).
- Example consequences:
  - POKE 56333,127 (0x7F): bit 7 = 0, low bits all 1 => clear all mask bits (disable all CIA interrupts). Do not execute this from BASIC immediate mode: disabling Timer A disables the IRQ used for the keyboard input routine, so the keyboard will stop responding.
  - POKE 56333,129 (0x81): bit 7 = 1 and bit 0 = 1 => set mask bit 0 (enable Timer A interrupt).
- Reading the register shows which sources fired: e.g., if Timer A underflowed, bit 0 will be 1 in the read result. If that source is also enabled (mask bit set), bit 7 will be set in the read result to indicate the CIA IRQ line was asserted. Because reading clears the register, save the read value if you want to test multiple bits.

## Source Code
```basic
10 REM Read-and-preserve ICR into variable (BASIC)
20 icr = PEEK(56333)   : REM $DC0D read clears the ICR, so save it
30 IF (icr AND 1) <> 0 THEN PRINT "Timer A underflow"
40 IF (icr AND 2) <> 0 THEN PRINT "Timer B underflow"
50 IF (icr AND 4) <> 0 THEN PRINT "TOD alarm"
60 IF (icr AND 8) <> 0 THEN PRINT "Serial (shift reg) event"
70 IF (icr AND 16) <> 0 THEN PRINT "Flag input"
80 IF (icr AND 32) <> 0 THEN PRINT "CNT (external count) event"
90 IF (icr AND 128) <> 0 THEN PRINT "CIA IRQ line asserted (masked interrupt)"
```

```basic
REM Examples: disable all CIA1 interrupts (do NOT run in immediate mode)
POKE 56333,127   : REM 0x7F clears all mask bits (bit7=0, low bits=1)

REM Enable Timer A interrupt
POKE 56333,129   : REM 0x81 sets bit0 (Timer A) in the mask (bit7=1)
```

```text
Register map (ICR $DC0D) - returned/read value bit meanings (common CIA/6526 mapping):
Bit 0  = Timer A underflow (TA)
Bit 1  = Timer B underflow (TB)
Bit 2  = Time-of-Day alarm (TOD)
Bit 3  = Serial/Shift register event (SP)
Bit 4  = Flag input (FLAG)
Bit 5  = CNT (external count) event
Bit 6  = Unused/reserved in many CIA variants
Bit 7  = IRQ flag (set if any enabled source caused the CIA IRQ)
```

## Key Registers
- $DC0D - CIA 1 - Interrupt Control Register (ICR): read shows pending-source bits and IRQ flag (cleared on read); write uses bit 7 as set/clear selector for mask bits.

## References
- "cia1_registers_and_interrupt_control" — expands on Bit meanings and mask behavior of $DC0D

## Labels
- ICR
