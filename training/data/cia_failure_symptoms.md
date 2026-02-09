# CIA 6526 — Common failure symptoms (CIA1 / CIA2)

**Summary:** Lists common failure symptoms for the MOS 6526 CIA chips on the C64: CIA1 ($DC00 range) symptoms (keyboard, joystick, control ports, cursor) and CIA2 ($DD00 range) symptoms (serial bus/disk, bank‑select/character ROM, user port, RS‑232).

## Failure symptoms

CIA1 failures may manifest as:
- No cursor visible at startup
- Keyboard completely unresponsive
- Partial keyboard or joystick malfunction
- Random characters appearing on screen
- Control port 1 or 2 not working

CIA2 failures may manifest as:
- Serial bus / disk drive inaccessible
- "FILE NOT FOUND" errors on disk operations
- User port not functioning
- Character display anomalies (bank selection fault)
- RS-232 communication failure

## Key Registers
- $DC00-$DC0F - CIA 1 - main CIA1 registers (keyboard matrix, joystick/control ports, timers, interrupts)
- $DD00-$DD0F - CIA 2 - main CIA2 registers (serial bus and disk interface, bank-select/character ROM control, user port, RS-232 related I/O)

## References
- "cia1_detailed_connections" — expands on CIA1 functions (keyboard, joysticks) and related failure modes  
- "cia2_detailed_connections" — expands on CIA2 functions (serial bus, bank select, RS-232) and related failure modes