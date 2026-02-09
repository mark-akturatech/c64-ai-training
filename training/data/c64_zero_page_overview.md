# The Great Zero-Page Hunt

**Summary:** Lists zero-page ($0000-$00FF) locations typically safe for user programs ($00FC-$00FF, $0022-$002A, $004E-$0053, $0057-$0060) and warns about critical OS/BASIC zero-page locations that must not be modified (e.g. $0013, $0016-$0018, $002B-$0038, $003A, $0053-$0054, $0068, $0073-$008A, $0090-$009A, $00A0-$00A2, $00B8-$00BA, $00C5-$00F4).

## Zero-page availability and cautions
Locations $00FC-$00FF are available for general use. Locations $0022-$002A, $004E-$0053, and $0057-$0060 are listed as work areas available for temporary use.

Most zero-page locations may be saved (copied elsewhere) and restored after use; programmers should avoid permanently altering locations that are critical to the operating system or BASIC.

Critical zero-page locations (must not be modified) listed in source:
- $0013
- $0016-$0018
- $002B-$0038
- $003A
- $0053-$0054
- $0068
- $0073-$008A
- $0090-$009A
- $00A0-$00A2
- $00B8-$00BA
- $00C5-$00F4

**[Note: Source may contain an error — $0053 appears both in the "work areas available" list ($004E-$0053) and in the "critical" list ($0053-$0054). Verify $0053 before using it.]**

## Key Registers
- $0000-$00FF - Zero Page (RAM) - general zero-page address space context
- $00FC-$00FF - Zero Page - available for user programs
- $0022-$002A - Zero Page - work area available for temporary use
- $004E-$0053 - Zero Page - work area available for temporary use (see note about $0053 conflict)
- $0057-$0060 - Zero Page - work area available for temporary use
- $0013 - Zero Page - critical OS/BASIC location (do not modify)
- $0016-$0018 - Zero Page - critical OS/BASIC locations (do not modify)
- $002B-$0038 - Zero Page - critical OS/BASIC locations (do not modify)
- $003A - Zero Page - critical OS/BASIC location (do not modify)
- $0053-$0054 - Zero Page - critical OS/BASIC locations (do not modify)
- $0068 - Zero Page - critical OS/BASIC location (do not modify)
- $0073-$008A - Zero Page - critical OS/BASIC locations (do not modify)
- $0090-$009A - Zero Page - critical OS/BASIC locations (do not modify)
- $00A0-$00A2 - Zero Page - critical OS/BASIC locations (do not modify)
- $00B8-$00BA - Zero Page - critical OS/BASIC locations (do not modify)
- $00C5-$00F4 - Zero Page - critical OS/BASIC locations (do not modify)

## References
- "c64_memory_map_zero_page_part1" — detailed zero-page memory map entries