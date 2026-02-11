# 6526 (CIA) Interrupt Control Register (ICR)

**Summary:** ICR ($0D offset — $DC0D for CIA1, $DD0D for CIA2) provides interrupt masking (write-only INT MASK) and interrupt status/data (read-only INT DATA) for five sources: Timer A underflow, Timer B underflow, TOD alarm, Serial port, and FLAG. Bit 7 is IR (INT Request) on read; bit 7 is SET/CLEAR control on writes.

## Operation
- The 6526 has five interrupt sources: Timer A underflow (TA), Timer B underflow (TB), Time-of-Day alarm (ALRM), Serial port full/empty (SP), and /FLAG (FLG).
- A single register (ICR at offset $0D) implements both the interrupt DATA (read-only) and interrupt MASK (write-only) functions.
- Any interrupt event sets its corresponding bit in the INT DATA register regardless of mask state.
- The INT DATA register's MSB (bit 7 — IR) is set when any interrupt whose mask bit is set becomes active; when IR is set the chip pulls /IRQ low.
- Reading the INT DATA register clears the interrupt DATA bits and releases /IRQ (the DATA register is cleared by the read).
- MASK semantics (write-only INT MASK):
  - Bit 7 of the written byte selects SET (1) or CLEAR (0) mode for the written ones.
  - If bit 7 = 0: bits written as 1 clear the corresponding mask bits; bits written as 0 leave mask bits unchanged.
  - If bit 7 = 1: bits written as 1 set the corresponding mask bits; bits written as 0 leave mask bits unchanged.
- For an interrupt flag to assert IR and generate a CPU interrupt, the corresponding mask bit must be set.
- Polling vs. masked interrupts:
  - Because reading INT DATA clears the DATA register and releases /IRQ, mixing polled checks with true masked interrupts requires preserving the DATA contents if any polled interrupts were present (i.e., a raw read will erase the pending bits).

## Source Code
```text
READ (INT DATA)
 REG   NAME
+-----+---------+------+------+------+------+------+------+------+------+
|  D  |   ICR   |  IR  |   0  |   0  |  FLG |  SP  | ALRM |  TB  |  TA  |
+-----+---------+------+------+------+------+------+------+------+------+

Bit positions (read): bit7=IR, bit6=0, bit5=0, bit4=FLG, bit3=SP, bit2=ALRM, bit1=TB, bit0=TA

WRITE (INT MASK)
 REG   NAME
+-----+---------+------+------+------+------+------+------+------+------+
|  D  |   ICR   |  S/C |   X  |   X  |  FLG |  SP  | ALRM |  TB  |  TA  |
+-----+---------+------+------+------+------+------+------+------+------+


Bit positions (write): bit7=S/C (1=set, 0=clear), bit6=X, bit5=X, bit4=FLG, bit3=SP, bit2=ALRM, bit1=TB, bit0=TA
```

## Key Registers
- $DC0D - CIA 1 - Interrupt Control Register (ICR) — read: INT DATA, write: INT MASK
- $DD0D - CIA 2 - Interrupt Control Register (ICR) — read: INT DATA, write: INT MASK

## References
- "time_of_day_tod_clock" — expands on TOD ALARM as an ICR interrupt source
- "serial_port_sdr" — expands on Serial port completion setting the ICR serial bit
- "control_registers_cra_crb" — expands on CRA/CRB timer control bits that cause timer underflow interrupts

## Labels
- ICR
