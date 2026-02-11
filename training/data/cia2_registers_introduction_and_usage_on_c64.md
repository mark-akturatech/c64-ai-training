# CIA #2 ($DD00-$DD0F) — C64 usage overview

**Summary:** CIA #2 registers at $DD00-$DD0F control the C64 Serial Bus, RS‑232, and User Port; Data Port A selects the 16K VIC‑II memory bank for video, and CIA #2 interrupts are wired to the 6510 NMI line (use the NMI vector; SEI does not mask these).

## Description
CIA #2 is functionally identical to CIA #1 (same register set and behavior) but on the C64 it is dedicated to:
- Serial Bus devices (e.g. 1541 disk drive, 1525 printer),
- RS‑232 interface (telecommunications),
- the User Port (8‑bit parallel port exposed to the cartridge/edge connectors),
- selecting which 16K memory bank the VIC‑II uses for graphics via Data Port A.

Interrupts from CIA #2 are connected to the 6510 NMI input (not IRQ). Consequently:
- They cannot be masked by setting the CPU Interrupt Disable flag (SEI).
- They can be enabled/disabled via the CIA Interrupt Mask Register.
- Code driven by CIA #2 interrupts must use the NMI vector and handler.

For general register definitions and bit layouts, see the CIA #1 documentation (same chip). This entry is limited to the C64-specific uses noted above.

**[Note: Source may contain an error — one sentence referred to "CIA chips #1 and #1"; it should read "#1 and #2".]**

## Key Registers
- $DD00-$DD0F - CIA #2 (Complex Interface Adapter) - Data Port A/B, Data Direction Registers, Timer A/B, Time‑of‑day/Alarm, Serial Shift register, Interrupt Control/Mask, Control registers; used for Serial Bus, RS‑232, User Port, and VIC‑II 16K bank selection (Data Port A). Interrupt output is wired to the 6510 NMI line.

## References
- "ci2pra_ci2prb" — expands on CIA #2 Data Port A/B bit mappings  
- "user_port_pinout" — expands on User Port lines exposed by CIA #2
