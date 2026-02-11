# MACHINE - Further VIC-20 memory map entries: screen line tables ($00D9-$00F0), pointers, SYS save areas, stack and BASIC buffers

**Summary:** Zero-page and low-memory VIC-20 system variables and tables: tape/RS-232 buffers and flags, keyboard and cursor state, screen line link table ($00D9-$00F0), screen/color/keyboard/RS-232 pointers ($00F3-$00FA), unused bytes, floating-to-ASCII workspace ($00FF-$010A), processor stack ($0100-$01FF) and BASIC input buffer ($0200-$0258).

## Memory map overview
This chunk documents low-memory (primarily zero page and page 1) VIC-20 system variables and small tables used by the KERNAL and BASIC interpreter. Key items included are:

- Tape and RS-232 status/buffers (e.g. tape timer at $00B4, RS-232 pointers at $00F7-$00FA).
- File/IO bookkeeping (current device/secondary address, pointer to filename at $00BB-$00BC).
- Keyboard and input editing state (last key, keyboard buffer pointers, cursor state at $00C5-$00D7 and $0285-$0292).
- Screen handling: single-byte values for cursor and row/column, and a screen line link table at $00D9-$00F0 with a dummy link at $00F1 and a screen row marker at $00F2.
- Pointers for screen color map ($00F3-$00F4), keyboard table setup and pointers ($00F5-$00F6 and $028F-$0290), and RS-232 receive/transmit pointers ($00F7-$00FA).
- Workspace areas: floating-to-ASCII conversion area ($00FF-$010A), processor stack ($0100-$01FF), tape error log ($0100-$013E overlaps stack area in listing — see Source Code for verbatim), and BASIC input buffer range ($0200-$0258).
- Logical tables for open files and devices in page 2 ($0259-$0276), keyboard buffer and BASIC memory pointers ($0277-$0284), and various RS-232 configuration and status bytes in the $0290s.

This node preserves the original byte-by-byte map entries for easy look-up and exact-address matching.

## Source Code
```text
00B4          180         1 = tape timer enabled; bit count
00B5          181         Tape EOT; RS232 next bit to send
00B6          182         Read character error; outbyte buffer
00B7          183         Number of characters in filename
00B8          184         Current logical file
00B9          185         Current secondary address
00BA          186         Current device
00BB-00BC     187-188     Pointer to filename

00BD          189         Write shift word; read input char
00BE          190         Number of blocks remaining to write/read
00BF          191         Serial word buffer
00C0          192         Tape motor interlock
00C1-00C2     193-194     I/O start address
00C3-00C4     195-196     Kernal setup pointer
00C5          197         Last key pressed
00C6          198         Number of characters in keyboard buffer
00C7          199         Screen reverse flag
00C8          200         End-of-line for input pointer
00C9-00CA     201-202     Input cursor log, row and column
00CB          203         Which key pressed:  64 if no key
00CC          204         0 = flash cursor
00CD          205         Cursor timing countdown
00CE          206         Character under cursor
00CF          207         Cursor in blink phase
00D0          208         Input from screen/keyboard
00D1-00D2     209-210     Pointer to screen line
00D3          211         Position of cursor on above line
00D4          212         0 = direct cursor; else programmed
00D5          213         Current screen line length
00D6          214         Row where cursor lives
00D7          215         Last inkey; checksum; buffer
00D8          216         Number of INSERTs outstanding
00D9-00F0     217-240     Screen line link table
00F1          241         Dummy screen link
00F2          242         Screen row marker
00F3-00F4     243-244     Screen color pointer
00F5-00F6     245-246     Keyboard pointer
00F7-00F8     247-248     RS-232 Rcv pointer
00F9-00FA     249-250     RS-232 Tx pointer
00FB-00FE     251-254     [unused; not listed in original text. -wf]
00FF-010A     255-266     Floating to ASCII work area
0100-013E     256-318     Tape error log
0100-01FF     256-511     Processor stack area
0200-0258     512-600     BASIC input buffer

0259-0262     601-610     Logical file table
0263-026C     611-620     Device number table
026D-0276     621-630     Secondary address table
0277-0280     631-640     Keyboard buffer
0281-0282     641-642     Start of BASIC memory
0283-0284     643-644     Top of BASIC memory
0285          645         Serial bus timeout flag
0286          646         Current color code
0287          647         Color under cursor
0288          648         Screen memory page
0289          649         Maximum size of keyboard buffer
028A          650         Repeat all keys
028B          651         Repeat speed counter
028C          652         Repeat delay counter
028D          653         Keyboard shift/control flag
028E          654         Last shift pattern
028F-0290     655-656     Keyboard table setup pointer
0291          657         Keymode (Katakana)
0292          658         0 = scroll enable
0293          659         RS-232 control register
0294          660         RS-232 command register
0295-0296     661-662     Bit timing
0297          663         RS-232 status
0298          664         Number of bits to send
0299-029A     665-666     RS-232 speed code
029B          667         RS-232 receive pointer
029C          668         RS-232 input pointer
029D          669         RS-232 transmit pointer
029E          670         RS-232 output pointer
029F-02A0     671-672     IRQ save during tape I/O
```

