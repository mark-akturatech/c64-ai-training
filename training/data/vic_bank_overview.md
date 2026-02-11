# VIC-II Memory Banking and Address Configuration Guide

**Summary:** The VIC-II has 14 address lines and accesses a single 16 KB window of the 64 KB CPU address space; two bits in CIA‑2 Port A ($DD00) select which 16 KB bank the VIC-II sees. The bank‑select bit patterns are inverted by the memory management circuit.

**Overview**

The VIC‑II only drives 14 address lines (A0–A13), so it can address 16 KB at a time. The C64's 64 KB CPU address space is therefore divided into four 16 KB banks (a VIC‑visible window shifted to one of these banks).

Two bits in Port A of CIA‑2 ($DD00) are used to select which 16 KB bank the VIC‑II is connected to. The memory management hardware contains inverters in the bank‑select path, so the bit patterns written to $DD00 are inverted before they reach the VIC‑II bank‑select inputs (i.e., the effective bank selection is the logical inverse of the port bits).

Effect on addressing:

- The VIC‑II always sees addresses A0–A13 ($0000–$3FFF relative to the selected bank); the selected bank determines which 16 KB slice of the CPU address space those VIC addresses map to.
- Typical 16 KB bank base addresses (CPU space): $0000, $4000, $8000, $C000.

The following table maps the bit patterns written to $DD00 (pre-inversion) to the corresponding 16 KB bank base addresses (post-inversion):

| $DD00 Bits (Pre-Inversion) | Inverted Bits | 16 KB Bank Base Address |
|-----------------------------|---------------|-------------------------|
| 11                          | 00            | $0000                   |
| 10                          | 01            | $4000                   |
| 01                          | 10            | $8000                   |
| 00                          | 11            | $C000                   |

To change the VIC-II bank selection safely and avoid visual glitches or race conditions, it is recommended to perform the update during the vertical blanking interval (VBI), when the screen is not being drawn. This can be achieved by setting up a raster interrupt to trigger at the start of the VBI, allowing the bank switch to occur without causing visible artifacts.

The memory management circuit includes inverters that perform the bit inversion for bank selection. While a detailed hardware schematic is not provided here, the presence of these inverters is well-documented in technical references.

## Source Code

```text
+-------------------+
| Memory Management |
|    Circuitry      |
+-------------------+
        |
        v
+-------------------+
|   Inverters (2x)  |
+-------------------+
        |
        v
+-------------------+
|   VIC-II Bank     |
|   Selection Bits  |
+-------------------+
```

## Key Registers

- $DD00 - CIA‑2 - Port A: two bits used to select VIC‑II 16 KB bank (bit patterns are inverted by the memory management circuit; affects VIC address window A0–A13)

## References

- "bank_selection_table" — expands on bank bit patterns and addresses
- "bank_selection_registers_and_rw" — expands on how to change bank bits in $DD00 safely

## Labels
- CIAPRA
