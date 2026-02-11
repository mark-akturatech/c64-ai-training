# CIA #2 overview ($DD00-$DD0F)

**Summary:** CIA #2 (addresses $DD00-$DD0F) is the Complex Interface Adapter used for the Serial Bus, RS-232 and the User Port; Data Port A (at $DD00) also selects the VIC‑II 16K graphics bank via bits 0–1. Unlike CIA #1, CIA #2’s interrupt line is wired to the 6510 NMI (non-maskable) and must be handled via the NMI vector; mask/enable is via the CIA interrupt mask register.

## Description
- CIA #2 is register-identical to CIA #1 but assigned different system functions on the C64: it controls peripherals on the Serial Bus (e.g. 1541 disk drive, 1525 printer), the RS‑232 interface, and the User Port (8-bit parallel).
- Data Port A is used by the C64 to select which 16K memory bank the VIC‑II will use for graphics; the bank select is placed in Data Port A bits 0–1.
- Interrupt wiring differs: CIA #1 → 6510 IRQ; CIA #2 → 6510 NMI. Because CIA #2 asserts NMI, its interrupts cannot be disabled by the CPU SEI flag. To prevent unwanted NMIs, use the CIA interrupt mask (ICR) to disable specific CIA sources. Routines driven by CIA #2 interrupts must be installed via the NMI vector.
- For general register behaviour (TOD, timers, DDR, serial), see the CIA #1 register documentation; CIA2 follows the same register set and semantics.

## Key Registers
- $DD00-$DD0F - CIA-II (Complex Interface Adapter #2) — Port/Timer/TOD/Control registers; Data Port A (bank select bits 0–1) selects VIC‑II 16K graphics bank; controls Serial Bus, RS‑232, and User Port; interrupts routed to NMI and controlled by CIA interrupt mask (ICR).

## References
- "cia_tod_write_mode_and_latch_behavior" — TOD behavior and write/latch details for both CIA chips ($DCxx and $DDxx)
- "dd00_dd01_cia2_data_ports_a_b_and_serial_rs232" — detailed port usage and peripheral connections for CIA #2 (Data Ports A/B, Serial, RS‑232)