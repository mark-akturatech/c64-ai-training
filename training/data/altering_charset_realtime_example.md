# Altering the Character Set in Realtime (example)

**Summary:** Example assembly showing realtime modification of a custom character set at $2000 by polling VIC-II raster ($D012) and inverting character bytes to animate; also sets VIC memory config via $D018 and clears screen/charset. Searchable terms: $D012, $D018, $D020, $D021, $2000, DYCP, charset, character layout.

## Explanation
This example places the character generator at $2000 and the screen at $0400 (via $D018), clears screen and charset memory, then enters a loop that waits for raster $FF ($D012) and inverts a single byte in the character data at $2000+counter each frame to produce a simple animation (DYCP-like effect). Character N's data begins at $2000 + N*8 (8 bytes per character, one byte per scanline).

Behavior summary:
- $D018 is written with #$18 to select screen at $0400 and charset at $2000.
- Poll $D012 (VIC-II raster) until it equals $FF to synchronize updates to the raster.
- Increment a one-byte counter (wraps at $28) and invert the byte at $2000+counter to animate.
- Clearing loop writes zero to screen pages $0400-$07FF and charset page $2000-$20FF using X-indexed stores over 256 iterations per page.

The code uses zero-filled bytes as the initial character/screen data; counter initialized to 8 and wrapped at $28 to slow the visible update rate versus just cycling 8 bytes.

## Source Code
```asm
* = $0801

        lda #$00        ; black
        sta $D020       ; border colour
        sta $D021       ; background colour

        tax             ; set X = 0

clrscreen
        sta $0400,x     ; clear screen page $0400
        sta $0500,x
        sta $0600,x
        sta $0700,x
        sta $2000,x     ; clear charset page $2000
        dex
        bne clrscreen

        lda #$18        ; screen at $0400, chars at $2000
        sta $D018

mainloop
        lda $D012       ; poll raster
        cmp #$FF        ; on raster line $FF?
        bne mainloop    ; wait

        ldx counter     ; get offset value
        inx
        cpx #$28        ; wrap at $28 to slow animation
        bne juststx
        ldx #$00
juststx
        stx counter

        lda $2000,x     ; read byte from charset
        eor #$FF        ; invert it
        sta $2000,x     ; write back

        jmp mainloop

counter
        .byte 8         ; initial counter value
```

## Key Registers
- $D012 - VIC-II - raster register (raster line counter)
- $D018 - VIC-II - memory control (selects screen and character generator locations)
- $D020 - VIC-II - border color
- $D021 - VIC-II - background (screen) color

## References
- "text_scroller_implementation" — expands on DYCP and realtime charset updates used for scrollers and animated fonts