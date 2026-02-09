# MACHINE — Bank 15 zero-page & vectors ($00C8-$03FF)

**Summary:** Zero-page and low-page layout for Bank 15 including screen/keyboard variables ($00C8-$00FF), stack and numeric-to-ASCII workspace ($0100-$01FE), filename/disk buffers ($0200-$0254), BASIC and CHRGET/CHRGOT vectors and links ($0280-$0295), and IRQ vector default ($0300-$0301).

## Overview
This chunk documents the Bank 15 continuation of zero-page variables and vector/link addresses used by the monitor and BASIC ROMs. It separates small runtime variables (screen, keyboard, cursor state), workspace areas (STACK, NUM->ASCII, PRINT USING), file/disk buffers, and ROM link vectors (error, warm start, CHRGET/CHRGOT, float/fixed conversion, etc.). Default vector targets (from the source) are preserved where listed.

The canonical, address-by-address listing is placed in the Source Code section (reference table). Use the Source Code table for exact addresses and descriptions; the prose here highlights groupings and purpose:
- Monitor/utility pointers and small control bytes: $00B7–$00BF
- Screen, keyboard, cursor, and edit-state variables: $00C8–$00FF
- Stack, numeric-to-ASCII workspace and related temporary areas: $0100–$01FF
- Filename, disk command buffers and miscellaneous workspace: $0200–$0276 (plus related temporary areas)
- BASIC/monitor link vectors and conversion vectors (CHRGOT/CHRGET, float/fixed): $0280–$0295; additional error and temp vectors follow
- IRQ default vector at $0300–$0301 (default listed as $FBE9)

## Zero-page and vector descriptions
- Monitor save/pointers and device number: $00B7–$00BF hold monitor IRQ save pointer, monitor memory pointers and a device number used by the monitor.
- Programmable key tables: $00C0–$00C7 store addresses and pointers for programmable keys.
- Screen/keyboard/edit state: $00C8–$00FF contains the current screen line pointer, cursor column/row, text/graphics mode flag, keyboard buffer counts, key-repeat timing, line-wrap bits, and other edit/display control bytes used by the input/editing routines.
- Stack and NUM->ASCII work: $0100–$01FE is used as the hardware stack plus staging/work areas for hex-to-binary and numeric-to-ASCII conversion routines (NUM->ASC).
- Filename and disk work areas: $0200–$0254 and nearby bytes are reserved for filename storage and disk command work.
- PRINT USING and INSTR$ work areas: $025E–$0276 and $02A0–$02A5 hold workspace for formatted output and temporary INSTR$ bytes.
- BASIC/monitor ROM vectors and links: $0280–$0295 hold pointers (two-byte little-endian) to ROM subroutines such as the error routine, warm start, token crunching, LIST, command dispatch, token/eval/expr routines, CHRGOT/CHRGET and float/fixed conversion vectors. Default targets listed in the table reflect ROM default addresses from the source.
- Misc temp/trap bytes and unused ranges: $0296–$02FF include temporary trap and DISPOSE bytes, bank offset, and unused areas; $0300–$0301 contain the IRQ vector (default FBE9 in the source).

