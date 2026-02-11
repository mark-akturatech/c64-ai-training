# Disable other interrupts before enabling your ISR

**Summary:** Before enabling a custom ISR on the Commodore 64, disable all other interrupt sources (VIC-II, CIA timers/serial, and any OS-installed handlers) so the cause of an interrupt is easy to find; enabling your ISR effectively disables the C64 OS and changes system behavior.

## Rationale
Enabling a bespoke interrupt service routine takes control away from the Commodore 64 operating system: the OS expects its own interrupt sources and handlers to be present. If other interrupt sources remain enabled, they can trigger unexpected entry into your ISR or the OS, making the true cause of an interrupt hard to diagnose. For game or demo code, many OS services are unnecessary or can be implemented differently, so it is normal and advisable to turn off competing interrupt sources before you install your own handler.

## Recommended procedure
- Before installing your ISR, disable all known interrupt sources so only your routine can generate interrupts. This makes it straightforward to identify the interrupt cause.
- After disabling other sources, install your ISR (and vector adjustments if required).
- Re-enable only the specific hardware sources you intend to use while the rest remain off.
- Remember: with the OS interrupt environment altered, OS functions that rely on original interrupts may fail or behave differently; account for that in your program design.

## References
- "kill_macro_and_vector_setup" — expands on the KILL macro and altering interrupt vectors