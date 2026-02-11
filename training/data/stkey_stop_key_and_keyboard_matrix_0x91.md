# STKEY ($91) — STOP key / last keyboard row

**Summary:** Zero page location $0091 (STKEY) contains the last row of the C64 keyboard matrix (includes STOP). Updated by the IRQ routine ~60Hz; bit polarity is 1 = unpressed, 0 = pressed. Useful for detecting STOP with a signed test (BPL).

## Description
STKEY ($91) is updated every 1/60 second during the system IRQ that reads the keyboard matrix and advances the jiffy clock. The byte stored here represents the last row of the keyboard matrix; each bit corresponds to a key in that row. Bit logic: 1 means the key is not pressed, 0 means the key is pressed.

Because the STOP key corresponds to bit 7 (the sign bit), reading $91 and using a signed branch (BPL) is a convenient test: BPL will branch when bit 7 is clear (STOP pressed). Other keys in that same row clear different bits; only keys that clear bit 7 will cause the signed test to behave the same as STOP.

VIC owners should note the C64 keyboard matrix layout differs from the VIC; this particular layout makes the BPL test for STOP possible and reliable for the STOP key itself.

## Source Code
```text
STKEY ($91) — example values (decimal / hex / binary) and key mapping
255  $FF  11111111 = no key pressed
254  $FE  11111110 = "1" key pressed         (bit0 = 0)
253  $FD  11111101 = Left arrow key pressed  (bit1 = 0)
251  $FB  11111011 = CTRL key pressed        (bit2 = 0)
247  $F7  11110111 = "2" key pressed         (bit3 = 0)
239  $EF  11101111 = Space bar pressed       (bit4 = 0)
223  $DF  11011111 = Commodore logo key      (bit5 = 0)
191  $BF  10111111 = "Q" key pressed         (bit6 = 0)
127  $7F  01111111 = STOP key pressed        (bit7 = 0)
```

```asm
; Example: branch if STOP key is pressed
; (STKEY is zero page $91)
    LDA $91        ; load last keyboard row
    BPL StopPressed ; branch if sign bit (bit7) = 0 -> STOP pressed
; ...fall-through if STOP not pressed...
StopPressed:
    ; handle STOP key
```

## Key Registers
- $0091 - Zero Page - STKEY: last row of keyboard matrix (includes STOP key); 1 = unpressed, 0 = pressed; updated by IRQ (~60Hz)

## References
- "kernal_zero_page_overview_0x90_0xff" — expands on overview of the Kernal zero-page area
- "st_status_io_status_word_0x90" — expands on ST status and device I/O (related to input operations)

## Labels
- STKEY
