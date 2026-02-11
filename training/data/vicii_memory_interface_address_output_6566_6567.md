# VIC-II memory interface differences: 6566 vs 6567

**Summary:** Describes VIC-II 6566 vs 6567 address output configurations: the 6566 provides thirteen fully decoded address outputs (A0–A12) for direct system-bus connection; the 6567 uses multiplexed addresses for direct connection to 64K DRAMs, presenting A06-A00 while /RAS is low and A13-A08 on the A05-A00 pins while /CAS is low; A11-A07 are static on the 6567 to permit ROM connection and lower-order address latching is required.

## Memory interface
- 6566
  - Provides thirteen fully decoded address outputs for direct connection to the system address bus (thirteen address lines = A0–A12). This allows the VIC-II 6566 to drive the system address lines without external multiplexing/latching for those bits.

- 6567
  - Designed for direct connection to 64K dynamic RAM using multiplexed address pins.
  - Multiplexing scheme:
    - When /RAS is asserted low, the chip presents the least-significant address bits A06–A00 on its A06–A00 pins.
    - When /CAS is asserted low, the chip presents the most-significant address bits A13–A08 on the pins labeled A05–A00 (i.e., MSBs share the same physical pins as the LSBs during different strobe phases).
  - Static outputs:
    - Pins A11–A07 on the 6567 are static address outputs (remain stable) so they can be connected directly to a conventional 16K (2K×8) ROM.
  - Design consequence:
    - Because the 6567 multiplexes low/high address bits across the same pins, external latching of the lower-order address bits (A06–A00) is required when the system needs both sets of address bits simultaneously (for example, when interfacing non-multiplexed devices or for bus contention resolution).

## References
- "vicii_system_interface_bus_sharing_and_phases" — describes when the VIC takes control of the address bus (AEC, Phase 1/2 accesses)
- "vicii_processor_interface_register_access" — details register access timing and behavior of A5–A0 pins when the processor accesses VIC registers