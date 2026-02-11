# Upgrade ROM / BASIC 4.0 — Zero-Page Guidance & Memory Map

**Summary:** This document provides detailed information on available temporary zero-page areas, critical zero-page locations to avoid modifying, and the complete Upgrade ROM / BASIC 4.0 memory map. It also includes absolute I/O ranges for PIA/VIA ($E810-$E84F) and ROM/RAM regions.

**Zero-Page Work Areas and Critical Locations**

**Available Temporary Zero-Page Work Areas (use only for short-lived, save/restore work):**

- $001F-$0027 — Utility pointer area and nearby workspace
- $004B-$0050 — Temporary zero-page area
- $0054-$005D — Temporary zero-page area
- $00B1-$00C3 — Temporary use only when tape I/O is inactive

**Critical Zero-Page Locations That Should Not Be Modified (used by BASIC/OS internals):**

- $0010
- $0013-$0015
- $0028-$0035
- $0037
- $0050-$0051
- $0065
- $0070-$0087
- $008D-$00B0
- $00C4-$00FA

**Notes:**

- Most zero-page locations can be copied out and restored after use, but the listed critical ranges must be left intact.
- Where Upgrade ROM differs from BASIC 4.0, the map shows an asterisk (*) and the 4.0 value is given (differences may exist between 40- and 80-column machines).
- PIA (6520) and VIA (6522) register charts are referenced as identical to those shown for Upgrade/4.0 systems and are included below.

**Memory Map Overview**

The following is the detailed Upgrade ROM / BASIC 4.0 memory map. Differences from BASIC 4.0 are marked with * (and the 4.0 value shown where applicable).

**Hex** | **Decimal** | **Description**
--- | --- | ---
$0000-$0002 | 0-2 | USR jump
$0003 | 3 | Search character
$0004 | 4 | Scan-between-quotes flag
$0005 | 5 | Input buffer pointer; number of subscripts
$0006 | 6 | Default DIM flag
$0007 | 7 | Type: FF = string; 00 = numeric
$0008 | 8 | Type: 80 = integer; 00 = floating point
$0009 | 9 | Flag: DATA scan; LIST quote; memory
$000A | 10 | Subscript flag; FNx flag
$000B | 11 | 0 = INPUT; $40 = GET; $98 = READ
$000C | 12 | ATN sign; Comparison evaluation flag
$000D-$000F | 13-15 | * Disk status DS$ descriptor
$0010 | 16 | * Current I/O device for prompt-suppress
$0011-$0012 | 17-18 | Integer value (for SYS, GOTO, etc.)
$0013-$0015 | 19-21 | Pointers for descriptor stack
$0016-$001E | 22-30 | Descriptor stack (temporary strings)
$001F-$0022 | 31-34 | Utility pointer area
$0023-$0027 | 35-39 | Product area for multiplication
$0028-$0029 | 40-41 | Pointer: start-of-BASIC
$002A-$002B | 42-43 | Pointer: start-of-variables
$002C-$002D | 44-45 | Pointer: start-of-arrays
$002E-$002F | 46-47 | Pointer: end-of-arrays
$0030-$0031 | 48-49 | Pointer: string-storage (moving down)
$0032-$0033 | 50-51 | Utility string pointer
$0034-$0035 | 52-53 | Pointer: limit-of-memory
$0036-$0037 | 54-55 | Current BASIC line number
$0038-$0039 | 56-57 | Previous BASIC line number
$003A-$003B | 58-59 | Pointer: BASIC statement for CONT
$003C-$003D | 60-61 | Current DATA line number
$003E-$003F | 62-63 | Current DATA address
$0040-$0041 | 64-65 | Input vector
$0042-$0043 | 66-67 | Current variable name
$0044-$0045 | 68-69 | Pointer: End of variable name
$0046-$0047 | 70-71 | Pointer: Current variable value
$0048-$0049 | 72-73 | Pointer: End of variable value
$004A | 74 | Variable type
$004B-$004C | 75-76 | Pointer: Current line in input buffer
$004D | 77 | Current character in input buffer
$004E | 78 | Current token
$004F | 79 | Current token length
$0050-$0051 | 80-81 | Pointer: Start of BASIC text
$0052-$0053 | 82-83 | Pointer: End of BASIC text
$0054-$0055 | 84-85 | Pointer: Start of variables
$0056-$0057 | 86-87 | Pointer: End of variables
$0058-$0059 | 88-89 | Pointer: Start of arrays
$005A-$005B | 90-91 | Pointer: End of arrays
$005C-$005D | 92-93 | Pointer: String storage area
$005E-$005F | 94-95 | Pointer: End of string storage area
$0060-$0061 | 96-97 | Pointer: Start of free memory
$0062-$0063 | 98-99 | Pointer: End of free memory
$0064