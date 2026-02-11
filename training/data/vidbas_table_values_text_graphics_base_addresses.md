# VIDBAS Values to Change the Text/Graphics Base Address (Table 7-2)

**Summary:** Lookup table mapping VIDBAS nibble values ($0- through $F-) to TEXT BASE ADDRESS upper-bit values ($0000–$3C00 in $0400 steps). Useful when modifying video base addresses for text or graphics.

**Table Description**

This table lists the 16 VIDBAS settings and the corresponding text/graphics base address upper-bit values. The addresses increment in $0400 steps from $0000 up to $3C00. Use this as a direct lookup when calculating or patching the video base address (upper address bits) for text or graphics locations.

## Source Code

```text
Table 7-2 — The Values To Use To Change the Base Address for Text or Graphics.

VIDBAS VALUE   TEXT BASE ADDRESS (Upper Bits)
$0-            $0000
$1-            $0400
$2-            $0800
$3-            $0C00
$4-            $1000
$5-            $1400
$6-            $1800
$7-            $1C00
$8-            $2000
$9-            $2400
$A-            $2800
$B-            $2C00
$C-            $3000
$D-            $3400
$E-            $3800
$F-            $3C00
```

**Explanatory Notes**

The VIDBAS register ($D018) controls the base addresses for both screen (text) memory and character (graphics) memory. The register is divided into two nibbles:

- **Upper nibble (bits 4–7):** Determines the starting address of the screen (text) memory. Each increment corresponds to a $0400 (1024 bytes) step. For example, setting bits 4–7 to $1- points the screen memory to $0400.

- **Lower nibble (bits 0–3):** Determines the starting address of the character (graphics) memory. Each increment corresponds to a $0800 (2048 bytes) step. For example, setting bits 0–3 to $2 sets the character memory to $1000.

When modifying the VIDBAS register:

- To change the **text base address**, modify only the upper nibble (bits 4–7).
- To change the **graphics base address**, modify only the lower nibble (bits 0–3).

**Note:** The actual memory addresses are also influenced by the current VIC-II memory bank setting, which is controlled by bits in the CIA register at $DD00. Ensure that the selected addresses do not overlap with ROM areas or other critical memory regions.

## References

- "vidbas_base_address_notes" — expands on how to apply these VIDBAS values and which bits to modify for text vs graphics
- Commodore 64 Programmer's Reference Guide, Chapter 3: Programming Graphics
- C64-Wiki: [53272 - VIC-II Memory Control Register](https://www.c64-wiki.com/wiki/53272)

## Labels
- VIDBAS
