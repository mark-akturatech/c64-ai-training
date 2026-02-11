# Original ROM Loader — Performance Limits

**Summary:** The original 256‑byte autostart ROM loader used bit‑by‑bit software handshakes (serial protocol) and achieved only about 400 bytes/sec; its periodic disabling of interrupts also stopped background music during disk loads.

## The Speed Problem
The ROM implementation performed software handshakes for every single bit of the serial transfer (bit‑by‑bit ACKs and polling in software). That per‑bit overhead limited raw throughput to roughly 400 bytes/second, so large images took minutes to load: a full 64 KB (65,536 bytes) image at 400 bytes/s requires about 65,536 / 400 = 163.84 seconds (≈ 2 minutes 44 seconds).

In addition to throughput limits, the ROM loader regularly disabled interrupts while performing its tight bit‑timing and handshake loops. Because music and other background tasks on the C64 are normally driven from interrupts (CIA timers or raster IRQs), these periodic interrupt disables prevented background music and other interrupt‑driven activity from running during disk operations.

## References
- "serial_protocol_overview" — expands on optimized protocol approaches to improve throughput and reduce interrupt disabling impacts