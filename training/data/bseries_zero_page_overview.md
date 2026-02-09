# B-Series Zero Page (Bank 15) Guidance

**Summary:** Banked zero page behavior for B-Series machines (B-128, CBM-256, etc.): bank 15 is the ROM bank that holds system/BASIC variables; usable free areas in bank 15 include $00E6-$00FF, $0020-$002B, and $0064-$006E. Critical zero-page locations to avoid modifying are listed ($001A, $001D-$001F, $002D-$0041, $0043, $005B, $0078, $0085-$0087, $009E-$00AB, $00C0-$00E5).

**Zero page (banked) behavior**

B-series machines implement multiple zero pages (banked zero page). Key points:

- Bank 15 (the ROM bank) is where system and BASIC variables reside; when writing programs that run from other banks, you typically have the entire zero page (except locations $00 and $01) available.
- If your program runs in bank 15 and needs temporary zero-page space, available unused/free areas in that bank include:
  - $00E6-$00FF
  - $0020-$002B
  - $0064-$006E
- Most zero-page locations can be saved (copied elsewhere) and restored after use, but exercise caution: certain zero-page addresses are critical to the OS/BASIC and must not be modified unless you fully understand the consequences.
- Critical zero-page locations (do not modify) include:
  - $001A
  - $001D-$001F
  - $002D-$0041
  - $0043
  - $005B
  - $0078
  - $0085-$0087
  - $009E-$00AB
  - $00C0-$00E5
- When using zero-page space in other banks, remember locations $00 and $01 are reserved and should not be used.

## Source Code

The following diagram illustrates the zero-page layout in Bank 15, highlighting critical and available areas:

```text
+-------------------------------+-------------------------------+
| Address Range                 | Description                   |
+-------------------------------+-------------------------------+
| $0000-$0001                   | Reserved                      |
+-------------------------------+-------------------------------+
| $0002-$0019                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $001A                         | Critical OS/BASIC variable    |
+-------------------------------+-------------------------------+
| $001B-$001C                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $001D-$001F                   | Critical OS/BASIC variables   |
+-------------------------------+-------------------------------+
| $0020-$002B                   | Available for use             |
+-------------------------------+-------------------------------+
| $002C                         | System/BASIC variable         |
+-------------------------------+-------------------------------+
| $002D-$0041                   | Critical OS/BASIC variables   |
+-------------------------------+-------------------------------+
| $0042                         | System/BASIC variable         |
+-------------------------------+-------------------------------+
| $0043                         | Critical OS/BASIC variable    |
+-------------------------------+-------------------------------+
| $0044-$005A                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $005B                         | Critical OS/BASIC variable    |
+-------------------------------+-------------------------------+
| $005C-$0063                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $0064-$006E                   | Available for use             |
+-------------------------------+-------------------------------+
| $006F-$0077                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $0078                         | Critical OS/BASIC variable    |
+-------------------------------+-------------------------------+
| $0079-$0084                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $0085-$0087                   | Critical OS/BASIC variables   |
+-------------------------------+-------------------------------+
| $0088-$009D                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $009E-$00AB                   | Critical OS/BASIC variables   |
+-------------------------------+-------------------------------+
| $00AC-$00BF                   | System/BASIC variables        |
+-------------------------------+-------------------------------+
| $00C0-$00E5                   | Critical OS/BASIC variables   |
+-------------------------------+-------------------------------+
| $00E6-$00FF                   | Available for use             |
+-------------------------------+-------------------------------+
```

## Key Registers

- $0000-$00FF - B-Series ROM bank 15 (zero page) - system/BASIC variables and zero-page workspace (see critical ranges below)
- $0000 - B-Series ROM bank 15 - reserved (do not overwrite) [includes $00 and $01 reserved note]
- $00E6-$00FF - B-Series ROM bank 15 - unused/free area in bank 15
- $0020-$002B - B-Series ROM bank 15 - temporary work area
- $0064-$006E - B-Series ROM bank 15 - temporary work area
- $001A - B-Series ROM bank 15 - critical OS/BASIC variable (avoid modifying)
- $001D-$001F - B-Series ROM bank 15 - critical OS/BASIC variables (avoid modifying)
- $002D-$0041 - B-Series ROM bank 15 - critical OS/BASIC variables (avoid modifying)
- $0043 - B-Series ROM bank 15 - critical OS/BASIC variable (avoid modifying)
- $005B - B-Series ROM bank 15 - critical OS/BASIC variable (avoid modifying)
- $0078 - B-Series ROM bank 15 - critical OS/BASIC variable (avoid modifying)
- $0085-$0087 - B-Series ROM bank 15 - critical OS/BASIC variables (avoid modifying)
- $009E-$00AB - B-Series ROM bank 15 - critical OS/BASIC variables (avoid modifying)
- $00C0-$00E5 - B-Series ROM bank 15 - critical OS/BASIC variables (avoid modifying)

## References

- "bseries_memory_map_banks_overview" — expands on detailed B-series memory map including bank descriptions and layouts