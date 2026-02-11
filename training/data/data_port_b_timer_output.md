# CIA1 Data Port B — Timer-controlled outputs (Bit 6 / Bit 7)

**Summary:** CIA1 Data Port B ($DC01) can be driven by CIA timers so that Timer A controls Bit 6 and Timer B controls Bit 7 instead of generating interrupts; Control Register A ($DC0E) and Control Register B ($DC0F) select pulse (one machine cycle) or toggle modes.

## Description
CIA timers may be configured to avoid generating an interrupt when they underflow and instead drive an output on Data Port B:
- When configured via Control Register A, Timer A can affect Bit 6 of Data Port B. It can be set to either pulse Bit 6 for one machine cycle or to toggle Bit 6 (flip 1→0 or 0→1) when the timer runs down.
- When configured via Control Register B, Timer B can affect Bit 7 of Data Port B with the same pulse or toggle options.

Searchable terms included: CIA1, Data Port B, $DC01, Timer A, Timer B, Control Register A, Control Register B, bit 6, bit 7, pulse, toggle.

## Key Registers
- $DC01 - CIA1 - Data Port B (controls/readable port; Timer A -> Bit 6, Timer B -> Bit 7)
- $DC0E - CIA1 - Control Register A (configures Timer A interrupt/pulse/toggle behavior)
- $DC0F - CIA1 - Control Register B (configures Timer B interrupt/pulse/toggle behavior)

## References
- "ciacra_control_register_a" — Control Register A bits to configure Timer A output/pulse/toggle
- "ciacrb_control_register_b" — Control Register B bits to configure Timer B output/pulse/toggle

## Labels
- CIAPRB
- CIACRA
- CIACRB
