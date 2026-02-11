# MACHINE - Upgrade ROM/4.0 Zero-Page Map ($0000-$00FF)

**Summary:** Zero-page register and work-area map for Upgrade ROM 4.0 covering $0000–$00FF, including processor port registers, variable pointers, numeric accumulators, CHRGET routine, interrupt vectors, status word ST, keyboard status and buffer counts, cursor/keyboard/IEEE/tape control bytes, and tape timing/work areas.

**Overview**
This chunk documents zero-page allocations and pointers used by the Upgrade ROM/4.0: processor port registers for memory configuration and I/O control, variable pointers for FOR/NEXT, numeric accumulators and series evaluation temporaries, the CHRGET character-fetch routine area, random seed and jiffy clock, interrupt vectors (IRQ, BRK, NMI), the ST status byte and keyboard state bytes, cursor and screen-input pointers, IEEE output buffering, and detailed tape I/O control bytes and pointers up through $00FF. Many entries are internal working bytes and pointers used by BASIC and cassette routines. CHRGET (get BASIC character) is located in the zero-page block at $0070–$0087, with a BASIC-pointer at $0077–$0078 (within that block). Interrupt vectors are at $0090–$0095. Tape timing, buffer pointers, and read/write flags occupy $00B4–$00CE.

## Source Code
```text
0000           0          Processor port data direction register
0001           1          Processor port
0002-0003      2-3        Unused
0004-0005      4-5        Unused
0006-0007      6-7        Unused
0008-0009      8-9        Unused
000A-000B      10-11      Unused
000C-000D      12-13      Unused
000E-000F      14-15      Unused
0010-0011      16-17      Unused
0012-0013      18-19      Unused
0014-0015      20-21      Unused
0016-0017      22-23      Unused
0018-0019      24-25      Unused
001A-001B      26-27      Unused
001C-001D      28-29      Unused
001E-001F      30-31      Unused
0020-0021      32-33      Unused
0022-0023      34-35      Unused
0024-0025      36-37      Unused
0026-0027      38-39      Unused
0028-0029      40-41      Unused
002A-002B      42-43      Unused
002C-002D      44-45      Unused
002E-002F      46-47      Unused
0030-0031      48-49      Unused
0032-0033      50-51      Unused
0034-0035      52-53      Unused
0036-0037      54-55      Unused
0038-0039      56-57      Unused
003A-003B      58-59      Unused
003C-003D      60-61      Unused
003E-003F      62-63      Unused
0040-0041      64-65      Unused
0042-0043      66-67      Unused
0044-0045      68-69      Unused
0046-0047      70-71      Variable pointer for FOR/NEXT
0048-0049      72-73      Y-save; op-save; BASIC pointer save
004A           74         Comparison symbol accumulator
004B-0050      75-80      Miscellaneous work area, pointers, and so on
0051-0053      81-83      Jump vector for functions
0054-005D      84-93      Miscellaneous numeric work area
005E           94         Accumulator #1:  exponent
005F-0062      95-98      Accumulator #1:  mantissa
0063           99         Accumulator #1:  sign
0064           100        Series evaluation constant pointer
0065           101        Accumulator #1:  high-order (overflow)
0066           102        Accumulator #2:  exponent
0067-006A      103-106    Accumulator #2:  mantissa
006B           107        Accumulator #2:  sign
006C           108        Sign comparison:  Accumulator #1 versus #2
006D           109        Accumulator #1:  low-order (rounding)
006E-006F      110-111    Cassette buffer length; series pointer
0070-0087      112-135    CHRGET subroutine; get BASIC character
0077-0078      119-120    BASIC pointer (within above subroutine)
0088-008C      136-140    Random number seed
008D-008F      141-143    Jiffy clock for TI and TI$
0090-0091      144-145    IRQ vector
0092-0093      146-147    BRK interrupt vector
0094-0095      148-149    NMI interrupt vector
0096           150        Status word ST
0097           151        Which key down:  255 = no key
0098           152        Shift key:  1 = pressed
0099-009A      153-154    Correction clock
009B           155        Keyswitch PIA:  STOP and RVS flags
009C           156        Timing constant for tape
009D           157        0 = load; 1 = verify
009E           158        Number of characters in keyboard buffer
009F           159        Screen reverse flag
00A0           160        IEEE output:  255 = character pending
00A1           161        End-of-line-for-input pointer
00A2           162        Unused
00A3-00A4      163-164    Cursor log, row and column
00A5           165        IEEE output buffer
00A6           166        Key image
00A7           167        0 = flash cursor
00A8           168        Cursor timing countdown
00A9           169        Character under cursor
00AA           170        Cursor in blink phase
00AB           171        EOT received from tape
00AC           172        Input from screen/keyboard
00AD           173        X save
00AE           174        How many files open
00AF           175        Input device, normally 0
00B0           176        Output CMD device, normally 3
00B1           177        Tape character parity
00B2           178        Byte-received flag
00B3           179        Logical address temporary save
00B4           180        Tape buffer character; MLM command
00B5           181        File name pointer; MLM flag; counter
00B6           182        Unused
00B7           183        Serial bit count
00B8           184        Unused
00B9           185        Cycle counter
00BA           186        Tape writer countdown
00BB-00BC      187-188    Tape buffer pointers, #1 and #2
00BD           189        Write leader count; read pass 1/2
00BE           190        Write new byte; read error flag
00BF           191        Write start bit; read bit sequence error
00C0-00C1      192-193    Error log pointers, pass 1/2
00C2           194        0 = scan; 1-25 = count; $40 = load; $80 = end
00C3           195        Write leader length; read checksum
00C4-00C5      196-197    Pointer to screen line
00C6           198        Position of cursor on above line
00C7-00C8      199-200    Utility pointer:  tape, scroll
00C9-00CA      201-202    Tape end address; end of current program
00CB-00CC      203-204    Tape timing constants
00CD           205        0 = direct cursor; else programmed
00CE           206        Tape read timer 1 enabled
00CF           207        Cursor flash phase: 0 = visible, >0 = invisible
00D0           208        Input source: 0 = keyboard, 3 = screen
00D1-00D2      209-210    Pointer to current screen line
00D3           211        Cursor column in current logical line
00D4           212        Quote mode flag: >0 = in quote mode
00D5           213        Maximum column index of logical screen line (39 or 79)
00D6           214        Current physical line number of cursor
00D7           215        ASCII value of last printed character
00D8           216        Insert mode flag: >0 = insert mode
00D9-00F2      217-242    Screen line link table / temporary storage for editor
00F3-00F4      243-244    Pointer to start of current screen line in Color RAM
00F5-00F6      245-246    Pointer to keyboard decoding table
00F7-00F8      247-248    Pointer to RS-232 input buffer
00F9-00FA      249-250    Pointer to RS-232 output buffer
00FB-00FE      251-254    Unused
00FF           255        Temporary register for BASIC floating point to ASCII conversion
```

## Key Registers
- $0000 - Processor port data direction register
- $0001 - Processor port
- $0046-$0047 - Variable pointer for FOR/NEXT
- $0048-$0049 - Y-save; op-save; BASIC pointer save
- $004A - Comparison symbol accumulator
- $004B-$0050 - Miscellaneous work area and pointers
- $0051-$0053 - Jump vector for functions
- $0054-$005D - Miscellaneous numeric work area
- $005E - Accumulator #1 exponent
- $005F-$

## Labels
- CHRGET
- ST
- IRQ
- BRK
- NMI
