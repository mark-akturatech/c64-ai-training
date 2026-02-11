# C64 ROM: I/O helpers, RS232 start-bit/parity, colour RAM helper, wait-for-STOP, PAL baud table, screen/cursor helpers

**Summary:** Routines and data for opening output channels (wrapper to $FFC9), RS232 start-bit and parity flagging (zero-page flags $A9/$AB), storing the current colour into colour RAM via the pointer at $F3, a wait-for-STOP-column routine sampling keyboard and jiffy clock ($91/$A1), a PAL baud-rate table, returning I/O base ($DC00) and screen geometry (40x25), and read/set cursor position helpers (zero-page pointers $D6/$D3).

## Description
- $E4AD-$E4B6 — Open channel for output (wrapper)
  - Pushes the flag byte, calls KERNAL open ($FFC9), saves returned flag in X, restores the original flag byte from stack, and conditionally copies the returned error flag (TXA) if carry set. Returns with RTS.
  - Calling convention: accumulator contains flag byte passed to PHA; result flag returned in A and copied to X.

- $E4D3-$E4D9 — RS232 start-bit and parity initializer
  - STA $A9 : save the start-bit check flag (sets "start bit received").
  - LDA #$01 / STA $AB : set initial receiver parity bit.
  - RTS

- $E4DA-$E4DF — Save current colour to colour RAM
  - LDA $D021 : read current colour code (border/colour register).
  - STA ($F3),Y : store that colour into colour RAM using the pointer at zero-page $F3 (indirect), with Y index.
  - RTS

- $E4E0-$E4EB — Wait ~8.5 seconds for any key from the STOP-key column
  - ADC #$02 : set the number of jiffies to wait (adjust accumulator).
  - LDY $91 : read STOP-key column byte.
  - INY / BNE : test for $FF (no keys pressed); if any key pressed exit immediately.
  - CMP $A1 / BNE back to LDY : compare wait time with jiffy clock mid byte; loop until timeout.
  - RTS
  - (Uses zero-page $91 for stop-key column, $A1 for current jiffy mid-byte.)

- $E4EC-$E4FE — PAL baud-rate table
  - A table of 16-bit little-endian words (two bytes each) for common baud rates for PAL C64 systems.
  - Formula noted in source: (system clock / baud rate) / 2 - 100. System clock for PAL ≈ 985248 Hz (NTSC listed for reference).

- $E500-$E504 — Return base address of I/O devices
  - LDX #$00 ; A0 #$DC ; RTS
  - Returns $DC00 in (Y:X) style (X = low, Y = high).

- $E505-$E509 — Return screen X,Y organization
  - LDX #$28 (40) ; LDY #$19 (25) ; RTS

- $E50A-$E517 — Read/set cursor X,Y position helper
  - Branch on carry: BCS $E513 — if carry set, read cursor into X/Y.
  - Otherwise save X -> $D6 (cursor row), Y -> $D3 (cursor column), then JSR $E56C to set screen pointers for cursor row/column.
  - Read path loads X from $D6 and Y from $D3 then RTS.

Notes:
- Zero-page locations used by these routines include $A9, $AB (RS232 flags), $F3 (pointer for colour RAM writes), $91 (stop-key column), $A1 (jiffy mid-byte), $D6 and $D3 (cursor row/column storage). These are zero-page variables, not hardware registers.
- Baud-rate table values are provided as raw little-endian words for PAL timing; the source gives the underlying formula and system clock values.

## Source Code
```asm
.;E4AC 5C
                                *** unused
.;E4AD 48       PHA             save the flag byte
.;E4AE 20 C9 FF JSR $FFC9       open channel for output
.;E4B1 AA       TAX             copy the returned flag byte
.;E4B2 68       PLA             restore the alling flag byte
.;E4B3 90 01    BCC $E4B6       if there is no error skip copying the error flag
.;E4B5 8A       TXA             else copy the error flag
.;E4B6 60       RTS             

                                *** unused bytes
.;E4B7 AA AA AA AA AA AA AA AA
.;E4BF AA AA AA AA AA AA AA AA
.;E4C7 AA AA AA AA AA AA AA AA
.;E4CF AA AA AA AA AA

                                *** flag the RS232 start bit and set the parity
.;E4D3 85 A9    STA $A9         save the start bit check flag, set start bit received
.;E4D5 A9 01    LDA #$01        set the initial parity state
.;E4D7 85 AB    STA $AB         save the receiver parity bit
.;E4D9 60       RTS

                                *** save the current colour to the colour RAM
.;E4DA AD 21 D0 LDA $D021       get the current colour code
.;E4DD 91 F3    STA ($F3),Y     save it to the colour RAM
.;E4DF 60       RTS             

                                *** wait ~8.5 seconds for any key from the STOP key column
.;E4E0 69 02    ADC #$02        set the number of jiffies to wait
.;E4E2 A4 91    LDY $91         read the stop key column
.;E4E4 C8       INY             test for $FF, no keys pressed
.;E4E5 D0 04    BNE $E4EB       if any keys were pressed just exit
.;E4E7 C5 A1    CMP $A1         compare the wait time with the jiffy clock mid byte
.;E4E9 D0 F7    BNE $E4E2       if not there yet go wait some more
.;E4EB 60       RTS             

                                *** baud rate tables for PAL C64
                                baud rate word is calculated from ..
                                
                                (system clock / baud rate) / 2 - 100
                                
                                    system clock
                                    ------------
                                PAL       985248 Hz
                                NTSC     1022727 Hz
.;E4EC 19 26                      50   baud   985300
.;E4EE 44 19                      75   baud   985200
.;E4F0 1A 11                     110   baud   985160
.;E4F2 E8 0D                     134.5 baud   984540
.;E4F4 70 0C                     150   baud   985200
.;E4F6 06 06                     300   baud   985200
.;E4F8 D1 02                     600   baud   985200
.;E4FA 37 01                    1200   baud   986400
.;E4FC AE 00                    1800   baud   986400
.;E4FE 69 00                    2400   baud   984000

                                *** return the base address of the I/O devices
.;E500 A2 00    LDX #$00        get the I/O base address low byte
.;E502 A0 DC    LDY #$DC        get the I/O base address high byte
.;E504 60       RTS             

                                *** return the x,y organization of the screen
.;E505 A2 28    LDX #$28        get the x size
.;E507 A0 19    LDY #$19        get the y size
.;E509 60       RTS             

                                *** read/set the x,y cursor position
.;E50A B0 07    BCS $E513       if read cursor go do read
.;E50C 86 D6    STX $D6         save the cursor row
.;E50E 84 D3    STY $D3         save the cursor column
.;E510 20 6C E5 JSR $E56C       set the screen pointers for the cursor row, column
.;E513 A6 D6    LDX $D6         get the cursor row
.;E515 A4 D3    LDY $D3         get the cursor column
.;E517 60       RTS             
```

## Key Registers
- $D000-$D02E - VIC-II - video chip registers (includes $D021 border/colour register)
- $D800-$DBFF - Colour RAM - screen colour memory (1 KB)
- $DC00-$DC0F - CIA 1 - I/O devices base (routine returns $DC00)

## References
- "basic_io_wrappers_and_error_handler" — expands on open/close wrappers and channel open helpers
- "screen_keyboard_init_and_input_handling" — expands on cursor/screen geometry helpers used by screen routines