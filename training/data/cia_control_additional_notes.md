# CIA Control Register B — Timer B bits (C64 $DC0F / $DD0F)

**Summary:** Describes Control Register B (CIA) bits for Timer B: Bits 0–3 (same functions as Control Register A’s low nybble for Timer A), Bit 4 (force-load), Bits 5–6 (timer source selection, including CPU cycles, CNT line, and Timer A underflows), and Bit 7 (controls whether writes to Time-of-Day registers set the TOD clock or the ALARM). Mentions Data Port B (Timer B output at bit 7) and TOD registers ($DC08-$DC0B / $DD08-$DD0B).

**Description**

- **Bits 0–3 — Timer B Mode Control:**
  - These bits function identically to Bits 0–3 of Control Register A, but apply to Timer B. Their definitions are:
    - **Bit 0 (Start/Stop):** 
      - `0`: Stop Timer B.
      - `1`: Start Timer B.
    - **Bit 1 (PB7 Output Mode):**
      - `0`: Timer B output appears on Data Port B bit 7 as a pulse.
      - `1`: Timer B output appears on Data Port B bit 7 as a toggle.
    - **Bit 2 (Run Mode):**
      - `0`: Timer B operates in one-shot mode (stops after underflow).
      - `1`: Timer B operates in continuous mode (reloads after underflow).
    - **Bit 3 (Force Load):**
      - `0`: No effect.
      - `1`: Forces the Timer B latch value into the counter immediately.
  - **Note:** Timer B’s external/status output appears on Data Port B at bit 7.

- **Bit 4 — Force Load:**
  - Writing a `1` to this bit immediately loads the Timer B counter with the value from its latch. This operation is level-triggered; the load occurs as long as the bit is set. To perform a force load, set Bit 4 to `1` and then back to `0`. This action does not affect the start/stop state of the timer or any interrupt flags.

- **Bits 5–6 — Timer B Source Select (two-bit field):**
  - These bits select the clock source for Timer B:
    - `00`: Timer B counts microprocessor cycles.
    - `01`: Timer B counts pulses on the CNT line (User Port pin 4).
    - `10`: Timer B counts Timer A underflow pulses.
    - `11`: Timer B counts Timer A underflows while the CNT line is high.
  - **Note:** Chaining Timer A underflows into Timer B (modes `10` or `11`) allows for a combined 32-bit timer capable of measuring up to approximately 70 minutes with an accuracy within 1/15 second.

- **Bit 7 — TOD Write Behavior:**
  - Controls the effect of writes to the Time-Of-Day (TOD) registers:
    - `0`: Writing to the TOD registers sets the TOD clock.
    - `1`: Writing to the TOD registers sets the ALARM time.

- **Notes and Hardware References:**
  - CNT line referenced above is User Port pin 4.
  - Timer B external/status output is visible on Data Port B (bit 7).
  - The documented CPU cycle rate (1,022,730 Hz) is the value given in this source; platform differences may apply in practice.

## Source Code

```text
Timing Diagram: Chaining Timer A Underflows into Timer B

Timer A Underflow:  |____|____|____|____|____|____|____|____|____|____|____|____|____|____|____|____|
                    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑    ↑
Timer B Count:      0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
```

*In this diagram, each underflow of Timer A increments Timer B's count by one, effectively creating a 32-bit timer.*

## Key Registers

- **$DC0F / $DD0F** — CIA Control Register B (Timer B control)
- **$DC01 / $DD01** — CIA Data Port B (Timer B output appears at bit 7)
- **$DC08–$DC0B / $DD08–$DD0B** — CIA Time-of-Day registers (TOD)

## References

- "cia_control_register_a" — Cross-reference for bits that affect timer load and start
- "cia_control_register_b" — Cross-reference for Timer B modes and bit meanings