# 6566/6567 (VIC-II) — Video Outputs: SYNC/LUM and COLOR

**Summary:** Describes the VIC-II (6566/6567) dual video outputs: SYNC/LUM (contains horizontal/vertical sync and luminance, open-drain, needs 500Ω pull-up) and COLOR (contains chrominance and color burst, described as "open‑source" in source, should be terminated with 1000Ω to ground). Explains external mixing and feeding to a monitor or RF modulator.

## Overview
The VIC-II provides two separate analog outputs that must be externally combined to form a composite video signal:

- SYNC/LUM
  - Carries horizontal and vertical sync and the luminance (Y) information for the display.
  - Described in the source as an open‑drain output and therefore requires an external pull‑up resistor (500 Ω specified).

- COLOR
  - Carries the chrominance information (color burst and chroma subcarrier content) that determines pixel colors.
  - Described in the source as "open‑source" and specified to be terminated with 1000 Ω to ground.

After appropriate external mixing of SYNC/LUM and COLOR, the resulting composite signal can either directly drive a video monitor (if levels/impedance match) or be fed into an RF modulator for use with a standard television.

**[Note: Source may contain an error — the term "open‑source" for the COLOR output appears to be an OCR or terminology mistake; verify against the original VIC‑II datasheet whether COLOR is actively driven or requires a specific termination.]**

## Electrical characteristics & termination (from source)
- SYNC/LUM: open‑drain, external pull‑up = 500 Ω
- COLOR: (described as) open‑source, termination to ground = 1000 Ω
- Both outputs must be externally mixed to produce a composite video signal suitable for monitors or modulators.

## References
- "vicii_system_interface_bus_sharing_and_phases" — expands on video timing and how raster activity affects memory accesses  
- "vicii_bus_activity_summary_table" — summarizes PHASE/CS/RW interaction which determines when VIC-II video fetches occur
