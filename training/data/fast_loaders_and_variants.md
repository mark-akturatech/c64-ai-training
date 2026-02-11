# IEC Serial Bus — Fast Loader Variants (JiffyDOS, Fast Serial, Software Loaders)

**Summary:** Notes on IEC serial bus fast-loader approaches: JiffyDOS (KERNAL + drive DOS ROM modification), Fast Serial (C128 CIA hardware-assisted serial), and software fast loaders that upload drive code; covers the IEC fundamental limitation (CPU bit‑banging + VIC‑II DMA). Includes throughput notes (standard <1 KB/s, many loaders 5–10× faster).

## Overview
The standard IEC serial bus used by the C64 is slow (under ~1 KB/s). Multiple approaches were developed to increase throughput by changing where timing and protocol handling occurs: in the computer KERNAL, in the drive ROM, in drive RAM, or in hardware.

## JiffyDOS (1985)
- Software/ROM modification applied to both the computer KERNAL and the disk-drive DOS ROM.
- Replaces the standard IEC serial bus routines on both ends.
- Uses a different byte transfer protocol to reduce per-byte overhead and achieve significantly higher sustained throughput compared with stock IEC.

## Fast Serial (C128, 1986)
- Hardware-assisted approach available on the C128 only.
- Uses the CIA chip's serial register for hardware serial byte transfers (offloads bit timing from the CPU).
- Requires compatible drives (e.g., 1571, 1581) that implement the complementary hardware protocol.
- Not available on standard C64 without compatible hardware in the computer or drive.

## Software Fast Loaders
- Many commercial and public-domain fast loaders replace the timing and transfer protocol in software.
- Common technique: upload custom code into the drive's RAM (drive-side bootstrapping) and then use a modified transfer protocol optimized for that code.
- Typical speed improvements: roughly 5–10× over stock IEC, depending on loader and drive.

## Fundamental IEC Limitation
- The IEC protocol as implemented on the C64 requires the CPU to bit-bang each bit of every byte (software-driven timing).
- On the C64, the VIC‑II (video chip) regularly steals CPU cycles for DMA, causing non-uniform CPU timing and making precise bit‑timing difficult — a primary reason fast loaders and hardware solutions were developed.

## References
- "timing_evolution_on_commodore_models" — expands on why C64 timing limitations motivated fast loaders  
- "burst_api" — expands on burst and drive-assisted fast transfers on compatible drives