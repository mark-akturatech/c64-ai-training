# MACHINE: Upgrade ROM memory map (screen wrap tables, file tables, tape buffers, BASIC/DOS areas, PIA/VIA references)

**Summary:** Memory-map listing for an upgraded ROM (zero page entries, screen line wrap tables, file logical/device/secondary address tables, tape input buffers, BASIC/DOS areas, video RAM and ROM regions) with I/O register ranges for PIA 6520 (keyboard and IEEE-488) and an onboard VIA. Includes absolute addresses ($E810-$E813, $E820-$E823, $E840-$E84F) and video/ROM ranges ($8000-$83E7, $B000-$E7FF, $F000-$FFFF).

## Memory map overview
This chunk enumerates zero-page and low-memory housekeeping entries used by the upgraded ROM (screen wrap tables, file descriptors, tape buffers, keyboard buffers, DOS/MLM pointers), the processor stack and workspace areas, video RAM regions for 40- and 80-column modes, available RAM/ROM expansion ranges, and mapped I/O for PIAs and the VIA. PIA 1 is used for keyboard I/O; PIA 2 is used for IEEE-488 I/O. The VIA block contains general I/O and timers; an 80-column / Fat40 CRT controller block is also mapped.

Use the Source Code section for the exact address table and descriptions. Key I/O register ranges are listed in Key Registers for exact-address filtering.

## Source Code
```text
00CF          207         EOT received from tape
00D0          208         Read character error
00D1          209         Number of characters in file name
00D2          210         Current file logical address
00D3          211         Current file secondary address
00D4          212         Current file device number
00D5          213         Right-hand window or line margin
00D6-00D7     214-215     Pointer: start of tape buffer
00D8          216         Line where cursor lives
00D9          217         Last key; checksum; miscellaneous
00DA-00DB     218-219     File name pointer
00DC          220         Number of INSERTs outstanding
00DD          221         Write shift word; read character in
00DE          222         Tape blocks remaining to write/read
00DF          223         Serial word buffer
00E0-00F8     224-248     (40-column) Screen line wrap table
00E0-00E1     224-225     * (80-column) Top, bottom of window
00E2          226         * (80-column) Left window margin
00E3          227         * (80-column) Limit of keyboard buffer
00E4          228         * (80-column) Key repeat flag
00E5          229         * (80-column) Repeat countdown
00E6          230         * (80-column) New key marker
00E7          231         * (80-column) Chime time
00E8          232         * (80-column) HOME count
00E9-00EA     233-234     * (80-column) Input vector
00EB-00EC     235-236     * (80-column) Output vector
00ED-00F8     237-248     * (80-column) [unused?]
00F9-00FA     249-250     Cassette statuses, #1 and #2
00FB-00FC     251-252     MLM pointer; tape start address
00FD-00FE     253-254     MLM; DOS pointer; miscellaneous
00FF          255         [unused? not listed in original text]
0100-010A     256-266     STR$ work area; MLM work area
0100-013E     256-318     Tape read error log
0100-01FF     256-511     Processor stack
0200-0250     512-592     MLM work area; input buffer
0251-025A     593-602     File logical address table
025B-0264     603-612     File device number table
0265-026E     613-622     File secondary address table
026F-0278     623-632     Keyboard input buffer
027A-0339     634-825     Tape #1 input buffer
033A-03F9     826-1017    Tape #2 input buffer
033A-0380     826-896     * DOS work area
03E9         1001         (Fat 40) New key marker
03EA         1002         (Fat 40) Key repeat countdown
03EB         1003         (Fat 40) Keyboard buffer limit
03EC         1004         (Fat 40) Chime time
03ED         1005         (Fat 40) Decisecond timer
03EE         1006         (Fat 40) Key repeat flag
03EE-03F7    1006-1015    (80-column) Tab stop table
03EF         1007         (Fat 40) Tab work value
03F0-03F9    1008-1017    (Fat 40) Tab stops
03FA-03FB    1018-1019    MLM extension vector
03FC         1020         * IEEE timeout default
03FD-03FF    1021-1023    [unused? not listed in original text]
0400-7FFF    1024-32767   Available RAM including expansion
8000-83E7   32768-33767   (40-column) Video RAM
8000-87CF   32768-34767   * (80-column) Video RAM
9000-AFFF   36864-45055   Available ROM expansion area
B000-E7FF   45056-59391   BASIC ROM, part of kernal
E810-E813   59408-59411   PIA 1: keyboard I/O
E820-E823   59424-59427   PIA 2: IEEE-488 I/O
E840-E84F   59456-59471   VIA: I/O and timers
E880-E881   59520-59521   (80-column and Fat 40) CRT controller
F000-FFFF   61440-65535   Kernal ROM
```

## Key Registers
- $E810-$E813 - PIA 1 - keyboard I/O
- $E820-$E823 - PIA 2 - IEEE-488 I/O
- $E840-$E84F - VIA - I/O and timers
- $E880-$E881 - CRT controller - 80-column and Fat40

## References
- "pia_via_charts" — expands on PIA 1 and 2 contact diagrams and register functions