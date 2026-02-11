# CIA#2 Timer Control ($DD0E-$DD0F) and Mirror Area ($DD10-$DDFF)

**Summary:** CIA#2 Timer A and Timer B control registers are located at $DD0E and $DD0F, respectively. These registers manage the start/stop functionality, output modes, and count-source selection for the timers. Additionally, CIA#2 registers are mirrored throughout the address range $DD10-$DDFF in repeated 16-byte blocks, meaning each register appears every $10 bytes within this range.

**Timer Control**

CIA#2 features two 16-bit timers: Timer A and Timer B. Their control registers, CRA ($DD0E) and CRB ($DD0F), configure various operational modes:

- **Start/Stop:** Enables or disables the timer countdown.
- **Output Mode:** Determines how the timer influences outputs, interrupts, or toggles peripheral lines.
- **Count Source Selection:** Chooses between the system clock, external CNT input, or chaining between timers.

### Control Register Bit Layouts

**CRA ($DD0E) - Timer A Control Register:**

- **Bit 7 (START):** 1 = Start Timer A; 0 = Stop Timer A.
- **Bit 6 (PBON):** 1 = Enable Timer A output on PB6; 0 = Disable.
- **Bit 5 (OUTMODE):** 1 = Toggle PB6 on underflow; 0 = Pulse PB6 on underflow.
- **Bit 4 (RUNMODE):** 1 = One-shot mode; 0 = Continuous mode.
- **Bit 3 (LOAD):** 1 = Load Timer A latch into counter (automatically clears).
- **Bit 2 (INMODE):** 1 = Count CNT pulses; 0 = Count system clock pulses.
- **Bits 1-0:** Unused.

**CRB ($DD0F) - Timer B Control Register:**

- **Bit 7 (START):** 1 = Start Timer B; 0 = Stop Timer B.
- **Bit 6 (PBON):** 1 = Enable Timer B output on PB7; 0 = Disable.
- **Bit 5 (OUTMODE):** 1 = Toggle PB7 on underflow; 0 = Pulse PB7 on underflow.
- **Bit 4 (RUNMODE):** 1 = One-shot mode; 0 = Continuous mode.
- **Bit 3 (LOAD):** 1 = Load Timer B latch into counter (automatically clears).
- **Bit 2 (INMODE):** 1 = Count CNT pulses; 0 = Count system clock pulses.
- **Bits 1-0 (MODE):**
  - 00: Count system clock pulses.
  - 01: Count CNT pulses.
  - 10: Count Timer A underflows.
  - 11: Count Timer A underflows while CNT is high.

### Timer Chaining and Count Source Behavior

- **Timer B Chaining:** When Timer B is set to count Timer A underflows (MODE bits set to 10 or 11), it increments each time Timer A underflows. This allows for extended timing intervals.
- **Count Source Switching:** Changing the count source or chaining mode while a timer is running can lead to unpredictable behavior. It's recommended to stop the timer before modifying these settings to ensure consistent operation.

### Example Control Register Configurations

- **Start Timer A in Continuous Mode with System Clock:**
  - CRA = %00010001 (START=1, RUNMODE=0, INMODE=0)
- **Start Timer B in One-Shot Mode Counting Timer A Underflows:**
  - CRB = %00011010 (START=1, RUNMODE=1, MODE=10)

## Source Code

```text
CIA#2 Timer Control and Mirror Map (reference)

$DD0E   - Timer A Control (CRA)   Start, output mode, count source
$DD0F   - Timer B Control (CRB)   Start, output mode, count source

Mirror area:
$DD10-$DDFF  - CIA#2 Images       Registers $DD00-$DD0F appear repeated every $10 bytes
              (reads/writes to $DD10+$n map to $DD00+$n, etc., for n = 0..$0F)
```

## Key Registers

- $DD0E - CIA#2 Timer A Control Register (CRA)
- $DD0F - CIA#2 Timer B Control Register (CRB)
- $DD10-$DDFF - CIA#2 Mirror Area (registers repeated every $10 bytes)

## References

- "cia2_timers" — expands on timer counters and control registers (detailed bit layouts and timer behavior)
- MOS 6526 CIA Datasheet
- Commodore 64 Programmer's Reference Guide

## Labels
- CRA
- CRB