## Key Registers
- $00B4 - System RAM - tape timer enabled; bit count
- $00B5 - System RAM - tape EOT; RS-232 next bit to send
- $00B6 - System RAM - read character error; outbyte buffer
- $00B7 - System RAM - number of characters in filename
- $00B8 - System RAM - current logical file
- $00B9 - System RAM - current secondary address
- $00BA - System RAM - current device
- $00BB-$00BC - System RAM - pointer to filename
- $00BD - System RAM - write shift word; read input char
- $00BE - System RAM - number of blocks remaining to write/read
- $00BF - System RAM - serial word buffer
- $00C0 - System RAM - tape motor interlock
- $00C1-$00C2 - System RAM - I/O start address
- $00C3-$00C4 - System RAM - KERNAL setup pointer
- $00C5 - System RAM - last key pressed
- $00C6 - System RAM - number of characters in keyboard buffer
- $00C7 - System RAM - screen reverse flag
- $00C8 - System RAM - end-of-line for input pointer
- $00C9-$00CA - System RAM - input cursor log (row & column)
- $00CB - System RAM - which key pressed (64 = no key)
- $00CC - System RAM - 0 = flash cursor
- $00CD - System RAM - cursor timing countdown
- $00CE - System RAM - character under cursor
- $00CF - System RAM - cursor in blink phase
- $00D0 - System RAM - input from screen/keyboard
- $00D1-$00D2 - System RAM - pointer to screen line
- $00D3 - System RAM - position of cursor on above line
- $00D4 - System RAM - 0 = direct cursor; else programmed
- $00D5 - System RAM - current screen line length
- $00D6 - System RAM - row where cursor lives
- $00D7 - System RAM - last inkey; checksum; buffer
- $00D8 - System RAM - number of INSERTs outstanding
- $00D9-$00F0 - System RAM - screen line link table
- $00F1 - System RAM - dummy screen link
- $00F2 - System RAM - screen row marker
- $00F3-$00F4 - System RAM - screen color pointer
- $00F5-$00F6 - System RAM - keyboard pointer
- $00F7-$00F8 - System RAM - RS-232 receive pointer
- $00F9-$00FA - System RAM - RS-232 transmit pointer
- $00FB-$00FE - System RAM - unused (not listed in original text)
- $00FF-$010A - System RAM - floating-to-ASCII work area
- $0100-$01FF - System RAM - processor stack area (also tape error log overlaps $0100-$013E in listing)
- $0200-$0258 - System RAM - BASIC input buffer
- $0259-$0262 - System RAM - logical file table
- $0263-$026C - System RAM - device number table
- $026D-$0276 - System RAM - secondary address table
- $0277-$0280 - System RAM - keyboard buffer
- $0281-$0282 - System RAM - start of BASIC memory
- $0283-$0284 - System RAM - top of BASIC memory
- $0285 - System RAM - serial bus timeout flag
- $0286 - System RAM - current color code
- $0287 - System RAM - color under cursor
- $0288 - System RAM - screen memory page
- $0289 - System RAM - maximum size of keyboard buffer
- $028A - System RAM - repeat all keys flag
- $028B - System RAM - repeat speed counter
- $028C - System RAM - repeat delay counter
- $028D - System RAM - keyboard shift/control flag
- $028E - System RAM - last shift pattern
- $028F-$0290 - System RAM - keyboard table setup pointer
- $0291 - System RAM - keymode (Katakana)
- $0292 - System RAM - 0 = scroll enable
- $0293 - System RAM - RS-232 control register
- $0294 - System RAM - RS-232 command register
- $0295-$0296 - System RAM - bit timing
- $0297 - System RAM - RS-232 status
- $0298 - System RAM - number of bits to send
- $0299-$029A - System RAM - RS-232 speed code
- $029B - System RAM - RS-232 receive pointer (higher-level pointer)
- $029C - System RAM - RS-232 input pointer
- $029D - System RAM - RS-232 transmit pointer
- $029E - System RAM - RS-232 output pointer
- $029F-$02A0 - System RAM - IRQ save during tape I/O

## References
- "vic20_memory_map_part1" — prior parts of VIC-20 memory map (see for earlier zero-page/KERNAL vectors)