# Preliminary Commodore PLUS/4 (C264) / Commodore 16 Memory Map (Zero-Page and Vectors)

**Summary:** Prototype Commodore PLUS/4 / C16 memory-map notes showing zero-page differences vs. VIC/64 (BASIC pointers like SOB/SOV preserved), selected zero-page addresses ($0073-$00EF), system vectors ($0314-$0319) with defaults, and I/O/TED register region ($FF00-$FF3F).

**Overview**

This is an early (prototype) memory-map summary for the Commodore 264 / PLUS/4 and Commodore 16. Design details may change before commercial release; the data below was accurate to the prototype hardware at time of publication.

Key points:

- Much of zero-page matches the VIC / C64 layout; BASIC pointers (SOB, SOV, etc.) are reported the same.
- CHRGET is not present in the listed zero-page range.
- Several zero-page and page-$05 locations hold file/device/keyboard/cursor tables and pointers.
- System vectors are present at $0314-$0319 with prototype default values (see Source Code for raw defaults).
- TED I/O registers occupy $FF00-$FF3F (TED is the C264 video/SID-like chip — detailed bit-level register map not included in this source).

Avoid relying on these addresses for final hardware/software—some addresses or vector locations may shift before release.

## Source Code

```text
Hex         Decimal       Description
-------------------------------------------------------------------
0073-008A     115-138     (CHRGET not present)

0097          151         How many open files
0098          152         Input device, normally 0
0099          153         Output CMD device, normally 3

00AC          172         Current logical file
00AD          173         Current secondary address
00AE          174         Current device
00AF-00B0     175-176     Pointer to filename

00C8-00C9     200-201     Pointer to screen line
00CA          202         Position of cursor on above line

00CD          205         Row where cursor lives

00EF          239         Number of characters in keyboard buffer

0314-0315     788-789     IRQ vector  (default CE0E)
0316-0317     790-791     BRK vector  (default F44B)
0318-0319     792-793     OPEN vector (default EF53)

(Most other vectors are similar to the C64, but are two locations lower)

0500-0502    1280-1282    USR program jump
0509-0512    1289-1298    Logical file table
0513-051C    1299-1308    Device number table
051D-0526    1309-1318    Secondary address table
0527-0530    1319-1328    Keyboard buffer

0800-0BE7    2048-3047    Color memory
0C00-0FE7    3072-4071    Screen memory
1000-FFFF    4096-65535   BASIC RAM memory
8000-FFFF   32768-65535   ROM:  BASIC
FF00-FF3F   65280-65343   TED I/O control registers
```

## Key Registers

- $0073-$008A - Zero Page - CHRGET area (not present on prototype)
- $0097 - Zero Page - How many open files
- $0098 - Zero Page - Input device (normally $00)
- $0099 - Zero Page - Output CMD device (normally $03)
- $00AC - Zero Page - Current logical file
- $00AD - Zero Page - Current secondary address
- $00AE - Zero Page - Current device
- $00AF-$00B0 - Zero Page - Pointer to filename
- $00C8-$00C9 - Zero Page - Pointer to screen line
- $00CA - Zero Page - Cursor column position on screen line
- $00CD - Zero Page - Cursor row
- $00EF - Zero Page - Number of characters in keyboard buffer
- $0314-$0315 - System vectors - IRQ vector (prototype default $CE0E)
- $0316-$0317 - System vectors - BRK vector (prototype default $F44B)
- $0318-$0319 - System vectors - OPEN vector (prototype default $EF53)
- $0500-$0502 - Page $05 - USR program jump
- $0509-$0512 - Page $05 - Logical file table
- $0513-$051C - Page $05 - Device number table
- $051D-$0526 - Page $05 - Secondary address table
- $0527-$0530 - Page $05 - Keyboard buffer
- $0800-$0BE7 - Color memory
- $0C00-$0FE7 - Screen memory
- $1000-$FFFF - BASIC RAM memory
- $8000-$FFFF - ROM: BASIC
- $FF00-$FF3F - TED - I/O control registers (chip I/O region for C264/TED)

## References

- "plus4_ted_chip_registers" — TED I/O control registers at $FF00-$FF3F (external/expanded reference)