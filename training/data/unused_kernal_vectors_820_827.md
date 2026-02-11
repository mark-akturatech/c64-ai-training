# Kernal: Unused bytes at $0334-$033B (locations 820–827)

**Summary:** Eight free bytes at $0334-$033B (decimal locations 820–827) in the Kernal vector area; available for user vectors or other data.

## Description
Bytes at addresses $0334–$033B (decimal 820–827) are unused within the Kernal vector region. These eight bytes are reserved/available for storing user vectors or other arbitrary data as needed by programs or custom system patches.

## Key Registers
- $0334-$033B - RAM - Eight unused bytes in the Kernal vector area (locations 820–827); available for user vectors or other data

## References
- "unused_ram_679_767" — Additional regions of free RAM are available for custom use