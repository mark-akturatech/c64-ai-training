# COMMODORE 64 - INTERRUPTS (/IRQ)

**Summary:** The VIC-II /IRQ interrupt output is driven low when an enabled internal interrupt source occurs; the /IRQ pin is open-drain and therefore requires an external pull-up resistor.

## Interrupts (/IRQ)
The VIC-II asserts its interrupt output (/IRQ) by pulling the line low whenever any enabled internal interrupt source is triggered. The /IRQ output is implemented as an open-drain driver — it can only pull the line to ground and cannot drive it high — therefore an external pull-up resistor is required to return the line to a logical high level when no interrupt is active.

## References
- "vicii_processor_interface_register_access" — expands on processor must monitor /IRQ and use register access rules to acknowledge or inspect interrupt sources
