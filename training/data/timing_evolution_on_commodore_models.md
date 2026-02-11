# Commodore IEC Serial Bus — Timing evolution (4 µs → 20 µs → 60 µs)

**Summary:** IEC serial bus hold-time requirements changed across Commodore models: the original 4 µs design (never shipped due to a 6522 VIA bug), the VIC‑20 with ~20 µs holds (~2 KB/s theoretical throughput), and the C64 with ~60 µs holds (<1 KB/s). Causes: 6522 VIA silicon bug and VIC‑II DMA stealing CPU cycles (timing unreliability).

## Timing evolution
- Original (design intent)
  - Target hold time: 4 µs.
  - Status: not shipped — abandoned because of a 6522 VIA silicon bug that prevented reliable short holds.
- VIC‑20 era
  - Hold time used: ~20 µs.
  - Resulting theoretical throughput: ≈ 2 KB/sec.
  - Reason: hardware constraints compared with the original design forced longer hold windows.
- C64 era
  - Hold time used: ~60 µs.
  - Resulting throughput: < 1 KB/sec.
  - Primary cause: VIC‑II video chip performs DMA that intermittently steals CPU cycles, making the CPU unable to meet the original tight timing requirements for the IEC bus. This forced a slower, more robust timing specification.
- Design intent vs reality
  - Commodore aimed for IEC transfer speed comparable to IEEE‑488, but practical hardware limitations (VIA bug, VIC‑II DMA) necessitated slower hold times and lower throughput.

## References
- "byte_transfer_sequence" — expands on required hold times and bit/byte mechanics
- "fast_loaders_and_variants" — expands on fast loaders and why they were needed