## Source Code
```text
00B7-00B8     183-184     Monitor IRQ save; pointer
00B9-00BA     185-186     Monitor memory pointer
00BB-00BC     187-188     Monitor secondary pointer
00BD          189         Monitor counter
00BE          190         Monitor miscellaneous byte
00BF          191         Monitor device number
00C0-00C1     192-193     Programmable key table address
00C2-00C3     194-195     Programmable key address
00C4-00C7     196-199     Pointers to change programmable key table

                                                                        :201:

00C8-00C9     200-201     Pointer to screen line
00CA          202         Screen line number
00CB          203         Position of cursor on line
00CC          204         0 = text mode, else graphics mode
00CD          205         Keypress variable
00CE          206         Old cursor column
00CF          207         Old cursor row
00D0          208         New character flag
00D1          209         Number of keys in keyboard buffer
00D2          210         Quotes flag
00D3          211         Insert key counter
00D4          212         Cursor type flag
00D5          213         Screen line length
00D6          214         Number of keys in "key" buffer
00D7          215         Key repeat delay
00D8          216         Key repeat speed
00D9-00DA     217-218     Temporary variables
00DB          219         Current output character
00DC          220         Top line of current screen
00DD          221         Bottom line of screen
00DE          222         Left edge of current screen
00DF          223         Right edge of current screen
00E0          224         Keys:  255 = none; 127 = key; 111 = shift
00E1          225         Key pressed:  255 = no key
00E2-00E5     226-229     Line wrap bits
00E6-00FF     230-255     [unused  -wf]
0100          256         Hex to binary staging area
0100-010A     256-266     Numeric to ASCII work area
0100-01FE     256-510     Stack area
01FF          511         Stack pointer save location
0200-020F     512-527     Filename area
0210-0226     528-550     Disk command work area
0227-0254     551-596     [unused?  -wf]
0255-0256     597-598     Miscellaneous work values for WAIT, etc.
0257          599         "Bank: value
0258          600         Output logical file (CMD)
0259          601         Sign of TAN
025A-025D     602-605     Pickup subroutine; miscellaneous work values
025E-0276     606-630     PRINT USING working variables

                                                                        :202:

0280-0281     640-641     Error routine link (default 8555)
0282-0283     642-643     Warm start link    (default 85CD)
0284-0285     644-645     Crunch token link  (default 88C2)
0286-0287     646-647     LIST link          (default 89F4)
0288-0289     648-649     Command dispatch link (default 8754)
028A-028B     650-651     Token evaluate link   (default 96B1)
028C-028D     652-653     Expression eval link  (default 95C4)
028E-028F     654-655     CHRGOT link (default BA2C)
0290-0291     656-657     CHRGET link (default BA32)
0292-0293     658-659     Float-fixed vector (default BA1E)
0294-0295     660-661     Fixed-float vector (default 9D39)
0296-0297     662-663     Error trap vector
0298-0299     664-665     Error line number
029A-029B     666-667     Error exit pointer
029C          668         Stack pointer save
029D-029F     669-671     Temporary TRAP, DISPOSE bytes
02A0-02A5     672-677     Temporary INSTR$ bytes
02A6-02A7     678-679     Bank offset
02A8-02FF     680-767     [unused?  -wf]
0300-0301     768-769     IRQ vector   (default FBE9)
```

## Key Registers
- $00B7-$00BF - Zero page - Monitor IRQ save, monitor pointers, counter, misc byte, device number
- $00C0-$00C7 - Zero page - Programmable key table addresses/pointers
- $00C8-$00FF - Zero page - Screen line pointer, cursor position, mode flags, keyboard buffers, key repeat, line-wrap bits
- $0100-$01FF - RAM/stack - Hex-to-binary staging, NUM->ASCII workspace, stack area, stack pointer save ($01FF)
- $0200-$0254 - RAM - Filename area and disk command work area (with some unused bytes)
- $0255-$0276 - RAM - Misc work values (WAIT, PRINT USING workspace, pickup/subroutine values)
- $0280-$0295 - Zero page (vectors) - Error routine, warm start, crunch token, LIST, command dispatch, token/eval/expr, CHRGOT/CHRGET, float/fixed conversion vectors
- $0296-$02A7 - Zero page - Error trap/vector bytes, error line/exit pointers, temporary TRAP/DISPOSE, INSTR$ temp bytes, bank offset
- $02A8-$02FF - Zero page - Unused range (source marks as unused)
- $0300-$0301 - Vector - IRQ vector (source default: $FBE9)

## References
- "bseries_memory_map_bank15_zeropage" — expanded continuation of Bank 15 zero-page and vectors