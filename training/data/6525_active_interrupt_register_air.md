# 6525 - Active Interrupt Register (AIR)

**Summary:** 6525 Active Interrupt Register (AIR) shows active interrupt bits A4..A0 and clears on write to AIR; used to report which interrupt(s) are currently active (see related ILR and priority-mode behavior).

## Description
- Layout: AIR contains five active-interrupt bits labeled A4..A0 that indicate currently-active interrupt sources.
- Purpose: AIR is read by the CPU (or interrupt-handling logic) to determine which interrupt(s) occurred.
- Clearing behavior: "Clears on Write to AIR" — writing to the AIR register clears its active bit(s) according to the chip's write semantics.
- Cross-interaction: AIR interacts with the Interrupt Latch Register (ILR) and with the 6525 interrupt priority mode; see referenced chunks for how reading AIR affects ILR (ILR xor AIR behavior) and how AIR semantics change under different priority settings.

## Source Code
```text
                          Active Interrupt Register
                          -------------------------
            +----+----+----+----+----+  
            | A4 | A3 | A2 | A1 | A0 |  Clears on Write to AIR
            +----+----+----+----+----+  
```

## References
- "6525_interrupt_latch_register_ILR" — expands on ILR behavior (reading AIR clears ILR bits via ILR xor AIR)
- "6525_interrupt_priority_select" — explains how AIR behavior differs with priority mode

## Labels
- AIR
