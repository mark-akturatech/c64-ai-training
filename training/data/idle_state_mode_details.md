# MOS 6567/6569 VIC-II — Idle state (g-access reads $3FFF / $39FF)

**Summary:** In the VIC-II idle state the g-access repeatedly fetches the single byte at $3FFF (or $39FF when the ECM bit is set) and outputs it according to the selected graphics mode while treating the video matrix (c-access data) as all-zero. No c-accesses occur; the fetched byte is displayed repeatedly.

## Idle state behavior
In idle state the VIC-II does not perform c-accesses (video matrix reads). Instead the graphics (g-) access repeatedly reads one fixed memory location:
- ECM = 0: address $3FFF is repeatedly read.
- ECM = 1: address $39FF is repeatedly read. (ECM = Extended Color Mode)

The byte read from that address is interpreted by the graphics rendering logic according to the currently selected graphics mode. The video matrix bits that would normally come from c-accesses are treated as all zeros, so only the single g-access byte determines the displayed pixels/colors for the whole fetched cell(s). See the tables in Source Code for the exact address bit patterns and the per-mode interpretation of the byte.

## Source Code
```text
c-access

 No c-accesses occur.

 Data

 +----+----+----+----+----+----+----+----+----+----+----+----+
 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+
 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+
```

```text
g-access

 Addresses (ECM=0)

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+

 Addresses (ECM=1)

 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 | 13 | 12 | 11 | 10 |  9 |  8 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
 |  1 |  1 |  1 |  0 |  0 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |  1 |
 +----+----+----+----+----+----+----+----+----+----+----+----+----+----+
```

```text
Data

 +----+----+----+----+----+----+----+----+
 |  7 |  6 |  5 |  4 |  3 |  2 |  1 |  0 |
 +----+----+----+----+----+----+----+----+
 |         8 pixels (1 bit/pixel)        | Standard text mode/
 |                                       | Multicolor text mode/
 | "0": Background color 0 ($d021)       | ECM text mode
 | "1": Black                            |
 +---------------------------------------+
 |         8 pixels (1 bit/pixel)        | Standard bitmap mode/
 |                                       | Invalid text mode/
 | "0": Black (background)               | Invalid bitmap mode 1
 | "1": Black (foreground)               |
 +---------------------------------------+
 |         4 pixels (2 bits/pixel)       | Multicolor bitmap mode
 |                                       |
 | "00": Background color 0 ($d021)      |
 | "01": Black (background)              |
 | "10": Black (foreground)              |
 | "11": Black (foreground)              |
 +---------------------------------------+
 |         4 pixels (2 bits/pixel)       | Invalid bitmap mode 2
 |                                       |
 | "00": Black (background)              |
 | "01": Black (background)              |
 | "10": Black (foreground)              |
 | "11": Black (foreground)              |
 +---------------------------------------+
```

## References
- "idle_state_display_state" — expands on definition of idle state and when it occurs
- "graphics_modes_overview" — expands on how g-access interpretation changes with mode in idle state