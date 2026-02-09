# C64 Zero Page: $00AE–$02BF (tape, I/O, keyboard, screen, RS‑232, CIA logs, BASIC areas)

**Summary:** Zero-page/system pointers and work areas from $00AE–$02BF covering tape buffer and timing ($00AE–$00C0), I/O and Kernal setup pointers ($00C1–$00C4), keyboard/screen variables and pointers ($00C5–$00F6), RS‑232/cassette serial state and bit timing ($00F7–$02A0), CIA-related log/control bytes on zero page ($02A1–$02A6), BASIC input buffer/stack/device tables ($0100–$0284), and unused/working areas through $02BF.

## Overview
This chunk documents zero-page and low memory system variables used by the Kernal and BASIC ROMs (addresses $00AE–$02BF). It groups common runtime variables:

- Tape/cassette and serial state: tape end/start pointers, timing constants, tape motor interlock, tape timer enable, read/write buffers, and RS‑232 bit/byte pointers and status bytes.
- I/O and Kernal pointers: I/O start address, Kernal setup pointer.
- Keyboard and screen state: last key, keyboard buffer count, cursor state (position, blink, char under cursor), screen pointers and line link table, color pointers, keyboard pointer and tables.
- Serial/RS‑232 control: receive/transmit pointers, bit timing, speed code, command/status registers, and serial timeout flag.
- Stack, tape error log and BASIC workspace: processor stack area ($0100–$01FF), tape error log ($0100–$013E overlap noted in source), BASIC input buffer and memory pointers, logical file/device/secondary address tables, keyboard buffer.
- CIA logging/control bytes on zero page: CIA (6526) related interrupt/log flags and saved IRQ state used by Kernal (not the CIA hardware registers, but software log bytes).
- Small reserved/unused areas: several ranges marked unused and available for temporary storage.

These are concise runtime variables, not hardware registers; they are used by ROM routines for device I/O, keyboard/screen handling, and BASIC/Kernal bookkeeping. Note that sprite data area commonly begins at $02C0 (covered in separate sprite/VIC-II documentation), which lies just after this chunk.

## Source Code
```text
$00AE-$00AF     174-175     Tape end address; end of program
$00B0-$00B1     176-177     Tape timing constants
$00B2-$00B3     178-179     Pointer: start of tape buffer
$00B4          180         1 = tape timer enabled; bit count
$00B5          181         Tape EOT; RS232 next bit to send
$00B6          182         Read character error; outbyte buffer
$00B7          183         Number of characters in filename
$00B8          184         Current logical file
$00B9          185         Current secondary address
$00BA          186         Current device
$00BB-$00BC     187-188     Pointer to filename
$00BD          189         Write shift word; read input char
$00BE          190         Number of blocks remaining to write/read
$00BF          191         Serial word buffer
$00C0          192         Tape motor interlock
$00C1-$00C2     193-194     I/O start address
$00C3-$00C4     195-196     Kernal setup pointer
$00C5          197         Last key pressed
$00C6          198         Number of characters in keyboard buffer
$00C7          199         Screen reverse flag
$00C8          200         End-of-line for input pointer
$00C9-$00CA     201-202     Input cursor log, row and column
$00CB          203         Which key pressed: 64 if no key
$00CC          204         0 = flash cursor
$00CD          205         Cursor timing countdown
$00CE          206         Character under cursor
$00CF          207         Cursor in blink phase
$00D0          208         Input from screen/keyboard
$00D1-$00D2     209-210     Pointer to screen line
$00D3          211         Position of cursor on above line
$00D4          212         0 = direct cursor; else programmed
$00D5          213         Current screen line length
$00D6          214         Row where cursor lives
$00D7          215         Last inkey; checksum; buffer
$00D8          216         Number of INSERTs outstanding
$00D9-$00F2     217-242     Screen line link table
$00F3-$00F4     243-244     Screen color pointer
$00F5-$00F6     245-246     Keyboard pointer
$00F7-$00F8     247-248     RS-232 Rcv pointer
$00F9-$00FA     249-250     RS-232 Tx pointer
$00FB-$00FE     251-254     [unused]
$00FF-$010A     255-266     Floating to ASCII work area
$0100-$013E     256-318     Tape error log
$0100-$01FF     256-511     Processor stack area
$0200-$0258     512-600     BASIC input buffer
$0259-$0262     601-610     Logical file table
$0263-$026C     611-620     Device number table
$026D-$0276     621-630     Secondary address table
$0277-$0280     631-640     Keyboard buffer
$0281-$0282     641-642     Start of BASIC memory
$0283-$0284     643-644     Top of BASIC memory
$0285          645         Serial bus timeout flag
$0286          646         Current color code
$0287          647         Color under cursor
$0288          648         Screen memory page
$0289          649         Maximum size of keyboard buffer
$028A          650         Repeat all keys
$028B          651         Repeat speed counter
$028C          652         Repeat delay counter
$028D          653         Keyboard shift/control flag
$028E          654         Last shift pattern
$028F-$0290     655-656     Keyboard table setup pointer
$0291          657         Keymode shift mode
$0292          658         0 = scroll enable
$0293          659         RS-232 control register
$0294          660         RS-232 command register
$0295-$0296     661-662     Bit timing
$0297          663         RS-232 status
$0298          664         Number of bits to send
$0299-$029A     665-666     RS-232 speed code
$029B          667         RS-232 receive pointer
$029C          668         RS-232 input pointer
$029D          669         RS-232 transmit pointer
$029E          670         RS-232 output pointer
$029F-$02A0     671-672     IRQ save during tape I/O
$02A1          673         CIA 2 (NMI) interrupt control (zero-page log byte)
$02A2          674         CIA 1 timer A control log (zero-page log byte)
$02A3          675         CIA 1 interrupt log (zero-page log byte)
$02A4          676         CIA 1 timer A enabled flag
$02A5          677         Screen row marker
$02A6          678         0 = NTSC; 1 = PAL
$02A7-$02BF     679-703     [unused]
```

## Key Registers
- $00AE-$00BF - Zero page — tape/cassette and serial state (tape end, timing, buffer pointers, serial word buffer)
- $00C0-$00FF - Zero page — I/O/Kernal pointers, keyboard and screen state, screen line links, color and keyboard pointers
- $0100-$01FF - Low memory — processor stack area and tape error log (overlap: $0100-$013E used by tape error log)
- $0200-$0258 - RAM — BASIC input buffer
- $0259-$0280 - RAM — logical file table, device number table, secondary address table, keyboard buffer
- $0281-$0284 - RAM — BASIC memory start/top pointers
- $0285-$029E - Zero page/low memory — serial/RS‑232 control/status, bit timing, speed code, I/O pointers
- $029F-$02A0 - Zero page — IRQ save during tape I/O
- $02A1-$02A6 - Zero page — CIA/Kernal log and control bytes (CIA 1/2 interrupt and timer logs; zero-page software flags)
- $02A7-$02BF - Zero page — unused/available work area

## References
- "c64_memory_map_zero_page_part1" — previous zero-page entries ($0000–$00AD)
- "c64_vic2_sprite_registers" — VIC-II sprite registers and sprite data area (sprite data area beginning at $02C0)
- "c64_cia1_registers" — CIA (6526) hardware registers and detailed CIA behavior referenced by zero-page log bytes