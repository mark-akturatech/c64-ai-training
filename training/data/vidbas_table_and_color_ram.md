# VIDBAS (graphics base) and Color RAM ($D800)

**Summary:** VIDBAS graphics-base table mapping VIDBAS values to VIC-II graphics base addresses (banks at $0000, $0800, ..., $3800) and Color RAM details at $D800 — nibble (4-bit) per screen cell storage, masking behavior, and mention of MVCOL usage.

**VIDBAS Graphics Base Table**

The following table maps VIDBAS values to their corresponding graphics base addresses. These addresses determine where the VIC-II fetches screen, character, or bitmap data. The "Lower Bits" column indicates the specific bit patterns set in the VIC-II's memory control register ($D018) to select these addresses.

| VIDBAS Value | Graphics Base Address | Lower Bits |
|--------------|-----------------------|------------|
| $00          | $0000                 | %0000      |
| $02          | $0800                 | %0001      |
| $04          | $1000 *               | %0010      |
| $06          | $1800 *               | %0011      |
| $08          | $2000                 | %0100      |
| $0A          | $2800                 | %0101      |
| $0C          | $3000                 | %0110      |
| $0E          | $3800                 | %0111      |

* In BANK 0 and 2, values $04 and $06 select Character ROM instead of RAM.

In this context, the "Lower Bits" refer to bits 1 through 3 of the $D018 register. These bits determine the starting address for character memory within the current VIC bank. The mapping is as follows:

- Bits 1-3 (%000 to %111) correspond to character memory addresses ranging from $0000 to $3800 in increments of $0800.

For example, setting bits 1-3 of $D018 to %010 selects character memory starting at $1000. This configuration is crucial for defining where the VIC-II fetches character data for rendering text and graphics.

**Color RAM ($D800)**

Color RAM is located at $D800, occupying a 1 KB block used as color memory for the 40×25 text/charset screen. Each location stores a single 4-bit nibble, representing one color nybble per character cell. Software that reads or writes to color memory must account for this nibble-storage layout and mask values appropriately (mask to low 4 bits).

The source mentions using the MVCOL routine for color-memory operations, but detailed information about this routine is not provided in this chunk.

## Source Code

```text
VIDBAS VALUE      GRAPHICS BASE ADDRESS      Lower Bits

$00               $0000                      %0000
$02               $0800                      %0001
$04               $1000 *                    %0010
$06               $1800 *                    %0011
$08               $2000                      %0100
$0A               $2800                      %0101
$0C               $3000                      %0110
$0E               $3800                      %0111

* In BANK 0 and 2, values $04 and $06 select Character ROM instead of RAM.
```

```text
Color RAM
Location: $D800
Storage: 1 nibble (4 bits) per screen cell
Notes: Values are stored as low 4 bits; mask writes/reads accordingly.
MVCOL: referenced for color-memory operations (details not included here)
```

## Key Registers

- $D018 - VIC-II Memory Control Register:
  - Bits 1-3: Select character memory location within the current VIC bank.
  - Bits 4-7: Select screen memory location within the current VIC bank.
- $D800 - Color RAM:
  - Stores 4-bit color values for each character cell on the screen.

## References

- "VIDBAS and Color RAM (original chunk)" — VIDBAS table and short color-memory description
- C64-Wiki: [53272 - VIC-II Memory Control Register](https://www.c64-wiki.com/wiki/53272)
- C64-Wiki: [Color RAM](https://www.c64-wiki.com/wiki/Color_RAM)